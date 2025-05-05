import express from "express"
import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config(); // Loads variables from .env into process.env

const router = express.Router()
const client = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || ""

router.get("/", async(req: any, res: any)=>{
    return res.json({
        message: "hi there!"
    })
})
//function to get all the p2pTransactions of the current user
router.post("/getUserBalance", async(req: any, res: any)=>{
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
            
            return res.json(
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
            return res.status(403).json({
                message: "Invalid token",
                error: err
            })
        }
})

//function to get all the p2pTransactions of the current user
router.post("/getOnRampData", async(req: any, res: any)=>{
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
           

            const data = await client.onRampTransaction.findMany({
                where: {
                    userId: decoded.id
                }
            })
          
    
            return res.json(
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
            return res.status(403).json({
                message: "Invalid token",
                error: err
            })
        }
})

export default router;