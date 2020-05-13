//dependencies
const fs = require("fs");
const express = require("express");
const path = require("path");

// Sets up the Express App
const app = express();
// Sets port for listening and let heroku decide on port, if not, use port 8080
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//serve images, CSS files, and JavaScript files in a directory named public
app.use(express.static("Develop/public"));


//listen tot he port when deployed
app.listen(PORT, () => console.log("Server listening on port " + PORT));