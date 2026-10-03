import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";

dotenv.config()


const app = express();
const PORT = process.env.PORT;


app.get("/",(req,res)=>{
    res.status(200).send(`hello from ${process.env.SERVER_NAME}`);
})

app.use("/auth",proxy("http://auth-service:5001"))
app.use("/order",proxy("http://order-service:5002"))
app.use("/payment",proxy("http://payment-service:5003"))

app.listen(PORT,()=>{
    console.log(`Server is listening to port ${PORT} .`)
})