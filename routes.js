import express from "express"
import app from "./app/config.js"
import { engine } from "express-handlebars"

app.engine("hbs", engine({
  extname: ".hbs",
  defaultLayout: "main",
}))
app.set("view engine", "hbs")
app.set("views", "./views")

app.get("/", (req, res)=>{
  res.render("home")
})