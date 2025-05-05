import express from "express"
import jwt from "jsonwebtoken"
const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || ""

interface JwtPayload{
    id: number,
    name: string | null,
    email: string | null
}

router.get("/", (req:any, res:any)=>{
    const token = req.cookies.token;
    if(!token)
    {
        return res.status(401).json({
            message: "Unauthorized!"
        })
    }
    try{
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
        return res.json({
            status: "ok",
            user: decoded
        })
    }catch(err)
    {   
        return res.status(403).json({
            message: "Invalid token!"
        })
    }
})

export default router