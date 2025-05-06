import { useNavigate } from "react-router-dom";
import Appbar from "./AppbarComponent";
import axios from "axios";
import { BACKEND_URL } from "../config";


export function AppbarClient(){
    const navigate = useNavigate()

    return <div>
        <Appbar onSignout={async()=>{
            console.log("Signout")
            //remove cookies
            try{
                const res = await axios.post(`${BACKEND_URL}/api/v1/user/logout/clearCookie`, 
                {}, 
                {
                    withCredentials: true
                })

                console.log("res is : ", res.data)
                
                //Navigate user to the signin page
                navigate("/signin")

            }catch(err)
            {
                console.log("Error while logout")
            }

        }}/>
    </div>
}