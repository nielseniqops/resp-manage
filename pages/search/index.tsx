import type { NextPage } from "next";
import Layout from "@components/layout";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { User, Project, Respondent } from "@prisma/client"
import { cls } from "@libs/client/utils";
import InputText from "@components/inputText";
import { useForm } from "react-hook-form";
import Btn from "@components/btn";
import useMutation from "@libs/client/useMutation";
import Link from "next/link";
import Errorset from "@components/error";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

interface SearchWithUser extends Project {
    user: User;
    _count: {respondent:number};
}

interface SearchProps {
    ok: boolean;
    projects: SearchWithUser[];
}

interface SearchProps {
    search: string;
}

const ProjectSearch: NextPage = ({}) => {
  const router = useRouter();
  const { register, setValue, handleSubmit, formState:{errors} } = useForm<SearchProps>();
  const [searchRegister, {loading, data, error}] = useMutation<SearchProps>(`/api/project/search`);

  const onValid = async ({search}:SearchProps) => {
    if(loading) return;
    searchRegister({search});
  }

  return (
    <Layout title="Project search" seoTitle="Search | NielsenIQ OPS" hasTabBar={true}>
        <div className="w-full h-full">
            <div className="fixed w-full max-w-xl bg-white top-24">
                <div className="w-full px-5">
                    <form onSubmit={handleSubmit(onValid)}>
                        <div className="flex flex-row items-center gap-2">
                            <div className="w-full">
                                <InputText name="search" type="text" label="search" register={register("search", {
                                    required: {
                                        value: true,
                                        message: "Please enter text"
                                    }
                                })} onSetValue={setValue}/>
                            </div>
                            <div className="w-32 mt-[4px]">
                                <Btn label={loading ? "Loading" : "Search"} loading={loading}/>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="w-full max-w-xl pl-4">{errors.search ? <Errorset text={errors.search.message}/> : null}</div>
            </div>
            <div className="fixed w-full max-w-xl bg-white top-[12rem]">
            <div className="flex flex-row items-center justify-between h-10 pb-3 mt-4 text-xs font-bold text-black shadow-md">
                    <div className="pt-2 text-center w-[50%]">name</div>
                    <div className="w-12 pt-2 text-center">status</div>
                    <div className="w-12 pt-2 text-center">sample</div>
                    <div className="w-24 pt-2 text-center">
                        <div>by</div>
                        <div>date</div>
                    </div>
                </div>
            </div>
            <div className="w-full h-[70%] sm:h-[80%] mt-[9.5rem] mb-28 overflow-y-scroll divide-y">
                { data?.projects ?  data.projects?.map( (project) =>{
                return(
                    <Link href={`/project/${project?.id}`} key={project?.id}>
                        <a className="flex flex-row items-center justify-between transition-all h-14 hover:bg-[#dde7fc]">
                        <div className="w-[50%] font-bold pl-4 text-gray-800 flex flex-col">
                            <div className={cls("text-gray-700 truncate")}>{project?.name}</div>
                            {project?.group !== null ? (<div className="text-[0.5rem] text-gray-500 w-full overflow-hidden whitespace-nowrap overflow-ellipsis">Group {project?.group}</div>) : null}
                        </div>
                        <div className="w-12 text-xs text-center text-gray-500">
                            <div className={cls("m-auto w-6 h-6 flex items-center justify-center shadow-md border-[0.5px] border-white rounded-full text-gray-700", project?.status === "Active" ? "bg-green-400" : "bg-red-400")}>{project?.status.slice(0, 1)}</div>
                        </div>
                        <div className="w-12 overflow-hidden text-sm text-center text-black whitespace-nowrap">{project?._count?.respondent}</div>
                        <div className="flex flex-col w-24 gap-1 pr-6 text-right text-gray-800">
                            <div className="overflow-hidden text-[0.7rem] whitespace-nowrap overflow-ellipsis">{project?.user?.name}</div>
                            <div className="text-[0.5rem]">{project?.createdAt.toString().split("T")[0]}</div>
                        </div>
                        </a>
                    </Link>
                )
                }) : loading ? (
                <div className="w-full max-w-lg text-center m-auto mt-[30%]">
                    <Skeleton circle width={70} height={70}/>
                </div>
                ) : null}
        </div>
    </div>
    </Layout>
  );
};

  
  export default ProjectSearch;
