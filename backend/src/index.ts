import { Hono } from "hono";

import { mainRoute } from "./routes";

import {cors} from "hono/cors"

const app = new Hono()

app.use("/*", cors({
    // origin: "http://localhost:5173",    //frontend url
    origin: "https://paymentappmanish.netlify.app",
    credentials: true
}))


app.route("/api/v1", mainRoute)

export default app