## Options Management Endpoints <!-- {docsify-ignore} -->

### Add New Option
Allows users with the "super-admin" role to add new option to the system. Clients can then choose to add these options to their products.
- Method: `POST`
- Path: `/options`
- Authentication: User Access Token (Bearer token)
- Request Body: 
```json
{
    "type": "car rent",
    "category": "Pickup Location",
    "title": "Central Lombok",
    "price": 45000
}
```
- Response Code: `201 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Option added successfully",
    "result": {
        "option": {
            "id": "47da0667-aa2f-423c-9713-c6347f91b1c6",
            "type_id": "bdeebf9e-cf96-425a-a16f-7818a0dd290d",
            "category": "Pickup Location",
            "title": "Central Lombok",
            "_created_date": "2023-11-01T12:52:45.611Z",
            "_updated_date": "2023-11-01T12:52:45.611Z",
            "price": "45000"
        }
    }
}
```

### Update Option
Allows users with the "super-admin" role to update option in the system. 
- Method: `PUT`
- Path: `/options/{optionId}`
- Authentication: User Access Token (Bearer token)
- Request Body: 
```json
{
    "type": "hotel",
    "category": "Service",
    "title": "Laundry",
    "price": 30000
}
```
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Option added successfully",
    "result": {
        "option": {
            "id": "47da0667-aa2f-423c-9713-c6347f91b1c6",
            "type_id": "bdeebf9e-cf96-425a-a16f-7818a0dd290d",
             "category": "Service",
            "title": "Laundry",
            "_created_date": "2023-11-01T12:52:45.611Z",
            "_updated_date": "2023-11-02T07:00:20.184Z",
            "price": "30000"
        }
    }
}
```

### Delete Option
Allows users with the "super-admin" role to delete option in the system. 
- Method: `DELETE`
- Path: `/options/{optionId}`
- Authentication: User Access Token (Bearer token)
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Option deleted successfully"
}
```