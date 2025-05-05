import express from "express"
import signInRoute from "./signin/signinRoute"
import signUpRoute from "./signup/signupRoute"
import dashboardRoute from "./lib/actions/dashboardFunctions"
import verifyToken from "./auth/verifyToken"
import p2pTransferFunctions from "./lib/actions/p2pTransferFunctions"
import transactionFunctions from "./lib/actions/transactionFunctions"
import transferFunctions from "./lib/actions/transferFunctions"

const router = express.Router()

router.use("/signinRoute", signInRoute)
router.use("/signupRoute", signUpRoute)
router.use("/user/dashboard", dashboardRoute)
router.use("/user/p2pTransfer", p2pTransferFunctions)
router.use("/user/transactions", transactionFunctions)
router.use("/user/transfer", transferFunctions)
router.use("/verify", verifyToken)

export default router;