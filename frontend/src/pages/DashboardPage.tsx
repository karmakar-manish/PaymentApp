import { useEffect, useState } from "react"
import axios from "axios"
import { BACKEND_URL } from "../config"
import TextInputComponent from "../components/TextInputComponent"

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
    

    return <div className="w-screen overflow-x-auto">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold pl-4">Dashboard</div>
        <div className="flex justify-around mt-10 gap-1 ">
            
            <DashboardCard sign={"₹"} title={"Available balance"} value={balance/100}/>
            <DashboardCard title={"Wallet Transactions"} value={onRampCount}/>
            <DashboardCard title={"P2P Transfer"} value={p2pCount}/>

        </div>
        <UserComponent/>
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

type UserDataType = {
    name: string,
    email: string,
    number: string
}
function UserComponent(){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("")
    const [number, setNumber] = useState("")

    useEffect(()=>{
        async function getData(){
            try{
                const res = await axios.post<UserDataType>(`${BACKEND_URL}/api/v1/user/getUserData/getData`, {},
                {withCredentials:true})

                setName(res.data.name)
                setEmail(res.data.email)
                setNumber(res.data.number)

            }catch(err)
            {
                console.log("Error from Dashboard page getuserData")
            }            
        }

        getData()   //get user data

    }, [])
    console.log(name, " ", email, " ", number)
    return <div className="mt-4 h-fit mb-10">
            <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold pl-4">User Profile</div>
            <div className="border rounded-lg p-10 md:w-sm lg:w-fit ml-4">
                <div className="md:w-sm lg:w-md">
                    <TextInputComponent label="Name" placeholder={name} onChange={()=>{}}/>
                    <TextInputComponent readOnly={!!email} label="Email" placeholder={email} onChange={()=>{}}/>
                    <TextInputComponent readOnly={!!number} type="tel" label="Phone" placeholder={number} onChange={()=>{}}/>
                </div>
                <button className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-md text-sm px-5 py-2.5 me-2 mt-4">Edit Profile</button>

                <button className="cursor-pointer text-slate-700 border border-slate-500 bg-white hover:bg-red-100 focus:outline-none font-medium  rounded-md text-sm px-5 py-2.5 me-2 mt-4">Change Password</button>
            </div>
        </div>
}
