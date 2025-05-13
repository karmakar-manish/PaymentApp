import { useEffect, useState } from "react"
import axios from "axios"
import { BACKEND_URL } from "../config"
import TextInputComponent from "../components/TextInputComponent"
import googleImg from "../assets/google.png"
import {auth, provider} from "../firebase"
import { signInWithPopup } from "firebase/auth";

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
    
    return <div className="w-full max-w-xs p-5 bg-[#CBF1F5] rounded-lg shadow-xl border border-slate-300">
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

type EmailDataType = {
    email: string,
    name: string
}

type NameNumberType = {
    name: string,
    number: string
}
function UserComponent(){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("")
    const [number, setNumber] = useState("")
    const [newNumber, setNewNumber] = useState("")
    const [emailError, setEmailError] = useState("")
    const [numberError, setNumberError] = useState("")

    useEffect(()=>{
        async function getData(){
            try{
                const res = await axios.post<UserDataType>(`${BACKEND_URL}/api/v1/user/getUserData/getData`, {},
                {withCredentials:true})

                setName(res.data.name || "")
                setEmail(res.data.email || "")
                setNumber(res.data.number || "")

            }catch(err)
            {
                console.log("Error from Dashboard page getuserData")
            }            
        }

        getData()   //get user data

    }, [])
    
    return <div className="mt-4 h-fit mb-10 mr-5">
            <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold pl-4">User Profile</div>
            <div className="rounded-lg p-10 md:w-fit lg:w-fit ml-4 bg-[#edededfa] shadow-xl border border-slate-400">
                <div className="md:w-sm lg:w-md">
                    <TextInputComponent label="Name" value={name} placeholder={"Enter your name"} onChange={(e)=>setName(e)}/>
                    
                    {email !== null ? (
                        <TextInputComponent readOnly={!!email} label="Email" value={email} placeholder={email} onChange={()=>{}}/>
                    ): (
                        <button className="cursor-pointer text-slate-700 bg-[#c2c8bc61] hover:bg-[#b3c5a161] focus:outline-none font-medium rounded-md text-sm px-5 py-2.5 mb-2 mt-4" onClick={async(e)=>{
                            e.preventDefault()
                            signInWithPopup(auth, provider)
                                .then(async(res)=>{
                                    try{
                                        const response = await axios.post<EmailDataType>(`${BACKEND_URL}/api/v1/user/getUserData/setEmail`, {
                                            uid: res.user.uid,
                                            email: res.user.email,
                                            name: res.user.displayName
                                        }, {
                                            withCredentials: true
                                        })
                                        setEmail(response.data.email)
                                        setName(response.data.name)
                                        setEmailError("")

                                    }catch(err){
                                        console.log("Error from Dashboard page google button: ", err)
                                        setEmailError("Email-id already taken. Try again.")
                                    }
                                    
                                })
                                .catch(err=>{
                                    console.log("error : ", err)
                                })
                        }}>
                            <div className="flex justify-center">
                                <img src={googleImg} alt="google_img" className="w-5 h-5 mr-2"/>
                                <span>Link Email</span>
                            </div>
                        </button>
                    )}
                    {emailError && (
                        <p className="text-red-500 text-sm text-left mb-2">{emailError}</p>
                    )}

                    <TextInputComponent type="tel" label="Phone" value={number}  placeholder={"Enter your phone number: "} onChange={(e)=>setNumber(e)}/>
                    {numberError && (
                        <p className="text-red-500 text-sm text-left mb-2">{numberError}</p>
                    )}

                </div>
                <button className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-md text-sm px-5 py-2.5 me-2 mt-4" onClick={async(e)=>{
                    e.preventDefault()

                    try{
                        const response = await axios.post<NameNumberType>(`${BACKEND_URL}/api/v1/user/getUserData/changePhoneName`, 
                        {
                            name: name,
                            number: number
                        }, {
                            withCredentials: true
                        })
                        
                        setName(response.data.name)
                        setNumber(response.data.number)
                        setNumberError("")
                        setNewNumber("")
                        alert("Profile updated successfully!")
                    }catch(err)
                    {
                        console.log("Error is: ", err)
                        setNumberError("Number already taken! Login instead.")
                    }
                    }}>Edit Profile</button>

                <button className="cursor-pointer text-slate-700 border border-slate-500 bg-white hover:bg-red-100 focus:outline-none font-medium  rounded-md text-sm px-5 py-2.5 me-2 mt-4">Change Password</button>
            </div>
        </div>
}
