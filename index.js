const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const { fileLoader } = require("ejs");

// Set the view engine to ejs
app.set("view engine", "ejs");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes

// Home route: List all files
app.get("/", (req, res) => {
  fs.readdir("./files", (err, files) => {
    if (err) {
      console.error("Error reading files directory:", err);
      return res.status(500).send("Server Error");
    }
    res.render("index", { files: files });
  });
});

// View a file
app.get("/file/:filename", (req, res) => {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, filedata) => {
    if (err) {
      console.error(`Error reading file ${req.params.filename}:`, err);
      return res.status(404).send("File Not Found");
    }
    res.render("show", { filename: req.params.filename, filedata: filedata });
  });
});

// Delete a file
app.get("/delete/:filename", (req, res) => {
  fs.unlink(`./files/${req.params.filename}`, (err) => {
    if (err) {
      console.error(`Error deleting file ${req.params.filename}:`, err);
      return res.status(500).send("Server Error");
    }
    res.redirect("/");
  });
});

// Edit a file: Show edit form
app.get("/edit/:filename", (req, res) => {
  res.render("edit", { filename: req.params.filename });
});

// Edit a file: Handle form submission
app.post("/edit", (req, res) => {
  const { previous, new: newFilename } = req.body;
  fs.rename(`./files/${previous}`, `./files/${newFilename}`, (err) => {
    if (err) {
      console.error(`Error renaming file from ${previous} to ${newFilename}:`, err);
      return res.status(500).send("Server Error");
    }
    res.redirect("/");
  });
});

// Create a new file
app.post("/create", (req, res) => {
  const { title, details } = req.body;
  const filename = `${title.split(" ").join("")}.txt`;
  fs.writeFile(`./files/${filename}`, details, (err) => {
    if (err) {
      console.error(`Error creating file ${filename}:`, err);
      return res.status(500).send("Server Error");
    }
    res.redirect("/");
  });
});

// Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
app.listen("https://gautam1242.github.io/NoteMakingApp/");