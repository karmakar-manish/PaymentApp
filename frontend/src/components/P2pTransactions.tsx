export default function P2pTransactions({transactions}: {
    transactions: {
        id: number,
        time: string,
        type: string,
        amount: number,
        ToFrom: string,
        status: string
    }[]
}){


    //incase of no transactions
    if(!transactions.length)
    {
        return <div className="shadow-xl border border-slate-400  p-6 rounded-xl bg-[#ededed]">
            <div className="text-xl border-b pb-2">
                Recent Transactions
            </div>
            <div className="text-center pb-8 pt-8">
                No Recent Transactions
            </div>
        </div>
    }

    return <div className="shadow-xl border border-slate-400  h-120 overflow-y-auto p-6 rounded-xl bg-[#ededed]">
            <div className="text-xl border-b pb-2">
                Recent Transactions
            </div>
            <div className="pt-2">
                {transactions.map(t => <P2PTransferCard key={t.time} amount={t.amount} time={t.time} status={t.ToFrom}/>)}
            </div>
        </div>
}

function P2PTransferCard(props: any)
{
    return <div className="flex justify-between mb-2">
        <div>
            <div className="text-sm"> {props.toFrom} INR </div>
            <div className="text-xs text-slate-600">{new Date(props.time).toDateString()}</div>
        </div>
        <div className="flex justify-center flex-col">
            {props.status==="Received"? "+": "-"} Rs {props.amount/100}
        </div>
    </div>
    
}
