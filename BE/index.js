const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const session = require('express-session');

const app = express();

app.use(cors());
app.use(bodyparser.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

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
    } else {
        console.log('database connected!!!');
    }
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
                data: result,
                count: result.length
            })
        }
    });
})

//GET BY ID
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

//Create
app.post('/account', (req, res) => {
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
        (${ totalRevenueWithTax }, ${ totalRevenueWithoutTax }, ${ creditNotesWithTax }, ${ depositCheck }, ${ depositCash }, 
         ${ depositTotal }, ${ totalPOSWithoutcommission }, ${ totalPOSWithcommission }, '${ notes }')`;

    db.query(qr, (err, result) => {
        if (err) {
            console.log(err);
        } 
        
        if (result.length > 0) {
            res.send({
                message: "data inserted with success."
            });
        } else {
            res.send({
                message: "wrong..."
            });
        }
    })
});

//Update
app.put('/account/:id', (req, res) => {
    let id = req.params.id;
    let totalRevenueWithTax = req.body.TotalRevenueWithTax;
    let totalRevenueWithoutTax = req.body.TotalRevenueWithoutTax;
    let creditNotesWithTax = req.body.CreditNotesWithTax;
    let depositCheck = req.body.DepositCheck;
    let depositCash = req.body.DepositCash;
    let depositTotal = req.body.DepositTotal;
    let totalPOSWithoutcommission = req.body.TotalPOSWithoutcommission;
    let totalPOSWithcommission = req.body.TotalPOSWithcommission;
    let notes = req.body.Notes;
    let qr = `update account set TotalRevenueWithTax = ${ totalRevenueWithTax }, TotalRevenueWithoutTax = ${ totalRevenueWithoutTax },
        CreditNotesWithTax = ${ creditNotesWithTax }, DepositCheck = ${ depositCheck }, DepositCash = ${ depositCash }, DepositTotal = ${ depositTotal }, 
        TotalPOSWithoutcommission = ${ totalPOSWithoutcommission }, TotalPOSWithcommission = ${ totalPOSWithcommission }, Notes = '${ notes }'
        where id = ${ id }`;

    db.query(qr, (err, result) => {
        if (err) {
            console.log(err);
        } 
        
        res.send({
            message: "data was updated."
        });
    })
})

//Delete by Id
app.delete('/account/:id', (req, res) => {

    let id = req.params.id;
    let qr = `delete from account where Id = ${ id }`;

    db.query(qr, (err, result) => {
        if(err) {
            console.log(err,'err');
        }

        res.send({
            message: `Data with id = ${ id } was deleted`, 
        })
    });
})

app.post('/auth', (request, response) => {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = username;
				// Redirect to home page
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.listen(3000, () => {
    console.log('server running...');
});