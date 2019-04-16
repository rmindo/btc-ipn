/**
* Import Modules
*/
const btcpay = require('btcpay');


/**
* Import Local Modules
*/
const dynamo = require('../services/invoices/dynamo');



/**
* Export
*/
module.exports = (app, config) => {

    const fn = {};



    fn.client = (item) => {
        // Keypair
        const keypair = btcpay.crypto.load_keypair(new Buffer.from(item['private']['S'], 'hex'));

        return new btcpay.BTCPayClient(config.BTCPAY.BTCPAY_URL, keypair, {merchant: item['token']['S']});
    };




    /**
    * Put record to the database
    */
    app.post('/api/v1/invoices', function(req, res) {

        dynamo.get('stores', {'storeid': {S: req.body.storeId}}, (data) => {

            req.body.notificationURL = req.body.notificationURL + '?storeid=' + req.body.storeId;

            // Client
            fn.client(data['Item'])

            // Create invoice
            ._signed_post_request('/invoices', req.body).then(data => {

                res.send('Ok');
            })
            // Catch error
            .catch(error => console.error('Error:', error));
        });
    });





    /**
    * Add record to the database
    */
    app.post('/api/v1/invoices/notify', function(req, res) {

        const param = new URLSearchParams(req._parsedUrl.query);


        dynamo.get('stores', {'storeid': {S: param.get('storeid')}}, (data) => {

            // Clent
            fn.client(data['Item'])

            // Get invoice
            .get_invoice(req.body.id).then(invoice => {

                // Create Item
                dynamo.create('invoices',
                {
                    'transref':         {S: invoice.id},
                    'status':           {S: invoice.status},
                    'privatekeylink':   {S: 'test link'},
                    'audbtcrate':       {S: 'test'},
                    'usdbtcrate':       {S: invoice.rate.toString()},
                    'time':             {S: invoice.invoiceTime.toString()},
                    'amount':           {S: invoice.cryptoInfo[0]['price']},
                    'publickey':        {S: invoice.cryptoInfo[0]['address']},
                    'feecalculated':    {S: (.01 * parseFloat(invoice.cryptoInfo[0]['price'])).toString()}
                },
                (result) => {

                    if(result && invoice.status == 'paid') {

                        // invoice.bitcoinAddress
                    }
                });

                res.send('Ok');
            })

            // Catch error
            .catch(error => console.error('Error:', error));
        });
    });
};