## User's Balance Endpoints <!-- {docsify-ignore} -->

### Get User Balance Information
Retrieve the balances information for the authenticated user. 
- Method: `GET`
- Path: `/users/balances`
- Authentication: User Access Token (Bearer token)
- Response Code: `200 OK`
- Response Body:
```json
{
   "status": true,
    "result": {
        "id": "9ba44c68-b2b4-41d5-9b40-29e8d8271429",
        "user_id": "511ed288-554b-4f07-96ed-3d323e67e745",
        "amount": "4000000.00",
        "_created_date": "2023-10-16T07:29:06.841Z",
        "_updated_date": "2023-10-25T07:41:09.657Z"
    }
}
```