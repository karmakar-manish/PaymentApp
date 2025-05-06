import { Hono } from "hono";
import zod from "zod"
import { PrismaClient } from "@prisma/client/edge"
import { withAccelerate } from "@prisma/extension-accelerate";
import {sign, verify} from "hono/jwt"
import { env } from "hono/adapter"

export const signInRoute = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}> ()


signInRoute.get("/", async(c)=>{
    return c.json({
        message: "Hi from signin route"
    })
})

//signin body schema
const phoneSchema = zod.object({
    number: zod.string().min(1),
    password: zod.string().min(1)
})

signInRoute.post("/phonePassword", async(c)=>{
    //prisma client
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const JWT_SECRET = env(c).JWT_SECRET || "";
    console.log("jwt secret : ", JWT_SECRET);
    
    const body = await c.req.json() //get the body data

    const response = phoneSchema.safeParse(body)
    
    //incase of no success
    if(!response.success)
    {
        return c.json({
            error: "Invalid Username / Password",
            message: "Zod validation error"
        }, 411)
    }

    let user;
    try{
        //find user from database
        user = await prisma.user.findFirst({
            where: {
                AND: [
                    {number: body.number},
                    {password: body.password}
                ]
            }
        })
        
    }
    catch(err){
        return c.json({
            error: "Invalid Username / Password",
            message: "No user in database"
        }, 411)
    }

    //incase no user is present in database
    if(!user)
    {
        return c.json({
            error: "Invalid Username / Password",
            message: "No user in database"
        }, 411)
    }

    //create a jwt token
    const token = await sign({
        id:user.id,
        secure: false,
        name: user.name,
        email: user.email
    }, JWT_SECRET)

    //create a cookie
    c.header("Set-Cookie", `token=${token};
        HttpOnly;
        Path=/;
        Max-Age=86400;
        SameSite=None;
        Secure`
    )
    

    return c.json({
        message: "Signed in successfully!"
    })
})

//provider schema
const providerSchema = zod.object({
    uid: zod.string().min(1),
    email:zod.string().min(1),
    displayName:zod.string().min(1)
})

//Provider login2
signInRoute.post("/providerLogin", async(c)=>{

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
        //check if user is in database
        const user = await prisma.user.findFirst({
            where: {
                uid: body.uid
            }
        })
        
        //incase user is there
        if(user)
        {
            //create a jwt token
            const token = await sign({
                id:user.id,
                name: user.name,
                email: user.email
            }, JWT_SECRET)
            
            //create a cookie
            c.header("Set-Cookie", `token=${token};
                HttpOnly;
                Path=/;
                Max-Age=86400;
                SameSite=None;
                Secure`
            )

            return c.json({
                message: "Signed in successfully!"
            })
        }
    }catch(err){
        return c.json({
            error: "Invalid provider id",
            message: "No user in database"
        }, 411)   
    }

    return c.json({
        error: "No user found",
        message:"Invalid provider id"
    }, 411)
})
