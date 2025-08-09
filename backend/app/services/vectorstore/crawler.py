import time
import json
import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from backend.config import RAW_DIR



def crawl_data_from_urls(recipe_links):
    urls = recipe_links[:]
    failed_urls = []

    driver = webdriver.Chrome()
    driver.implicitly_wait(15)
    wait = WebDriverWait(driver, 15)

    list_of_dishes = []

    for url in urls:
        dict = {} # Chứa các trường thông tin về món ăn
        driver.get(url)
        try:
            # tìm element chứa toàn bộ thông tin cần thiết
            artile_element = driver.find_element(By.TAG_NAME, 'article')

            # Lấy tên món và description
            header_element = artile_element.find_element(By.CSS_SELECTOR, "div.loc.article-post-header")
            name = header_element.find_element(By.TAG_NAME, "h1").text
            description = header_element.find_element(By.TAG_NAME, 'p').text

            dict["name"] = name
            dict['description'] = description

            # element chứa thông tin hình ảnh, nguyên liệu, các bước
            content_element = artile_element.find_element(By.CSS_SELECTOR, 'div.loc.article-content')

            # Lấy ra 1 ảnh. Do primary có thể là ảnh hoặc video nên ta phải if else. Nếu primary là video ta lấy ảnh phụ
            # Do có thể có recipe ko có ảnh nên phải thêm 1 if else nữa
            try:
                image_element = content_element.find_element(By.CSS_SELECTOR, 'img.primary-image__image')
                image_link = image_element.get_attribute('src')
            except Exception as e:
                try:
                    image_element = content_element.find_element(By.CSS_SELECTOR, 'div.article__photo-ribbon')
                    image_link = image_element.find_element(By.TAG_NAME, 'a').get_attribute('href')
                except Exception as e:
                    image_link = None
            dict['image'] = image_link

            # Lấy các thông tin như thời gian chuẩn bị, thời gian nấu, chia phần ăn
            recipe_details_elements = content_element.find_elements(By.CSS_SELECTOR, 'div.mm-recipes-details__item')
            for rde in recipe_details_elements:
                label = rde.find_element(By.CSS_SELECTOR, 'div.mm-recipes-details__label').text
                value = rde.find_element(By.CSS_SELECTOR, 'div.mm-recipes-details__value').text
                dict[label] = value

            # chứa thông tin nguyên liệu
            ingredients_elements = content_element.find_element(By.CSS_SELECTOR, 'div.mm-recipes-lrs-ingredients')

            # Do trong 1 món có thể có nhiều món nhỏ hơn (VD như nước sốt), tức là > 1 danh sánh nguyên liệu
            # Nhưng cũng có món chỉ có 1 danh sách duy nhất
            # Nếu > 1, sẽ có thêm tên món nhỏ và danh sách nguyên liệu đi kèm
            # Nếu không sẽ chỉ có nguyên liệu
            # Nên ta phải if else
            recipes_ingredients_elements = ingredients_elements.find_elements(By.CSS_SELECTOR, 'ul.mm-recipes-structured-ingredients__list')
            if len(recipes_ingredients_elements) > 1:
                dish_list = {}
                dish_elements = ingredients_elements.find_elements(By.CSS_SELECTOR, 'p.mm-recipes-structured-ingredients__list-heading.text-title-200')
                for de in dish_elements:
                    dish_list[de.text] = []
                    for rie in recipes_ingredients_elements:
                        ingredients = rie.find_elements(By.CSS_SELECTOR, 'li.mm-recipes-structured-ingredients__list-item')
                        for ing in ingredients:
                            dish_list[de.text].append(ing.text)
                dict['ingredients'] = dish_list
            else:
                dict['ingredients'] = {}
                dict['ingredients'][name] = []
                ingredients = recipes_ingredients_elements[0].find_elements(By.CSS_SELECTOR, 'li.mm-recipes-structured-ingredients__list-item')
                for ing in ingredients:
                    dict['ingredients'][name].append(ing.text)

            # Lấy ra các bước, cùng với 1 số lời nhắn đi kèm (Nếu có)
            dict['Directions'] = {}
            steps_element = content_element.find_element(By.CSS_SELECTOR, 'div.mm-recipes-steps__content')
            child_element = steps_element.find_elements(By.XPATH, './*')
            pre = None
            for child in child_element:
                tag_name = child.tag_name
                class_name = child.get_attribute('class')

                if tag_name == 'ol':
                    steps_element = child.find_elements(By.CSS_SELECTOR, 'p.mntl-sc-block')
                    for i in range(len(steps_element)):
                        dict['Directions'][f'{i+1}'] = steps_element[i].text

                elif tag_name == 'h2':
                    key = child.text.strip()
                    dict[key] = ""
                    pre = key
                
                elif tag_name == 'p' and pre is not None:
                    dict[pre] += child.text.strip() +'\n'

            # Lấy thông tin dinh dưỡng
            nutrition_element = content_element.find_element(By.CSS_SELECTOR, 'div.mm-recipes-nutrition-facts')

            nutrition_fact_element = nutrition_element.find_element(By.TAG_NAME, 'tbody')
            facts = nutrition_fact_element.find_elements(By.TAG_NAME, 'tr')
            tag = nutrition_element.find_element(By.TAG_NAME, 'h2').text
            dict[tag] = {}
            for fact in facts:
                value, key = fact.find_elements(By.TAG_NAME, 'td')
                dict[tag][key.text] = value.text

            # Do bảng dinh dưỡng mở rộng phải nhấn nút mới hiện ra, nên ta cần tìm và nhấn vào nó :v
            try:
                show_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button.mm-recipes-nutrition-facts-label__button")))
                show_button.click()
            except Exception as e:
                print("Nutrition button not found:", e)
                failed_urls.append(url)
                print(url)
            wait.until(EC.presence_of_element_located((By.CLASS_NAME, "mm-recipes-nutrition-facts-label__wrapper")))

            dict['Nutrition Label'] = {}
            label_element = nutrition_element.find_element(By.CLASS_NAME, 'mm-recipes-nutrition-facts-label__table')

            servings_element = nutrition_element.find_element(By.CSS_SELECTOR, 'tr.mm-recipes-nutrition-facts-label__servings')
            calories_element = nutrition_element.find_element(By.CSS_SELECTOR, 'tr.mm-recipes-nutrition-facts-label__calories')
            detail_element = label_element.find_element(By.TAG_NAME, 'tbody')

            servings_key, servings_value = servings_element.find_elements(By.CSS_SELECTOR, 'th.mm-recipes-nutrition-facts-label__table-head-subtitle span')
            calories_key, calories_value = calories_element.find_elements(By.CSS_SELECTOR, 'th.mm-recipes-nutrition-facts-label__table-head-subtitle span')

            dict['Nutrition Label'][servings_key.text] = servings_value.text
            dict['Nutrition Label'][calories_key.text] = calories_value.text

            detail_rows = detail_element.find_elements(By.TAG_NAME, 'tr')
            for row in detail_rows[1::]:
                cells = row.find_elements(By.TAG_NAME, 'td')
                name_element = cells[0].find_element(By.TAG_NAME, "span")
                name = name_element.text
                amount = cells[0].text.replace(name, '')
                if len(cells) == 2:
                    percent = cells[1].text
                else:
                    percent = 'Not Avaiable'

                dict['Nutrition Label'][name] = {
                    'amount': amount,
                    'percent (% Daily Value)': percent
                }

        except Exception as e:
            print(e)
            failed_urls.append(url)
            print(url)

        list_of_dishes.append(dict)

    driver.quit()
    return failed_urls, list_of_dishes

if __name__ == "__main__":
    RECIPE_LINKS_FILE = os.path.join(RAW_DIR, 'recipe_links.json')
    FAILED_URLS_FILE = os.path.join(RAW_DIR, 'failed_urls.json')
    RECIPES_FILE = os.path.join(RAW_DIR, 'recipes.json')
    with open(RECIPE_LINKS_FILE, 'r') as f:
        recipe_links = json.load(f)
    failed_urls, list_of_dishes = crawl_data_from_urls(recipe_links[:2])

    with open(FAILED_URLS_FILE, "w", encoding='utf-8') as f:
        json.dump(failed_urls, f, ensure_ascii=False, indent=2)
    
    with open(RECIPES_FILE, "w", encoding='utf-8') as f:
        json.dump(list_of_dishes, f, ensure_ascii=False, indent=2)