const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
// const { listenerCount } = require("process");

const app = express();

/* middleware */
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3001;

/* database info */
const mysql = require("mysql");
const { send } = require("process");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "darna123",
  database: "nodemysql",
});

db.connect((err) => {
  if (err) {
    throw err;
  } else {
    console.log("connection done");
  }
});

/* HTML form */
app.get("/form", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

/* Create DB */
app.get("/createdb", (req, res) => {
  let sql = "CREATE DATABASE nodemysql";
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log("result");
    res.send("DATABASE Created");
  });
});

/* Create table */
app.get("/createposttable", (req, res) => {
  let sql =
    "CREATE TABLE posts(id int AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), PRIMARY KEY(id))";
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log("result");
    res.send("Posts table created");
  });
});

/* Insert data */
app.get("/addpost", (req, res) => {
  let sql = "INSERT INTO posts SET ?";
  let query = db.query(sql, req.query, (err, result) => {
    if (err) throw err;
    console.log(req.query);
    res.redirect(200, "http://localhost:3001/form");
  });
});

/* Fetch data */
app.get("/getposts", (req, res) => {
  let sql = "SELECT * FROM posts";
  let query = db.query(sql, req.query, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

/* Fetch single data */
app.get("/getpost/:id", (req, res) => {
  let { id } = req.query;
  let sql = `SELECT * FROM posts WHERE id=${id}`;
  let query = db.query(sql, req.query, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

/* Update data */
app.get("/updatepost/:id", (req, res) => {
  let { id, body } = req.query;
  let sql = `UPDATE posts SET body='${body}' WHERE id=${id}`;
  let query = db.query(sql, req.query, (err, result) => {
    if (err) throw err;
    res.json(req.query);
  });
});

/* Delete data */
app.get("/deletepost/:id", (req, res) => {
  let { id, body } = req.query;
  let sql = `Delete FROM posts WHERE id=${id}`;
  let query = db.query(sql, req.query, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.listen(port, () => {
  console.log("listening at port", port);
});
