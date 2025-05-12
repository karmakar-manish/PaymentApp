import ProfileComponent from "./ProfileComponent"

interface AppbarProps {
    // user? : {
    //     name? : string | null,
    // }
    // onSignin: any,
    onSignout: any,
}

export default function Appbar({onSignout}: AppbarProps){
    return <div className="flex justify-between border-b px-4">
        <div className="flex flex-col justify-center font-semibold">QuickPaisa</div>
        <div className="flex mr-20 flex-col justify-center pt-2">
            <ProfileComponent onClick={onSignout}/>  
        </div>
    </div>
}