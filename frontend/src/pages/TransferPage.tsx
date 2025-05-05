import axios from "axios"
import { useEffect, useState } from "react"
import { AddMoney } from "../components/AddMoneyCard"
import BalanceCard from "../components/BalanceCard"
import OnRampTransactions from "../components/OnRampTxnsComponent"
import { BACKEND_URL } from "../confit"

type BalanceResponse = {
    balance: number
}
type LockedBalanceType = {
    lockedBalance: number
}

type onRampTxnType = {
    time: string
    amount: number
    status: string
    provider: string
}

export default function(){
    const [balance, setBalance] = useState<number>(0)
    const [onRampTxns, setOnRampTxns] = useState<onRampTxnType[]>([])
    const [lockedBalance, setLockedBalance] = useState<number>(0)
    
    useEffect(()=>{
        //function to get the balance of the currently logged in user
        async function fetchBalance(){
            try{
                const response = await axios.post<BalanceResponse>(`${BACKEND_URL}/api/v1/user/dashboard/getBalance`,
                    {}, //body
                    {
                        withCredentials: true   //required to send cookie
                    }
                )
                
                setBalance(response.data.balance)
               
            }catch(err)
            {
                console.log("erore: ", err)
            }
        } 

        //function to fetch the onRampTxns of the user
        async function getOnRampTxns(){
            try{
                const response = await axios.post<onRampTxnType[]>(`${BACKEND_URL}/api/v1/user/transfer/getOnRampTxns`,
                    {}, //body
                    {
                        withCredentials: true   //required to send cookie
                    }
                )
                setOnRampTxns(response.data)
               
            }catch(err)
            {
                console.log("Error from Transfer Page : ", err)
            }
        } 
        //function to fetch the locked balance of the user
        async function getLockedBalance(){
            try{
                const response = await axios.post<LockedBalanceType>(`${BACKEND_URL}/api/v1/user/transfer/getLockedBalance`,
                    {}, //body
                    {
                        withCredentials: true   //required to send cookie
                    }
                )
                
                setLockedBalance(response.data.lockedBalance)
                
            }catch(err)
            {
                console.log("Error from Transfer Page : ", err)
            }
        } 
        fetchBalance()
        getOnRampTxns()
        getLockedBalance()
    }, [])

    return <div className="w-screen">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold pl-4">
        Wallet
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            <div>
                <AddMoney/>
            </div>
            <div>
                <BalanceCard amount={balance} locked={lockedBalance}/>
                <div className="pt-4">
                    <OnRampTransactions transactions={onRampTxns}/>
                </div>
            </div>
        </div>
    </div>
}