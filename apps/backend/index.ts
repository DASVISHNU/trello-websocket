
import {Prisma} from "db/client";

import express  from "express";

const app=express();


app.use("/",(req,res)=>{
        res.send("hello hope you get a 20LPM job soon")
})
app.listen(8000,()=>{
    console.log("hello the server has started")
})
