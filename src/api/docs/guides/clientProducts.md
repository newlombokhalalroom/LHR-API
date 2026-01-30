## Client's Products Endpoints <!-- {docsify-ignore} -->

### Get All Client's Products
Allows users to retrieves a list of products associated with a specific client identified by their id. 
- Method: `GET`
- Path: `/clients/{id}/products`
- Query Parameters:
    - `page` (optional): The page number for paginated results.
    - `limit` (optional): The number of items per page for pagination.
- Example: 
```bash
base-url//clients/{id}/products?limit=2&page=1
```
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "result": [
        {
            "id": "72e99827-86c7-488c-925e-43f693e3b496",
            "title": "Deluxe Ocean View Room",
            "description": "Experience luxury and breathtaking ocean views in our spacious Deluxe Ocean View Room, perfect for a romantic getaway or relaxation.",
            "availability": true,
            "price": "350000",
            "units": "night",
            "details": [
                {
                    "id": "a73c4e7c-36e8-4160-a1c8-de3fe66d0a95",
                    "title": "Queen Bed",
                    "amount": "1"
                },
                {
                    "id": "68b6c624-a5d3-43ba-af83-d56ee7816480",
                    "title": "Guests",
                    "amount": "2"
                }
            ],
            "pictures": [
                {
                    "id": "52e9e0a1-c83d-4fcc-86ca-091af28d1d5f",
                    "picture": "https://example.com/deluxe-ocean-view-room-1.jpg",
                    "title": "Room with a View",
                    "description": "Enjoy panoramic ocean views from your private balcony."
                },
                {
                    "id": "4a38be1c-780c-4b10-b3ac-efa13cdd8c85",
                    "picture": "https://example.com/deluxe-ocean-view-room-2.jpg",
                    "title": "Comfortable Bed",
                    "description": "Relax in a spacious room with a comfortable king-sized bed."
                }
            ],
            "items": [
                {
                    "id": "4c9950b0-6806-4525-881f-f91e266ff6c7",
                    "title": "Deluxe 1"
                }
            ]
        },
        {
            "id": "eac10847-61e3-436c-bd60-b2c43abaa51a",
            "title": "Luxury Suite with Private Pool",
            "description": "Indulge in ultimate luxury and privacy with our exclusive Luxury Suite featuring a private pool and stunning views of the surrounding landscape.",
            "availability": true,
            "price": "20000",
            "units": "night",
            "details": [
                {
                    "id": "a73c4e7c-36e8-4160-a1c8-de3fe66d0a95",
                    "title": "Queen Bed",
                    "amount": "1"
                }
            ],
            "pictures": [
                {
                    "id": "a4eedf09-4270-4164-b4a7-b1c1c3c655fd",
                    "picture": "https://example.com/luxury-suite-1.jpg",
                    "title": "Private Pool Paradise",
                    "description": "Enjoy your own private pool with breathtaking views."
                },
                {
                    "id": "9aeb4ec9-220e-47b5-9077-89d590604783",
                    "picture": "https://example.com/luxury-suite-2.jpg",
                    "title": "Spacious Living Area",
                    "description": "Relax in a spacious living area with elegant decor."
                }
            ],
            "items": []
        }
    ]
}
```

### Get Product by ID
Allows users to retrieve detailed information about a product using its unique id.
- Method: `GET`
- Path: `/products/{productId}`
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "result": {
        "id": "fefb02f8-f410-496a-9b25-f8e1a10103d5",
        "client_id": "374624e2-7f5a-428f-8b26-92ded2581f27",
        "title": "Standard Room",
        "description": "A comfortable standard room perfect for a relaxing stay.",
        "availability": true,
        "price": "900000",
        "units": "night",
        "_created_date": "2023-09-28T12:45:03.587Z",
        "_updated_date": "2023-09-28T12:45:03.587Z",
        "amenities": [
            {
                "id": "0ef924a0-437d-4646-81ef-e9b356c1da23",
                "title": "Qibla Direction",
                "category": "halal"
            },
            {
                "id": "eeaaa843-856a-4d14-91a1-26f25d52f985",
                "title": "Prayer Mats",
                "category": "halal"
            },
            {
                "id": "b8e51cd2-5791-4d5e-a379-ca372ad2c8fe",
                "title": "Television",
                "category": "halal"
            }
        ],
        "pictures": [
            {
                "id": "a7e251c5-03d9-4d5c-8d12-e35d234a345e",
                "product_id": "fefb02f8-f410-496a-9b25-f8e1a10103d5",
                "picture": "https://i.ibb.co/t4Y85qN/blank-profile-picture-973460-1280.png",
                "title": "Bedroom",
                "description": "Cozy Bedroom with 1 Queen-sized Bed",
                "_created_date": "2023-09-28T12:45:03.646Z",
                "_updated_date": "2023-09-28T12:45:03.646Z"
            },
            {
                "id": "8b86a833-d5e8-4e01-9bc3-4865a9f6c7bb",
                "product_id": "fefb02f8-f410-496a-9b25-f8e1a10103d5",
                "picture": "https://i.ibb.co/t4Y85qN/blank-profile-picture-973460-1280.png",
                "title": "Bathroom",
                "description": "Bathroom with Shower",
                "_created_date": "2023-09-28T12:45:03.646Z",
                "_updated_date": "2023-09-28T12:45:03.646Z"
            }
        ],
        "details": [
            {
                "id": "3088c623-dc89-4424-86ca-a916f1d1448b",
                "title": "Single Bed",
                "amount": "1"
            },
            {
                "id": "68b6c624-a5d3-43ba-af83-d56ee7816480",
                "title": "Guests",
                "amount": "2"
            }
        ],
        "items": [
            {
                "id": "b52e2474-53c3-4c38-b997-61eb4d731e3d",
                "title": "Standard 1"
            },
            {
                "id": "55e42e61-84b6-4a26-9c18-26908b92f399",
                "title": "Standard 2"
            },
            {
                "id": "a9fcc1d4-4880-4774-97ed-f867093a0281",
                "title": "Standard 3"
            }
        ]
    }
}
```

### Get Product's Options
Allows users to retrieve information about a product's options using its unique id.
- Method: `GET`
- Path: `/products/{productId}/options`
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "result": [
        {
            "id": "833b2ec3-ffaf-4560-bf49-3e5ad2b97a36",
            "title": "Laundry",
            "price": "60000"
        },
        {
            "id": "7cb5a011-1f28-4d9f-8aff-39abac48831e",
            "title": "Room Cleaning",
            "price": "35000"
        }
    ]
}
```