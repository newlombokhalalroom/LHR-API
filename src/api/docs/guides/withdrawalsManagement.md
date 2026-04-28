## Withdrawals Management Endpoints <!-- {docsify-ignore} -->

### Update Withdrawal Status
Allows user with "super-admin" role to update withdrawal status (to cancelled or success) by its Id.
- Method: `PUT`
- Path: `/withdrawals/{id}/{status}`
- Authentication: User Access Token (Bearer token)
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Withdrawal status updated successfully",
    "result": {
        "id": "da2119c1-0e4b-4417-b79d-feeb10cfe426",
        "card_id": "d07d8bed-a0f4-4875-bad6-21ec4d4c265a",
        "balance_id": "a9690910-627d-465f-8bc8-c223ed3df7ab",
        "amount": "1000000.00",
        "status": "cancelled",
        "_created_date": "2023-11-09T18:44:56.747Z",
        "_updated_date": "2023-11-09T18:46:22.436Z"
    }
}
```