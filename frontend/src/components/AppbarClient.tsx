import { useNavigate } from "react-router-dom";
import Appbar from "./AppbarComponent";
import axios from "axios";
import { BACKEND_URL } from "../config";


export function AppbarClient(){
    const navigate = useNavigate()

    return <div>
        <Appbar onSignout={async()=>{
            
            //remove cookies
            try{
                await axios.post(`${BACKEND_URL}/api/v1/user/logout/clearCookie`, 
                {}, 
                {
                    withCredentials: true
                })
                
                //Navigate user to the signin page
                navigate("/signin")

            }catch(err)
            {
                console.log("Error while logout")
            }

        }}/>
    </div>
}