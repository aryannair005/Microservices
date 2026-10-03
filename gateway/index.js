import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";

dotenv.config()


const app = express();
const PORT = process.env.PORT;


app.get("/",(req,res)=>{
    res.status(200).send("home route");
})

app.use("/auth",proxy("http://localhost:5001"))
app.use("/order",proxy("http://localhost:5002"))
app.use("/payment",proxy("http://localhost:5003"))

app.listen(PORT,()=>{
    console.log(`Server is listening to port ${PORT} .`)
})