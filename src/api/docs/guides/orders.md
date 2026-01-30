## Order Endpoints <!-- {docsify-ignore} -->

Order refers to a request made by a user to purchase goods or services from client.

### Create Order

Allows the creation of a new order associated with a specific client identified by clientId. Users with the "user" scope are authorized to access this endpoint.

- Method: `POST`
- Path: `/orders/{clientId}`
- Authentication: User Access Token (Bearer token)
- Request Body:

```json
{
    "startDate": "2023-11-24T00:00:00.000Z",
    "endDate": "2023-11-26T00:00:00.000Z",
    "orderItems": [
        {
            "productId": "6b036b57-9c6a-46ee-9d0e-ef3a4ba844b7",
            "optionId": ["edb63dc8-3916-46ff-99ff-fa25e6cc9320", "9b9b2e27-e80e-4ec7-bcc6-d7658e719425"]
        },
        {
            "productId": "5e954e85-eb54-4eae-bce0-f5c2c61610c0"
        }
    ]
}
```

- Response Code: `201 OK`
- Response Body:

```json
{
    "status": true,
    "message": "Orders added successfully",
    "result": {
        "id": "12f2991e-d8d7-48c2-9fea-0e97903fccf5",
        "user_details_id": "2ff5f6cf-2eda-4ac6-b7c4-ad236e4200f9",
        "client_details_id": "7f0203b0-a2a7-47bb-9046-4119ff79f13a",
        "start_date": "2023-11-24T00:00:00.000Z",
        "end_date": "2023-11-26T00:00:00.000Z",
        "total": "2475000.00",
        "addedOrderItems": [
            {
                "id": "bc9f748d-a07b-4d87-aa98-3996370a2a6e",
                "order_id": "12f2991e-d8d7-48c2-9fea-0e97903fccf5",
                "order_product_details_id": "3776e506-2230-4f50-811c-3f51c4062b05",
                "quantity": 2,
                "_created_date": "2023-11-30T08:27:44.728Z",
                "_updated_date": "2023-11-30T08:27:44.728Z",
                "total": "1675000.00",
                "addedOptions": [
                    {
                        "id": "291f615f-5b1c-40cf-9d00-7b880370fc09",
                        "order_items_id": "bc9f748d-a07b-4d87-aa98-3996370a2a6e",
                        "option_id": "edb63dc8-3916-46ff-99ff-fa25e6cc9320",
                        "title": "Room Cleaning",
                        "category": "Service",
                        "price": "45000",
                        "_created_date": "2023-11-30T08:27:44.733Z"
                    },
                    {
                        "id": "d6ce4f2d-d16a-43f3-8c7d-1e81556ef784",
                        "order_items_id": "bc9f748d-a07b-4d87-aa98-3996370a2a6e",
                        "option_id": "9b9b2e27-e80e-4ec7-bcc6-d7658e719425",
                        "title": "Laundry",
                        "category": "Service",
                        "price": "30000",
                        "_created_date": "2023-11-30T08:27:44.764Z"
                    }
                ]
            },
            {
                "id": "5964f731-5725-414c-9f43-f696956c39e2",
                "order_id": "12f2991e-d8d7-48c2-9fea-0e97903fccf5",
                "order_product_details_id": "563113e9-b07f-4933-80ae-15d07539ebeb",
                "quantity": 2,
                "_created_date": "2023-11-30T08:27:44.729Z",
                "_updated_date": "2023-11-30T08:27:44.729Z",
                "total": "800000.00",
                "addedOptions": []
            }
        ]
    }
}
```

### Get User Orders

This endpoint retrieves a list of orders for the authenticated user. Users with both "user" and "admin" scopes are authorized to access this endpoint. The result may vary depending on the user's role.

- Method: `GET`
- Path: `/orders`
- Query Parameters:
  - `filter` (optional as JSON string): filter based on order's fields.
  - `page` (optional): The page number for paginated results.
  - `limit` (optional): The number of items per page for pagination.
- Example:

```bash
GET base-url/orders?limit=3&page=1&filter=%7B%22where%22%3A%22orders.status%3D'progress'%22%7D
```

- Filter (optional): `{"where":"orders.status='progress'"}` or JSON.stringify({where: "orders.status='progress'"})
- Authentication: User Access Token (Bearer token)
- Response Code: `200 OK`
- Response Body:

```json
{
  "status": true,
  "total": 22,
  "count": 1,
  "pages": 1,
  "result": [
    {
      "id": "fdf4dbdb-9b88-4aed-aa4d-2db65eb79c0c",
      "user_details_id": "a1cc96ca-ba7c-4944-9a33-5a751579f864",
      "client_details_id": "109f49f0-fe46-42a6-8169-f6abe447626f",
      "start_date": "2023-11-05T16:00:00.000Z",
      "end_date": "2023-11-08T08:55:11.450Z",
      "_created_date": "2023-11-07T08:55:12.275Z",
      "_updated_date": "2023-11-07T08:58:14.370Z",
      "status": "progress",
      "total": 4800000,
      "user_details": "a1cc96ca-ba7c-4944-9a33-5a751579f864",
      "user_id": "bbf9fce9-786c-41c8-acfb-883040db42b6",
      "client_id": "eb417dbb-a7d3-45b2-ad72-758c4da7bf65",
      "items": [
        {
          "id": "fac9d135-4b70-437f-a8f8-8675753c1b0d",
          "order_id": "fdf4dbdb-9b88-4aed-aa4d-2db65eb79c0c",
          "order_product_details_id": "1497c5bd-1462-4706-88d6-aa484caf74e2",
          "quantity": 2,
          "_created_date": "2023-11-07T08:55:12.353Z",
          "_updated_date": "2023-11-07T08:55:12.353Z",
          "total": "1800000.00",
          "product_id": "a1fca1c5-68ef-4e2b-ba55-55de4dd1ca60",
          "title": "Standard Room",
          "picture": "https://firebasestorage.googleapis.com/v0/b/lombok-halal-room-sandbox.appspot.com/o/admin%2F7328a9d5-b6f4-427d-af6b-71daea5dc32b?alt=media&token=75904f7e-f347-4272-ac11-9e799fbdf770"
        },
        {
          "id": "fd5d77fd-ad34-48a1-9fd3-0e7be0e68d47",
          "order_id": "fdf4dbdb-9b88-4aed-aa4d-2db65eb79c0c",
          "order_product_details_id": "6514b2b1-ccec-495a-8ad2-6ef686dcf5ef",
          "quantity": 2,
          "_created_date": "2023-11-07T08:55:12.353Z",
          "_updated_date": "2023-11-07T08:55:12.353Z",
          "total": "3000000.00",
          "product_id": "b0d33840-cdb2-496c-b06c-6cb55fa2ac89",
          "title": "Luxury ",
          "picture": "https://firebasestorage.googleapis.com/v0/b/lombok-halal-room-sandbox.appspot.com/o/admin%2F4f2cd97e-4872-42f0-a12e-9cae98c448e0?alt=media&token=8f39719b-1ab6-4029-b9d5-d666ac8bc905"
        }
      ],
      "user": {
        "first_name": "Mahendra",
        "last_name": "Putra",
        "picture": null
      },
      "client": {
        "id": "eb417dbb-a7d3-45b2-ad72-758c4da7bf65",
        "type_id": "95d9abd9-b21e-4213-802b-1e2cfffc6ec0",
        "owner_id": "244281db-014c-4084-84b8-3357016954fc",
        "approved_by": "a9411808-18aa-4adf-8009-7c2bede481a4",
        "name": "GrandLegiHotel",
        "email": "info@grandlegihotel.com",
        "phone": "+123456789",
        "npwp": "789-654-321",
        "picture": "https://example.com/grandlegihotel.jpg",
        "description": "Experience unparalleled luxury at Grand Legi Hotel, where comfort meets elegance. Located in the heart of the city, our hotel offers a perfect blend of modern amenities and traditional hospitality. Whether you're traveling for business or leisure, our spacious rooms, exquisite dining options, and state-of-the-art facilities ensure a memorable stay. Enjoy breathtaking views of the city skyline and indulge in a relaxing atmosphere that will rejuvenate your senses. Grand Legi Hotel is not just a hotel; it's a destination in itself.",
        "_created_date": "2023-09-15T02:58:05.791Z",
        "_updated_date": "2023-11-23T18:26:13.569Z",
        "title": "hotel"
      }
    }
  ]
}
```

### Get User Order by ID

This endpoint retrieves a specific order identified by its unique id for the authenticated user. Users with both "user" and "admin" scopes are authorized to access this endpoint.

- Method: `GET`
- Path: `/orders/{id}`
- Example:

```bash
GET base-url/orders/fdf4dbdb-9b88-4aed-aa4d-2db65eb79c0c
```

- Authentication: User Access Token (Bearer token)
- Response Code: `200 OK`
- Response Body:

```json
{
  "status": true,
  "result": {
    "id": "fdf4dbdb-9b88-4aed-aa4d-2db65eb79c0c",
    "user_details_id": "a1cc96ca-ba7c-4944-9a33-5a751579f864",
    "client_details_id": "109f49f0-fe46-42a6-8169-f6abe447626f",
    "start_date": "2023-11-05T16:00:00.000Z",
    "end_date": "2023-11-08T08:55:11.450Z",
    "_created_date": "2023-11-07T08:55:12.275Z",
    "_updated_date": "2023-11-07T08:58:14.370Z",
    "status": "progress",
    "total": 4800000,
    "user_details": "a1cc96ca-ba7c-4944-9a33-5a751579f864",
    "user_id": "bbf9fce9-786c-41c8-acfb-883040db42b6",
    "client_id": "eb417dbb-a7d3-45b2-ad72-758c4da7bf65",
    "items": [
      {
        "id": "fac9d135-4b70-437f-a8f8-8675753c1b0d",
        "order_id": "fdf4dbdb-9b88-4aed-aa4d-2db65eb79c0c",
        "order_product_details_id": "1497c5bd-1462-4706-88d6-aa484caf74e2",
        "quantity": 2,
        "_created_date": "2023-11-07T08:55:12.353Z",
        "_updated_date": "2023-11-07T08:55:12.353Z",
        "total": "1800000.00",
        "product_id": "a1fca1c5-68ef-4e2b-ba55-55de4dd1ca60",
        "title": "Standard Room",
        "picture": "https://firebasestorage.googleapis.com/v0/b/lombok-halal-room-sandbox.appspot.com/o/admin%2F7328a9d5-b6f4-427d-af6b-71daea5dc32b?alt=media&token=75904f7e-f347-4272-ac11-9e799fbdf770"
      },
      {
        "id": "fd5d77fd-ad34-48a1-9fd3-0e7be0e68d47",
        "order_id": "fdf4dbdb-9b88-4aed-aa4d-2db65eb79c0c",
        "order_product_details_id": "6514b2b1-ccec-495a-8ad2-6ef686dcf5ef",
        "quantity": 2,
        "_created_date": "2023-11-07T08:55:12.353Z",
        "_updated_date": "2023-11-07T08:55:12.353Z",
        "total": "3000000.00",
        "product_id": "b0d33840-cdb2-496c-b06c-6cb55fa2ac89",
        "title": "Luxury ",
        "picture": "https://firebasestorage.googleapis.com/v0/b/lombok-halal-room-sandbox.appspot.com/o/admin%2F4f2cd97e-4872-42f0-a12e-9cae98c448e0?alt=media&token=8f39719b-1ab6-4029-b9d5-d666ac8bc905"
      }
    ],
    "user": {
      "first_name": "Mahendra",
      "last_name": "Putra",
      "picture": null
    },
    "client": {
      "id": "eb417dbb-a7d3-45b2-ad72-758c4da7bf65",
      "type_id": "95d9abd9-b21e-4213-802b-1e2cfffc6ec0",
      "owner_id": "244281db-014c-4084-84b8-3357016954fc",
      "approved_by": "a9411808-18aa-4adf-8009-7c2bede481a4",
      "name": "GrandLegiHotel",
      "email": "info@grandlegihotel.com",
      "phone": "+123456789",
      "npwp": "789-654-321",
      "picture": "https://example.com/grandlegihotel.jpg",
      "description": "Experience unparalleled luxury at Grand Legi Hotel, where comfort meets elegance. Located in the heart of the city, our hotel offers a perfect blend of modern amenities and traditional hospitality. Whether you're traveling for business or leisure, our spacious rooms, exquisite dining options, and state-of-the-art facilities ensure a memorable stay. Enjoy breathtaking views of the city skyline and indulge in a relaxing atmosphere that will rejuvenate your senses. Grand Legi Hotel is not just a hotel; it's a destination in itself.",
      "_created_date": "2023-09-15T02:58:05.791Z",
      "_updated_date": "2023-11-23T18:26:13.569Z",
      "title": "hotel"
    }
  }
}
```

### Get Order Invoice By Order ID

This endpoint retrieves a specific invoice identified by the order id for the authenticated user. Users with "user" scopes are authorized to access this endpoint.

- Method: `GET`
- Path: `/orders/{id}/invoice`
- Authentication: User Access Token (Bearer token)
- Response Code: `200 OK`
- Response Body:

```json
{
  "status": true,
  "result": {
    "id": "cf6f3fe2-eca3-4401-b2b4-b89d5b5cbe0b",
    "user_details_id": "9de3c091-9cd7-45b1-8204-5b38cc27f741",
    "client_details_id": "6e7d5676-c5b1-44b4-9eaa-77209b4aaf22",
    "start_date": "2023-11-14T00:00:00.000Z",
    "end_date": "2023-11-15T00:00:00.000Z",
    "_created_date": "2023-10-18T06:26:38.170Z",
    "_updated_date": "2023-10-18T06:26:38.170Z",
    "status": "unpaid",
    "total": "4400000.00",
    "userDetails": {
      "id": "9de3c091-9cd7-45b1-8204-5b38cc27f741",
      "user_id": "92b73fdc-64a8-4feb-92c5-f3cf02b88fe9",
      "first_name": "John",
      "last_name": "Doe",
      "email": "johndoe@gmail.com",
      "phone": "012339485891",
      "_created_date": "2023-10-18T06:26:38.080Z"
    },
    "clientDetails": {
      "id": "6e7d5676-c5b1-44b4-9eaa-77209b4aaf22",
      "client_id": "d1ccbf70-4d9b-4845-bdcf-84739adfdf4f",
      "name": "Grand Madani Hotel",
      "email": "grandmadani@example.com",
      "phone": "+01909087",
      "npwp": "675-908-657",
      "_created_date": "2023-10-18T06:26:38.129Z"
    },
    "orderItems": [
      {
        "id": "677b12a1-0538-4647-8972-5234f1b9cf25",
        "order_id": "cf6f3fe2-eca3-4401-b2b4-b89d5b5cbe0b",
        "order_product_details_id": "677b12a1-0538-4647-8972-5234f1b9cf25",
        "quantity": 3,
        "_created_date": "2023-10-18T06:26:38.215Z",
        "_updated_date": "2023-10-18T06:26:38.360Z",
        "total": "2400000.00",
        "product_id": "69f2ec85-60ed-45ab-8520-c53488888081",
        "title": "Regular Room",
        "description": "Regular room that provide a lot of aminities",
        "price": "800000",
        "units": "night"
      },
      {
        "id": "eee62e85-9d76-44e5-baa3-ff6d0b2afb33",
        "order_id": "cf6f3fe2-eca3-4401-b2b4-b89d5b5cbe0b",
        "order_product_details_id": "eee62e85-9d76-44e5-baa3-ff6d0b2afb33",
        "quantity": 2,
        "_created_date": "2023-10-18T06:26:38.215Z",
        "_updated_date": "2023-10-18T06:26:38.360Z",
        "total": "1600000.00",
        "product_id": "9558f7e3-9464-4389-b84c-ee6ee7b31062",
        "title": "Deluxe Room",
        "description": "Deluxe room that provide a lot of aminities",
        "price": "800000",
        "units": "night"
      },
      {
        "id": "67b67a7e-15e6-40b3-8c7b-08f0c377ce77",
        "order_id": "cf6f3fe2-eca3-4401-b2b4-b89d5b5cbe0b",
        "order_product_details_id": "67b67a7e-15e6-40b3-8c7b-08f0c377ce77",
        "quantity": 1,
        "_created_date": "2023-10-18T06:26:38.215Z",
        "_updated_date": "2023-10-18T06:26:38.360Z",
        "total": "400000.00",
        "product_id": "49a6284a-b6f5-48bd-a77e-a51f4a03a8c4",
        "title": "Deluxe Ocean View Room",
        "description": "Experience luxury and breathtaking ocean views in our spacious Deluxe Ocean View Room, perfect for a romantic getaway or relaxation.",
        "price": "400000",
        "units": "night"
      }
    ]
 }
}
```

### Get Midtrans Snap token

This API endpoint allowed user with 'user' roles to retrieve a Midtrans Snap token for processing payments related to a specific order.

- Method: `GET`
- Path: `/orders/{orderId}/payment`
- Authentication: User Access Token (Bearer token)
- Response Code: `200 OK`
- Response Body:

```json
{
  "status": true,
  "result": {
    "token": "cd850039-f8b1-42e7-9dc9-6c372b5c28f9",
    "redirect_url": "https://app.sandbox.midtrans.com/snap/v3/redirection/cd850039-f8b1-42e7-9dc9-6c372b5c28f9"
  }
}
```

### Update Order Confirmation Status

This API endpoint allowed user with 'admin' roles to accept an order by setting its status to "progress" or reject it by setting its status to "cancelled". The action can only be executed if the order is in process status.

- Method: `PUT`
- Path: `/orders/{id}/confirmation/{status}`
- Authentication: User Access Token (Bearer token)
- Response Code: `200 OK`
- Response Body:

```json
{
  "status": true,
  "message": "Order status updated successfully",
  "result": {
    "id": "e541515b-73d8-4303-aeab-f57c24304a43",
    "status": "progress",
    "_updated_date": "2023-10-28T06:40:36.444Z"
  }
}
```

### Update Order Completion Status

This API endpoint allowed user with 'user' roles to update the completion status of a specific order. The action can only be executed if the order is in progress status and the current time has already passed the end date specified in the order.

- Method: `PUT`
- Path: `/orders/{orderId}/completed`
- Authentication: User Access Token (Bearer token)
- Response Code: `200 OK`
- Response Body:

```json
{
  "status": true,
  "message": "Order status updated successfully",
  "result": {
    "id": "e541515b-73d8-4303-aeab-f57c24304a43",
    "status": "done",
    "_updated_date": "2023-10-28T06:40:54.054Z"
  }
}
```

### Get Orders Summaries (Admin Dashboard)

This endpoint retrieves summaries of orders data for the authenticated admin.

- Method: `GET`
- Path: `/orders/summaries`
- Query Parameters:
  - `lastmonths`: filter to allow users to access order summaries data from the last few months.
- Example:

```bash
GET base-url/orders/summaries?lastmonths=1
```

- Authentication: User Access Token (Bearer token)
- Response Code: `200 OK`
- Response Body:

```json
{
    "status": true,
    "result": {
        "total": 3,
        "income": 4800000,
        "process": {
            "total": 0,
            "percentage": 0
        },
        "progress": {
            "total": 0,
            "percentage": 0
        },
        "done": {
            "total": 1,
            "percentage": 33.33333333333333
        },
        "cancelled": {
            "total": 2,
            "percentage": 66.66666666666666
        }
    }
}
```
