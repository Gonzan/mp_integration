var mercadopago = require('mercadopago');
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
       await mercadopago.configurations.setAccessToken("TEST-1798157045199963-081618-f88da422e52b3c598d936ff2c1bd6b22-626894855");

        var payment_data = {
        transaction_amount: 165,
        token: req.body.token,
        description: req.body.description,
        installments: Number(req.body.installments),
        payment_method_id: req.body.payment_method_id,
        payer: {
            email: req.body.email
        }
        };

        mercadopago.payment.save(payment_data).then(function (data) {
           
            res.json(data);
            }).catch(function (error) {
            res.json(error.message);
            });

    },
    webhook(req, res) { 
        if (req.method === "POST") { 
          let body = ""; 
          req.on("data", chunk => {  
            body += chunk.toString();
          });
          req.on("end", () => {  
            fs.writeFileSync('./hook.txt',body)           
            console.log(body, "webhook response"); 
            res.end("ok");
          });
        }
        return res.status(200); 
      }
    
}