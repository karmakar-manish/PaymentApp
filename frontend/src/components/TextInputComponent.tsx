export default function({
    placeholder,
    onChange,
    label,
    type = "text",
    readOnly = false
}: {
    placeholder: string,
    onChange: (value: string) => void,
    label: string,
    type?: string,
    readOnly?: boolean
}){
    return <div className="w-full">
        <div className="mb-2 text-sm font-medium text-gray-900">{label}</div>
        <input readOnly={readOnly} type={type} placeholder={placeholder}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm block rounded-lg focus:border-blue-500 w-full p-2.5 mb-2"
        onChange={(e)=>{
            onChange(e.target.value)
        }}/>
    </div>
}