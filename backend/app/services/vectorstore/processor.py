import re
import json
import os
from ingredient_parser import parse_ingredient

from backend.config.setting import RECIPES_FOR_CHROMA_DIR, RAW_DIR

def parse_time_str(time_str):
    """Parse time string to total minutes

    Args:
        time_str (str): Time string in format like "1 hr 30 mins"

    Returns:
        int: Total minutes
    """
    if not time_str:
        return 0
    time_str = time_str.lower()
    hours = re.search(r'(\d+)\s*hr', time_str)
    mins = re.search(r'(\d+)\s*mins', time_str)
    total_minutes = 0
    if hours:
        total_minutes += int(hours.group(1)) * 60
    if mins:
        total_minutes += int(mins.group(1))
    return total_minutes


def parse_time_to_minutes(time_str: str) -> int:
    """Convert time string to total minutes

    Args:
        time_str (str): Time string in format like "1 hr 15 mins"

    Returns:
        int: Total minutes
    """
    if not time_str:
        return 0
    time_str = time_str.lower()
    hours = re.search(r'(\d+)\s*hr', time_str)
    mins = re.search(r'(\d+)\s*min', time_str)
    total_minutes = 0
    if hours:
        total_minutes += int(hours.group(1)) * 60
    if mins:
        total_minutes += int(mins.group(1))
    return total_minutes


def generate_tag_in_content(data):
    """Generate tags based on nutrition and time data

    Args:
        data (dict): Recipe data containing nutrition and time information

    Returns:
        list: List of generated tags
    """
    tags = []

    basic_nutrition = data.get("Basic Nutrition", ('0', '0g', '0g', '0g'))
    detailed_nutrition = data.get("Nutrition Dict", {})

    def to_number(val):
        """Convert string values like '8g', '80mg' to float numbers"""
        if not val:
            return 0
        return float(val.lower().replace('mg', '').replace('g', '').strip())

    cal, fat, carb, prot = basic_nutrition

    # Calories
    cal_val = to_number(cal)
    if cal_val >= 500:
        tags.append("High Calorie")
    elif cal_val <= 200:
        tags.append("Low Calorie")
    else:
        tags.append("Moderate Calorie")

    # Protein
    prot_val = to_number(prot)
    if prot_val >= 20:
        tags.append("High Protein")
    elif prot_val <= 10:
        tags.append("Low Protein")
    else:
        tags.append("Moderate Protein")

    # Carbohydrates
    carb_val = to_number(carb)
    if carb_val >= 50:
        tags.append("High Carb")
    elif carb_val <= 20:
        tags.append("Low Carb")
    else:
        tags.append("Moderate Carb")

    # Fat
    fat_val = to_number(fat)
    if fat_val >= 20:
        tags.append("High Fat")
    elif fat_val <= 5:
        tags.append("Low Fat")
    else:
        tags.append("Moderate Fat")

    if detailed_nutrition:
        lookup = {
            key.lstrip('- ').strip().lower(): value
            for key, value in detailed_nutrition.items()
        }

        def tag_range(value, low, high, label):
            if value >= high:
                return f"High {label}"
            elif value <= low:
                return f"Low {label}"
            else:
                return f"Moderate {label}"

        nutrients_to_tag = {
            "sodium": (140, 600),
            "total sugars": (5, 20),
            "dietary fiber": (1, 5),
            "iron": (0.5, 2),
            "calcium": (50, 200),
            "vitamin c": (5, 30),
            "potassium": (100, 300)
        }

        for nutrient, (low, high) in nutrients_to_tag.items():
            value = to_number(lookup.get(nutrient, ""))
            tags.append(tag_range(value, low, high, nutrient.title()))

        def time_tag(prefix, minutes):
            if minutes <= 5:
                return f"{prefix} Very Fast"
            elif minutes <= 15:
                return f"{prefix} Fast"
            elif minutes <= 30:
                return f"{prefix} Moderate"
            elif minutes <= 60:
                return f"{prefix} Slow"
            else:
                return f"{prefix} Very Slow"

        time_fields = {
            "Prep Time:": "Prepare",
            "Cook Time:": "Cook",
            "Additional Time:": "Additional Time",
            "Total Time:": "Total Time"
        }

        for field, prefix in time_fields.items():
            mins = parse_time_str(data.get(field, ''))
            if mins > 0:
                tags.append(time_tag(prefix, mins))
    return tags


def normalize_fractions(text: str) -> str:
    """Convert unicode fractions to ASCII format

    Args:
        text (str): Text containing unicode fractions

    Returns:
        str: Text with ASCII fractions
    """
    fraction_map = {
        '½': '1/2',
        '⅓': '1/3',
        '⅔': '2/3',
        '¼': '1/4',
        '¾': '3/4',
        '⅕': '1/5',
        '⅖': '2/5',
        '⅗': '3/5',
        '⅘': '4/5',
        '⅙': '1/6',
        '⅚': '5/6',
        '⅛': '1/8',
        '⅜': '3/8',
        '⅝': '5/8',
        '⅞': '7/8',
    }
    for uni_frac, ascii_frac in fraction_map.items():
        text = text.replace(uni_frac, ascii_frac)
    return text


def parse_ingredients(text):
    """Parse ingredient text to structured format

    Args:
        text (str): Ingredient text

    Returns:
        dict: Structured ingredient data
    """
    result = parse_ingredient(text)
    ingredient_dict = {
        "Name": '',
        "Alternative": [],
        "Size": None,
        "Amount": [],
        "Preparation": None,
        "Comment": None,
        "Purpose": None,
        "Original Text": text
    }
    for i in range(len(result.name)):
        if i == 0:
            ingredient_dict['Name'] = result.name[i].text if result.name[i].text else ''
        else:
            alternative_ingredient = {"Name": result.name[i].text if result.name[i].text else ''}
            ingredient_dict["Alternative"].append(alternative_ingredient)
    
    ingredient_dict['Size'] = result.size
    for i in range(len(result.amount)):
        amount = {
            "Quantity": result.amount[i].quantity if hasattr(result.amount[i], 'quantity') and result.amount[i].quantity else None,
            "Quantity Max": result.amount[i].quantity if hasattr(result.amount[i], 'quantity') and result.amount[i].quantity else None,
            "Unit": result.amount[i].unit if hasattr(result.amount[i], 'unit') and result.amount[i].unit else None,
            "Text": result.amount[i].text if hasattr(result.amount[i], 'text') and result.amount[i].text else None,
            "Prepared Ingredient": result.amount[i].PREPARED_INGREDIENT if hasattr(result.amount[i], 'PREPARED_INGREDIENT') and result.amount[i].PREPARED_INGREDIENT else None
        }

        ingredient_dict['Amount'].append(amount)

    ingredient_dict['Preparation'] = result.preparation.text if result.preparation else None
    ingredient_dict['Comment'] = result.comment if result.comment else None
    ingredient_dict['Purpose'] = result.purpose if result.purpose else None

    return ingredient_dict


def generate_detailed_nutrition(recipe, percentage=False):
    """Generate detailed nutrition information

    Args:
        recipe (dict): Recipe data containing nutrition information
        percentage (bool): Whether to include percentage information

    Returns:
        list: List of detailed nutrition lines
    """
    nutrition_label = recipe.get("Nutrition Label", {})
    detailed_lines = []
    for key, val in nutrition_label.items():
        if isinstance(val, dict):
            amount = val.get("amount", "").strip()
            percent = val.get("percent (% Daily Value)", "").strip()
            detailed_lines.append(f"- {key}: {amount}" if percentage else f"- {key}: {amount}, percent (% Daily Value): {percent}" )
        elif key != "Servings Per Recipe" and key != "Calories":
            detailed_lines.append(f"- {key}: {val.strip()}")
    return detailed_lines


def generate_nutrition(recipe):
    """Extract basic nutrition information from recipe

    Args:
        recipe (dict): Recipe data containing nutrition facts

    Returns:
        tuple: Tuple of (calories, fat, carbs, protein)
    """
    nutrition_label_per_serving = recipe.get("Nutrition Facts (per serving)", {})
    cal = nutrition_label_per_serving.get("Calories", "")
    fat = nutrition_label_per_serving.get("Fat", "")
    carb = nutrition_label_per_serving.get("Carbs", "")
    prot = nutrition_label_per_serving.get("Protein", "")
    return cal, fat, carb, prot


def generate_content(recipe: dict, idx: int) -> str:
    """Generate formatted content string from recipe data

    Args:
        recipe (dict): Recipe data dictionary
        idx (int): Recipe index

    Returns:
        str: Formatted content string
    """
    parts = []
    need_for_tagging = {}
    parts.append(f"ID: {idx}")
    parts.append(f"Name of dish: {recipe['name']}")
    parts.append(f"Description: {recipe['description']}")

    time_fields = ["Prep Time:", "Cook Time:", "Additional Time:", "Total Time:"]
    for field in time_fields:
        if field in recipe:
            need_for_tagging[field] = recipe[field]
            parts.append(f"{field.replace(':','')}: {recipe[field]}")
    if "Servings:" in recipe:
        need_for_tagging['Servings'] = recipe['Servings:']
        parts.append(f"Servings: {recipe['Servings:']}")
    if "Yield:" in recipe:
        need_for_tagging['Yield'] = recipe['Yield:']
        parts.append(f"Yield: {recipe['Yield:']}")

    ingred = recipe.get('ingredients', {})
    ing_parts = []
    for section_name, ing_list in ingred.items():
        normalized_ings = [normalize_fractions(ing) for ing in ing_list]
        ing_text = "; ".join(normalized_ings)
        ing_parts.append(f"- To prepare {section_name}, you need: {ing_text}")
    parts.append("Ingredients:\n" + "\n".join(ing_parts))

    directions = recipe.get("Directions", {})
    if isinstance(directions, dict):
        step_texts = [f"- Step {step}. {normalize_fractions(text)}" for step, text in sorted(directions.items(), key=lambda x: int(x[0]))]
        parts.append("Directions:\n" + "\n".join(step_texts))
    if "Cook's Note:" in recipe:
        parts.append("Cook's Note: " + recipe["Cook's Note:"].strip())

    basic_nutrition = generate_nutrition(recipe)
    parts.append(f"Nutrition (per serving): {basic_nutrition[0]} cal; {basic_nutrition[1]} protein; {basic_nutrition[2]} carbs; {basic_nutrition[3]} fat")
    need_for_tagging['Basic Nutrition'] = basic_nutrition

    detailed_lines = generate_detailed_nutrition(recipe)
    if len(detailed_lines) > 1:
        parts.append("Detailed Nutrition Info (per serving):\n" + "\n".join(detailed_lines))
        nutrition_dict = {line.split(":")[0].strip(): line.split(":")[1].strip() for line in detailed_lines if ":" in line}
        need_for_tagging['Nutrition Dict'] = nutrition_dict
    
    parts.append(f"Image URL: {recipe.get('image')}")
    return "\n".join(parts)


def generate_metadata(recipe: dict, idx: int) -> dict:
    """Generate metadata for recipe

    Args:
        recipe (dict): Recipe data dictionary
        idx (int): Recipe index

    Returns:
        dict: Metadata dictionary
    """
    title = recipe.get("name", "").strip()
    return {
        "id": idx,
        "title": title,
    }


def prepare_data_for_Chroma(input_path, output_path):
    """Prepare recipe data for Chroma database

    Args:
        input_path (str): Path to input JSON file containing recipes
        output_path (str): Path to output JSON file for Chroma

    Returns:
        None
    """
    with open(input_path, 'r', encoding='utf-8') as f:
        recipes = json.load(f)

    results = []

    for idx, recipe in enumerate(recipes):
        try:
            content = generate_content(recipe, idx)
            metadata = generate_metadata(recipe, idx)

            results.append({
                "content": content,
                "metadata": metadata
            })
        except Exception as e:
            print(f"Bỏ qua mẫu {idx} do lỗi: {e}")
            continue

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"Đã chuyển {len(results)} mẫu vào {output_path}")


if __name__ == "__main__":
    RECIPES_JSON_FILE = os.path.join(RAW_DIR, 'recipes.json')
    RECIPES_FOR_CHROMA_FILE = os.path.join(RECIPES_FOR_CHROMA_DIR, 'recipes_for_Chroma.json')
    prepare_data_for_Chroma(RECIPES_JSON_FILE, RECIPES_FOR_CHROMA_FILE)