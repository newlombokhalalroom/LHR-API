## Banks Management Endpoints <!-- {docsify-ignore} -->

### Add New Bank
Allows users with the "super-admin" role to add new bank to the system.
- Method: `POST`
- Path: `/banks`
- Authentication: User Access Token (Bearer token)
- Request Body: 
```json
{
    "code": "citibank",
    "title": "CITIBANK, NA",
    "icon": "https://firebasestorage.googleapis.com/v0/b/lombok-halal-room-sandbox.appspot.com/o/banks%2Fciti.png?alt=media&token=c78b3af2-dbd9-4a5d-9eca-a10d76124617"
}
```
- Response Code: `201 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Bank added successfully",
    "result": {
        "id": "08f4a8ba-2f3b-4870-bad7-b6f75cae8a46",
        "code": "citibank",
        "title": "CITIBANK, NA",
        "_created_date": "2023-11-20T04:56:43.534Z",
        "_updated_date": "2023-11-20T04:56:43.534Z",
        "icon": "https://firebasestorage.googleapis.com/v0/b/lombok-halal-room-sandbox.appspot.com/o/banks%2Fciti.png?alt=media&token=c78b3af2-dbd9-4a5d-9eca-a10d76124617"
    }
}
```

### Update a Bank
Allows users with the "super-admin" role to update bank information in the system.
- Method: `PUT`
- Path: `/banks`
- Authentication: User Access Token (Bearer token)
- Request Body: 
```json
{
    "code": "citibank",
    "title": "CITIBANK, NA",
    "icon": "https://firebasestorage.googleapis.com/v0/b/lombok-halal-room-sandbox.appspot.com/o/banks%2Fciti.png?alt=media&token=c78b3af2-dbd9-4a5d-9eca-a10d76124617"
}
```
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Bank updated successfully",
    "result": {
        "id": "08f4a8ba-2f3b-4870-bad7-b6f75cae8a46",
        "code": "citibank",
        "title": "CITIBANK, NA",
        "_created_date": "2023-11-20T04:56:43.534Z",
        "_updated_date": "2023-11-20T04:58:21.222Z",
        "icon": "https://firebasestorage.googleapis.com/v0/b/lombok-halal-room-sandbox.appspot.com/o/banks%2Fciti.png?alt=media&token=c78b3af2-dbd9-4a5d-9eca-a10d76124617"
    }
}
```