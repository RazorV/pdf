const fs = require('fs');
const hummus = require('hummus');
const express = require('express');
const app = express();
const port = 3333;

const scale = 0.48; // we dont use 0.5 to fit into border lines

app.use(express.static('apiDoc'));

app.listen(port, () => console.log(`Example app listening on internal port ${port}! Default external port 3337`));

const handlePdf = function(req, response) {
    response.setHeader("Content-Type", "application/pdf");
    response.setHeader("Content-Disposition", "attachment;filename=merged.pdf");
    /**
     * to simplify testing use pdf files, then read them as buffers
     */
    let files = ['1.pdf','2.pdf','3.pdf','4.pdf'];

    if (req.params.limit && req.params.limit > 0 && req.params.limit < 4) {
        files = files.slice(0, req.params.limit);
    }

    const pdfWriter = hummus.createWriter(new hummus.PDFStreamForResponse(response));

    let copyingContext={}, forms = [];
    for (let i = 0; i < files.length; i++) {
        /**
         * Read file and create buffer
         */
        let data = fs.readFileSync(`./files/${i}.pdf`);
        let buff = Buffer.from(data, 'base64');
        /**
         * Read buffer as PDF and open it for copying data
         */
        let inStream = new hummus.PDFRStreamForBuffer(buff);
        copyingContext[i] = pdfWriter.createPDFCopyingContext(inStream);
        /**
         * Save object as form to write to new file
         */
        forms.push(copyingContext[i].createFormXObjectFromPDFPage(0, hummus.ePDFPageBoxMediaBox));
    }

    const page = pdfWriter.createPage(0,0,842,595);
    const pageContent = pdfWriter.startPageContentContext(page);

    pageContent
        .G(0)
        .w(1)
        .re(0,297.5,421,297.5)
        .re(421,297.5,421,297.5)
        .re(421,0,421,297.5)
        .re(0,0,421,297.5)
        .S();

    for (let i = 0; i < files.length; i++) {
        let x, y;
        /**
         * choose start coordinates to insert page
         */
        switch (i) {
            case 0:
                x = 2;
                y = 298;
                break;
            case 1:
                x = 422;
                y = 298;
                break;
            case 2:
                x = 2;
                y = 2;
                break;
            case 3:
                x = 422;
                y = 2;
                break;
            default :
                x = 422;
                y = 298;
                break;
        }
        /**
         * write page to selected position
         */
        pageContent
            .q()
            .cm(scale, 0,0, scale, x, y)
            .doXObject(page.getResourcesDictionary().addFormXObjectMapping(forms[i]))
            .Q()
            .S();
    }
    /**
     * send response with file
     */
    pdfWriter.writePage(page).end();
    response.send();
};

/**
 * @api {get} /api/test-file Request for 4 merged pages in PDF format
 * @apiName DefaultPdf
 * @apiGroup Pdf
 *
 * @apiSuccess {File} merged.pdf
 */
app.get('/api/test-file', handlePdf);

/**
 * @api {get} /api/test-file/:limit Request for custom count of merged pages in PDF format
 * @apiName LimitedPagesPdf
 * @apiGroup Pdf
 *
 * @apiParam {Number} limit - limit files in result from 1 to 4.
 *
 * @apiSuccess {File} merged.pdf
 */
app.get('/api/test-file/:limit', handlePdf);