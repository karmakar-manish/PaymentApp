import SignInComponent from "../components/SignInComponent"
import backgroundImg from "../assets/signBackground.jpg"

export default function(){
    return <div className="bg-gray-700 min-h-screen p-2 lg:p-10 flex bg-center bg-cover" style={{backgroundImage: `url(${backgroundImg})`}}>
        <div className="bg-white border-white border-8 rounded-2xl w-full text-center gap-20 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
            {/* left container */}
            <div className="bg-gray-400 rounded-2xl flex flex-col justify-end text-left p-10">
                <div className="text-white font-[Open_Sans] text-5xl">
                    Get <br/>
                    Everything <br/>
                    You Want
                </div>
                <div className="text-white text-sm mt-4 ">
                    Manage your payments effortlessly, wherever life takes you.
                </div>
            </div>
            {/* right container  */}
            <div className="h-full w-full flex justify-center  border-red-800">
                <div className="flex flex-col justify-center w-sm p-10 rounded-xl">
                    <div className="text-center">
                        <div className="text-4xl font-serif text-slate-800">Welcome Back</div>
                        <div className="font-medium text-sm text-slate-700 mt-2 pb-2">Enter your email and password to access your account</div>
                    </div>
                    <div className="text-left">
                        <SignInComponent/>
                    </div>
                </div>
            </div>
        </div>

        
    </div>
    
}
{/* <div className="flex justify-center">
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
                </div> */}