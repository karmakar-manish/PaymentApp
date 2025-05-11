import SignUpComponent from "../components/SignUpComponent"
import wallpaper2 from "../assets/wallpaper7.jpg"

export default function(){
    

    return <div className="h-screen relative p-2 lg:p-10 flex flex-col justify-center overflow-hidden">
        <div
        className="absolute inset-0 bg-center bg-cover blur-sm scale-105"
        style={{ backgroundImage: `url(${wallpaper2})`, zIndex: -1 }}
      />
        <div className="flex justify-center w-full pt-10 pb-10 h-fit">
        {/* right container  */}
        <div className="flex justify-center bg-white/80 rounded-lg backdrop-blur-sm w-lg p-10 md:p-5 ">
            <div className="flex flex-col justify-center lg:p-10 md:p-10 rounded-xl w-full">
                <div className="text-center ">
                    <div className="lg:text-4xl text-6xl font-serif text-slate-800">Get Started</div>
                    <div className="font-medium text-md lg:text-sm text-slate-700 mt-2 pb-2">Welcome to Payment App - Let's create your account</div>
                </div>
                <div className="text-left">
                    <SignUpComponent/>
                </div>
            </div>
        </div>

        </div>
        
    

        
    </div>
    
}
