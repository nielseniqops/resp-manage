import Btn from "@components/btn";
import Dropdown from "@components/dropDown";
import InputText from "@components/inputText";
import useMutation from "@libs/client/useMutation";
import type { NextPage } from "next";
import { useForm } from "react-hook-form"
import { User } from "@prisma/client";
import { useEffect } from "react";
import Errorset from "@components/error";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import useUser from "@libs/client/useUser";

interface UserAddForm {
    email: string;
    phone: string|null;
    name: string;
    permission: string;
    formErrors: string;
}

interface RegisterUserMutation{
    ok: boolean;
    user: User;
    error?: string;
}

const UserAdd: NextPage = () => {
    const { register, handleSubmit, setValue, setError, formState, watch} = useForm<UserAddForm>({mode: 'onBlur'});
    const { errors } = formState;
    const { user } = useUser();
    const [registerUser, {loading, data, error}] = useMutation<RegisterUserMutation>(`/api/user`);
    const router = useRouter();
    const onVaid = async ({email, phone, name, permission}:UserAddForm) => {
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
        }else{
            const {email, phone} = watch();
            fetch(`/api/user/dupchk`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email, phone}),
            })
            .then((res) => res.json())
            .then((json) => {
                if( json.email ){
                    return setError("email", {message: "This email is already registered"});
                }
                else if ( json.phone ){
                    return setError("phone", {message: "The phone number is already registered"});
                }else{
                    registerUser(watch());
                    router.push("/user");
                }
            })
        }
    }

    useEffect(()=>{
        if( data?.error ){
            return setError("formErrors", {message: "ERROR"});
        }
    }
    ,[data, setError]);

    useEffect(()=>{
        if( user ){
            if( !["FULL"].includes(user.permission) ){
                router.replace("/user");
            }
        }
    }, [user]);

    return (
        <Layout title="User register" seoTitle="User Add | NielsenIQ OPS" canGoBack={true}>
            <div className="px-4 pb-10 mt-5">
                <form onSubmit={handleSubmit(onVaid)}>
                    <InputText name="email" type="text" register={register("email", {
                        pattern: {
                            value : /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
                            message: "Invalid email address"
                        }
                    })} label="Email address" onSetValue={setValue}/>
                    {errors.email ? <Errorset text={errors.email.message}/> : null}  
                    <InputText name="phone" type="number" register={register("phone")} label="Phone number" onSetValue={setValue} optional={true}/>
                    {errors.phone ? <Errorset text={errors.phone.message}/> : null}
                    <InputText name="name" type="text" register={register("name")} label="Name" onSetValue={setValue}/>
                    {errors.name ? <Errorset text={errors.name.message}/> : null}
                    <Dropdown name="permission" register={register("permission")} setValueFunction={setValue} label={"Permission"} options={["EDIT", "VIEW", "FULL"]}/>
                    {errors.permission ? <Errorset text={errors.permission.message}/> : null}
                    <Btn label={loading ? "LOADING" : "REGIST"}/>
                    {errors.formErrors ? <Errorset text={errors.formErrors.message}/> : null}
                </form>
            </div>
        </Layout>
    );
};


export default UserAdd;
