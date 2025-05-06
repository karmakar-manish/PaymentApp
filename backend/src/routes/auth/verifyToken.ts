import { Hono } from "hono";
import {sign, verify} from "hono/jwt"
import { getCookie } from "hono/cookie"
import { env } from "hono/adapter"

export const verifyRoute = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}> ()


verifyRoute.get("/", async(c)=>{
    const JWT_SECRET = env(c).JWT_SECRET || "";
    const token = getCookie(c, "token")

    if(!token)
    {
        return c.json({
            message: "Unauthorized!"
        }, 401)
    }
    try{
        const decoded = await verify(token, JWT_SECRET) 
        
        return c.json({
            status: "ok",
            user: decoded
        })
    }catch(err)
    {   
        return c.json({
            message: "Invalid token!"
        }, 403)
    }
})