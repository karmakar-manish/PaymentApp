import express from "express"
import zod from "zod"
import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";

dotenv.config(); // Loads variables from .env into process.env

const router = express.Router()
const client = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || ""

router.get("/", (req: any,res: any)=>{
    return res.json({
        message: "Hi from signin route"
    })
})

//signin body schema
const phoneSchema = zod.object({
    number: zod.string().min(1),
    password: zod.string().min(1)
})
router.post("/phonePassword", async(req: any,res: any)=>{

    const response = phoneSchema.safeParse(req.body)
    
    //incase of no success
    if(!response.success)
    {
        return res.status(411).json({
            error: "Invalid Username / Password",
            message: "Zod validation error"
        })
    }

    let user;
    try{
        //find user from database
        user = await client.user.findFirst({
            where: {
                AND: [
                    {number: req.body.number},
                    {password: req.body.password}
                ]
            }
        })
        
    }
    catch(err){
        return res.status(411).json({
            error: "Invalid Username / Password",
            message: "No user in database"
        })
    }

    //incase no user is present in database
    if(!user)
    {
        return res.status(411).json({
            error: "Invalid Username / Password",
            message: "No user in database"
        })
    }

    //create a jwt token
    const token = jwt.sign({
        id:user.id,
        secure: false,
        name: user.name,
        email: user.email
    }, JWT_SECRET)

    //create cookie
    res.cookie("token", token, {
        httpOnly: true, // Prevents JavaScript from accessing the cookie
        sameSite: "none",    //cross-site post/put/delete/fetch not allowed from different origin
        secure: false,
        maxAge: 24*60*60*1000,   //1 day
        // path: "/"
    })

    return res.json({
        message: "Signed in successfully!"
    })
})

//provider schema
const providerSchema = zod.object({
    uid: zod.string().min(1),
    email:zod.string().min(1),
    displayName:zod.string().min(1)
})

router.post("/providerLogin", async(req:any, res:any)=>{
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
        //check if user is in database
        const user = await client.user.findFirst({
            where: {
                uid: req.body.uid
            }
        })
        
        //incase user is there
        if(user)
        {
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
                secure: false,
                maxAge: 24*60*60*1000,   //1 day
                // path: "/"
            })

            return res.json({
                message: "Signed in successfully!"
            })
        }
    }catch(err){
        return res.status(411).json({
            error: "Invalid provider id",
            message: "No user in database"
        })   
    }

    return res.status(411).json({
        error: "No user found",
        message:"Invalid provider id"
    })
})
export default router;