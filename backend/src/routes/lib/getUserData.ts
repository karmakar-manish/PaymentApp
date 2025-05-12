import { Hono } from "hono"
import { PrismaClient } from "@prisma/client/edge"
import { withAccelerate } from "@prisma/extension-accelerate"
import {sign, verify} from "hono/jwt"
import { env } from "hono/adapter"
import { getCookie } from "hono/cookie"

export const getUserDataRoute = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}> ()

getUserDataRoute.get("/", async(c)=>{
    return c.json({
        message: "Hi from getuserData route"
    })
})

//function to get the user data
getUserDataRoute.post("/getData", async(c)=>{
    
    //prisma client
    const client = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    //get the token from the cookie
    const token = getCookie(c, "token")
    const JWT_SECRET = env(c).JWT_SECRET || "";
        
    //incase of no token
    if(!token)
    {
        return c.json({
            error: "Not authenticated!"
        }, 401)
    }

    try{
        const decoded = await verify(token, JWT_SECRET) as{
            id: number,
            name: string | null,
            email: string | null
        }

        //fetch the use information
        const User = await client.user.findFirst({
            where: {
                id: Number(decoded.id)
            }
        })

        return c.json({
            "name": User?.name,
            "email": User?.email,
            "number": User?.number
        })

    }catch(err)
    {
        console.log(`Error from getUserData.ts ${err}`);
        return c.json({
            error: err
        }, 411)
    }
})