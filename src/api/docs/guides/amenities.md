## Amenities Endpoints <!-- {docsify-ignore} -->
Amenities refer to features or services associated with products, where each product can have multiple amenities, and vice versa.

### Get All Amenities
Allows users to retrieve a list of all types of amenities. 
- Method: `GET`
- Path: `/amenities`
- Query Parameters:
    - `type` (optional): Filters amenities by the specified type.
    - `category` (optional): Filters amenities by the specified category.
- Example:
```bash
GET base-url/amenities?type=hotel&category=regular
```
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "result": [
        {
            "id": "472959ea-0968-49f9-9f07-509dac1f2dcf",
            "type": "hotel",
            "category": "regular",
            "title": "Coffee/Tea Maker"
        },
        {
            "id": "0ef924a0-437d-4646-81ef-e9b356c1da23",
            "type": "hotel",
            "category": "halal",
            "title": "Qibla Direction"
        },
        {
           "id": "eeaaa843-856a-4d14-91a1-26f25d52f985",
            "type": "hotel",
            "category": "halal",
            "title": "Prayer Mats"
        }
    ]
}
```

### Get Amenity by ID
Allows users to retrieve a specific amenity by its ID.
- Method: `GET`
- Path: `/amenities/{id}`
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "result": {
        "amenity": {
            "type": "hotel",
            "category": "halal",
            "title": "Television"
        }
    }
}
```