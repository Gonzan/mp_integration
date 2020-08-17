var mercadopago = require('mercadopago');
mercadopago.configure({
    access_token: "APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398"
  });
  
const  axios  = require("axios")
const fs = require('fs')
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
    checkout: (req,res)=> res.render('checkout'),
    processPay: async (req,res)=> {
        var preference = {
            items: [
                {
                    title: 'Test',
                    quantity: 1,
                    currency_id: 'ARS',
                    unit_price: 10.5
                }
            ]
        };
        
        mercadopago.preferences.create(preference).then(function (data) {
            mercadopago.payment.save(preference).then(function (payment) {
                res.json(payment)
        }).catch(function (error) {
            res.render('500', {
              error: error
            });
          });
    //    await mercadopago.configurations.setAccessToken("APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398");

    //     var payment_data = {
    //     // id:1,
    //     transaction_amount: 165,
    //     // name:'producto test',
    //     token: req.body.token,
    //     // cuantity:1,
    //     description: req.body.description,
    //     // picture_url:"https://www.mercadopago.com/org-img/MP3/home/logomp3.gif",
    //     installments: Number(req.body.installments),
    //     payment_method_id: req.body.payment_method_id,
    //     external_reference:'gonzalo@digitalhouse.com',
    //     payer: {
    //         id:'471923173',
    //         email: req.body.email
    //     },
    //     // integrator_id:'dev_24c65fb163bf11ea96500242ac130004',
    //     };

    //     mercadopago.payment.save(payment_data).then(function (data) {
           
    //         res.json(data);
    //         }).catch(function (error) {
    //         res.json(error.message);
    //         });

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