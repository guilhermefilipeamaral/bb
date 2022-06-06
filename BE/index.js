const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const session = require('express-session');
const path = require("path");
const app = module.exports = express();
const port = process.env.PROD || 3000;
const expire = 1000 * 60 * 60 * 2; //1 hour
// const IN_PROD = NODE_ENV === 'production';

app.use(cors());
app.use(bodyparser.json());

app.use(express.urlencoded({ extended: true }));

//use the public folder to serve web pages
app.use(express.static(path.join(__dirname, "public")));

//database connection
const MySQLStore = require('express-mysql-session')(session);
const options = {
  host: 'localhost',
  user: "root",
  database: "bentoborges",
  port: 3306
}
const connection = mysql.createPool(options);
const sessionStore = new MySQLStore({
  expiration: expire * 2,
  createDatabaseTable: true,
  schema:{
      tableName: 'sessions',
      columnNames:{
        session_id: 'sesssion_id',
        expires: 'expires',
        data: 'data'
      }
  }
}, connection);

app.use(session({
  cookie: {
    maxAge: expire,
    sameSite: true,
    secure: true,
    expires: new Date(Date.now() + expire),
    token: ""
  },
	secret: 'secret123!!321secret',
	resave: true,
	saveUninitialized: false,
  store: sessionStore
}));

//GET
app.get('/account', (req, res) => {
    let start = req.query.start;
    let end = req.query.end;

    let qr1 = queryStoreId(req.headers.authorization);
    sessionStore.query(qr1, (err, result) => {
      if(err) {
          console.log(err,'err');
      }
      if(result) {
        let qr = `SELECT * from account
                  WHERE CreationDate between '${ start }' and '${ end }' and StoreId = ${ result[0].storeId }`;
        console.log(qr)
        sessionStore.query(qr, (err, result) => {
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
      }
    });

})

//GET BY ID
app.get('/account/:id', (req, res) => {

    let id = req.params.id;
    let qr = `select * from account where Id = ${ id }`;

    sessionStore.query(qr, (err, result) => {
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
    let totalRevenueWithTax = req.body.TotalRevenueWithTax == "" ? 0 : req.body.TotalRevenueWithTax;
    let totalRevenueWithoutTax = req.body.TotalRevenueWithoutTax == "" ? 0 : req.body.TotalRevenueWithoutTax;
    let creditNotesWithTax = req.body.CreditNotesWithTax == "" ? 0 : req.body.CreditNotesWithTax;
    let depositCheck = req.body.DepositCheck == "" ? 0 : req.body.DepositCheck;
    let depositCash = req.body.DepositCash== "" ? 0 : req.body.DepositCash;
    let depositTotal = req.body.DepositTotal== "" ? 0 : req.body.DepositTotal;
    let totalPOSWithoutcommission = req.body.TotalPOSWithoutcommission== "" ? 0 : req.body.TotalPOSWithoutcommission;
    let totalPOSWithcommission = req.body.TotalPOSWithcommission== "" ? 0 : req.body.TotalPOSWithcommission;
    let notes = req.body.Notes;
    let qr1 = queryStoreId(req.headers.authorization);
    sessionStore.query(qr1, (err, result) => {
      if(err) {
          console.log(err,'err');
      }
      if(result) {
        let qr = `INSERT INTO account (TotalRevenueWithTax, TotalRevenueWithoutTax, CreditNotesWithTax, DepositCheck, DepositCash, DepositTotal, TotalPOSWithoutcommission, TotalPOSWithcommission, Notes, StoreId) VALUES(
          ${ totalRevenueWithTax }, ${ totalRevenueWithoutTax }, ${ creditNotesWithTax }, ${ depositCheck }, ${ depositCash },
          ${ depositTotal }, ${ totalPOSWithoutcommission }, ${ totalPOSWithcommission }, '${ notes }', ${ result[0].storeId })`;

          console.log(qr);
        sessionStore.query(qr, (err, result) => {
          if (err) {
              console.log(err);
          }
          console.log(result)
          if (result.affectedRows > 0) {
              res.send({
                  message: "data inserted with success."
              });
          } else {
              res.send({
                  message: "wrong..."
              });
          }
        })
      }
    });
});

//Update
app.put('/account/:id', (req, res) => {
    console.log(req.params);
    console.log(req.body);
    let id = req.params.id;
    let totalRevenueWithTax = req.body.TotalRevenueWithTax == "" ? 0 : req.body.TotalRevenueWithTax;
    let totalRevenueWithoutTax = req.body.TotalRevenueWithoutTax == "" ? 0 : req.body.TotalRevenueWithoutTax;
    let creditNotesWithTax = req.body.CreditNotesWithTax == "" ? 0 : req.body.CreditNotesWithTax;
    let depositCheck = req.body.DepositCheck == "" ? 0 : req.body.DepositCheck;
    let depositCash = req.body.DepositCash== "" ? 0 : req.body.DepositCash;
    let depositTotal = req.body.DepositTotal== "" ? 0 : req.body.DepositTotal;
    let totalPOSWithoutcommission = req.body.TotalPOSWithoutcommission== "" ? 0 : req.body.TotalPOSWithoutcommission;
    let totalPOSWithcommission = req.body.TotalPOSWithcommission== "" ? 0 : req.body.TotalPOSWithcommission;
    let notes = req.body.Notes;
    let qr1 = queryStoreId(req.headers.authorization);
    sessionStore.query(qr1, (err, result) => {
      if(err) {
          console.log(err,'err');
      }
      if(result) {
        let qr = `update account set TotalRevenueWithTax = ${ totalRevenueWithTax }, TotalRevenueWithoutTax = ${ totalRevenueWithoutTax },
        CreditNotesWithTax = ${ creditNotesWithTax }, DepositCheck = ${ depositCheck }, DepositCash = ${ depositCash }, DepositTotal = ${ depositTotal },
        TotalPOSWithoutcommission = ${ totalPOSWithoutcommission }, TotalPOSWithcommission = ${ totalPOSWithcommission }, Notes = '${ notes }', StoreId = ${ result[0].storeId }
        where id = ${ id }`;

          console.log(qr);
          sessionStore.query(qr, (err, result) => {
            if (err) {
                console.log(err);
            }

            res.send({
                message: "data was updated."
            });
        })
      }
    });
})

//Delete by Id
app.delete('/account/:id', (req, res) => {

    let id = req.params.id;
    let qr = `delete from account where Id = ${ id }`;

    sessionStore.query(qr, (err, result) => {
        if(err) {
            console.log(err,'err');
        }

        res.send({
            message: `Data with id = ${ id } was deleted`,
        })
    });
})

app.post('/login', (request, response) => {
	// Capture the input fields
	let email = request.body.email;
	let password = request.body.password;
  let userId = "";
  let token = ""
	// Ensure the input fields exists and are not empty
	if (email && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		sessionStore.query(`SELECT users.firstName, users.lastName, users.email, stores.*, roles.name as 'roleName'
      FROM users
      INNER JOIN stores ON users.storeId = stores.id
      INNER JOIN roles ON users.roleId = roles.id
      WHERE email = ? AND password = ?`, [email, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.email = email;
        userId = results[0].id;
        token = request.sessionID;
        request.session.regenerate(function (err) {
          if (err) next(err)

          // store user information in session, typically a user id
          // save the session before redirection to ensure page
          // load does not happen before session is saved
          request.session.save(function (err) {
            if (err) return next(err)
          })
        });
        response.send({
          data:  request.session,
          firstName: results[0].firstName,
          lastName: results[0].lastName,
          token: request.sessionID,
          role: results[0].roleName
        });

			} else {
				response.send('Incorrect Email and/or Password!');
			}
      let qr = `INSERT INTO user_session (userId, token) VALUES ('${ userId }', '${ token }')`;
      sessionStore.query(qr, (err, result) => {
          if (err) {
              console.log(err);
          }
        })
			response.end();
		});
	} else {
		response.send('Please enter Email and Password!');
		response.end();
	}

});

app.get('/logout', (request, response) => {
  req.session.destroy(function(err){
    if(!err){
      res.send("Log Out!")
    }
})
});

app.get('/stores', (req, res) => {
  let qr = `select * from stores`;

  sessionStore.query(qr, (err, result) => {
      if(err) {
          console.log(err,'err');
      }
      if(result) {
          res.send({
              message: "store list is ready",
              data: result,
              count: result.length
          })
      }
  });
})

app.listen(port, () => {
    console.log('server running...');
});

function queryStoreId(token) {
  return `SELECT users.storeId FROM user_session INNER JOIN users ON users.id = user_session.userId WHERE user_session.token = '${ token }'`
}
