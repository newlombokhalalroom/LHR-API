## Cards Endpoints <!-- {docsify-ignore} -->

### Add New Card
Allows users with the "user" and "admin" role to add new card information.
- Method: `POST`
- Path: `/cards`
- Authentication: User Access Token (Bearer token)
- Request Body: 
```json
{
    "bankId": "581b27fa-0a97-4495-b528-ce7e2379c579",
    "cardNumber": "89078968989",
    "cardHolder": "John Doe"
}
```
- Response Code: `201 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Card added successfully",
    "result": {
        "id": "d07d8bed-a0f4-4875-bad6-21ec4d4c265a",
        "bank_id": "581b27fa-0a97-4495-b528-ce7e2379c579",
        "user_id": "92b73fdc-64a8-4feb-92c5-f3cf02b88fe9",
        "card_number": "89078968989",
        "card_holder": "John Doe",
        "_created_date": "2023-11-09T12:20:33.188Z",
        "_updated_date": "2023-11-09T12:20:33.188Z"
    }
}
```

### Update a Card
Allows users with the "user" and "admin" role to update their card information.
- Method: `PUT`
- Path: `/cards`
- Authentication: User Access Token (Bearer token)
- Request Body: 
```json
{
    "bankId": "c6613409-f733-464c-8a32-cee711c15a63",
    "cardNumber": "890789453777",
    "cardHolder": "Jane Doe"
}
```
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Card updated successfully",
    "result": {
        "id": "9366af73-ec86-46e9-a393-93a226935ba3",
        "bank_id": "c6613409-f733-464c-8a32-cee711c15a63",
        "user_id": "92b73fdc-64a8-4feb-92c5-f3cf02b88fe9",
        "card_number": "890789453777",
        "card_holder": "Jane Doe",
        "_created_date": "2023-11-09T11:56:50.179Z",
        "_updated_date": "2023-11-09T12:30:00.042Z"
    }
}
```

### Get Card Information
Allows users with the "user" and "admin" role to get their card information.
- Method: `GET`
- Path: `/cards`
- Authentication: User Access Token (Bearer token)
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "result": {
        "id": "3b56f2ac-f7ae-4976-a059-2756e4d8de81",
        "bank_id": "5fc4172f-6a69-499d-b72f-d1583817cdd7",
        "user_id": "75191894-1d24-404d-b30c-820f5cfa2dbc",
        "card_number": "890789453777",
        "card_holder": "John Doe",
        "_created_date": "2023-11-10T12:52:20.229Z",
        "_updated_date": "2023-11-20T05:05:40.835Z",
        "bank": {
            "id": "5fc4172f-6a69-499d-b72f-d1583817cdd7",
            "icon": "https://firebasestorage.googleapis.com/v0/b/lombok-halal-room-sandbox.appspot.com/o/banks%2Fbca.png?alt=media&token=b303bda6-c0ab-46bc-b72c-fc84fb548e8d",
            "code": "bca",
            "title": "PT. BANK CENTRAL ASIA TBK."
        }
    }
}
```