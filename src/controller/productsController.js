var mercadopago = require('mercadopago');
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
    checkout: (req,res)=> res.render('checkout'),
    processPay: async (req,res)=> {
        mercadopago.configurations.setAccessToken("TEST-803947980763499-081617-0f6f15e31d046ddc51948ede9fc36ebd-268367815");

        var payment_data = {
        transaction_amount: 165,
        token: 'ff8080814c11e237014c1ff593b57b4d',
        description: 'Small Rubber Computer',
        installments: 1,
        payment_method_id: 'visa',
        payer: {
            email: 'test@test.com'
        }
        };

        mercadopago.payment.save(payment_data).then(function (data) {
            console.log(data);
            res.send(data);
            }).catch(function (error) {
            console.log(error);
            });

            }
}