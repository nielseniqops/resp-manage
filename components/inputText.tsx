import { cls } from "@libs/client/utils";
import { useEffect, useRef, useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface InputTextProps {
    name: string;
    type: string;
    label: string;
    required?: boolean;
    register: UseFormRegisterReturn;
    optional?: boolean;
    onSetValue: Function;
    defaultValue?: string|number|undefined;
}

export default function InputText({
    name,
    type,
    label,
    required=false,
    register,
    optional=false,
    onSetValue,
    defaultValue
}:InputTextProps){
    const [requiredBool, setRequiredBool] = useState<boolean>(false);
    const requiredOnchange = (event:any)=>{
        if( event.target.value !== null && event.target.value !== undefined && event.target.value !== ""){
            setRequiredBool(true);
            onSetValue(name, event.target.value);
        }else{
            setRequiredBool(false);
            onSetValue(name, undefined);
        }
    }
    
    useEffect(()=>{
        if( defaultValue !== undefined && defaultValue !== null && defaultValue !== ""){
            setRequiredBool(true);
        }
    }, [defaultValue]);

    return(
        <div className="relative mt-6">
            <input 
                id={name}
                required={required}
                type={type}
                autoComplete={type === "password" ? "false" : "true"}
                name={register.name}
                ref={register.ref}
                onBlur={register.onBlur}
                defaultValue={defaultValue}
                onChange={(e)=>{register.onChange(e);requiredOnchange(e);}}
                className={cls("w-full border-gray-700 rounded-md shadow-md focus:outline-none focus:ring-green-400 focus:border-green-400 peer", requiredBool ? "outline-none ring-green-400 border-green-400" : "")}/>
            <span className={cls("absolute pointer-events-none transition-all ease-in select-none left-2 pt-2 text-center peer-focus:text-[12px] peer-focus:px-2 peer-focus:pt-0 peer-focus:-top-[0.6rem] peer-focus:bg-green-400 peer-focus:text-black peer-focus:rounded-sm", requiredBool ? "text-[12px] px-2 pt-0 -top-[0.6rem] bg-green-400 text-black rounded-sm" : "text-gray-400")}>{label}</span>
            {optional ? (<span className="absolute top-[-45%] right-0 text-xs text-red-500 font-thin italic">* optional</span>) : null}
        </div>
    );

}