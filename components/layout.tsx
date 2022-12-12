import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import {cls} from "@libs/client/utils"
import 'animate.css';
import { User } from "@prisma/client";
import useSWR from "swr";
import DataLoadingPage from "./dataLoading";

interface ProfileResponse {
  ok: boolean;
  profile: User;
}

interface LayoutProps {
  title?: string;
  canGoBack?: boolean;
  goBackUrl?: string;
  hasTabBar?: boolean;
  children: React.ReactNode;
  seoTitle?: string|null;
}

export default function Layout({
  title,
  canGoBack,
  goBackUrl,
  hasTabBar=false,
  children,
  seoTitle,
}: LayoutProps) {
  const router = useRouter();
  const onClick = () => {
    if( goBackUrl !== null && goBackUrl !== undefined && goBackUrl !== ""){
      router.push(goBackUrl);
    }else{
      router.back();
    }
  };

  // const [user, setUser] = useState<User|null>(null);
  // useEffect(()=>{
  //   if( !["/input/[id]", "/project/[id]/resp/qrcode"].includes(router.pathname) ){
  //     const { user:currUser } = useUser();
  //     setUser(currUser||null);
  //   }
  // }, [router]);
  const {data, error} = useSWR<ProfileResponse>(typeof window === "undefined" ? null : "/api/user/me");
  
  const user = data?.profile;
  
  return (
    <div className={cls("relative h-full bg-white shadow-md rounded-b-md", data ? "" : "pointer-events-none")}> 
      <Head>
        <title>{seoTitle ?? seoTitle}</title>
      </Head>
      <div className={cls("pt-24", hasTabBar ? "overflow-hidden h-screen pb-[6.2rem]" : "")}>
        {children}
      </div>
      <div className="fixed w-full h-[3.2rem] max-w-xl pt-1.5 pl-5 text-2xl text-white bg-black border-t-4 top-0 rounded-t-md border-t-green-400">
        <div className="flex items-center w-full">
          <div className="w-full text-center">Respondent Manager</div>
        </div>
        <div className="absolute pt-1 flex flex-row top-[100%] left-0 w-full pb-2 text-black bg-white border-b-2 border-green-400 shadow-md text-lg">
            {canGoBack ? (
              <button onClick={onClick} className="pl-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
                </svg>
              </button>
            ) : null}
          <div className={cls("w-full text-center text-gray-600 truncate", canGoBack ? "pr-8" : "")}>
            {title ? (
              <span className={cls(canGoBack ? "mx-auto" : "", "")}>{title}</span>
            ) : null}
          </div>
        </div>
      </div>
      { hasTabBar ? (
        <div className="fixed bottom-0 text-sm w-full h-[60px] max-w-xl font-thin text-white bg-black shadow-md rounded-t-md h-sm:hidden">
          <div className="relative flex flex-row mt-2">
            <Link href="/">
              <a className={cls("absolute flex flex-col items-center transition-all hover:text-green-400 left-[8%]", router.pathname == "/" ? "text-green-400" : "")}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
              </svg>
              Active
              </a>
            </Link>
            <Link href="/project">
              <a className={cls("absolute flex flex-col items-center transition-all hover:text-green-400 left-[27%]", router.pathname == "/project" ? "text-green-400" : "")}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
                Projects
              </a>
            </Link>
            <Link href="/search">
              <a className={cls("absolute flex flex-col items-center transition-all hover:text-green-400 right-[27%]", router.pathname == "/search" ? "text-green-400" : "")}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                Search
              </a>
            </Link>
            <Link href="/user">
              <a className={cls("absolute flex flex-col items-center transition-all hover:text-green-400 right-[8%]", router.pathname == "/user" ? "text-green-400" : "")}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
                User
              </a>
            </Link>
          </div>
          { user?.permission && 
            ((["/", "/project", "/project/[id]", "/search"].includes(router.pathname) &&  ["EDIT", "FULL"].includes(user?.permission)) || (["/user"].includes(router.pathname) &&  ["FULL"].includes(user?.permission))) ? (
              <Link href={["/project/[id]"].includes(router.pathname) ? `/project/${router.query.id}/resp?mode=direct` : ["/user"].includes(router.pathname) ? "/user/add" : "/project/add"}>
                <a className="absolute left-[43%] top-[-30%] bg-black rounded-full p-2 hover:text-green-400 flex flex-row items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 sm:w-14 sm:h-14 hover:text-green-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </a>
              </Link>
            ) : null
          }
      </div>
      ) : null }
    </div>
  );
}
