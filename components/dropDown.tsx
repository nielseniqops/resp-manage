import { cls } from "@libs/client/utils";
import { useEffect, useRef, useState } from "react";
import { useForm, UseFormRegisterReturn } from "react-hook-form";

type DropdownValue = string|number;
type FlagType = boolean;

interface DropdownProps{
    name: string;
    required?: boolean;
    label: string;
    register: UseFormRegisterReturn;
    options: (string)[];
    setValueFunction: Function;
    defaultValue?: string|number;
    addionalClass?: string;
    searchFlag?: boolean;
}

export default function Dropdown({name, label, required=false, register, options, setValueFunction, defaultValue, addionalClass, searchFlag=false}:DropdownProps){
    const [dropdownValue, setDropdownValue] = useState<DropdownValue>(defaultValue || '');
    const [openFlag, setOpenFlag] = useState<FlagType>(false);
    const dropDownRef = useRef<any>();

    const optionClick = (name:string, item:any)=>{
        setDropdownValue(item);
        setValueFunction(name, item);
        setOpenFlag(false);
    }

    useEffect(()=>{
        if( defaultValue !== undefined ){
            setDropdownValue(defaultValue);
        }
    }, [defaultValue]);

    useEffect(()=>{
        if( openFlag && searchFlag){
            dropDownRef.current.focus();
        }
    }, [openFlag])

    const [keyUpText, setKeyUpText] = useState<string>('');
    const onKeyUp = (e:any)=>{
        if( searchFlag ){
            setOpenFlag(true);
            setKeyUpText(e.target.value);
        }
    }

    

    return (
        <div className="relative w-full mt-4">
            <div className="w-full cursor-pointer"
                onClick={()=>{setOpenFlag(!openFlag);}}>
                <div
                    className={cls("pt-2 pl-3 w-full h-10 rounded-md shadow-md cursor-pointer border-[1px] border-gray-500 peer", openFlag ? "border-green-400" : "", dropdownValue !== "" ? "border-green-400" : "")}>
                    {dropdownValue}
                </div>
                <input 
                    id={name} 
                    type={"hidden"}
                    autoComplete="off"
                    required={required}
                    className={cls("w-full border-gray-700 rounded-md shadow-md cursor-pointer focus:outline-none focus:ring-green-400 focus:border-green-400 peer", openFlag ? "ring-green-400 border-green-400 outline-none" : "", dropdownValue !== "" ? "outline-none border-green-400 ring-green-400" : "", searchFlag ? "" : "caret-transparent")}
                    defaultValue={defaultValue}
                    {...register}
                    />
                <span className={cls("absolute pointer-events-none transition-all ease-in select-none top-0 left-2 pt-2 text-center", dropdownValue !== "" ? "text-[12px] px-2 pt-0 -top-[0.6rem] bg-green-400 text-black rounded-sm" : "", openFlag ? "text-[12px] px-2 pt-0 -top-[0.6rem] bg-green-400 text-black rounded-sm " : "", !openFlag && dropdownValue == "" ? "text-gray-400" : "")}>{label}</span>
                <div className={cls("absolute top-[20%] cursor-pointer right-2 transition-all", openFlag ? "rotate-90" : "")}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-green-900">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </div>
            </div>
            <div className={cls("absolute z-10 left-0 w-full bg-white border border-gray-700 rounded-md max-h-80 shadow-xl flex flex-col gap-0 top-[120%] overflow-hidden", openFlag ? "" : "hidden")}>
                { searchFlag ? (
                    <input type="text" className="m-2 text-sm border-gray-700 rounded-md shadow-md focus:outline-none focus:ring-green-400 focus:border-green-400" placeholder="검색" onKeyUp={onKeyUp} ref={dropDownRef}/>
                ) : null }
                <div className="w-full h-full overflow-scroll">
                    {options.map( (item, index)=>{
                            if( !searchFlag || ( searchFlag && (item.toUpperCase().includes(keyUpText.replace(/ /g, "")) || item.toUpperCase().includes(keyUpText.replace(/ /g, ""))) ) ){
                                return (<div key={index} className="flex flex-col justify-center h-12 pl-3 font-bold cursor-pointer text-md hover:bg-green-400" onClick={()=>optionClick(name, item)}>{item}</div>)
                            }
                        }
                    )}
                </div>
            </div>
        </div>
    );
}