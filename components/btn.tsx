import { cls } from "@libs/client/utils";

interface ButtonProps{
    label: string;
    loading?: boolean;
}

export default function Btn({label, loading}:ButtonProps){
    return (
        <div className="mt-5"> 
            <button className={cls("w-full py-[0.4rem] text-lg font-bold text-center  transition-colors  rounded-md shadow-md hover:bg-green-400 hover:text-black", loading ? "bg-green-400 text-black cursor-not-allowed" : "bg-black text-white")}>{label}</button>
        </div>
    );
}