import { useEffect, useState } from "react";
import SideBarItem from "./SideBarItem";
import { Outlet, Navigate, useLocation} from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../confit";

export default function LayoutAfterSignin() {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const location = useLocation()

  useEffect(()=>{
    async function verify(){
      try{
        await axios.get(`${BACKEND_URL}/api/v1/verify`, {
          withCredentials: true
        })
        
        setAuthenticated(true)
      }catch(err)
      {
        console.log("Error : ", err)
        setAuthenticated(false)
      }finally{
        setLoading(false)
      }
    }
    verify()

  }, [])
    if(loading)
    {
      return <div>...Loading</div>
    }
    //incase of not authenticated  
    if(!authenticated)
    {
      return <Navigate to="/signin" replace />
    }
    
    return <div className="">
        <div className="flex">
            <div className="w-60 border-r border-slate-300 min-h-screen mr-4 pt-27 bg-[#e1dbf0]">
                <div className="p-2 pl-5 gap-2 flex flex-col">
                    <SideBarItem href={"/dashboard"} icon={<HomeIcon/>} title={"Home"}/>
                    <SideBarItem href={"/transfer"} icon={<TransferIcon/>} title={"Wallet Top-up"}/>
                    <SideBarItem href={"/transactions"} icon={<TransactionIcon/>} title={"Transactions"}/>
                    <SideBarItem href={"/p2pTransfer"} icon={<P2PIcon/>} title={"P2P Transfer"}/>
                </div>
            </div>
            {/* this will render the children */}
            <Outlet key={location.pathname}/>   
        </div>
    </div>
  }

function HomeIcon(){
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
}

function TransferIcon(){
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
  
}

function TransactionIcon(){
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
}

function P2PIcon(){
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
</svg>

}