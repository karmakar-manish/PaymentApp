import { useEffect, useState } from "react"
import axios from "axios"
import SendCard from "../components/SendCard"
import P2pTransactions from "../components/P2pTransactions"
import { BACKEND_URL } from "../confit"

type p2pTransactionSchema = {
    id: number,
    time: string,
    type: string,
    amount: number,
    ToFrom: string,
    status: string
}
export default function(){
    const [p2pTxns, setP2pTxns] = useState<p2pTransactionSchema[]>([])

    useEffect(()=>{
        async function getP2pTxns(){
            try{
                const res = await axios.post<p2pTransactionSchema[]>(`${BACKEND_URL}/api/v1/user/p2pTransfer/getTxns`, 
                    {},
                    {
                        withCredentials: true //for cookies
                    }
                )
           
                setP2pTxns(res.data)
                
            }catch(err)
            {
                console.log("Wrong inputs!")
                console.log("error from p2pTransfer.tsx : ", err)
            }
        }
        getP2pTxns()
    }, [])
    
    return <div className="w-screen">
            <div className="flex flex-col justify-center">
            <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold pl-4">Transfer</div>
                <div className="grid grid-cols-1 gap-20  md:grid-cols-2 p-4">
                    <div>
                        <SendCard/>
                    </div>
                    <div className="">
                        <P2pTransactions transactions={p2pTxns}/>
                    </div>
                </div>
            </div>
        </div>
}