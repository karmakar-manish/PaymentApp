import { Hono } from "hono"
import { Prisma, PrismaClient } from "@prisma/client/edge"
import { withAccelerate } from "@prisma/extension-accelerate"
import {sign, verify} from "hono/jwt"
import { env } from "hono/adapter"
import { getCookie } from "hono/cookie"

export const p2pTransferRoute = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}> ()

//function to get all the p2pTransfer details of the user
p2pTransferRoute.post("/getTxns", async(c)=>{
    
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
                id: number,
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
        }, 401)
    }
})


p2pTransferRoute.post("/transfer", async(c)=>{
    
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
        
        const body = await c.req.json()

        const senderId = decoded.id
        const receiverNum = body.receiverNum
        const amount = body.amount

        //incase no sender is found
        if(!senderId)
        {
            console.log("Invalid sender number!");
            return c.json({
                message: "Invalid sender number!"
            }, 400)
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
            return c.json({
                message: "Receiver not found!"
            }, 400)
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
                return c.json({
                    message: "Insufficient balance"
                }, 400)
            }

            //reduce the balance of the sender
            await tx.balance.update({
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
            await tx.balance.update({
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
            await tx.p2pTransfer.create({
                data:{
                    amount: amount,
                    timestamp: new Date(),
                    toUserId: Number(receiver.id),
                    fromUserId: Number(senderId)
                }
            })
        })
        return c.json({
            message:"Money sent successfully!"
        })

        }catch(err)
        {
            console.log("Error: ", err);
            return c.json({
                message: "Invalid token",
                error: err
            }, 403)
        }
})
