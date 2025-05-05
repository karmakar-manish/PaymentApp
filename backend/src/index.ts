import express from "express"
import cors from "cors"
import mainRoute from "./routes/index"
import cookieParser from "cookie-parser";
const app = express()

app.use(express.json()) //body parser
app.use(cors({
    origin: "http://localhost:5173",    //frontend URL
    credentials: true
}))
app.use(cookieParser())
//route requests that start with api/v1
app.use("/api/v1",mainRoute)

const port = 3000;
app.listen(port, ()=>{
    console.log(`Server is listening on ${port} port.`);
})

