## Item's Unavailable Status Endpoints <!-- {docsify-ignore} -->
This status indicates periods when a product's item is not available for purchase. 

### Mark Product's Item as Unavailable
Allows users with the "admin" role to mark a specific product item as unavailable within a specified date range.
- Method: `POST`
- Path: `/products/{productId}/items/{itemId}/unavailable`
- Authentication: User Access Token (Bearer token)
- Request Body: 
```json
{
    "startDate": "2023-11-11T00:00:00.000Z",
    "endDate": "2023-11-12T00:10:00.000Z"
}
```
- Response Code: `201 OK`
- Response Body:
```json
{
    "status": true,
    "result": {
        "item": {
            "id": "8799cfff-5e15-42d3-a1cc-c92db8da519e",
            "unavailable": {
                "id": "7ce6758d-1af0-4715-9309-d5b63ea3c02b",
                "start_date": "2023-11-11T00:00:00.000Z",
                "end_date": "2023-11-12T00:10:00.000Z"
            }
        }
    }
}
```

### Get Item's Unavailability Status
Allows users with the "admin" role to retrieves a list of unavailability periods for a specific product item.
- Method: `GET`
- Path: `/products/{productId}/items/{itemId}/unavailable`
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "result": {
        "item": {
            "id": "8799cfff-5e15-42d3-a1cc-c92db8da519e",
            "unavailable": [
                {
                    "id": "7ce6758d-1af0-4715-9309-d5b63ea3c02b",
                    "start_date": "2023-11-11T00:00:00.000Z",
                    "end_date": "2023-11-12T00:10:00.000Z"
                },
                {
                    "id": "fc59c7a8-ed40-4b23-a666-eaa46997d088",
                    "start_date": "2023-11-14T00:00:00.000Z",
                    "end_date": "2023-11-16T00:10:00.000Z"
                }
            ]
        }
    }
}
```

### Delete Product Item's Unavailability Status
Allows users with the "admin" role to delete a specific unavailability status for a product item.
- Method: `DELETE`
- Path: `/products/{productId}/items/{itemId}/unavailable/{statusId}`
- Authentication: User Access Token (Bearer token)
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Product item's unavailable status has been deleted",
    "result": {
        "id": "fc59c7a8-ed40-4b23-a666-eaa46997d088"
    }
}
```