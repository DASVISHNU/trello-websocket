
import cors from "cors";
import express  from "express";
import authRouter from "./src/routes/auth.route.ts"
import orgRouter from "./src/routes/org.route.ts"
import boardRoter from "./src/routes/board.route.ts"
import sectioRouter from "./src/routes/section.route.ts"
import issueRotuter from "./src/routes/issue.route.ts"
import commentRouter from "./src/routes/issue.route.ts"
const app=express();
app.use(cors());
app.use(express.json({ limit: "16kb" }));
app.get("/",(req,res)=>{
        res.send("hello hope you get a 20LPM job soon")
})

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/org",orgRouter);
app.use("/api/v1/org",boardRoter);
app.use("/api/v1/org",sectioRouter);
app.use("/api/v1/org",issueRotuter);
app.use("/api/v1/org",commentRouter);
app.listen(8000,()=>{
    console.log("hello the server has started")
})
