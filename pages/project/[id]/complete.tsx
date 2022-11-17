import type { NextPage } from "next";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import useSWR from "swr";
import 'animate.css';
import Link from "next/link";

const InputComplete: NextPage = ({}) => {
  const router = useRouter();
  const { data } = useSWR(router.query.id ? `/api/project/${router.query.id}` : null);

  return (
    <Layout title={data?.project?.name} seoTitle="Input | NielsenIQ OPS">
        { data && data.project.status === "Active" ? (
        <div className="w-full h-screen">
            <div className="flex flex-col gap-1 items-center justify-start mt-16 animate__animated animate__bounceIn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-red-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div  className="text-red-400 text-2xl">
                    입력 완료
                </div>
                <div className="mt-10">
                    <div 
                        onClick={()=>{router.back()}}
                        className="text-lg flex flex-row gap-3 items-center bg-black text-white w-32 justify-center py-1 rounded-md shadow-md hover:bg-green-400 hover:text-black transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                        </svg>
                        BACK
                    </div>
                </div>
            </div>
        </div>
        ) : (data && data.project.status === "Close") && 
            <div className="flex flex-col items-center justify-center w-full px-5 pb-10">
                <div className="mt-5 text-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-14 h-14">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                </div>
                <div className="mt-5 text-2xl font-bold text-red-400">CLOSE PROJECT</div>
            </div>
        }
    </Layout>
  );
};


export default InputComplete;
