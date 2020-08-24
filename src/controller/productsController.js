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
            
            const {productId,price,category_id, title,condition,free_shipping,sold_quantity} = item.data

            var preference = {
                "items": [
                    {
                        "id": productId,
                        "title": title,
                        "currency_id": "ARS",
                        "picture_url": "https://www.mercadopago.com/org-img/MP3/home/logomp3.gif",
                        "description": "Descripción del Item",
                        "category_id": category_id,
                        "quantity": 1,
                        "unit_price": price
                    }
                ],
                "payer":{
                    "name": "Lalo",
                    "surname": "Landa",
                    "email": "test_user_63274575@testuser.com",
                    "date_created": "",
                    "phone": {
                        "area_code": "11",
                        "number": 22223333
                    },
                    "address": {
                        "street_name": "false",
                        "street_number": 123,
                        "zip_code": "1111"
                    }
                },
                "back_urls": {
                    "success": "https://mpintegrationdh.herokuapp.com/products/payment",
                    "failure": "https://mpintegrationdh.herokuapp.com/products/payment",
                    "pending": "https://mpintegrationdh.herokuapp.com/products/payment"
                },
                "auto_return": "all",
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
                "external_reference": "gonzalo@digitalhouse.com",
        };
        
          mercadopago.preferences.create(preference)
          .then(function (data) {
            global.id = data.body.id;
            // res.json(data)
            const init_point = data.body.init_point
            res.render('detail',{
                productId,
                title,
                condition,
                free_shipping,
                sold_quantity,
                init_point
            })
          }).catch(function (error) {
            res.send(error.message);
          });    

            
            
        }catch(e){
            res.json(e.message)
        }
        
    },
    payment :(req, res) => {
        res.locals.payments = {...req.query}
        res.render('payment')
    },
    webhook: async (req, res) => {
        if (req.body.type == "payment") {
            console.log(req.body);
        } 
      res.status(200).send("ok")
    }
    
}