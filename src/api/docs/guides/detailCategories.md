## Detail Categories Endpoints <!-- {docsify-ignore} -->

### Add New Detail Category
Allow super admin to add new detail category to the system.
- Method: `POST`
- Path: `/details/categories`
- Authentication: User Access Token (Bearer token)
- Request Body: 
```json
{
    "title": "Vehicle Type"
}
```
- Response Code: `201 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Detail category added successfully",
    "result": {
        "id": "580639aa-529b-45d1-aef5-dfab048b1d5b"
    }
}
```

### Update Detail Category
Allow super admin to update detail category to the system.
- Method: `PUT`
- Path: `/details/categories/{id}`
- Authentication: User Access Token (Bearer token)
- Request Body: 
```json
{
    "title": "Room Type"
}
```
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Detail categories updated successfully",
    "result": {
        "id": "580639aa-529b-45d1-aef5-dfab048b1d5b",
        "title": "Room Type"
    }
}
```

### Delete Detail Category
Allow super admin to delete detail category to the system.
- Method: `DELETE`
- Path: `/details/categories/{id}`
- Authentication: User Access Token (Bearer token)
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Detail categories deleted successfully",
}
```