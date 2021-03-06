define({ "api": [
  {
    "type": "get",
    "url": "/api/test-file",
    "title": "Request for 4 merged pages in PDF format",
    "name": "DefaultPdf",
    "group": "Pdf",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "File",
            "optional": false,
            "field": "merged.pdf",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "pdf/index.js",
    "groupTitle": "Pdf"
  },
  {
    "type": "get",
    "url": "/api/test-file/:limit",
    "title": "Request for custom count of merged pages in PDF format",
    "name": "LimitedPagesPdf",
    "group": "Pdf",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "limit",
            "description": "<ul> <li>limit files in result from 1 to 4.</li> </ul>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "File",
            "optional": false,
            "field": "merged.pdf",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "pdf/index.js",
    "groupTitle": "Pdf"
  }
] });
