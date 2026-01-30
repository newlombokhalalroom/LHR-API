## Product's Item Endpoints <!-- {docsify-ignore} -->
Items refer to individual products or objects associated with a larger product category.

### Create Product's Item
Allows users with the "admin" role to create a new item for the specified product.
- Method: `POST`
- Path: `/products/{productId}/items`
- Authentication: User Access Token (Bearer token)
- Request Body: 
```json
{
    "title": "Room 1"
}
```
- Response Code: `201 OK`
- Response Body:
```json
{
    "status": true,
    "result": {
        "item": {
            "id": "730c6f48-b1f9-4451-ae20-8a1d61b72648",
            "title": "Room 1"
        }
    }
}
```

### Update Product's Item
Allows users with the "admin" role to update an existing item for the specified product.
- Method: `PUT`
- Path: `/products/{productId}/items/{itemId}`
- Authentication: User Access Token (Bearer token)
- Request Body: 
```json
{
    "title": "Room 2"
}
```
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Product's item updated successfully",
    "result": {
        "item": {
            "id": "2d1285b7-7a5b-4bef-bb69-e1190ca62823",
            "title": "Room 2",
            "_updated_date": "2023-10-04T07:54:43.499Z"
        }
    }
}
```


### Get Product's Item by ID
Allows users with the "admin" role to retrieve detailed information about a specific item from the product.
- Method: `GET`
- Path: `/products/{productId}/items/{itemId}`
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "result": {
        "item": {
            "id": "9b11d7ee-a750-43c8-a9c8-e47462958e3a",
            "product_id": "fefb02f8-f410-496a-9b25-f8e1a10103d5",
            "title": "Room 6",
            "_created_date": "2023-10-03T03:06:24.597Z",
            "_updated_date": "2023-10-03T03:06:24.597Z",
            "unavailable": [
                {
                    "id": "d772e6eb-dcf5-4c10-b3c7-3eb755169ad6",
                    "start_date": "2023-10-15T11:00:00.000Z",
                    "end_date": "2023-10-16T12:00:00.000Z"
                },
                {
                    "id": "d6229b85-24e1-4b35-b55f-e7422f98a442",
                    "start_date": "2023-10-17T11:00:00.000Z",
                    "end_date": "2023-10-19T12:00:00.000Z"
                }
            ]
        }
    }
}
```

### Delete Product's Item
Allows users with the "admin" role to delete a specific item from the product.
- Method: `DELETE`
- Path: `/products/{productId}/items/{itemId}`
- Authentication: User Access Token (Bearer token)
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Product's item deleted successfully",
    "result": {
        "item": {
            "id": "2d1285b7-7a5b-4bef-bb69-e1190ca62823",
            "title": "Room 2"
        }
    }
}
```

### Get Product's Items
Allows users with the "admin" role to retrieves a list of items for the specified product. Optionally filter items based on availability within a specific date range.
- Method: `GET`
- Path: `/products/{productId}/items`
- Authentication: User Access Token (Bearer token)
- Query Parameters:
    - `startDate` : Start date and time in UTC format (format: YYYY-MM-DDTHH:mm:ss.SSSZ).
    - `endDate` : End date and time in UTC format (format: YYYY-MM-DDTHH:mm:ss.SSSZ).
- Example: 
```bash
GET base-url/products/{{productId}}/items?startDate=2023-10-14T00:00:00.000Z&endDate=2023-10-16T00:00:00.000Z
```
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "result": {
        "productId": "fefb02f8-f410-496a-9b25-f8e1a10103d5",
        "items": [
            {
                "id": "780acd06-291b-4cae-b3e6-83a9b1a48a7f",
                "title": "Room 1"
            },
            {
                "id": "6839acf1-507e-43e2-832d-d1bd26a0789f",
                "title": "Room 2"
            },
            {
                "id": "f026fc6a-95dc-48d6-ad8d-8ee8a57d326e",
                "title": "Room 3"
            },
            {
                "id": "8b7f2bdc-2734-4e1c-b320-d19e959edc70",
                "title": "Room 4"
            },
            {
                "id": "e0c9b80d-ddcb-442a-8959-9eca8f75a4ab",
                "title": "Room 5"
            },
            {
                "id": "21d648b7-552a-4bf4-a378-bd9869df7b76",
                "title": "Room 7"
            }
        ]
    }
}
```

### Get Items from All Client Products
Allows users with the "admin" role to retrieve a list of items for all their products. Optionally filter items based on availability within a specific date range.
- Method: `GET`
- Path: `/products/items`
- Authentication: User Access Token (Bearer token)
- Query Parameters:
    - `startDate` : Start date and time in UTC format (format: YYYY-MM-DDTHH:mm:ss.SSSZ).
    - `endDate` : End date and time in UTC format (format: YYYY-MM-DDTHH:mm:ss.SSSZ).
- Example: 
```bash
GET base-url/products/items?startDate=2023-11-14T00:00:00.000Z&endDate=2023-11-16T00:00:00.000Z
```
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "result": {
        "items": [
            {
                "id": "b52e2474-53c3-4c38-b997-61eb4d731e3d",
                "product_id": "fefb02f8-f410-496a-9b25-f8e1a10103d5",
                "title": "Standard 1"
            },
            {
                "id": "a9fcc1d4-4880-4774-97ed-f867093a0281",
                "product_id": "fefb02f8-f410-496a-9b25-f8e1a10103d5",
                "title": "Standard 3"
            },
            {
                "id": "fb250040-d068-4835-829a-5a05182fa9fe",
                "product_id": "2b6d6541-624a-4387-a4cc-66f8de456189",
                "title": "Executive 1"
            },
            {
                "id": "4c9950b0-6806-4525-881f-f91e266ff6c7",
                "product_id": "72e99827-86c7-488c-925e-43f693e3b496",
                "title": "Deluxe 1"
            }
        ]
    }
}
```