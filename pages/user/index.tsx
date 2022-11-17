import type { NextPage } from "next";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import useSWR from "swr";
import { User, Project, Respondent } from "@prisma/client"
import { cls } from "@libs/client/utils";
import Link from "next/link";
import useUser from "@libs/client/useUser";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
import { useState, useEffect } from "react";
import 'animate.css';
import useMutation from "@libs/client/useMutation";
import InputText from "@components/inputText";
import { useForm } from "react-hook-form";
import Btn from "@components/btn";

interface UsersProps{
    ok: boolean;
    users: User[];
}

interface SearchForm{
    search: string;
}

const User: NextPage = ({}) => {
  const { user, isLoading } = useUser();
  const { data } = useSWR<UsersProps>(`/api/user`);
  const { register, watch } = useForm<SearchForm>();
  const [ searchText, setSearchText ] = useState<string>("");
  return (
    <Layout title="User" seoTitle="User | NielsenIQ OPS" hasTabBar={true}>
        <div className="flex flex-col justify-center w-full gap-3 pl-3 mt-1 text-gray-600">
            <div className="flex flex-row items-center gap-2 mb-3 text-lg font-bold -ml-[0.1rem]">
                { isLoading ? (
                    <div>
                        <Skeleton circle width={20} height={20}/>
                    </div>
                ) : (
                    <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    User Information
                    <Link href={`/user/${user?.id}`}>
                        <a className="p-1 px-2 text-sm font-normal text-white transition-colors bg-black rounded-md shadow-md hover:bg-green-400 hover:text-black">
                            EDIT
                        </a>
                    </Link>
                    </>
                ) }
            </div>
            <div className="flex flex-row items-center gap-4 text-center">
                <div className="flex flex-row items-center font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    <div className="ml-2">Email</div>
                </div>
                <div className="flex flex-row">
                    <div>
                        {isLoading ? (
                            <>
                                <Skeleton width={200} count={1}/>
                            </>
                        ) : (
                            <>{user?.email} ({user?.permission})</>
                        ) }
                    </div>
                </div>
            </div>
            <div className="flex flex-row items-center gap-4 text-center">
                <div className="flex flex-row items-center font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                    </svg>
                    <div className="ml-2">Name</div>
                </div>
                <div>
                    {isLoading ? (
                        <>
                            <Skeleton width={100} count={1}/>
                        </>
                    ) : (
                        <>
                            <div className="-ml-1">{user?.name}</div>
                        </>
                    )}</div>
            </div>
            <div className="flex flex-row items-center gap-3 text-center">
                <div className="flex flex-row items-center font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                    </svg>
                    <div className="ml-2">Phone</div>
                </div>
                <div>
                {isLoading ? (
                        <>
                            <Skeleton width={150} count={1}/>
                        </>
                    ) : (
                        <>
                            {user?.phone}
                        </>
                    )}
                </div>
            </div>
        </div>
        <div className="border-t-[1px] border-gray-300 mt-5">
            <div className="flex flex-row items-center gap-2 mt-3 ml-3 text-lg font-bold text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
                User list
            </div>
            <div className="w-full">
                {isLoading || !data?.users ? (
                    <div className="flex items-center justify-center w-full h-full mt-10">
                        <Skeleton circle width={70} height={70}/>
                    </div>
                ) : 
                    user?.permission == "FULL" ?                         
                    (
                        <div className="flex-grow h-screen pb-10">
                            <div className="mb-2 ml-1">
                                <div className="flex flex-row items-center w-full mt-1 ml-2 text-gray-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <input type="text" className="h-8 m-1 text-sm border-gray-700 rounded-md shadow-md focus:outline-none focus:ring-green-400 focus:border-green-400" placeholder="search" {...register("search", {
                                        onChange: (e)=>{
                                            setSearchText(e.target.value);
                                        }
                                    })}/>
                                </div>
                            </div>
                            <div className="overflow-y-scroll h-[30%] sm:h-[45%]">
                                <table className="relative w-full shadow-md sm:table-fixed">
                                        <thead className="text-sm text-gray-600 border-b-2 shadow-md">
                                            <tr>
                                                <th className="sticky top-0 py-2 bg-green-400">email</th>
                                                <th className="sticky top-0 py-2 bg-green-400">name</th>
                                                <th className="sticky top-0 py-2 bg-green-400">phone</th>
                                                <th className="sticky top-0 py-2 bg-green-400">level</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm text-center">
                                            { data?.users.map( (u) => {
                                                if( user.id !== u.id && (u.name.includes(searchText) || (u.phone && u.phone.includes(searchText) || u.email.includes(searchText)) )){
                                                    return (
                                                        <tr className="text-xs text-gray-600 shadow-sm odd:bg-white even:bg-gray-200 hover:bg-green-300" key={u.id}>
                                                            <td className="h-8 px-1 py-1">
                                                                <Link href={`/user/${u.id}`}>
                                                                    <a className="text-blue-500 transition-all hover:text-blue-700">
                                                                        {u.email}
                                                                    </a>
                                                                </Link>
                                                            </td>
                                                            <td className="h-8 px-1 py-1">{u.name}</td>
                                                            <td className="h-8 px-1 py-1">{u.phone}</td>
                                                            <td className="h-8 px-1 py-1">{u.permission}</td>
                                                        </tr>
                                                    )
                                                }
                                            }) }
                                        </tbody>
                                    </table>
                            </div>
                        </div>
                    ) : (
                    <div className="flex flex-col items-center justify-center w-full gap-2 mt-10 text-center text-red-400 animate__animated animate__bounceIn">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                        You do not have permission
                    </div>
                    )
                }
            </div>
        </div>
        <div>
            
        </div>
    </Layout>
  );
};

  
  export default User;
