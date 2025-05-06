import express from "express"
const router = express.Router()

//function to get all the p2pTransfer details of the user
router.post("/clearCookie", async(req: any, res:any)=>{
    
    //clear the cookie
    res.clearCookie("token", {
        httpOnly: true, // Prevents JavaScript from accessing the cookie
        sameSite: "none",    //cross-site post/put/delete/fetch not allowed from different origin
        secure: true,
        maxAge: 24*60*60*1000   //1 day
    })

    console.log("Cookie cleared");

    return res.json({
        message: "Logged out!"
    })
})

export default router;