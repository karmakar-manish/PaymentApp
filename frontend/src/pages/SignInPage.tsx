import SignInComponent from "../components/SignInComponent"

export default function(){
    return <div className=" mt-20">
        <div className="flex justify-center">
            <div className="flex flex-col justify-center w-xs bg-[#e6e6e6] p-10 rounded-xl">
                <div className="text-center">
                    <div className="text-2xl font-bold text-slate-800">PAYMENT</div>
                    <div className="text-sm text-slate-700 pb-2 mb-7">Secure Payments, Anytime, Anywhere</div>
                </div>
                <div className="">
                    <div className="text-xl text-center font-semibold text-slate-800">
                        Sign in to your account
                    </div>
                    <SignInComponent/>
                </div>
            </div>
        </div>
    </div>
}