import ButtonComponent from "./ButtonComponent"
import SelectComponent from "./SelectComponent"
import TextInputComponent from "./TextInputComponent"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { BACKEND_URL } from "../confit"

const SUPPORTED_BANKS = [{
    name: "HDFC Bank",
    redirectURL: "https://netbanking.hdfcbank.com"
}, {
    name: "Axis Bank",
    redirectURL: "https://www.axisbank.com"
}]

export function AddMoney(){
    const [, setRedirectURL] = useState(SUPPORTED_BANKS[0]?.redirectURL)
    const [amount, setAmount] = useState("")
    const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name)
    const navigate = useNavigate()

    return <div className="border p-6 rounded-xl bg-[#ededed]">
        <div className="text-xl border-b pb-2">Add Money</div>
        <div>
            <TextInputComponent label="Amount" placeholder="Amount" onChange={(e)=>{
                setAmount(e)
            }}/>
            <div className="py-4 text-left">
                Bank
            </div>
            <SelectComponent onSelect={(value) => {
                setRedirectURL(SUPPORTED_BANKS.find(x=>x.name === value)?.redirectURL || "")
                setProvider(SUPPORTED_BANKS.find(x=>x.name===value)?.name || "")
            }} options={SUPPORTED_BANKS.map(x => ({
                key: x.name,
                value: x.name
            }))}
            />
            <div className="text-center">
                <ButtonComponent onClick={async ()=>{
                    axios.post(`${BACKEND_URL}/api/v1/user/transfer/createOnRamptxn`, {
                        amount: amount,
                        provider: provider
                    }, {
                        withCredentials: true
                    })
                    navigate("/transfer", { replace: true })
                }} label={"Add Money"}/>
            </div>
           

        </div>
    </div>
}