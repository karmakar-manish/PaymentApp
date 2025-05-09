import SignUpComponent from "../components/SignUpComponent"
import wallpaper2 from "../assets/wallpaper7.jpg"

export default function(){
    

    return <div className="h-screen relative p-2 lg:p-10 flex overflow-hidden">
        <div
        className="absolute inset-0 bg-center bg-cover blur-sm scale-105"
        style={{ backgroundImage: `url(${wallpaper2})`, zIndex: -1 }}
      />
        <div className="flex justify-center w-full">
        {/* right container  */}
        <div className="flex justify-center bg-white/80 rounded-lg backdrop-blur-sm">
            <div className="flex flex-col justify-center w-sm p-10 rounded-xl">
                <div className="text-center">
                    <div className="text-4xl font-serif text-slate-800">Get Started</div>
                    <div className="font-medium text-sm text-slate-700 mt-2 pb-2">Welcome to Payment App - Let's create your account</div>
                </div>
                <div className="text-left">
                    <SignUpComponent/>
                </div>
            </div>
        </div>

        </div>
        
    

        
    </div>
    
}
