import { signInRoute } from "./signin/signinRoute"
import { signUpRoute } from "./signup/signupRoute"
import { verifyRoute } from "./auth/verifyToken"
import { dashboardRoute } from "./lib/dashboardFunctions"
import { p2pTransferRoute } from "./lib/p2pTransferFunctions"
import { transactionRoute } from "./lib/transactionFunctions"
import { transferRoute } from "./lib/transferFunctions"
import { logoutRoute } from "./logout/logoutRoute"
import { Hono } from "hono"

export const mainRoute = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}> ()


mainRoute.route("/signinRoute", signInRoute)
mainRoute.route("/signupRoute", signUpRoute)
mainRoute.route("/verify", verifyRoute)
mainRoute.route("/user/dashboard", dashboardRoute)
mainRoute.route("user/p2pTransfer", p2pTransferRoute)
mainRoute.route("/user/transactions", transactionRoute)
mainRoute.route("/user/transfer", transferRoute)
mainRoute.route("/user/logout", logoutRoute)

