## Facilities Endpoints <!-- {docsify-ignore} -->

### Get All Facilities
Allows users to retrieve a list of all types of facilities. 
- Method: `GET`
- Path: `/facilities`
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "result": {
        "facilities": [
            {
                "id": "982dba7c-55d0-4a3c-a91d-d015986b16e2",
                "type": "hotel",
                "category": "halal",
                "title": "Restaurant"
            },
            {
                "id": "e80ea9bc-764d-4f93-b6c5-429d3a9ac292",
                "type": "hotel",
                "category": "halal",
                "title": "Tempat Wudhu"
            },
            {
                "id": "eab5fac4-6915-413e-b4f5-8e7cd886bbd2",
                "type": "hotel",
                "category": "halal",
                "title": "Kolam Renang"
            }
        ]
    }
}
```