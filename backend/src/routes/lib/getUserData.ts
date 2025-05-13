import { Hono } from "hono"
import { PrismaClient } from "@prisma/client/edge"
import { withAccelerate } from "@prisma/extension-accelerate"
import {verify} from "hono/jwt"
import { env } from "hono/adapter"
import { getCookie } from "hono/cookie"

export const getUserDataRoute = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}> ()

getUserDataRoute.get("/", async(c)=>{
    return c.json({
        message: "Hi from getuserData route"
    })
})

//Helper function for Prisma client
function getPrisma(c:any)
{
    return new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
}

//Helper function to verify jwt
async function verifyToken(c:any){
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
        return await verify(token, JWT_SECRET) as{
            id: number,
            name: string | null,
            email: string | null
        }
    }catch(err)
    {
        console.log("Invalid token");
        return c.json({
            error: err
        }, 401)
    }
    
}


//function to get the user data
getUserDataRoute.post("/getData", async(c)=>{
    
    //prisma client
    const client = getPrisma(c)

    try{
        const decoded = await verifyToken(c)

        //fetch the user information
        const User = await client.user.findFirst({
            where: {
                id: Number(decoded.id)
            }
        })

        return c.json({
            "name": User?.name,
            "email": User?.email,
            "number": User?.number
        })

    }catch(err)
    {
        console.log(`Error from getUserData.ts ${err}`);
        return c.json({
            error: err
        }, 411)
    }
})

//function to set the email of the User
getUserDataRoute.post("/setEmail", async(c)=>{
    //prisma client
    const client = getPrisma(c)

    const body = await c.req.json()
    
    try{
        const decoded = await verifyToken(c)

        const User = await client.user.findUnique({
            where:{
                email: body.email
            }
        })
        
        //incase email is already taken
        if(User)
        {
            return c.json({
                error: "Email taken already"
            }, 409)
        }

        //create an entry
        const data = await client.user.update({
            where: {
                id: decoded.id
            }, 
            data: {
                email: body.email,
                name: body.name,
                uid: body.uid
            }
        })
        return c.json({
            email: data.email,
            name: data.name
        })
    }catch(err)
    {
        console.log(`Error from getUserData SetEmail route ${err}`);
        return c.json({
            error: err
        }, 411)
    }
})


//function to set the User name
getUserDataRoute.post("/changePhoneName", async(c)=>{
    
    //prisma client
    const client = getPrisma(c)
    const body = await c.req.json()
    
    try{
        const decoded = await verifyToken(c)

        //fetch the use information
        const updatedUser = await client.user.update({
            where: {
                id: Number(decoded.id)
            },
            data:{
                name: body.name
            }
        })

        //check if the number sent in body is same as that of the current user (no number was changed)
        if(updatedUser.number === body.number)
        {
            return c.json({
                name: updatedUser.name,
                number:updatedUser.number
            })
        }

        
        //now check if the phone number is already taken
        const User = await client.user.findFirst({
            where: {
                number: body.number
            }
        })
       
        if(User)
        {
            return c.json({
                message: "Phone number already taken"
            }, 409)
        }

        //else set the phone number
        const newUser = await client.user.update({
            where: {
                id: Number(decoded.id)
            },
            data:{
                number: body.number
            }
        })
        
        return c.json({
            name: newUser.name,
            number: newUser.number
        })

    }catch(err)
    {
        console.log(`Error from setUsername route from getUserData ${err}`);
        return c.json({
            error: err
        }, 411)
    }
})