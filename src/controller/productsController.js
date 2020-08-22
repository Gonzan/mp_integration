var mercadopago = require('mercadopago');
mercadopago.configure({
    access_token: 'APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398',
    integrator_id: 'dev_24c65fb163bf11ea96500242ac130004'
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
                        "title": "Producto Test",
                        "currency_id": "ARS",
                        "picture_url": "https://www.mercadopago.com/org-img/MP3/home/logomp3.gif",
                        "description": "Descripción del Item",
                        "category_id": "art",
                        "quantity": 1,
                        "unit_price": 75.76
                    }
                ],
                // "auto_return": "approved",
                "back_urls": {
                    "success": "https://www.google.com",
                    "failure": "http://www.failure.com",
                    "pending": "http://www.pending.com"
                },
                "payment_methods": {
                    "excluded_payment_methods": [
                        {
                            "id": "amex"
                        }
                    ],
                    "excluded_payment_types": [
                        {
                            "id": "atm"
                        }
                    ],
                    "installments": 6
                },
                "notification_url": "https://mpintegrationdh.herokuapp.com/products/webhook",
                "external_reference": "GonzaDH",
        };
        
          mercadopago.preferences.create(preference)
          .then(function (data) {
            global.id = data.body.id;
            res.redirect(data.body.init_point);
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
        .manage(req)
        .then(function(response) {
          console.log(response);
        })
        .then(function(error) {
          console.log(error);
        });
      
      }
    
}