import Btn from "@components/btn";
import Errorset from "@components/error";
import InputText from "@components/inputText";
import useMutation from "@libs/client/useMutation";
import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import { User } from "@prisma/client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { encodeText } from "@libs/client/utils";
import Head from "next/head";
import 'animate.css';

interface LoginForm{
    email : string;
    password : string;
    confirm: string;
}

interface UserMutation{
    ok: boolean;
    user?: User;
    error?: string;
}

type FlagType = boolean;
type StringType = string;

const Enter: NextPage = () => {
    const {register, handleSubmit, setValue, formState: {errors}, setError, reset, watch} = useForm<LoginForm>();
    const [enter, {loading, data, error}] = useMutation<UserMutation>(`/api/user/enter`);
    const [pw, {loading:pwLoading, data:pwData, error:pwError}] = useMutation<UserMutation>(`/api/user/pwupdate`);
    const [saveEmail, setSaveEmail] = useState<StringType | null>(null);
    const [changePW, setChangePW] = useState<FlagType>(false);
    const [pwUpdate, setPwUpdate] = useState<StringType | null>(null);
    const router = useRouter();

    const [beforeSame, setBeforeSame] = useState<FlagType>(true);
    const [minLenChk, setMinLenChk] = useState<FlagType>(true);
    const [combiChk, setCombiChk] = useState<FlagType>(true);
    const [spaChk, setSpaChk] = useState<FlagType>(true);
    
    const [sameChk, setSameChk] = useState<FlagType>(true);

    const onValid = async ({email,password}:LoginForm)=>{
        if(loading || pwLoading) return;
        if( !changePW ){
            let errorFlag = false;
            if( email === '' || email === undefined || email === null ){
                errorFlag = true;
                setError("email", {message: "Please enter email address"});
            }
            if( password === '' || password === undefined || password === null ){
                errorFlag = true;
                setError("password", {message: "Please enter password"});
            }
            if( errorFlag ) return;
            setSaveEmail(email);
            
            const encodePw = encodeText(password);
            setPwUpdate(encodePw);
            
            enter({email, password: encodePw});
        }else{
            if( !sameChk ){
                pw({email: saveEmail, password: encodeText(password)});
            }else{
                return;
            }
        }
    }
    
    useEffect(()=>{
        if( data && data.ok === false && data.error === "email"){
            return setError("email", {message: "Invalid email address"});
        }
        if( data && data.ok === false && data.error === "password"){
            return setError("password", {message: "Please check your password"});
        }
        if( data && data.ok ){
            if( data.user?.pwChange === false ){
                reset({
                    password: ""
                });
                setChangePW(true);
            }else{
                router.push(`/`);
            }
        }
        if( pwData && pwData.ok ){
            router.push(`/`);
        }
    },[data, pwData]);

    return (
        <>
        <Head>
            <title>LOGIN</title>
        </Head>
        <div className="px-4 mt-10 sm:mt-36 animate__animated animate__backInUp">
            <div className="overflow-hidden bg-[#2d6df6] border rounded-md shadow-xl">
                <div className="w-full py-2 mt-1 overflow-hidden text-4xl font-bold text-center text-white bg-[#2d6df6]">
                    <h3>NielsenIQ</h3>
                </div>
                <div className="bg-white rounded-b-md">
                    <div className="py-2 border-b-2 border-b-[#2d6df6]">
                        <h3 className="flex items-center justify-center text-2xl font-bold text-center">
                            Respondent Manager
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 ml-2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" /></svg>
                        </h3>
                    </div>
                    <div className="px-10 pb-5 mt-10">
                        <form onSubmit={handleSubmit(onValid)}>
                            {/* LOGIN */}
                            {!changePW ? 
                            (<>
                                <InputText name="email" type="text" register={register("email")} label="Email address" onSetValue={setValue}/>
                                {errors.email ? <Errorset text={errors.email.message}/> : null}
                                <InputText name="password" type="password" register={register("password")} label="Password" onSetValue={setValue}/>
                                {errors.password ? <Errorset text={errors.password.message}/> : null}
                                <Btn label={loading? "LOADING" : "LOGIN"} loading={loading}/>
                            </>) : null}
                            
                            {/* Password Change */}
                            {changePW ? 
                            (<>
                                <div className="text-2xl font-bold text-center">Please change password</div>
                                <InputText name="password" type="password" register={register("password", {
                                    onChange: (e)=>{
                                        const curr = e.target.value;
                                        const encodePassword = encodeText(curr);

                                        if( !((pwUpdate ===  encodePassword) || (curr === "" || curr === undefined || curr === null) ) ){
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
                                { !sameChk ? <Btn label={pwLoading? "LOADING" : "CHANGE"} loading={pwLoading}/> : null }
                            </>)
                            : null }
                        </form>
                        <div className="text-xs text-center text-gray-500 mt-14 hidden">
                            <div>Copyright ⓒ 2022 Chan.lee all right reserved.</div>
                            <div>Chan.lee@nielseniq.com</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    );
};


export default Enter;
