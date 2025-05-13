import ButtonComponent from "./ButtonComponent";
import TextInputComponent from "./TextInputComponent";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";

export default function(){
    const [number, setNumber] = useState(0)
    const [amount, setAmount] = useState(0)
    const navigate = useNavigate()

    return  <div className="">
                <div className=" p-10 bg-[#e6e6e6] h-80  rounded-lg shadow-xl border border-slate-400 ">
                    <div className="border-b border-slate-300 text-xl pb-2 mb-2">
                        Send
                    </div >
                    <div className="">
                        <TextInputComponent label="Number" placeholder="1234567890" onChange={(e)=>{
                            setNumber(Number(e))            
                        }}/>
                        <TextInputComponent label="Amount" placeholder="1000" onChange={(e)=>{
                            setAmount(Number(e)*100)            
                        }}/>
                        <div className="text-center mt-4">
                            <ButtonComponent onClick={async()=>{
                                try{
                                    await axios.post(`${BACKEND_URL}/api/v1/user/p2pTransfer/transfer`,{
                                        receiverNum: number,
                                        amount: amount
                                    }, {
                                        withCredentials: true   //for cookie
                                    })
                                   
                                    navigate("/p2ptransfer")    //navigate to the same page
                                }catch(err)
                                {
                                    console.log("error from sendCard: ", err)
                                }
                               
                            }} label="Submit"/>
                        </div>
                    </div>
                </div>
            </div>
    
}