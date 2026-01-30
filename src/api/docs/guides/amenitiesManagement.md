## Amenities Management Endpoints <!-- {docsify-ignore} -->
Amenities refer to features or services associated with products, where each product can have multiple amenities, and vice versa.

### Add New Amenity
Allows users with the "super-admin" role to add new amenity to the system. Admin can then choose to add these amenities to their product information.
- Method: `POST`
- Path: `/amenities`
- Authentication: User Access Token (Bearer token)
- Request Body: 
```json
{
    "type": "hotel",
    "category": "halal",
    "title": "Television"
}
```
- **The `category` field in the request body specifies whether the facility is `halal` or `regular`.**
- Response Code: `201 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Amenity added successfully",
    "result": {
        "amenity": {
            "id": "999d48a4-e695-4506-9e1a-fa15100a59d5",
            "type_id": "a3dfce96-6136-4b15-9d4c-83a7a55fc279",
            "title": "Television",
            "category": "halal",
            "_created_date": "2023-09-28T03:08:05.975Z"
        }
    }
}
```

### Update Amenity by ID
Allows users with the "super-admin" role to update a spesific amenity in the system. 
- Method: `PUT`
- Path: `/amenities/{id}`
- Authentication: User Access Token (Bearer token)
- Request Body: 
```json
{
    "type": "hotel",
    "category": "regular",
    "title": "TV"
}
```
- **The `category` field in the request body specifies whether the facility is `halal` or `regular`.**
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Amenity updated successfully",
    "result": {
        "id": "999d48a4-e695-4506-9e1a-fa15100a59d5",
        "type_id": "a3dfce96-6136-4b15-9d4c-83a7a55fc279",
        "category": "regular",
        "title": "TV",
        "_updated_date": "2023-09-28T03:12:13.198Z"
    }
}
```

### Delete Amenity by ID
Allows users with the "super-admin" role to delete a spesific amenity in the system. 
- Method: `DELETE`
- Path: `/amenities/{id}`
- Authentication: User Access Token (Bearer token)
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Amenity deleted successfully",
    "result": {
        "amenityId": {
            "id": "999d48a4-e695-4506-9e1a-fa15100a59d5"
        }
    }
}
```