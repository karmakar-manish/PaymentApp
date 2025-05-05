import { useEffect, useState } from "react"
import axios from "axios"
import { BACKEND_URL } from "../config"

interface BalanceResponse {
    balance: number
}
interface onRampCountResponse {
    txnCount: number
}
interface p2pCountResponse {
    p2pCount: number
}
export default function(){
    
    const [balance, setBalance] = useState<number>(0)
    const [onRampCount, setOnRampCount] = useState<number>(0)
    const [p2pCount, setP2pCount] = useState<number>(0)

    useEffect(()=>{
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
        async function fetchOnRampCount(){
            try{
                const response = await axios.post<onRampCountResponse>(`${BACKEND_URL}/api/v1/user/dashboard/getOnRampTxns`,
                    {}, //body
                    {
                        withCredentials: true   //required to send cookie
                    }
                )
                setOnRampCount(response.data.txnCount)
            }catch(err)
            {
                console.log("error: ", err)
            }
        }   
        async function fetchP2pCount(){
            try{
                const response = await axios.post<p2pCountResponse>(`${BACKEND_URL}/api/v1/user/dashboard/p2pTransferCount`,
                    {}, //body
                    {
                        withCredentials: true   //required to send cookie
                    }
                )
                setP2pCount(response.data.p2pCount)
            }catch(err)
            {
                console.log("erore: ", err)
            }
        }   

        fetchBalance()
        fetchOnRampCount()
        fetchP2pCount()
    }, [])
    

    return <div className="w-screen">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold pl-4">Dashboard</div>
        <div className="flex justify-around mt-10 gap-1 ">
            
            <DashboardCard sign={"₹"} title={"Available balance"} value={balance/100}/>
            <DashboardCard title={"Wallet Transactions"} value={onRampCount}/>
            <DashboardCard title={"P2P Transfer"} value={p2pCount}/>

        </div>
    </div>
}

function DashboardCard({title, value, sign = ""}: {
    title: string,
    value: number,
    sign?: string
})
{
    
    return <div className="w-full max-w-xs p-5 bg-[#e6e6e6] rounded-lg border ">
        <div className="">
            <div className="pb-2 mb-4 text-md font-semibold text-slate-600 border-b border-slate-400">{title}</div>
            <div className="text-xl font-bold text-slate-700 pb-2">{sign} {Number(value).toLocaleString("en-IN")}</div>
        </div>
</div>

}

