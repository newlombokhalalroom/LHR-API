## Details Endpoints <!-- {docsify-ignore} -->
Details refer to detailed information associated with products, where each product can have multiple details, and vice versa.

### Get All Details
Allows users to retrieves details of a product based on specified query parameters. 
- Method: `GET`
- Path: `/details`
- Optional Query Parameters:
    - `category` : Specifies the category of the detail.
    - `type` : Specifies the type of product.
- Example: 
```bash
GET base-url/details?category=Bed Types&type=hotel
```
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "result": [
        {
            "id": "3088c623-dc89-4424-86ca-a916f1d1448b",
            "title": "Single Bed"
        },
        {
            "id": "a73c4e7c-36e8-4160-a1c8-de3fe66d0a95",
            "title": "Queen Bed"
        },
        {
            "id": "83876751-9b3b-4217-9317-157ed65c2c76",
            "title": "King Bed"
        },
        {
            "id": "82352507-b37b-4c3e-8b4c-70067aad365e",
            "title": "Double Bed"
        }
    ]
}
```