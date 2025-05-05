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
        message: "hi there     !"
    })
})

//function to get the onRampTxns of the user
router.post("/getOnRampTxns", async(req: any, res: any)=>{
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
            
            const txns = await client.onRampTransaction.findMany({
                where: {
                    userId: decoded.id
                }
            })
        
            //sort based on time
            txns.sort((a: {startTime: Date}, b: {startTime: Date}) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
          

            return res.json(
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
            return res.status(403).json({
                message: "Invalid token",
                error: err
            })
        }
})

//function to get the locked balance of the user
router.post("/getLockedBalance", async(req: any, res: any)=>{
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
            
            const user = await client.onRampTransaction.findMany({
                where: {
                    userId: decoded.id
                }
            })
        
            
            let lockedBalance = 0
        
            user.forEach(t=>{
                if(t.status === "Processing")
                    lockedBalance = lockedBalance + t.amount
            })
       
            return res.json({
                lockedBalance: lockedBalance
            })
    
        }catch(err)
        {
            return res.status(403).json({
                message: "Invalid token",
                error: err
            })
        }
})

//function to create onRamp txns
router.post("/createOnRamptxn", async(req: any, res: any)=>{
    //get the token from the cookie
        const token = req.cookies.token
        const amount = req.body.amount
        const provider = req.body.provider
        
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

            return res.json({
                message: "On ramp transaction added!"
            })
            
        }catch(err)
        {
            return res.status(403).json({
                message: "Invalid token",
                error: err
            })
        }
})

export default router;