### Getting a list of Banks
Allows users to get all available banks in the system. 
- Method: `GET`
- Path: `/banks`
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "result": [
        {
            "id": "13520059-ba9d-4ee1-807e-665987d32da6",
            "code": "anz",
            "title": "PT. BANK ANZ INDONESIA",
            "_created_date": "2023-11-09T08:19:27.027Z",
            "_updated_date": "2023-11-09T08:19:27.027Z"
        },
        {
            "id": "5fc4172f-6a69-499d-b72f-d1583817cdd7",
            "code": "bca",
            "title": "PT. BANK CENTRAL ASIA TBK.",
            "_created_date": "2023-11-09T08:16:36.943Z",
            "_updated_date": "2023-11-09T08:16:36.943Z"
        },
        {
            "id": "273db203-621b-4960-bbb1-d3ab81e7645c",
            "code": "bni",
            "title": "PT. BANK NEGARA INDONESIA (PERSERO)",
            "_created_date": "2023-11-09T08:17:00.070Z",
            "_updated_date": "2023-11-09T08:17:00.070Z"
        },
        {
            "id": "bd07959d-0355-4b40-a4b3-0a2632a0f333",
            "code": "bri",
            "title": "PT. BANK RAKYAT INDONESIA (PERSERO)",
            "_created_date": "2023-11-09T07:25:59.428Z",
            "_updated_date": "2023-11-09T07:25:59.428Z"
        },
        {
            "id": "581b27fa-0a97-4495-b528-ce7e2379c579",
            "code": "btn",
            "title": "PT. BANK TABUNGAN NEGARA (PERSERO)",
            "_created_date": "2023-11-09T07:29:11.391Z",
            "_updated_date": "2023-11-09T08:13:36.674Z"
        },
        {
            "id": "b7440b09-232f-4c05-84a6-302a6d3a377e",
            "code": "bukopin",
            "title": "PT BANK KB BUKOPIN TBK.",
            "_created_date": "2023-11-09T08:17:17.583Z",
            "_updated_date": "2023-11-09T08:17:17.583Z"
        },
        {
            "id": "b85cd425-ddc9-402b-88f5-e9c3a68013f0",
            "code": "cimb",
            "title": "PT. BANK CIMB NIAGA TBK.",
            "_created_date": "2023-11-09T08:15:19.501Z",
            "_updated_date": "2023-11-09T08:15:19.501Z"
        },
        {
            "id": "16ace7c1-86c2-4f68-9ec6-e09ac674a901",
            "code": "danamon",
            "title": "PT. BANK DANAMON INDONESIA TBK.",
            "_created_date": "2023-11-09T08:17:30.239Z",
            "_updated_date": "2023-11-09T08:17:30.239Z"
        },
        {
            "id": "18a37b5e-bbf4-433f-9099-190a6faa3640",
            "code": "sampoerna",
            "title": "PT. BANK SAHABAT SAMPOERNA",
            "_created_date": "2023-11-09T08:18:09.397Z",
            "_updated_date": "2023-11-09T08:18:09.397Z"
        },
        {
            "id": "2764771d-5a74-4dfa-9919-a29ea33f22b1",
            "code": "seabank",
            "title": "PT. BANK SEABANK INDONESIA",
            "_created_date": "2023-11-09T08:16:03.943Z",
            "_updated_date": "2023-11-09T08:16:03.943Z"
        }
    ]
}
```