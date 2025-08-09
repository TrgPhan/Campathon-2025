# API
Tất cả các endpoint sẽ cần phải có tài khoản người dùng mới có thể sử dụng.

Response của các request PUT, POST, DELETE sẽ có dạng chung sau:
```
{
    "status": failed, success
    "message": ... str
}
```

# Module "ingredients"
=> endpoint /ingredients
Endpoint liên quan đến Use Case "Manage Ingredients"

## get-ingredients
=> endpoint /ingredients/get-ingredients

Request(GET, query):
```
limit: int
offset: int
sort_by: "name" | "date"
sort_order: "asc" | "desc"
```

Response (JSON):
```
[   # List các nguyên liệu
    {
        'id': id của nguyên liệu,
        'name': Tên của nguyên liệu,
        'unit': Đơn vị của nguyên liệu,
        'amount': Số lượng nguyên liệu đó mà người dùng có,
        'add_date': Ngày nguyên liệu được thêm vào,
        'expire_date': Ngày nguyên liệu hết hạn
    }
]
```

## add-ingredients
=> endpoint /ingredients/add-ingredients

Request(POST, request):
```
name: str
amount: int/float
add_date: str
expire_date(optional): str
```

```
Response (JSON):
{
    "status": failed | success
    "message": ... str
}
```

## delete-ingredients
=> endpoint /ingredients/delete-ingredients

Request(DELETE, request):
```
id: id của nguyên liệu
```

Response (tương tự như add)

## update-ingredients
=> endpoint /ingredients/update-ingredients

Request(PUT, request):
```
id: id của món ăn
add_date: Ngày thêm của món ăn
amount: int
expire_date(optional): Ngày hết hạn món ăn
```

Response (tương tự như add)

## search-ingredients
=> endpoint /ingredients/search-ingredients

Request(GET, query):
```
name: str (Chỉ cần là một đoạn str name nào đó, kể cả không đầy đủ)
```

```
Response (JSON):
[   # Danh sách các tên nguyên liệu tìm kiếm
    {
        'id': id của nguyên liệu
        'name': Tên của nguyên liệu
        'unit': Đơn vị của nguyên liệu
    }
]
```

# Module "recipes"
=> endpoint /recipes
Endpoint liên quan đến Use Case "Manage Recipes"

## get-sufficient-recipes
=> endpoint recipes/get-sufficient-recipes

Request(GET, query):
```
sort_by: 'prep_time' | 'cook_time' | 'total_time' | 'kcal' | 'protein' | 'fat' | 'carb' 
sort_order: 'asc' | 'desc'
```

```
Response (JSON):
[   # List công thức nấu ăn
    {
        'id': id công thức,
        'name': Tên công thức,
        'image': link ảnh của món ăn,
        'description': str,
        'prep_time': Thời gian chuẩn bị công thức tính theo phút,
        'additional_time': Thời gian chờ thêm tính theo phút,
        'cook_time': Thời gian nấu món ăn tính theo phút
        'chill_time': Thời gian làm nguội tính theo phút,
        'total_time': Tổng thời gian tính theo phút,
        'servings': int,
        'yields': str (Kiểu tên món khi hoàn thiện sẽ là gì),
        'ingredients': [    # List các nguyên liệu cần cho công thức
            {
                'id': id của nguyên liệu,
                'name': Tên nguyên liệu str,
                'amount': Số lượng cần,
                'unit': Đơn vị của nguyên liệu
            }
        ],
        'nutritions': [ # List các dinh dưỡng mà công thức mang lại
            {
                'id': id của dinh dưỡng,
                'name': Tên của dinh dưỡng,
                'unit': Đơn vị của dinh dưỡng (g, mg, kcal, ...),
                'value': Giá trị dinh dưỡng,
                'percent': int, phần trăm dinh dưỡng cần thiết trong ngày cho tiêu chuẩn 2000 kcal 1 ngày
            }
        ],
    }   
]
```

## get-insufficient-recipes
=> endpoint /recipes/get-insufficient-recipes

Request(GET, query):
```
num_missing: int, số nguyên liệu thiếu
num_recipes: int, số công thức muốn trả về
sort_by: 'prep_time' | 'cook_time' | 'total_time' | 'kcal' | 'protein' | 'fat' | 'carb' 
sort_order: 'asc' | 'desc'
```

Response (JSON): Giống với get sufficient recipes những bổ sung thêm field sau vào mỗi recipe:
```
{
    'missing': [ # List các nguyên liệu thiếu
        'id': id của nguyên liệu,
        'name': Tên của nguyên liệu,
        'amount': Lượng còn thiếu,
        'unit': Đơn vị
    ]
}
```

## add-daily-meal
=> endpoint /recipes/add-daily-meal

Request (POST, request):
```
id: id của công thức món ăn
```

Response (JSON): Tương tự như response của endpoint add bên ingredients

# Module "daily-meals"
=> endpoint /daily-meals
Module liên quan đến lịch trình ăn (hiện chỉ có 1 endpoint nên chưa chia nhỏ, dùng endpoint của cả module luôn)

Request (GET, query):
```
day: str
```

Response (JSON):
```
{
    'breakfast': [  # List các món người dùng ăn buổi sáng vào ngày chỉ định
        {
            'id': id của món,
            'name': Tên của món,
            'image': Link ảnh của món ăn
        }
    ],
    'lunch': [
        # Tương tự breakfast
    ],
    'dinner': [
        # Tương tự breakfast
    ],
    nutritions: [   # List các loại dinh dưỡng và hàm lượng tiêu thụ ngày chỉ định (Hiện tại chỉ lấy Calo, Pro, Carb, Fat)
        {
            'id': id của dinh dưỡng,
            'name': Tên loại dinh dưỡng,
            'value': Hàm lượng dinh dưỡng,
            'unit': Đơn vị
        }
    ]
}
```

# Module "profile"
=> endpoint /profile

## get
=> endpoint /profile/get

Request (GET, query):
```
No arguments
```

Response (JSON):
```
{
    'id': id người dùng,
    'username': Tên đăng nhập, tên người dùng,
    'age': Tuổi,
    'sex': Giới tính,
    'weight': cân nặng,
    'height': chiều cao,
    'goal': Mục tiêu ăn uống (str) (cái này cần suy nghĩ thêm, khả năng cần tạo thêm table cho goals) ví dụ: Giảm cân, Tăng cân, Tăng cơ, ...,
    'allergy': Dị ứng (str) (có thể cũng nên tạo thêm table cho allergy, hiện giờ tạm để str),
    'disease': Bệnh nền (str) (kiểu tiểu đường, mỡ máu, tạm thời để str),
    'nutritions_goal': [    # List các dinh dưỡng và hàm lượng khuyến nghị
        {
            'id': id của dinh dưỡng,
            'name': tên dinh dưỡng,
            'amount': Hàm lượng khuyến nghị,
            'unit': Đơn vị
        }
    ]
}
```

## edit
=> endpoint /profile/edit:

Request (PUT, request):
```
Đây sẽ cho điền form, sẽ nhận hết các trường của endpoint get, khi người dùng muốn edit thì cho tất cả các field vẫn là từ lần chỉnh sửa gần nhất, kiểu không phải nhập lại hết mà chỉ xóa những cái muốn sửa để viết lại thôi
```

## add
=> endpoint /profile/edit

Request (POST, request):
```
Điền và chọn đủ các trường thông tin trên phần "get" trừ "nutritions_goal"
```

