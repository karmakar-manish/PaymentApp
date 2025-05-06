import { Hono } from "hono"
import { PrismaClient } from "@prisma/client/edge"
import { withAccelerate } from "@prisma/extension-accelerate"
import {sign, verify} from "hono/jwt"
import { env } from "hono/adapter"
import { getCookie } from "hono/cookie"


export const transferRoute = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}> ()



transferRoute.get("/", async(c)=>{
    return c.json({
        message: "hi there  from transfer route!"
    })
})

//function to get the onRampTxns of the user
transferRoute.post("/getOnRampTxns", async(c)=>{
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
        
        const txns = await client.onRampTransaction.findMany({
            where: {
                userId: decoded.id
            }
        })
    
        //sort based on time
        txns.sort((a: {startTime: Date}, b: {startTime: Date}) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
        

        return c.json(
            txns.map((t: {
                startTime: Date,
                amount: number,
                status: string,
                provider: string,
            }) => ({
                time: t.startTime,
                amount: t.amount,
                status: t.status,
                provider: t.provider
            }))
        )
            
        

    }catch(err)
    {
        return c.json({
            message: "Invalid token",
            error: err
        }, 401)
    }
})

//function to get the locked balance of the user
transferRoute.post("/getLockedBalance", async(c)=>{
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
        
        const user = await client.onRampTransaction.findMany({
            where: {
                userId: decoded.id
            }
        })
    
        
        let lockedBalance = 0
    
        user.forEach((t: {
            status: string,
            amount: number
        })=>{
            if(t.status === "Processing")
                lockedBalance = lockedBalance + t.amount
        })
    
        return c.json({
            lockedBalance: lockedBalance
        })

    }catch(err)
    {
        return c.json({
            message: "Invalid token",
            error: err
        })
    }
})

//function to create onRamp txns
transferRoute.post("/createOnRamptxn", async(c)=>{
    //prisma client
    const client = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    //get the token from the cookie
    const token = getCookie(c, "token")
    const JWT_SECRET = env(c).JWT_SECRET || "";

    const body = await c.req.json()
    const amount = body.amount
    const provider = body.provider
        
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
        
        //in real world, token will be provided by the banking server
        const txnToken = (Math.random()*1000).toString();

        //create an entry
        const txn = await client.onRampTransaction.create({
            data: {
                userId: decoded.id,
                amount: amount * 100,
                status: "Processing",
                startTime: new Date(),
                provider: provider,
                token: txnToken
            }
        })

        return c.json({
            message: "On ramp transaction added!"
        })
        
    }catch(err)
    {
        return c.json({
            message: "Invalid token",
            error: err
        }, 401)
    }
})

