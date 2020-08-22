var mercadopago = require('mercadopago');
mercadopago.configure({
    access_token: 'APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398'
  });
  
const  axios  = require("axios")

module.exports = {
    search: async (req,res)=> {
        const search = req.query.q
        // console.log(search);
        try {
            
            const url = `https://api.mercadolibre.com/sites/MLA/search?q=${search}`
            const data =await axios.get(url)
            const results =  data.data.results
            
            res.render('searchResults', {results})
            
        } catch (error) {
            
            res.json("error")
            
        }
    },
    detail: async (req,res)=> {
        const {id} = req.params
        try {
            
            const item =  await axios.get(`https://api.mercadolibre.com/items/${id}`)
            
            const {productId,title,condition,free_shipping,sold_quantity} = item.data
            res.render('detail',{
                productId,
                title,
                condition,
                free_shipping,
                sold_quantity
            })
            
        }catch(e){
            res.json(e.message)
        }
        
    },
    checkout: (req,res)=> {
        var preference = {
                "items": [
                    {
                        "id": "item-ID-1234",
                        "title": "Mi producto",
                        "currency_id": "ARS",
                        "picture_url": "https://www.mercadopago.com/org-img/MP3/home/logomp3.gif",
                        "description": "Descripción del Item",
                        "category_id": "art",
                        "quantity": 1,
                        "unit_price": 75.76
                    }
                ],
                "payer": {
                    "name": "Juan",
                    "surname": "Lopez",
                    "email": "user@email.com",
                    "phone": {
                        "area_code": "11",
                        "number": "4444-4444"
                    },
                    "identification": {
                        "type": "DNI",
                        "number": "12345678"
                    },
                    "address": {
                        "street_name": "Street",
                        "street_number": 123,
                        "zip_code": "5700"
                    }
                },
                "back_urls": {
                    "success": "https://www.success.com",
                    "failure": "http://www.failure.com",
                    "pending": "http://www.pending.com"
                },
                "auto_return": "approved",
                "payment_methods": {
                    "excluded_payment_methods": [
                        {
                            "id": ""
                        }
                    ],
                    "excluded_payment_types": [
                        {
                            "id": ""
                        }
                    ],
                    "installments": 6
                },
                "notification_url": "",
                "external_reference": "Reference_1234",
                "expires": false,
                "expiration_date_from": "",
                "expiration_date_to": ""   
          };
        
          mercadopago.preferences.create(preference)
          .then(function (data) {
            global.id = response.body.id;
            res.redirect(data.sandbox_init_point);
          }).catch(function (error) {
            res.send(error.message);
          });
    },
    processPay: async (req,res)=> {      


        var payment_data = {
        // id:1,
        transaction_amount: 165,
        // name:'producto test',
        token: req.body.token,
        // cuantity:1,
        description: req.body.description,
        // picture_url:"https://www.mercadopago.com/org-img/MP3/home/logomp3.gif",
        installments: Number(req.body.installments),
        payment_method_id: req.body.payment_method_id,
        external_reference:'gonzalo@digitalhouse.com',
        payer: {
            email: req.body.email
        },
        // integrator_id:'dev_24c65fb163bf11ea96500242ac130004',
        };

        mercadopago.payment.save(payment_data).then(function (data) {
           
            res.json(data);
            }).catch(function (error) {
            res.json(error.message);
            });

    },
    webhook: (req, res) => { 
        mercadopago.ipn
        .manage(request)
        .then(function(response) {
          console.log(response);
        })
        .then(function(error) {
          console.log(error);
        });
      
      }
    
}