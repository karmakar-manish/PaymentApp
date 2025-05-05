import express from "express"
import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config(); // Loads variables from .env into process.env

const router = express.Router()
const client = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || ""



router.get("/", (req: any,res: any)=>{
    return res.json({
        msg: "hi there"
    })
})
//function to get the balance of the current logged in user
router.post("/getBalance", async(req: any, res:any)=>{
    
    //get the token from the cookie
    const token = req.cookies.token
    
    //incase of no token
    if(!token)
    {
        return res.status(401).json({
            error: "Not authenticated!"
        })
    }

    try{
        const decoded = jwt.verify(token, JWT_SECRET) as{
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
            return res.status(403).json({
                message: "Invalid user id"
            })
        }
        return res.json({
            balance: balance.amount
        })

    }catch(err)
    {
        return res.status(403).json({
            message: "Invalid token",
            error: err
        })
    }
})


//function to get the count of onRampTransactions by the user
router.post("/getOnRampTxns", async(req: any, res:any)=>{
    //get the token from the cookie
    const token = req.cookies.token
    
    //incase of no token
    if(!token)
    {
        return res.status(401).json({
            error: "Not authenticated!"
        })
    }

    try{
        const decoded = jwt.verify(token, JWT_SECRET) as{
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
            return res.status(403).json({
                message: "Invalid user id"
            })
        }
        return res.json({
            txnCount: onRamp.length
        })
    }catch(err)
    {
        return res.status(403).json({
            message: "Invalid token",
            error: err
        })
    }
})

//get the count of p2pTransfer
router.post("/p2pTransferCount", async(req:any, res: any)=>{
    //get the token from the cookie
    const token = req.cookies.token
    
    //incase of no token
    if(!token)
    {
        return res.status(401).json({
            error: "Not authenticated!"
        })
    }

    try{
        const decoded = jwt.verify(token, JWT_SECRET) as{
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
            return res.status(403).json({
                message: "Invalid user id"
            })
        }
        return res.json({
            p2pCount: p2p.length
        })
    }catch(err)
    {
        return res.status(403).json({
            message: "Invalid token",
            error: err
        })
    }
})
export default router