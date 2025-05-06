import { Hono } from "hono";

export const logoutRoute = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}> ()


//route to logout the user to the signin page
logoutRoute.post("/clearCookie", async(c)=>{
    
    //clear the cookie
    c.header("Set-Cookie", 
        `token=;
        HttpOnly;
        Path=/;
        Max-Age=0;
        SameSite=None;
        Secure`
    )


    return c.json({
        message: "Logged out!"
    })
})