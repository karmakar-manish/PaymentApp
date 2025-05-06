import ButtonComponent from "./ButtonComponent"

interface AppbarProps {
    // user? : {
    //     name? : string | null,
    // }
    // onSignin: any,
    onSignout: any,
}

export default function Appbar({onSignout}: AppbarProps){
    return <div className="flex justify-between border-b px-4">
        <div className="flex flex-col justify-center font-semibold">PayTm</div>
        <div className="flex flex-col justify-center pt-2">
            <ButtonComponent onClick={onSignout} label={"Logout"}/>
                
        </div>
    </div>
}