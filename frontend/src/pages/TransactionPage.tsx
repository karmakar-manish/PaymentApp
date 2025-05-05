import axios from "axios"
import { useEffect, useState } from "react"

type getUserBalanceType = {
    id: number
    time: string
    type: string
    amount: number
    ToFrom:string
    status: string
}

type onRampTxnsType = {
    id: number
    date: string
    type: string
    amount: number
    status: string
    sign: string
}
export default function(){
    const [balance, setBalance] = useState<getUserBalanceType[]>([])
    const [onRampData, setOnRampData] = useState<onRampTxnsType[]>([])

    useEffect(()=>{
        async function getUserBalance(){
            try{
                const res = await axios.post<getUserBalanceType[]>("http://localhost:3000/api/v1/user/transactions/getUserBalance", {

                }, {
                    withCredentials: true
                })
                
                setBalance(res.data)
            }catch(err)
            {
                console.log("1. Error from transaction page: ", err)
            }
        }

        async function getOnRampData(){
            try{
                const res = await axios.post<onRampTxnsType[]>("http://localhost:3000/api/v1/user/transactions/getOnRampData", {

                }, {
                    withCredentials: true
                })
                
                setOnRampData(res.data)
            }catch(err)
            {
                console.log("2. Error from transaction page: ", err)
            }
        }
        getUserBalance()
        getOnRampData()

    }, [])

    const mappedP2Pdata = balance.map(t=>({
        id: t.id,
        date: t.time,
        type: "P2P Transfer",
        amount: t.amount/100,
        status: t.status,
        sign: (t.ToFrom==="Received")?"+":"-",
    }))
    //now store both the data in same place
    const combinedData = [...mappedP2Pdata, ...onRampData]
   
    //sort based on time
    combinedData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let totalsent=0, totalReceived=0, successfullCount=0, pendingCount=0;
    
    combinedData.map(t=>{
        if(t.status==="Success")
        {
            successfullCount++;
        }
        else if(t.status==="Pending")
        {
            pendingCount++;
        }
        if(t.sign==="+")
            totalReceived = totalReceived + t.amount;
        else if(t.sign==="-")
            totalsent = totalsent + t.amount;
    })

    return <div className="w-screen">
            <div className="text-4xl text-[#6a51a6] pt-8 font-bold pl-4">Transactions</div>
                
            <div className="p-5">
                <div className="flex justify-around rounded-lg bg-[#e6e6e6] pt-10 pb-10 pr-3 pl-3">
                    
                    <BalanceInfo sign={"₹"} title={"Total Sent"} count={totalsent}/>
                    <BalanceInfo sign={"₹"} title={"Total Received"} count={totalReceived}/>
                    <BalanceInfo title={"Succesfull Transactions"} count={successfullCount}/>
                    <BalanceInfo title={"Pending Transactions"} count={pendingCount}/>
                </div>
                <div>
                    <div className="mt-5">
                        <div className="grid grid-cols-5 p-2 text-left font-semibold text-slate-800 bg-[#e6e6e6] rounded-lg">
                            <div>Transaction ID</div>
                            <div className="pl-3">Date</div>
                            <div>Type</div>
                            <div>Amount</div>
                            <div>Status</div>
                        </div>
                        <div className="h-120 overflow-x-auto">
                            {combinedData.map(t=>(<TransactionComponent key={t.id} data={t}/>))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
}

function BalanceInfo({title, count, sign=""}: {
    title: string,
    count: number,
    sign?: string
})
{
    return <div className="flex flex-1 mr-8 flex-col bg-white justify-center p-3  rounded-lg">
        <div className="text-md font-semibold text-slate-600">{title}</div>
        <div className="text-xl font-bold text-slate-700">{sign} {count.toLocaleString("en-IN")}</div>
    </div>
}

function TransactionComponent({data}: {
    data: {
        id: number,
        date: string,
        type: string,
        amount: number,
        status: string,
        sign: string
    }
})
{
    return <div className="grid grid-cols-5 items-center border-b border-slate-300 px-6 py-4 text-sm text-gray-800">
        <div>#{data.id}</div>
        <div className="flex flex-col ">
            <div>
                {new Date(data.date).toDateString()} 
            </div>
            <div className="text-xs text-gray-500">
                {new Date(data.date).toLocaleTimeString("en-IN")}
            </div>
        </div>
        <div>{data.type}</div>
        <div>{data.sign} ₹{data.amount.toLocaleString("en-IN")}</div>
        <div className={`p-2 rounded-lg text-center font-semibold text-xs ${data.status === "Success"?"bg-green-200" : "bg-red-100 text-red-800"} w-20`}>{data.status}</div>
    </div>
}

