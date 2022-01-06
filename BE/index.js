const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

app.use(cors());
app.use(bodyparser.json());

//database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: "root",
    password: "Qwerty123?",
    database: "bentoborges",
    port: 3306
});

//check database connection
db.connect(err => {
    if (err) {
        console.log(err,'err');
    }
    console.log('database connected...');
});

//GET
app.get('/account', (req, res) => {
    let qr = "select * from account"

    db.query(qr, (err, result) => {
        if(err) {
            console.log(err,'err');
        }

        if(result) {
            res.send({
                message: "account list is ready",
                data: result
            })
        }
    });
})

app.get('/account/:id', (req, res) => {

    let id = req.params.id;
    let qr = `select * from account where Id = ${ id }`;

    db.query(qr, (err, result) => {
        if(err) {
            console.log(err,'err');
        }

        if(result) {
            res.send({
                message: "get data with id",
                data: result[0]
            })
        } else {
            res.send({
                message: "no data",
            })
        }
    });
})

//Post
app.post('/account', (req, body) => {
    let totalRevenueWithTax = req.body.TotalRevenueWithTax;
    let totalRevenueWithoutTax = req.body.TotalRevenueWithoutTax;
    let creditNotesWithTax = req.body.CreditNotesWithTax;
    let depositCheck = req.body.DepositCheck;
    let depositCash = req.body.DepositCash;
    let depositTotal = req.body.DepositTotal;
    let totalPOSWithoutcommission = req.body.TotalPOSWithoutcommission;
    let totalPOSWithcommission = req.body.TotalPOSWithcommission;
    let notes = req.body.Notes;
    let qr = `INSERT INTO account (TotalRevenueWithTax, TotalRevenueWithoutTax, CreditNotesWithTax, DepositCheck, DepositCash, DepositTotal, 
        TotalPOSWithoutcommission, TotalPOSWithcommission, Notes) VALUES 
        ('${ totalRevenueWithTax }', '${ totalRevenueWithoutTax }', '${ creditNotesWithTax }', '${ depositCheck }', '${ depositCash }', 
         '${ depositTotal }', '${ totalPOSWithoutcommission }', '${ totalPOSWithcommission }', '${ notes }')`
});


app.listen(3000, () => {
    console.log('server running...');
});