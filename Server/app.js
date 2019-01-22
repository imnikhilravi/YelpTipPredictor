const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors')
let app = express();

app.use(cors())

let configRoutes = require("./routes");

// Start worker
require("./worker");

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
    // If the user posts to the server with a property called _method, rewrite the request's method
    // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
    // rewritten in this middleware to a PUT route
    if (req.body && req.body._method) {
        req.method = req.body._method;
        delete req.body._method;
    }

    // let the next middleware run:
    next();
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);

configRoutes(app);

app.listen(3001, () => {
    console.log("Server running on http://localhost:3001");
});