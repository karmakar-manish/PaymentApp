export default function BalanceCard({amount, locked}: {
    amount: number,
    locked: number
}){
    
    return <div className="border p-6 rounded-xl bg-[#ededed]">
        <div className="text-xl border-b pb-2">Balance</div>

        <BalanceComponent title={"Unlocked Balance"} amount={amount/100}/>
        <BalanceComponent title={"Total Locked Balance"} amount={locked/100}/>
        <BalanceComponent title={"Total Balance"} amount={(locked+amount)/100}/>

    </div>
}

function BalanceComponent({title, amount}: {
    title: string,
    amount: number
}){
    return <div className="flex justify-between border-b border-slate-300 py-2">
        <div className="text-slate-700">{title}</div>
        <div className="text-md font-semibold text-slate-900">
        ₹ {amount.toLocaleString("en-In")}
        </div>
    </div>
}