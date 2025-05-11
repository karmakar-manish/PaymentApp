import TextInputComponent from "./TextInputComponent";
import { useState } from "react"
import {auth, provider} from "../firebase"
import { signInWithPopup } from "firebase/auth";
import axios from "axios";
import googleImg from "../assets/google.png"
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";


export default function (){
    const [number, setNumber] = useState("");
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [error, setError] = useState("");
    const navigate = useNavigate()

    return <div className="mt-5">

        <TextInputComponent placeholder="manish" type="text" label="Username" onChange={(e)=>setUsername(e)}/>
        <TextInputComponent placeholder="1234567890" label="Phone" onChange={(e)=>setNumber(e)}/>
        <TextInputComponent placeholder="******" type="Password" label="Password" onChange={(e)=>setPassword(e)}/>

        <button className="cursor-pointer text-white bg-green-800 hover:bg-green-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-md px-5 py-2.5 me-2 mb-2 mt-2 w-full" onClick={async(e)=>{
            e.preventDefault()

            try{
                await axios.post(`${BACKEND_URL}/api/v1/signupRoute/phonePassword`, {
                    number, 
                    password,
                    username
                }, {
                    withCredentials: true
                })

                //navigate to dashboard
                navigate("/dashboard")

            }catch(err){
                console.log("Error: ", err)
                setError("Invalid credentials. Please try again!")
            }

        }}>Sign up</button>

        {error && (
            <p className="text-red-500 text-sm text-center">{error} </p>
        )}
        
        <div className="text-slate-500 flex items-center">
            <div className="bg-gray-400 h-px flex-grow"></div>
            <div className="mx-2">or</div>
            <div className="bg-gray-400 h-px flex-grow"></div>
        </div>

        <button className="cursor-pointer text-gray-700
         bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 font-bold rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-2 w-full border border-[#585555f0]" onClick={async(e)=>{
            e.preventDefault()
            signInWithPopup(auth, provider)
                .then(async(res)=>{
                    try{
                        await axios.post(`${BACKEND_URL}/api/v1/signupRoute/providerSignup`, {
                            uid: res.user.uid,
                            email: res.user.email,
                            displayName: res.user.displayName
                        }, {
                            withCredentials: true
                        })
                        
                    }catch(err){
                        console.log("Error from signupcomponent: ", err)
                        // auto signin the user since account is already taken
                        await axios.post(`${BACKEND_URL}/api/v1/signinRoute/providerLogin`, {
                            uid: res.user.uid,
                            email: res.user.email,
                            displayName: res.user.displayName
                        }, {
                            withCredentials: true
                        })
                    }
                    //navigate to dashboard
                    navigate("/dashboard")
                })
                .catch(err=>{
                    console.log("error : ", err)
                })
         }}>
            <div className="flex justify-center">
                <img src={googleImg} alt="google_img" className="w-5 h-5 mr-2"/>
                <span>Continue with Google</span>
            </div>
        </button>
        <div className="flex justify-center text-sm font-semibold">
            <p className="mr-2 text-slate-700">Already have an account? </p>
            <button className="text-blue-600 underline cursor-pointer" onClick={()=>{navigate("/signin")}}>Signin</button>
        </div>
    </div>
}