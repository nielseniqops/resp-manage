import type { NextPage } from "next";
import Layout from "@components/layout";
import InputText from "@components/inputText";
import { useForm } from "react-hook-form";
import Dropdown from "@components/dropDown";
import Btn from "@components/btn";
import Errorset from "@components/error";
import { Project } from "@prisma/client";
import useMutation from "@libs/client/useMutation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface RegisterProjectMutation{
  ok: boolean;
  project: Project;
  error?: string;
}

const AddProject: NextPage = ({}) => {
  const { register, handleSubmit, setValue, setError, formState: { errors }, watch} = useForm<Project>();
  const [registerProject, {loading, data, error}] = useMutation<RegisterProjectMutation>(`/api/project`);
  const router = useRouter();
  const onValid = async ({name, title, opNumber, wbsNumber, group, payType}:Project) => {
    if(loading) return;
    let errFlag = false;
    
    if( name === "" || name === undefined || name === null ){
        setError("name", {message: "Please enter project name"});
        errFlag = true;
    }

    if( payType === "" || payType === undefined || payType === null ){
      setError("payType", {message: "Please select payment method"});
      errFlag = true;
    }

    if( errFlag ) return;
    registerProject({name, title, opNumber, wbsNumber, group, payType});
  }

  useEffect( ()=>{
    if( data && data.ok ){
        const pid = data?.project?.id;
        router.push(`/project/${pid}`);
    }
  }, [data]);

  return (
    <Layout title="New project" canGoBack={true} goBackUrl={`/`} seoTitle="New project | NielsenIQ OPS">
        <div className="w-full px-5 pb-10 overflow-visible">
          <form onSubmit={handleSubmit(onValid)}>
            <InputText name="name" type="text" label="Project name" register={register("name")} onSetValue={setValue}/>
            {errors.name ? <Errorset text={errors.name.message}/> : null}
            <InputText name="title" type="text" label="Show title" register={register("title")} onSetValue={setValue} required={false} optional={true}/>
            {errors.title ? <Errorset text={errors.title.message}/> : null}
            <InputText name="opNumber" type="text" label="OP-Number" register={register("opNumber")} onSetValue={setValue} required={false} optional={true}/>
            {errors.opNumber ? <Errorset text={errors.opNumber.message}/> : null}
            <InputText name="wbsNumber" type="text" label="WBS-Number" register={register("wbsNumber")} onSetValue={setValue} required={false} optional={true}/>
            {errors.wbsNumber ? <Errorset text={errors.wbsNumber.message}/> : null}
            <InputText name="group" type="text" label="Group" register={register("group")} onSetValue={setValue} required={false} optional={true}/>
            {errors.group ? <Errorset text={errors.group.message}/> : null}
            <div className="mt-6">
              <Dropdown name="payType" register={register("payType")} setValueFunction={setValue} label={"Payment method"} options={["Account transfer", "Cash"]}/>
              {errors.payType ? <Errorset text={errors.payType.message}/> : null}
            </div>
            <Btn label={loading ? "LOADING" : "CREATE"} loading={loading}/>
          </form>
        </div>
    </Layout>
  );
};


export default AddProject;
