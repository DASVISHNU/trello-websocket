import express from "express";
import {prisma} from "./db";

const app=express()

app.use(express.json())

app.post("/signup",(req,res)=>{
    const{username,password}=req.body;
    prisma.user.create({
        data:{
            username,
            password
        }
    })

    res.json({
        message:"signed up"
    })
})


app.listen(3000);
