import { Hono } from "hono";
import zod from "zod"
import { PrismaClient } from "@prisma/client/edge"
import { withAccelerate } from "@prisma/extension-accelerate";
import {sign, verify} from "hono/jwt"
import { env } from "hono/adapter"
import { setCookie } from "hono/cookie";


export const signUpRoute = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}> ()

signUpRoute.get("/", async(c)=>{
    const JWT_SECRET = env(c).JWT_SECRET || "";
    return c.json({
        message: "Hi from signup",
        JWT_SECRET: JWT_SECRET
    })
})

//signup body schema
const phoneSchema = zod.object({
    number: zod.string().min(10),
    password: zod.string().min(1),
    username: zod.string()
})

signUpRoute.post("/phonePassword", async(c)=>{

    //prisma client
    const client = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const JWT_SECRET = env(c).JWT_SECRET || "";

    const body = await c.req.json() //get the body
    console.log(body);
    const response = phoneSchema.safeParse(body)
    console.log("Response: ", response.success);
    //incase of no success
    if(!response.success)
    {
        return c.json({
            error: "Invalid Username / Password",
            message: "Zod validation error"
        }, 411)
    }
    try{
        //create a new user in database
        const user = await client.user.create({
            data: {
                number: body.number,
                password: body.password,
                name: body.username
            }
        })
        // also create a balance entry 
        const balance = await client.balance.create({
            data: {
                userId: user.id,
                amount: 0,
                locked: 0,
            }
        })
        //create a token
        const token = await sign({
            id: user.id,
            name: user.name,
            email: user.email
        }, JWT_SECRET)
        
       //create a cookie
        setCookie(c, "token", token, {
            httpOnly: true,
            path: "/",
            maxAge: 86400,
            sameSite: "None",
            secure: true,
        })

        return c.json({
            message: "Signed up successfully!"
        })
    }catch(err)
    {
        return c.json({
            message: "Error while signup!",
            error: err
        }, 411)
    }
})

//provider schema
const providerSchema = zod.object({
    uid: zod.string().min(1),
    email:zod.string().min(1),
    displayName:zod.string().min(1)
})

//provider signup
signUpRoute.post("/providerSignup", async(c)=>{
    console.log("Provider signup route");
    //prisma client
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const JWT_SECRET = env(c).JWT_SECRET || ""
    const body = await c.req.json()
    const response = providerSchema.safeParse(body)

    //incase of no success
    if(!response.success)
    {
        return c.json({
            error: "Invalid provider details!",
            message: "Zod validation error"
        }, 411)
    }

    try{
        //create a new user
        const user = await prisma.user.create({
            data:{
                uid: body.uid,
                email: body.email,
                name: body.displayName
            }
        })
        // also create a balance entry 
        const balance = await prisma.balance.create({
            data: {
                userId: user.id,
                amount: 0,
                locked: 0,
            }
        })
        //create a jwt token
        //create a jwt token
        const token = await sign({
            id:user.id,
            name: user.name,
            email: user.email
        }, JWT_SECRET)
        
        
        //create a cookie
        setCookie(c, "token", token, {
            httpOnly: true,
            path: "/",
            maxAge: 86400,
            sameSite: "None",
            secure: true,
        })

        return c.json({
            message: "Signed-up successfully!"
        })
    }catch(err){
        console.log("Error while singup with provider");
        return c.json({
            message: "Error while signup with provider",
            error: err
        }, 411)
    }
    
})
