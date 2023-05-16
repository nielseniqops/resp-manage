import { cls } from "@libs/client/utils";

interface ButtonProps{
    label: string;
    loading?: boolean;
}

export default function Btn({label, loading}:ButtonProps){
    return (
        <div className="mt-5"> 
            <button className={cls("w-full py-[0.4rem] text-lg font-bold text-center transition-colors border-[1px] border-gray-500 rounded-md shadow-md hover:bg-[#2d6df6] hover:border-[#2d6df6] hover:text-white ring-0 outline-none focus:ring-1 focus:ring-[#2d6df6]", loading ? "bg-[#2d6df6] text-white cursor-not-allowed" : "")}>{label}</button>
        </div>
    );
}