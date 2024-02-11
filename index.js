import app from "./app/config.js";
import "./routes.js"

app.listen(3000, (err)=>{
  if(err){
    console.log(err)
  }else{
    console.log("Server is running on port 3000")
  }
})