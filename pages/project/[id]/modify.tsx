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
import useSWR from "swr";
import 'animate.css';
import useUser from "@libs/client/useUser";

interface RegisterProjectMutation{
  ok: boolean;
  project: Project;
  error?: string;
}

interface ProjectWithDelete extends Project{
  deleteFlag : boolean;
}

const AddProject: NextPage = ({}) => {
  const router = useRouter();
  const { user } = useUser();
  const [registerProject, {loading, data, error}] = useMutation<RegisterProjectMutation>(`/api/project/${router.query.id}`);
  const { data:projectData } = useSWR(router.query.id ? `/api/project/${router.query.id}` : null);
  const { register, handleSubmit, setValue, setError, formState: { errors }, watch} = useForm<ProjectWithDelete>();
  
  const [ deleteChk, setDeleteChk ] = useState<boolean>(false);
  const [ deletePermission, setDeletePermission ] = useState<boolean>(false);

  const deleteHandle = ()=>{
    setDeleteChk(!deleteChk);
    setValue("deleteFlag", !deleteChk);
  }

  useEffect(()=>{
    setValue("deleteFlag", deleteChk);
  }, []);

  useEffect( ()=>{
      if( user ){
        if( user.permission === "FULL" ){
          setDeletePermission(true);
        }
        if( projectData && projectData.ok ){
          if( user.id === projectData.project.user.id ){
            setDeletePermission(true);
          }
        }
        if( user.permission === "VIEW" ){
          setDeletePermission(false);
        }
      }
    }, [user, projectData])

  const onValid = async ({name, title, opNumber, wbsNumber, group, status, payType, deleteFlag}:ProjectWithDelete) => {
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
    registerProject({name, title, opNumber, wbsNumber, group, status, payType, deleteFlag});
  }

  useEffect(()=>{
    if( projectData ){
        const {name, title, payType, status, opNumber, wbsNumber, group} = projectData?.project;
        setValue("name", name);
        setValue("title", title);
        setValue("opNumber", opNumber);
        setValue("wbsNumber", wbsNumber);
        setValue("group", group);
        setValue("payType", payType);
        setValue("status", status);
    }
  }, [projectData])

  useEffect( ()=>{
    if( data && data.ok ){
        const pid = data?.project?.id;
        if( deleteChk ){
          router.push(`/`);
        }else{
          router.push(`/project/${pid}`);
        }
    }
  }, [data]);


  return (
    <Layout title="Modify project" canGoBack={!loading ? true : false} goBackUrl={`/project/${router.query.id}`} seoTitle="Modify | NielsenIQ OPS">
        <div className="w-full px-5 pb-10 overflow-visible">
          <form onSubmit={handleSubmit(onValid)}>
            <div className="flex flex-row justify-end w-full mt-3">
              { deletePermission ? (
                <div
                onClick={deleteHandle}
                className="flex w-28 flex-row gap-1 text-red-400 py-1 pr-1 justify-center border-[1px] border-red-400 rounded-md transition-all shadow-md cursor-pointer hover:bg-red-400 hover:text-black">
                { !deleteChk ? (
                  <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>DELETE</div>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>CANCLE</div>
                  </>
                ) }
              </div>
              ) : null }
              
            </div>
            { !deleteChk ? (
              <>
                <InputText name="name" type="text" label="Project name" defaultValue={watch("name")} register={register("name")} onSetValue={setValue}/>
                {errors.name ? <Errorset text={errors.name.message}/> : null}
                <InputText name="title" type="text" label="Show title" defaultValue={watch("title")||""} register={register("title")} onSetValue={setValue} required={false} optional={true}/>
                {errors.title ? <Errorset text={errors.title.message}/> : null}
                <InputText name="opNumber" type="text" label="OP-Number" defaultValue={watch("opNumber")||""} register={register("opNumber")} onSetValue={setValue} required={false} optional={true}/>
                {errors.opNumber ? <Errorset text={errors.opNumber.message}/> : null}
                <InputText name="wbsNumber" type="text" label="WBS-Number" defaultValue={watch("wbsNumber")||""} register={register("wbsNumber")} onSetValue={setValue} required={false} optional={true}/>
                {errors.wbsNumber ? <Errorset text={errors.wbsNumber.message}/> : null}
                <InputText name="group" type="text" label="Group" defaultValue={watch("group")||""} register={register("group")} onSetValue={setValue} required={false} optional={true}/>
                {errors.group ? <Errorset text={errors.group.message}/> : null}
                <div className="mt-6">
                  <Dropdown name="payType" defaultValue={watch("payType")} register={register("payType")} setValueFunction={setValue} label={"Payment method"} options={["Account transfer", "Cash"]}/>
                  {errors.payType ? <Errorset text={errors.payType.message}/> : null}
                  <Dropdown name="status" register={register("status")} defaultValue={watch("status")} setValueFunction={setValue} label={"Status"} options={["Active", "Close"]}/>
                  {errors.status ? <Errorset text={errors.status.message}/> : null}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center w-full mt-5 text-center animate__animated animate__bounceIn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-red-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <div className="text-2xl text-red-400">
                  The entered data is also deleted
                </div>
              </div>
            ) }
            <Btn label={loading ? "LOADING" : "SAVE"} loading={loading}/>
          </form>
        </div>
    </Layout>
  );
};


export default AddProject;
