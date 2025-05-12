import { Hono } from "hono"
import { PrismaClient } from "@prisma/client/edge"
import { withAccelerate } from "@prisma/extension-accelerate"
import {sign, verify} from "hono/jwt"
import { env } from "hono/adapter"
import { getCookie } from "hono/cookie"

export const transactionRoute = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}> ()

transactionRoute.get("/", async(c)=>{
    return c.json({
        message: "hi there from transaction route!"
    })
})

//function to get all the p2pTransactions of the current user
transactionRoute.post("/getUserBalance", async(c)=>{
    
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
        const txns = await client.p2pTransfer.findMany({
            where: {
                OR: [
                    {fromUserId: Number(decoded.id)},
                    {toUserId: Number(decoded.id)}
                ]
            }
        })
        //sort the txns based on time
        txns.sort((a: {timestamp: Date},b: {timestamp: Date}) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        
        return c.json(
            txns.map((t: {
                id:number,
                timestamp: Date,
                amount: number,
                toUserId: number
            })=>({
                id: t.id,
                time: t.timestamp,
                type: "P2P Transfer",
                amount: t.amount,
                ToFrom: Number(decoded.id)===t.toUserId ? "Received": "Sent",
                status: "Success"
            }))
        )


    }catch(err)
    {
        return c.json({
            message: "Invalid token",
            error: err
        }, 403)
    }
})

//function to get all the p2pTransactions of the current user
transactionRoute.post("/getOnRampData", async(c)=>{
    
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
        

        const data = await client.onRampTransaction.findMany({
            where: {
                userId: decoded.id
            }
        })
        

        return c.json(
            data.map((t: {
                id: number,
                startTime: Date,
                amount: number,
                status: string
            })=>({
                id: t.id,
                date: t.startTime,
                type: "Wallet Top-up",
                amount: t.amount/100,
                status: (t.status==="Success")?"Success":"Pending",
                sign: (t.status==="Success")?"+":""
            }))
        )


    }catch(err)
    {
        return c.json({
            message: "Invalid token",
            error: err
        }, 403)
    }
})
