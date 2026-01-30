## Clients Endpoints <!-- {docsify-ignore} -->

### Get All Approved Clients 
Allows users to retrieve a list of all approved clients. 
- Method: `GET`
- Path: `/clients`
- Query Parameters:
    - `page` (optional): The page number for paginated results.
    - `limit` (optional): The number of items per page for pagination.
- Example: 
```bash
GET base-url/clients?limit=2&page=1
```
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "result": [
        {
            "id": "374624e2-7f5a-428f-8b26-92ded2581f27",
            "type_id": "a3dfce96-6136-4b15-9d4c-83a7a55fc279",
            "owner_id": "4a96a9e9-30b8-4952-90d6-8f250d3e768b",
            "approved_by": "7b69dc7a-8e7e-4012-b165-3dc6a05d02fc",
            "name": "Madani",
            "email": "samplehotel@example.com",
            "phone": "+1234567890",
            "npwp": "123-456-789",
            "picture": "https://example.com/samplehotel.jpg",
            "description": "A luxurious hotel offering top-notch amenities and breathtaking views.",
            "_created_date": "2023-09-14T13:30:57.841Z",
            "_updated_date": "2023-09-14T13:30:57.841Z",
            "title": "hotel",
            "pictures": [
                {
                    "id": "9d8249cc-6235-4ae2-b864-54dd6eafad56",
                    "client_id": "374624e2-7f5a-428f-8b26-92ded2581f27",
                    "picture": "https://i.ibb.co/t4Y85qN/blank-profile-picture-973460-1280.png",
                    "title": "Hotel Pool",
                    "description": "Big Hotel Pool",
                    "_created_date": "2023-09-18T13:39:51.961Z",
                    "_updated_date": "2023-09-18T13:39:51.961Z"
                },
                {
                    "id": "0bc972d4-a96d-4f05-b2d4-a9da03ca8732",
                    "client_id": "374624e2-7f5a-428f-8b26-92ded2581f27",
                    "picture": "https://i.ibb.co/t4Y85qN/blank-profile-picture-973460-1280.png",
                    "title": "Hotel Gym",
                    "description": "Big Hotel Gym",
                    "_created_date": "2023-09-18T13:54:05.320Z",
                    "_updated_date": "2023-09-18T13:54:05.320Z"
                }
            ]
        },
        {
            "id": "58bf6274-5866-48bb-a05d-8f0ca1a2bbaa",
            "type_id": "a3dfce96-6136-4b15-9d4c-83a7a55fc279",
            "owner_id": "af6ed60a-5853-4670-8391-9d4bf3adcaf9",
            "approved_by": "7b69dc7a-8e7e-4012-b165-3dc6a05d02fc",
            "name": "Grand",
            "email": "samplehotel@example.com",
            "phone": "+1234567890",
            "npwp": "123-456-789",
            "picture": "https://example.com/samplehotel.jpg",
            "description": "A luxurious hotel offering top-notch amenities and breathtaking views.",
            "_created_date": "2023-09-14T12:51:13.479Z",
            "_updated_date": "2023-10-18T06:57:11.675Z",
            "title": "hotel",
            "pictures": []
        }
    ]
}
```

### Retrieve Client by ID
Allows users to retrieve detailed information about a specific client based on their unique identifier (ID). 
- Method: `GET`
- Path: `/clients/{id}`
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "result": {
        "id": "374624e2-7f5a-428f-8b26-92ded2581f27",
        "type_id": "a3dfce96-6136-4b15-9d4c-83a7a55fc279",
        "owner_id": "4a96a9e9-30b8-4952-90d6-8f250d3e768b",
        "approved_by": "7b69dc7a-8e7e-4012-b165-3dc6a05d02fc",
        "name": "Madani",
        "email": "samplehotel@example.com",
        "phone": "+1234567890",
        "npwp": "123-456-789",
        "picture": "https://example.com/samplehotel.jpg",
        "description": "A luxurious hotel offering top-notch amenities and breathtaking views.",
        "_created_date": "2023-09-14T13:30:57.841Z",
        "_updated_date": "2023-09-14T13:30:57.841Z",
        "title": "hotel",
        "clientPictures": [
            {
                "id": "9d8249cc-6235-4ae2-b864-54dd6eafad56",
                "picture": "https://i.ibb.co/t4Y85qN/blank-profile-picture-973460-1280.png",
                "title": "Hotel Pool",
                "description": "Big Hotel Pool"
            },
            {
                "id": "0bc972d4-a96d-4f05-b2d4-a9da03ca8732",
                "picture": "https://i.ibb.co/t4Y85qN/blank-profile-picture-973460-1280.png",
                "title": "Hotel Gym",
                "description": "Big Hotel Gym"
            },
            {
                "id": "cecee5bb-d1f7-4df7-a70f-3c875426ae24",
                "picture": "https://i.ibb.co/t4Y85qN/blank-profile-picture-973460-1280.png",
                "title": "Hotel Parking Lot",
                "description": "Big Hotel Parking Lot"
            },
            {
                "id": "ed3c0e6e-7f35-4fa6-9d1e-3afb1677f101",
                "picture": "https://i.ibb.co/t4Y85qN/blank-profile-picture-973460-1280.png",
                "title": "Hotel Food Court",
                "description": "Big Hotel Food Court"
            }
        ],
        "clientFacilities": [
            {
                "title": "Tempat Wudhu",
                "category": "halal"
            },
            {
                "title": "Kolam Renang",
                "category": "halal"
            }
        ],
        "clientLocation": {
            "address": "Jl. Udayana No.20, Monjok Bar., Kec. Selaparang, 83122",
            "city": "Kota Mataram",
            "province": "Nusa Tenggara Barat",
            "longitude": 116.10281638858123,
            "latitude": -8.57548540893652
        },
        "policies": [
            {
                "policy_id": "8a08844f-d28c-437d-8a21-4ba945372968",
                "title": "Check-in",
                "category": "regular",
                "description": "Standard check-in time",
                "details": "From 15:00"
            },
            {
                "policy_id": "a93ca831-04a1-4b36-a036-a589e02b4476",
                "title": "Check-out",
                "category": "regular",
                "description": "Standard check-out time",
                "details": "From 12:00"
            }
        ]
    }
}
```