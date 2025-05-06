import { Hono } from "hono"
import { PrismaClient } from "@prisma/client/edge"
import { withAccelerate } from "@prisma/extension-accelerate"
import {sign, verify} from "hono/jwt"
import { env } from "hono/adapter"
import { getCookie } from "hono/cookie"


export const dashboardRoute = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}> ()



dashboardRoute.get("/", (c)=>{
    return c.json({
        msg: "hi there from dashboard"
    })
})

//function to get the balance of the current logged in user
dashboardRoute.post("/getBalance", async(c)=>{
    
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

        //fetch the balance of the user
        const balance = await client.balance.findFirst({
            where: {
                userId: decoded.id
            }
        })
        
        if(!balance)
        {
            return c.json({
                message: "Invalid user id"
            }, 403)
        }
        return c.json({
            balance: balance.amount
        })

    }catch(err)
    {
        return c.json({
            message: "Invalid token",
            error: err
        }, 403)
    }
})


//function to get the count of onRampTransactions by the user
dashboardRoute.post("/getOnRampTxns", async(c)=>{
    //get the token from the cookie
    const token = getCookie(c, "token")
    const JWT_SECRET = env(c).JWT_SECRET || "";

    //prisma client
    const client = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

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

        //fetch the balance of the user
        const onRamp = await client.onRampTransaction.findMany({
            where: {
                userId: Number(decoded.id)
            }
        })
        
        if(!onRamp)
        {
            return c.json({
                message: "Invalid user id"
            }, 403)
        }
        return c.json({
            txnCount: onRamp.length
        })
    }catch(err)
    {
        return c.json({
            message: "Invalid token",
            error: err
        }, 403)
    }
})

//get the count of p2pTransfer
dashboardRoute.post("/p2pTransferCount", async(c)=>{
    //get the token from the cookie
    const token = getCookie(c, "token")
    const JWT_SECRET = env(c).JWT_SECRET || "";

    //prisma client
    const client = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())


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

        //fetch the balance of the user
        const p2p = await client.p2pTransfer.findMany({
            where: {
                OR: [
                    {fromUserId: decoded.id},
                    {toUserId: decoded.id}
                ]
            }
        })
        
        if(!p2p)
        {
            return c.json({
                message: "Invalid user id"
            }, 403)
        }
        return c.json({
            p2pCount: p2p.length
        })
    }catch(err)
    {
        return c.json({
            message: "Invalid token",
            error: err
        }, 403)
    }
})
