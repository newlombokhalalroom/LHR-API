### Get Options
Allows users to get all available options in the system. 
- Method: `GET`
- Path: `/options`
- Optional Query Parameters:
    - `category` : Specifies the category of the option.
    - `type` : Specifies the type of client.
- Example: 
```bash
GET base-url/options?category=Service&type=hotel
```
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "result": [
        {
            "id": "833b2ec3-ffaf-4560-bf49-3e5ad2b97a36",
            "type_id": "336797b5-aad3-4f85-acf9-c78d447f67c8",
            "category": "Service",
            "title": "Laundry",
            "_created_date": "2023-11-02T06:40:14.503Z",
            "_updated_date": "2023-11-02T07:00:20.184Z",
            "price": "45000",
            "type_title": "hotel"
        },
        {
            "id": "7cb5a011-1f28-4d9f-8aff-39abac48831e",
            "type_id": "336797b5-aad3-4f85-acf9-c78d447f67c8",
            "category": "Service",
            "title": "Room Cleaning",
            "_created_date": "2023-11-02T07:41:58.688Z",
            "_updated_date": "2023-11-02T07:41:58.688Z",
            "price": "45000",
            "type_title": "hotel"
        }
    ]
}
```