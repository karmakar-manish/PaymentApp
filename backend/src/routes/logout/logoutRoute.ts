import { Hono } from "hono";
import { setCookie } from "hono/cookie";

export const logoutRoute = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}> ()


//route to logout the user to the signin page
logoutRoute.post("/clearCookie", async(c)=>{
    
    //clear the cookie
    setCookie(c, "token", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0,
        sameSite: "None",
        secure: true,
    })
    


    return c.json({
        message: "Logged out!"
    })
})