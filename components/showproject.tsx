import { cls } from "@libs/client/utils";
import Link from "next/link";
import { User, Project } from "@prisma/client"
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

interface ProjectWithUser{
    user: User;
    id: number
    name: string
    opNumber: string | null
    wbsNumber: string | null
    group: string | null 
    status: string
    userId: number
    payType: string
    createdAt: Date
    updatedAt: Date
    _count: {respondent:number};
  }
  
interface ProjectResponse{
    projects: ProjectWithUser[];
    infScroll?: any;
    setRef?: any;
}

export default function ShowProject({projects, infScroll, setRef}:ProjectResponse){
    return (
    <>
    <div className="fixed w-full max-w-xl bg-white top-[5rem]">
        <div className="flex flex-row items-center justify-between h-10 pb-3 mt-4 text-xs font-bold text-black shadow-md ">
          <div className="pt-2 text-center w-[50%]">name</div>
          <div className="w-12 pt-2 text-center">status</div>
          <div className="w-12 pt-2 text-center">sample</div>
          <div className="w-24 pt-2 text-center">
            <div>by</div>
            <div>date</div>
          </div>
        </div>
      </div>
      <div className="w-full h-full mt-10 mb-20 overflow-y-scroll divide-y" onScroll={infScroll} ref={setRef}>
        { projects ?  projects.map( (project) =>{
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
        }) : (
          <div className="flex flex-row items-center justify-center mt-20">
              <Skeleton circle width={70} height={70}/>
          </div>
        )}
      </div>
    </>
    );
}