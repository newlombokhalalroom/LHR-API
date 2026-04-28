## Withdrawals Endpoints <!-- {docsify-ignore} -->

### Add New Withdrawal
Allows users with the "user" and "admin" role to withdraw their balance.
- Method: `POST`
- Path: `/withdrawals`
- Authentication: User Access Token (Bearer token)
- Request Body: 
```json
{
    "amount": 1000000
}
```
- Response Code: `201 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Withdrawals successfully",
    "result": {
        "id": "da2119c1-0e4b-4417-b79d-feeb10cfe426",
        "card_id": "d07d8bed-a0f4-4875-bad6-21ec4d4c265a",
        "balance_id": "a9690910-627d-465f-8bc8-c223ed3df7ab",
        "amount": "1000000.00",
        "status": "pending",
        "_created_date": "2023-11-09T18:44:56.747Z",
        "_updated_date": "2023-11-09T18:44:56.747Z",
        "balance": "8900000.00"
    }
}
```

### Get Withdrawals History
Allows users with the "user" and "admin" role to get their withdrawal History.
User with "super-admin" role can get all users withdrawal History.
- Method: `GET`
- Path: `/withdrawals`
- Authentication: User Access Token (Bearer token)
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "result": [
        {
            "id": "a581b884-9ad9-4c32-b942-f965289d24fd",
            "card_id": "d07d8bed-a0f4-4875-bad6-21ec4d4c265a",
            "balance_id": "a9690910-627d-465f-8bc8-c223ed3df7ab",
            "amount": "100000.00",
            "status": "cancelled",
            "_created_date": "2023-11-09T17:42:14.423Z",
            "_updated_date": "2023-11-09T18:42:57.390Z"
        },
        {
            "id": "f0244d3b-601d-4683-b7b3-69541632f3d1",
            "card_id": "d07d8bed-a0f4-4875-bad6-21ec4d4c265a",
            "balance_id": "a9690910-627d-465f-8bc8-c223ed3df7ab",
            "amount": "100000.00",
            "status": "success",
            "_created_date": "2023-11-09T17:40:24.703Z",
            "_updated_date": "2023-11-09T18:44:33.787Z"
        },
        {
            "id": "da2119c1-0e4b-4417-b79d-feeb10cfe426",
            "card_id": "d07d8bed-a0f4-4875-bad6-21ec4d4c265a",
            "balance_id": "a9690910-627d-465f-8bc8-c223ed3df7ab",
            "amount": "1000000.00",
            "status": "pending",
            "_created_date": "2023-11-09T18:44:56.747Z",
            "_updated_date": "2023-11-09T18:44:56.747Z"
        }
    ]
}
```

### Get Withdrawal By Id
Allows users to get withdrawal detail information.
- Method: `GET`
- Path: `/withdrawals/{id}`
- Authentication: User Access Token (Bearer token)
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "result": {
        "id": "fce14ed9-89cc-4a8a-9eb0-e197b187bdf3",
        "card_id": "a2f8b604-4eee-4c92-8507-78bb9f934d36",
        "balance_id": "9ba44c68-b2b4-41d5-9b40-29e8d8271429",
        "amount": "10000000.00",
        "status": "pending",
        "_created_date": "2023-11-10T14:51:41.901Z",
        "_updated_date": "2023-11-10T14:51:41.901Z",
        "user_id": "511ed288-554b-4f07-96ed-3d323e67e745",
        "card": {
            "id": "a2f8b604-4eee-4c92-8507-78bb9f934d36",
            "bank_id": "c6613409-f733-464c-8a32-cee711c15a63",
            "user_id": "511ed288-554b-4f07-96ed-3d323e67e745",
            "card_number": "890789453777",
            "card_holder": "John Doe",
            "_created_date": "2023-11-10T14:49:30.495Z",
            "_updated_date": "2023-11-10T15:31:29.258Z",
            "bank_code": "bni",
            "bank_name": "PT. BANK NEGARA INDONESIA",
            "bank_icon": "https://firebasestorage.googleapis.com/v0/b/lombok-halal-room-sandbox.appspot.com/o/banks%2Fciti.png?alt=media&token=c78b3af2-dbd9-4a5d-9eca-a10d76124617"
        }
    }
}
```