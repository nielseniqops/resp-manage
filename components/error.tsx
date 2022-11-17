import { cls } from "@libs/client/utils";

interface ErrorProps {
    text: string|undefined;
    flag?: boolean;
}

export default function Errorset({text, flag=true}:ErrorProps){
    return (
        <div className={cls("w-full pl-1 mt-1 font-bold transition-all duration-700", flag ? "text-red-400" : "text-green-500")}>
                <div className="flex flex-row w-full gap-2">
                {flag ? (
                    <div>  
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                ) : (
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                )}
                <div>{text}</div>
            </div>
        </div>
    )
}