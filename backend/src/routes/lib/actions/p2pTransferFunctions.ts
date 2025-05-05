import express from "express"
import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config(); // Loads variables from .env into process.env

const router = express.Router()
const client = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || ""

//function to get all the p2pTransfer details of the user
router.post("/getTxns", async(req: any, res:any)=>{
    
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
        txns.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

        
        return res.json(
            txns.map(t=>({
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


router.post("/transfer", async(req: any, res:any)=>{
    
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
        
        const senderId = decoded.id
        const receiverNum = req.body.receiverNum
        const amount = req.body.amount

        //incase no sender is found
        if(!senderId)
        {
            console.log("Invalid sender number!");
            return res.error({
                message: "Invalid sender number!"
            })
        }

        const receiver = await client.user.findFirst({
            where: {
                number: String(receiverNum)
            }
        })
    
        //incase Receiver account is not found
        if(!receiver)
        {
            console.log("Receiver not found!");
            return res.error({
                message: "Receiver not found!"
            })
        }
    
        //create a trasaction to maintain atomicity
        await client.$transaction(async (tx) => {
            //we need to make sure only one db call is done here (LOCK)
            // Locks the selected row so that no one else can modify it until this transaction commits or rolls back.
            await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId"=${Number(senderId)} FOR UPDATE`;
            // In SQL, FOR UPDATE means row-level lock


            //fetch the balance of the sender
            const senderBalance = await tx.balance.findUnique({
                where: {
                    userId: Number(senderId)
                }
            })
        /*
            console.log("Before sleep");
            await new Promise(resolve => setTimeout(resolve, 4000))
            console.log("After sleep");
        */
            //check if sufficient balance is there
            if(!senderBalance || senderBalance.amount < amount)
            {
                console.log("Insufficient balance");
                return res.error({
                    message: "Insufficient balance"
                })
            }

            //reduce the balance of the sender
            await tx.balance.updateMany({
                where: {
                    userId: Number(senderId)
                },
                data:{
                    amount:{
                        decrement: amount
                    }
                }
            })

            //increase the balance of the receiver
            await tx.balance.updateMany({
                where: {
                    userId: Number(receiver.id)
                },
                data:{
                    amount:{
                        increment: amount
                    }
                }
            })

            //update the p2pTransfer table
            await client.p2pTransfer.create({
                data:{
                    amount: amount,
                    timestamp: new Date(),
                    toUserId: Number(receiver.id),
                    fromUserId: Number(senderId)
                }
            })
        })
        return res.json({
            message:"Money sent successfully!"
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