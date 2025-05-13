import ProfileComponent from "./ProfileComponent"

interface AppbarProps {
    // user? : {
    //     name? : string | null,
    // }
    // onSignin: any,
    onSignout: any,
}

export default function Appbar({onSignout}: AppbarProps){
    return <div className="flex justify-between px-4 bg-[#112D4E]">
            <div className="flex flex-col justify-center font-serif text-white text-2xl ml-5">QuickPaisa</div>
        <div className="flex mr-20 flex-col justify-center pt-2">
            <ProfileComponent onClick={onSignout}/>  
        </div>
    </div>
}