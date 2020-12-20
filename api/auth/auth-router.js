const router = require('express').Router();
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const { jwtSecret } = require('../config/secrets');
const users = require('../jokes/jokes-model')

router.post('/register', async (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10)
  user.password = hash; 

  try {
    const saved = await users.add(user)
    res.status(201).json(saved)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }

  res.end('implement register, please!');
})

router.get('/logout', (req, res) => {
    if(req.session) {
      req.session.destroy(err => {
        if(err) {
          res.send("You will be here for eternity")
        } else {
          res.send("You have logged out")
        }
      });
    } else {
      res.end()
    }
})
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */

router.post('/login', (req, res) => {
  let {username, password} = req.body
  users.findBy({username})
  .first()
  .then(user => {
    if(user && bcrypt.compareSync(password, user.password)) {
      const token = generateToken(user)
      res.status(200).json({message: `welcome ${user.username}`, token})
    } else {
      res.status(401).json({message: 'invalid credentials'})
    }
  })
  .catch(err => {
    console.log(err)
    res.status(500).json('username and password required', err)
  })
  
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
})

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    role: user.role
  };
  const options = {
    expiresIn: "1 day"
  };
  return jwt.sign(payload, jwtSecret, options)
}

module.exports = router;
