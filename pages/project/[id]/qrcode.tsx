import type { NextPage } from "next";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import useSWR from "swr";
import { User, Project } from "@prisma/client"
import 'react-loading-skeleton/dist/skeleton.css'
import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "animate.css";

interface ProjectWithUser extends Project{
    user: User;
    _count: {respondent:number};
}

interface ProjectResponse{
    ok: boolean;
    project: ProjectWithUser[]|any;
}

const ProjectDetail: NextPage = ({}) => {
  const router = useRouter();
  const { data } = useSWR<ProjectResponse>(router.query.id ? `/api/project/${router.query.id}` : null);

  useEffect(()=>{
    if( data && data.project == null ){
        router.replace("/404");
    }
  },[data]);

  const [QRCodeValue, setQRCodeValue] = useState<string>("");
  useEffect(()=>{
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
    const inputURL = `${origin}/project/${router.query.id}/resp?mode=once`;
    setQRCodeValue(inputURL);
  }, [router])
  return (
    <Layout title={`${data?.project?.title ? data?.project?.title : data?.project?.name} QRCode`} seoTitle="QRCode | NielsenIQ OPS">
        <div className="h-full py-10">
            <div className="relative flex flex-col items-center h-full mt-10">
                <div className="flex justify-center pt-10">
                    <QRCodeCanvas
                        value={QRCodeValue}
                        size={250}
                        fgColor="rgb(75 85 99)"
                    />
                </div>
                <div className="absolute flex justify-center pt-10 qrcode-set">
                    <QRCodeCanvas
                        value={QRCodeValue}
                        size={250}
                        fgColor="rgb(45 109 246)"
                    />
                </div>
                <div className="w-[300px] qrcode-scan absolute h-1 bg-[#2d6df6] shadow-[#2d6df6] shadow-md"></div>
                <div className="absolute w-20 h-20 border-t-8 border-l-8 qrcode-camera -top-4 left-2 sm:left-28 border-t-[#2d6df6] border-l-[#2d6df6]"></div>
                <div className="absolute w-20 h-20 rotate-90 border-t-8 border-l-8 qrcode-camera -top-4 right-2 sm:right-28 border-t-[#2d6df6] border-l-[#2d6df6]"></div>
                <div className="absolute w-20 h-20 rotate-180 border-t-8 border-l-8 qrcode-camera -bottom-14 right-2 sm:right-28 border-t-[#2d6df6] border-l-[#2d6df6]"></div>
                <div className="absolute w-20 h-20 -rotate-90 border-t-8 border-l-8 qrcode-camera -bottom-14 left-2 sm:left-28 border-t-[#2d6df6] border-l-[#2d6df6]"></div>
            </div>
            <div className="py-2 mt-20 text-2xl font-bold text-center text-[#2d6df6] filter qrcode-camera">
                QR CODE SCAN
            </div>
        </div>
        <style jsx>{`
.qrcode-set{
    overflow: hidden;
    animation: qranimate 4s ease-in-out infinite;
}
@keyframes qranimate
{
    0%,100%
    {
        height: 0;
    }
    50%{
        height : 110%;
    }
}
.qrcode-scan{
    animation: lineanimate 4s ease-in-out infinite;
}
@keyframes lineanimate{
    0%, 100%
    {
        top: 0;
    }
    50%{
        top : 110%;
    }
}
.qrcode-camera{
    animation: lightanimate 0.5s ease-in-out infinite;
}

@keyframes lightanimate {
    0%, 100%{
        opacity: 0;
    }
    50%{
        opacity: 1;
    }
}
`}</style>
    </Layout>
  );
};

  
  export default ProjectDetail;
