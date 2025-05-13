export default function OnRampTransactions({transactions}: {
    transactions: {
        time: string,
        amount: number,
        status: string,
        provider: string
    }[]
}){
    //incase of no transactions
    if(!transactions.length)
    {
        return <div className="shadow-xl border border-slate-400  p-6 rounded-xl bg-[#ededed]">
            <div className="text-xl border-b pb-2">Recent Transactions</div>
            <div className="text-center pb-8 pt-8">No Recent Transactions</div>
        </div>
    }

    //incase the user has transactions
    return <div className="shadow-xl border border-slate-400  p-6 rounded-xl bg-[#ededed] overflow-x-auto h-80">
        <div className=" text-xl border-b pb-2">Recent Transactions</div>
        <div className="pt-2">
            {transactions.map(t => <TransactionCard key={t.time} time={t.time} amount={t.amount}/>)}
        </div>
    </div>
}

function TransactionCard(props: any){
    return <div className="flex justify-between mb-2">
        <div>
            <div className="text-sm">Received INR</div>
            <div className="text-xs text-slate-600">
                {new Date(props.time).toDateString()}
            </div>
        </div>
        <div className="flex flex-col justify-center text-md font-semibold text-slate-900">
            + ₹{(props.amount / 100).toLocaleString("en-IN")}
        </div>
    </div>
}