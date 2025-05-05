import express from "express"
import cors from "cors"
import mainRoute from "./routes/index"
import cookieParser from "cookie-parser";
const app = express()

app.use(express.json()) //body parser
const allowedOrigins = [
    "http://localhost:5173", // dev
    "https://paymentappmanish.netlify.app", // replace with your real Netlify domain
  ];
  
app.use(cors({
origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
    callback(null, true);
    } else {
    callback(new Error("Not allowed by CORS"));
    }
},
credentials: true  // if using cookies/session
}));

app.use(cookieParser())
//route requests that start with api/v1
app.use("/api/v1",mainRoute)

const port = 3000;
app.listen(port, ()=>{
    console.log(`Server is listening on ${port} port.`);
})

