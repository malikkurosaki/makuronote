# How To Use JSON Web Tokens (JWTs) in Express.js
Node.js
By Danny Denenberg

Last Validated onMarch 22, 2021 Originally Published onFebruary 19, 2020 183.3kviews
Introduction
JSON Web Tokens (JWTs) supports authorization and information exchange.

One common use case is for allowing clients to preserve their session information after logging in. By storing the session information locally and passing it to the server for authentication when making requests, the server can trust that the client is a registered user.

In this article, you will learn about the applications of JWTs in a server-client relationship using Node.js and vanilla JavaScript.

Prerequisites
To follow along with this article, you will need the following installed on your machine:

Node.js installed locally, which you can do by following How to Install Node.js and Create a Local Development Environment.
Step 1 — Generating a Token
jsonwebtoken is an implementation of JSON Web Tokens.

You can add it to your JavaScript project by running the following command in your terminal:

npm install jsonwebtoken
 
And import it into your files like so:

const jwt = require('jsonwebtoken');
 
To sign a token, you will need to have 3 pieces of information:

The token secret
The piece of data to hash in the token
The token expire time
The token secret is a long random string used to encrypt and decrypt the data.

To generate this secret, one option is to use Node.js’s built-in crypto library, like so:

> require('crypto').randomBytes(64).toString('hex')
// '09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611'
 
Warning: Be careful! If your secret is simple, the token verification process will be much easier to break by an unauthorized intruder.

Now, store this secret in your project’s .env file:

.env
TOKEN_SECRET=09f26e402586e2faa8da4c98a35f1b20d6b033c60...
 
To bring this token into a Node.js file and to use it, you have to use dotenv:

npm install dotenv
 
And import it into your files like so:

const dotenv = require('dotenv');

// get config vars
dotenv.config();

// access config var
process.env.TOKEN_SECRET;
 
The piece of data that you hash in your token can be something either a user ID or username or a much more complex object. In either case, it should be an identifier for a specific user.

The token expire time is a string, such as 1800 seconds (30 minutes), that details how long until the token will be invalid.

Here’s an example of a function for signing tokens:

function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}
 
This can be sent back from a request to sign in or log in a user:

app.post('/api/createNewUser', (req, res) => {
  // ...

  const token = generateAccessToken({ username: req.body.username });
  res.json(token);

  // ...
});
 
This example takes the username value from the req (request). And provides the token as the res (response).

That concludes how jsonwebtoken, crypto, and dotenv can be used to generate a JWT.

Step 3 — Authenticating a Token
There are many ways to go about implementing a JWT authentication system in an Express.js application.

One approach is to utilize the middleware functionality in Express.js.

How it works is when a request is made to a specific route, you can have the (req, res) variables sent to an intermediary function before the one specified in the app.get((req, res) => {}).

The middleware is a function that takes parameters of (req, res, next).

The req is the sent request (GET, POST, DELETE, PUT, etc.).
The res is the response that can be sent back to the user in a multitude of ways (res.sendStatus(200), res.json(), etc.).
The next is a function that can be called to move the execution past the piece of middleware and into the actual app.get server response.
Here is an example middleware function for authentication:

const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, user: any) => {
    console.log(err)

    if (err) return res.sendStatus(403)

    req.user = user

    next()
  })
}
 
An example request using this middleware function would resemble something like this:

GET https://example.com:4000/api/userOrders
Authorization: Bearer JWT_ACCESS_TOKEN
And an example of a request that would use that piece of middleware would resemble something like this:

app.get('/api/userOrders', authenticateToken, (req, res) => {
  // executes after authenticateToken
  // ...
})
 
This code will authenticate the token provided by the client. If it is valid, it can proceed to the request. If it is not valid, it can be handled as an error.

Step 4 — Handling Client-Side Tokens
When the client receives the token, they often want to store it for gathering user information in future requests.

The most popular manner for storing auth tokens is in an HttpOnly cookie.

Here’s an implementation for storing a cookie using client-side JavaScript code:

// get token from fetch request
const token = await res.json();

// set token in cookie
document.cookie = `token=${token}`
 
This approach stores the response locally where they can be referenced for future requests to the server.

That concludes the flow of requesting a token, generating a token, receiving a token, passing a token with new requests, and verifying a token.

Conclusion
In this article, you were introduced to JWTs and one approach to applying them to a Node.js application. This approach relied upon a combination of jsonwebtoken, crypto, dotenv, and express.

For another approach to using JWTs, there is How To Implement API Authentication with JSON Web Tokens and Passport.

For more background on JWTs, there is the “Introduction” documentation.

If you’d like to learn more about Node.js, check out our Node.js topic page for exercises and programming projects.
