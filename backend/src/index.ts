import { Hono } from "hono";

import { mainRoute } from "./routes";

import {cors} from "hono/cors"

const app = new Hono()

app.use("/*", cors())

app.route("/api/v1", mainRoute)

export default app