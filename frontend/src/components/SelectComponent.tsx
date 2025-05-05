export default function({options, onSelect}: {
    options: {
        key: string,
        value: string,
    }[],
    onSelect: (value: string) => void
}){
    return <div className="mb-4">
         <select onChange={(e)=>{
            onSelect(e.target.value)
         }} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-blue-500 w-full p-2.5">
            {options.map(option => <option key={option.key} value={option.key}>{option.value}</option>)}
         </select>
    </div>
}

/**
    <select>
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="mango">Mango</option>
    </select>
 */