## Reviews Endpoints <!-- {docsify-ignore} -->

### Adding Product Reviews
Allows users to add reviews for products included in their orders. 
- **Conditions for Adding Reviews**
    - The order associated with the orderId must be completed (status is 'done').
    - The order must belong to the authenticated user.
    - The specified product (productId) must be included in the order.
    - Users cannot add multiple reviews for the same product within the same order.
    - The rating given to the product must be on a scale of 1 to 5.
- Method: `POST`
- Path: `/orders/{orderId}/reviews/{productId}`
- Authentication: User Access Token (Bearer token)
- Request Body:
```json
{
  "reviewContent": "Your review content here",
  "reviewRate": 5
}
```
- Response Code: `201 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Review added successfully",
    "result": {
        "id": "c1592c11-2e45-4893-8dfb-9f352198584f",
        "order_id": "efa1d86f-31b8-4ec8-8e2e-ccadb4bb98fe",
        "user_id": "75191894-1d24-404d-b30c-820f5cfa2dbc",
        "product_id": "eac10847-61e3-436c-bd60-b2c43abaa51a",
        "review_content": "Good review content here",
        "review_rate": "3",
        "_created_date": "2024-03-17T13:43:33.313Z"
    }
}
```

### Retrieve Product Reviews
Allows users to retrieve reviews for a specific product based on its unique identifier (id). 
- Method: `GET`
- Path: `/products/{id}/reviews`
- Query Parameters:
    - `sort` (optional): Specifies the sorting criteria for the retrieved reviews. Possible values are:
        - **highest_rating**: Sort reviews by highest rating first.
        - **lowest_rating**: Sort reviews by lowest rating first.
        - If not provided, reviews will be sorted by default based on the newest reviews first.
    - `filter` (optional): Filters reviews based on the rating. Only reviews with the specified rating will be retrieved. Should be a value **between 1 and 5**.
    - `page` (optional): Specifies the page number of the results. Default is 1.
    - `limit` (optional): Specifies the maximum number of reviews per page. Default is 10.
- Example: 
```bash
GET base-url/products/{{id}}/reviews?sort=highest_rating&filter=5&limit=5&page=2
```
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "result": {
        "productId": "eac10847-61e3-436c-bd60-b2c43abaa51a",
        "reviews": [
            {
                "id": "b0e93d8a-bc51-4b4f-8352-8cba98fa2ad6",
                "order_id": "afffce8b-4f65-408f-a56e-45b2d6dfdd08",
                "user_id": "75191894-1d24-404d-b30c-820f5cfa2dbc",
                "product_id": "eac10847-61e3-436c-bd60-b2c43abaa51a",
                "review_content": "Luar Biasa",
                "review_rate": "5",
                "_created_date": "2024-03-17T13:42:14.167Z"
            }
        ]
    }
}
```