import Btn from "@components/btn";
import Dropdown from "@components/dropDown";
import InputText from "@components/inputText";
import useMutation from "@libs/client/useMutation";
import type { NextPage } from "next";
import { useForm } from "react-hook-form"
import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import Errorset from "@components/error";
import Layout from "@components/layout";
import useSWR from "swr";
import { useRouter } from "next/router";
import useUser from "@libs/client/useUser";
import { encodeText } from "@libs/client/utils";
import "animate.css";
import { NextRequest, NextFetchEvent, userAgent } from "next/server";

interface UserAddForm {
    email: string;
    phone: string|null;
    name: string;
    password: string;
    confirm: string;
    pwChange: boolean;
    permission: string;
    formErrors: string;
}

interface ProfileProps{
    ok: boolean;
    user: User;
    emailFlag: boolean;
    phoneFlag: boolean;
    error?: string;
}

const UserModified: NextPage = () => {
    const { register, handleSubmit, setValue, setError, formState, watch} = useForm<UserAddForm>({mode: 'onBlur'});
    const { errors } = formState;
    const router = useRouter();
    const { user } = useUser();
    const [registerUser, {loading, data, error}] = useMutation<ProfileProps>(`/api/user/${router.query.id}`);

    const { data:userData } = useSWR<ProfileProps>(router.query.id ? `/api/user/${router.query.id}` : null);
    
    const [pwChange, setPwChange] = useState<boolean>(false);
    const [beforeSame, setBeforeSame] = useState<boolean>(true);
    const [minLenChk, setMinLenChk] = useState<boolean>(true);
    const [combiChk, setCombiChk] = useState<boolean>(true);
    const [spaChk, setSpaChk] = useState<boolean>(true);
    
    const [sameChk, setSameChk] = useState<boolean>(true);


    useEffect(()=>{
        if( userData && userData.ok ){
            if( userData.user === null  ){
                router.replace("/404");
            }else{
                setValue("email", userData?.user.email);
                setValue("phone", userData?.user.phone);
                setValue("name", userData?.user.name);
                setValue("permission", userData?.user.permission);
            }
        }
    }, [userData]);
    
    const onVaid = async ({email, phone, name, permission, password}:UserAddForm) => {
        if(loading) return;
        let errFlag = false;
        if( email === "" ){
            setError("email", {message: "Please enter email address"});
            errFlag = true;
        }
        if( name === "" ){
            setError("name", {message: "Please enter name"});
            errFlag = true;
        }
        if( permission === "" ){
            setError("permission", {message: "Please select permission"});
            errFlag = true;
        }
        if( errFlag ){
            return
        }
        if( pwChange ){
            if( user?.id === Number(router.query.id) ){
                registerUser({email, phone, name, permission, password:encodeText(password), pwChange: true});
            }else{
                registerUser({email, phone, name, permission, password:encodeText("password123@"), pwChange: false});
            }
        }else{
            registerUser({email, phone, name, permission});
        }
    }

    useEffect(()=>{
        if( user ){
            if( user.id.toString() !== router.query.id ){
                if( !["FULL"].includes(user.permission) ){
                    router.replace("/user");
                }
            }
        }
    }, [user]);

    useEffect(()=>{
        if( data && data.ok == false ){
            if( data.emailFlag ){
                return setError("email", {message: "email is duplicated"});
            }
            if( data.phoneFlag ){
                return setError("phone", {message: "phone number is duplicated"});
            }
        }

        if( data && data.ok ){
            router.push("/user");
        }
    }
    ,[data]);

    return (
        <Layout title="User update" seoTitle="User Add | NielsenIQ OPS" canGoBack={true}>
            <div className="px-4 pb-10 mt-5">
                <div className="flex justify-end w-full text-xs">
                    <div 
                        onClick={()=>{setPwChange(!pwChange)}}
                        className="p-1 px-2 text-white transition-colors bg-black rounded-md shadow-md cursor-pointer hover:bg-green-400 hover:text-black">
                        {pwChange ? "Cancle" : (user?.id === Number(router.query.id)) ? "Password Change" : "Password reset"}
                    </div>
                </div>
                <form onSubmit={handleSubmit(onVaid)}>
                    <InputText name="email" type="text" register={register("email", {
                        pattern: {
                            value : /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
                            message: "Invalid email address"
                        }
                    })} label="Email address" onSetValue={setValue} defaultValue={watch("email")}/>
                    {errors.email ? <Errorset text={errors.email.message}/> : null}  
                    <InputText name="phone" type="number" register={register("phone")} label="Phone number" onSetValue={setValue} optional={true} defaultValue={watch("phone") || ''}/>
                    {errors.phone ? <Errorset text={errors.phone.message}/> : null}
                    <InputText name="name" type="text" register={register("name")} label="Name" onSetValue={setValue} defaultValue={watch("name")}/>
                    {errors.name ? <Errorset text={errors.name.message}/> : null}
                    { user && (["FULL"].includes(user?.permission)) ? (
                        <>
                            <Dropdown name="permission" register={register("permission")} setValueFunction={setValue} label={"Permission"} options={["EDIT", "VIEW", "FULL"]} defaultValue={watch("permission")}/>
                            {errors.permission ? <Errorset text={errors.permission.message}/> : null}
                        </>
                    ) : null}
                    { pwChange && (user?.id === Number(router.query.id)) ? (
                        <div className="mt-10 mb-10">
                            <InputText name="password" type="password" register={register("password", {
                                onChange: (e)=>{
                                    const curr = e.target.value;
                                    const encodePassword = encodeText(curr);
                                    
                                    if( !((userData?.user.password ===  encodePassword) || (curr === "" || curr === undefined || curr === null) ) ){
                                        setBeforeSame(false);
                                    }else{ setBeforeSame(true) }

                                    if( curr.length >= 5 ){
                                        setMinLenChk(false);
                                    }else{ setMinLenChk(true); }

                                    if( /[a-z]/g.test(curr) && /[0-9]/g.test(curr) ){
                                        setCombiChk(false);
                                    }else{ setCombiChk(true); }

                                    if( /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g.test(curr) ){
                                        setSpaChk(false);
                                    }else{ setSpaChk(true); }
                                    
                                    setSameChk(true);
                                    
                                }
                            })} label="Password change" onSetValue={setValue}/>
                            <div className="flex flex-col gap-2 pl-1 mt-3 font-bold">
                                <Errorset text={"Enter different password than previous password"} flag={beforeSame}/>
                                <Errorset text={"Enter at least 5 characters"} flag={minLenChk}/>
                                <Errorset text={"Enter English/Number Combination"} flag={combiChk}/>
                                <Errorset text={"Enter at least one special character"} flag={spaChk}/>
                            </div>
                                { !beforeSame && !minLenChk && !combiChk && !spaChk ?
                                (
                                <>
                                <InputText name="confirm" type="password" register={register("confirm", {
                                    onChange: (e)=>{
                                        const {password} = watch();
                                        const confirm = e.target.value;
                                        
                                        if( password === confirm ){
                                            setSameChk(false);
                                        }else{ setSameChk(true); }
                                    }
                                })} label="Confirm" onSetValue={setValue}/>
                                <div className="flex flex-col gap-2 pl-1 mt-3 font-bold">
                                    <Errorset text={"Please enter the same password"} flag={sameChk}/>
                                </div>
                                </>
                                ) : null}
                                </div>) 
                                : null }
                    { pwChange && user && ((user?.id !== Number(router.query.id)) && (["FULL"].includes(user?.permission))) ? (
                        <div className="flex flex-col items-center justify-center w-full mt-5 text-red-400 animate__animated animate__bounceIn">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                            </svg>
                            <div className="text-lg text-center">The password is changed to the default password</div>
                            <div className="text-center">( password123@ )</div>
                        </div>
                    ) : null }
                    { !pwChange || ( pwChange && !beforeSame && !minLenChk && !combiChk && !spaChk && !sameChk) || (user?.id !== Number(router.query.id))? <Btn label={loading ? "LOADING" : "SAVE"}/> : null }
                </form>
            </div>
        </Layout>
    );
};


export default UserModified;
