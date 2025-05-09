import SignInComponent from "../components/SignInComponent"
import wallpaper1 from "../assets/wallpaper1.jpg"
import wallpaper2 from "../assets/wallpaper2.jpg"


export default function(){
    return <div className="bg-center bg-cover min-h-screen p-2 lg:p-10 flex" style={{backgroundImage: `url(${wallpaper2})`}}>
        <div className="bg-white border-white border-8 rounded-2xl w-full text-center gap-20 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
            {/* left container */}
            <div className="bg-cover xs:bg-center rounded-2xl flex flex-col justify-end text-left p-10 h-130 lg:min-h-full" style={{backgroundImage: `url(${wallpaper1})`}}>
                <div className="text-slate-600 font-[Open_Sans] text-3xl md:text-4xl lg:text-5xl sm:pr-5 lg:p-0">
                    Get <br/>
                    Everything <br/>
                    You Want
                </div>
                <div className="text-slate-500 text-sm mt-2 sm:w-xs">
                    Manage your payments effortlessly, wherever life takes you.
                </div>
            </div>
            {/* right container  */}
            <div className="h-full w-full flex justify-center">
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