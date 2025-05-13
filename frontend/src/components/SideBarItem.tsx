import { useNavigate, useLocation } from "react-router-dom"

export default function({href, icon, title}: any){
    const location = useLocation()  //get current path
    const navigate = useNavigate()

    const selected = location.pathname === href
    

    return <div className={`flex ${selected?"text-[#0F4C75]": "text-slate-400"} cursor-pointer`} 
        onClick={()=>{
            if (location.pathname !== href) {
                navigate(href);
            }
            
            // navigate(href)
        }}>
        <div className="pr-2 cursor-pointer">
            {icon}
        </div>
        <div className={`font-bold ${selected?"text-[#0F4C75]": "text-slate-400 "} cursor-pointer`}>
            {title}
        </div>
    </div>
}