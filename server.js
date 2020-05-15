//dependencies
const fs = require("fs");
const express = require("express");
const path = require("path");

// Sets up the Express App
const app = express();
// Sets port for listening and let heroku decide on port, if not, use port 8080
const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//serve images, CSS files, and JavaScript files in a directory named public
app.use(express.static("public"));


//route to notes.html
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

//route to index.html
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

//route to read the `db.json` file and return all saved notes as JSON.
app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./db/db.json"));
});

//receive a new note to save on the request body, add it to the `db.json` file, 
//and then return the new note to the client.
app.post("/api/notes", function(req, res) {
    let newNote = req.body;
    let noteList = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let notelength = (noteList.length).toString();

    //create new property called id based on length and assign it to each json object
    newNote.id = notelength;
    //push updated note to the array containing notes history
    noteList.push(newNote);

    //write the updated data to db.json
    fs.writeFileSync("./db/db.json", JSON.stringify(noteList));
    res.json(noteList);

    console.log(newNote);


})

//get note api based on their id
app.get("/api/notes/:id", function(req, res) {
    let noteList = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(noteList[parseInt(req.params.id)]);
});

app.delete("/api/notes/:id", function(req, res) {
    let noteList = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteId = (req.params.id).toString();
    console.log(noteId);

    for(var i = 0; i < noteList.length; i++){
        if(noteList[i] === noteId){
            res.send(noteList[i])
        }else{
            noteList.splice(i,1);
            break;
        }
    }

    fs.writeFileSync("./db/db.json", JSON.stringify(noteList));
    res.json(noteList);

    
});


//listen tot he port when deployed
app.listen(PORT, () => console.log("Server listening on port " + PORT));