const express = require("express")
const app = require("./app/config.js")
const exbhs = require("express-handlebars")
const path = require("path")
app.engine("hbs", exbhs.engine({
  extname: ".hbs",
  defaultLayout: "main",
  layoutsDir: path.join(__dirname + "/views/layouts")
}))
app.set("view engine", "hbs")
app.use("views", express.static(path.join(__dirname + "/views")))

app.get("/", (req, res) => {
  res.render("home")
})