import express from "express"
import zod from "zod"
import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const router = express.Router()
const client = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || ""

router.get("/", (req: any, res:any)=>{
    return res.json({
        message: "Hi from signup"
    })
})

//signup body schema
const phoneSchema = zod.object({
    number: zod.string().min(10),
    password: zod.string().min(1)
})

router.post("/phonePassword", async(req: any, res:any)=>{
    const response = phoneSchema.safeParse(req.body)
    
    //incase of no success
    if(!response.success)
    {
        return res.status(411).json({
            error: "Invalid Username / Password",
            message: "Zod validation error"
        })
    }
    try{
        //create a new user in database
        const user = await client.user.create({
            data: {
                number: req.body.number,
                password: req.body.password
            }
        })

        //create a token
        const token = jwt.sign({
            id: user.id,
            name: user.name,
            email: user.email
        }, JWT_SECRET)
        
       //create cookie
        res.cookie("token", token, {
            httpOnly: true, // Prevents JavaScript from accessing the cookie
            sameSite: "none",    //cross-site post/put/delete/fetch not allowed from different origin
            secure: true,
            maxAge: 24*60*60*1000,   //1 day
            // path: "/"
        })
        return res.json({
            message: "Signed up successfully!"
        })
    }catch(err)
    {
        return res.status(411).json({
            message: "Error while signup!",
            error: err
        })
    }
})

//provider schema
const providerSchema = zod.object({
    uid: zod.string().min(1),
    email:zod.string().min(1),
    displayName:zod.string().min(1)
})

//provider signup
router.post("/providerSignup", async(req:any, res:any)=>{
    const response = providerSchema.safeParse(req.body)

    //incase of no success
    if(!response.success)
    {
        return res.status(411).json({
            error: "Invalid provider details!",
            message: "Zod validation error"
        })
    }

    try{
        //create a new user
        const user = await client.user.create({
            data:{
                uid: req.body.uid,
                email: req.body.email,
                name: req.body.displayName
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
        //create a jwt token
            const token = jwt.sign({
                id:user.id,
                name: user.name,
                email: user.email
            }, JWT_SECRET)
        
            //create cookie
            res.cookie("token", token, {
                httpOnly: true, // Prevents JavaScript from accessing the cookie
                sameSite: "none",    //cross-site post/put/delete/fetch not allowed from different origin
                secure: true,
                maxAge: 24*60*60*1000,   //1 day
                // path: "/"
            })
        
            return res.json({
                message: "Signed in successfully!"
            })
    }catch(err){
        return res.status(411).json({
            message: "Error while signup with provider",
            error: err
        })
    }
})
export default router