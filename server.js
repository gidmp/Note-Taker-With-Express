//dependencies
const fs = require("fs");
const express = require("express");
const path = require("path");

// Sets up the Express App
const app = express();
// Sets port for listening and let heroku decide on port, if not, use port 8080
const PORT = process.env.PORT || 8000;

//serve images, CSS files, and JavaScript files in a directory named public
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//route to index.html

//route to notes.html
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

//route to read the `db.json` file and return all saved notes as JSON.
app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

//get note api based on their id
app.get("/api/notes/:id", function(req, res) {
    let noteList = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(noteList[parseInt(req.params.id)]);
});

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
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



})

//delete note based on their id
app.delete("/api/notes/:id", function(req, res) {
    let noteList = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteId = (req.params.id).toString();

    //filter all notes that does not have matching id and saved them as a new array
    //the matching array will be deleted
    noteList = noteList.filter(selected =>{
        return selected.id != noteId;
    })

    //write the updated data to db.json and display the updated note
    fs.writeFileSync("./db/db.json", JSON.stringify(noteList));
    res.json(noteList);

    
});


//listen tot he port when deployed
app.listen(PORT, () => console.log("Server listening on port " + PORT));