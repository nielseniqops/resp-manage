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
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import JSZipUtils from "@libs/client/JSZipUtils";

interface ProjectWithUser extends Project{
    user: User;
    _count: {respondent:number};
}

interface ProjectResponse{
    ok: boolean;
    project: ProjectWithUser[]|any;
}

interface RespDataResponse{
    ok: boolean;
    respondent: Respondent[];
} 

const ProjectDetail: NextPage = ({}) => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const { data } = useSWR<ProjectResponse>(router.query.id ? `/api/project/${router.query.id}` : null);

  const [projectInfo, setProjectInfo] = useState<string|null>(null);

  const { data:respData } = useSWR<RespDataResponse>(router.query.id ? `/api/project/${router.query.id}/resp` : null);
  
  const [searchText, setSearchText] = useState<string>("");

  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
  const inputURL = `${origin}/project/${router.query.id}/resp?mode=ableback`;
  const [urlCopy, setUrlCopy] = useState<boolean>(false);

  const onceURL = `${origin}/project/${router.query.id}/resp?mode=once`;
  const [onceUrlCopy, setOnceUrlCopy] = useState<boolean>(false);

  const handleCopyClipBoard = async (text: string, handle: Function) => {
    handle(false);
    try {
      await navigator.clipboard.writeText(text);  
      handle(true);
      setTimeout(()=>{
        handle(false);
      }, 3000);
      
    } catch (error) {
        handle(false);
    }
  };


  useEffect(()=>{
    if( data && data.project == null ){
        router.push('/404');
    }else{
        if(data && data.ok && data.project !== null){
            const {title, payType, opNumber, wbsNumber} = data?.project;
            const joinText = [title, payType, opNumber, wbsNumber].filter((item)=> item !== undefined && item !== null && item !== "");
            setProjectInfo(joinText.join(" / "));
        }
    }
  },[data]);

  const [showDownload, setShowDownload] = useState<boolean>(true);
  const [downLoading, setDownLoading] = useState<boolean>(false);

  const s2ab = (s:any)=>{ 
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf);  //create uint8array as viewer
    for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;    
}

  // excel
  const downLoadExcel = async (jsonData:any)=>{
    let exportJson = jsonData.map((item:any)=>{
        return {
            respID : item.id,
            projectName : item.project.name,
            projectOP : item.project.opNumber,
            projectWBS : item.project.wbsNumber,
            group: item.project.group,
            respName : item.name,
            respPhone : `'${item.phone}`,
            agree : item.otherProjectAgree,
            birthDay : `${item.birthday}`,
            residentNumber : `${item.residentNumber}`,
            payMathod : item.todayPay ? "Cash" : "Account transfer",
            bankName : item.bankName,
            bankNumber : item.bankNumber,
            address: item.address,
            addressDetail : item.addressDetail,
            zoneCode : `${item.zonecode}`,
            sign: item.sign,
            pay: item.pay,
            createdAt: item.createdAt
        }
    });
    
    // const wb = XLSX.utils.book_new();
    // const workSheet = XLSX.utils.json_to_sheet(exportJson);
    // XLSX.utils.book_append_sheet(wb, workSheet, "Respondent");
    // const wbout = XLSX.write(wb, {bookType: "xls",  type: "binary"});
    
    // const excelFileName = `${data?.project?.name}${data?.project?.group !== null ? `_Group${data?.project?.group}` : ""}_Respondents_Data.xls`;

    // saveAs(new Blob([s2ab(wbout)],{type:"application/xls"}), excelFileName);
    // setDownLoading(false);

    // Convert JSON to CSV
    const csvContent: string = exportJson.reduce((csv: string, row: any) => {
        const values = Object.values(row).map((value) =>
            typeof value === "string" && value.includes(",") ? `"${value}"` : value
        );
        csv += values.join(",") + "\n";
        return csv;
    }, Object.keys(exportJson[0]).join(",") + "\n"); // Add headers

    const csvFileName: string = `${jsonData?.[0]?.project?.name}${jsonData?.[0]?.project?.group !== null ? `_Group${jsonData?.[0]?.project?.group}` : ""}_Respondents_Data.csv`;

    // Add UTF-8 BOM to prevent encoding issues
    const BOM = "\uFEFF"; // UTF-8 BOM
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });

    // Create and download CSV file
    saveAs(blob, csvFileName);
    setDownLoading(false);
  }


  const urlToPromise = (seturl:any) => {
    return new Promise<any>(function(resolve, reject) {
         JSZipUtils.getBinaryContent(seturl, (err:any, data:any) => {
              if(err) {
                   reject(err);
              } else {
                   resolve(data);
              }
         });
    });
}

  // sign
  const signZip = async ()=>{
    const zip = new JSZip();
    respData?.respondent.map((resp)=>{
        zip.file(`${data?.project?.name.replace(" ","_")}${data?.project?.group !== null ? `_Group${data?.project?.group}` : ""}_${resp.name}_${resp.id}_sign.png`, urlToPromise(resp.sign), {binary: true});
    });

    //console.log(zip);
    zip.generateAsync({type:"blob"}).then((content)=>{
        saveAs(content, `${data?.project?.name}${data?.project?.group !== null ? `_Group${data?.project?.group}` : ""}_signs.zip`);
    });
    setDownLoading(false);
  };

  
  return (
    <Layout title="Project Detail" seoTitle="Detail | NielsenIQ OPS" hasTabBar={true}>
        { downLoading ? (
            <>
            <div className="fixed top-0 left-0 z-[100] w-full h-full bg-gray-500 opacity-40 cursor-wait">
            </div>
            <div className="fixed top-0 left-0 z-[100] w-full h-full flex flex-col items-center justify-center cursor-wait">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-20 h-20 animate-bounce">
                    <path fillRule="evenodd" d="M19.5 21a3 3 0 003-3V9a3 3 0 00-3-3h-5.379a.75.75 0 01-.53-.22L11.47 3.66A2.25 2.25 0 009.879 3H4.5a3 3 0 00-3 3v12a3 3 0 003 3h15zm-6.75-10.5a.75.75 0 00-1.5 0v4.19l-1.72-1.72a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l3-3a.75.75 0 10-1.06-1.06l-1.72 1.72V10.5z" clipRule="evenodd" />
                </svg>
            </div>
            </>
        ) : null }
        <div className="flex flex-row items-center justify-between w-full px-5 pb-5 mt-2">
            <div className="text-lg text-black">
                <div className="w-full">
                    {data ? (<div>{data?.project?.name}{data?.project?.group !== null ? (<span className="text-[0.5rem] text-gray-500"> (Group {data?.project?.group})</span>) : null}</div>) : <Skeleton width={200} count={1}/>}
                </div>
                <p className="text-xs text-gray-500">{data ? projectInfo : <Skeleton width={40} count={1}/>}</p>
            </div>
            <div className="mt-[-5px]">
                    {data ? <>
                        <p className={cls("flex items-center justify-center text-xs text-center w-12 py-[1.5px] shadow-md border-[0.5px] border-white rounded-lg text-gray-700", data?.project?.status === "Active" ? "bg-green-400" : "bg-red-400")}>
                            {data?.project?.status}
                        </p>
                        </>
                     : <Skeleton width={70} count={1}/>}
            </div>
        </div>
        { router.query.id && user?.permission && ["FULL", "EDIT"].includes(user.permission) ? 
            data ? (<div className="w-full px-2 pl-3 mb-2 text-sm">
                <div className="flex flex-row items-center text-black text-md">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    Input link
                    <Link href={`/project/${router.query.id}/qrcode`} target="_blank">
                        <a target="_blank" className="flex flex-col items-center justify-center w-12 py-1 ml-2 text-sm transition-all bg-[#dde7fc] rounded-md shadow-md cursor-pointer hover:bg-[#2d6df6] hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                            </svg>
                        </a>
                    </Link>
                </div>
                <div className="flex flex-col gap-1 pl-1 mt-2">
                    <div onClick={()=>{
                        handleCopyClipBoard(inputURL, setUrlCopy);
                    }} className="flex flex-col items-center justify-center w-12 text-xs transition-all bg-[#dde7fc] rounded-md shadow-md cursor-pointer hover:bg-[#2d6df6] hover:text-white">
                        {urlCopy ? (
                            <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 animate__animated animate__bounceIn">                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            </>
                        ) : "repeat"}
                    </div>
                    <Link href={`/project/${router.query.id}/resp?mode=ableback`} target="_blank">
                        <a target="_blank" className="text-blue-400 text-[11px]">
                            {inputURL}
                        </a>
                    </Link>
                </div>
                <div className="flex flex-col gap-1 pl-1 mt-2">
                    <div onClick={()=>{
                        handleCopyClipBoard(onceURL, setOnceUrlCopy);
                    }} className="flex flex-col items-center justify-center w-12 text-xs transition-all bg-[#dde7fc] rounded-md shadow-md cursor-pointer hover:bg-[#2d6df6] hover:text-white">
                        {onceUrlCopy ? (
                            <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 animate__animated animate__bounceIn">                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            </>
                        ) : "once"}
                    </div>
                    <Link href={`/project/${router.query.id}/resp?mode=once`} target="_blank">
                        <a target="_blank" className="text-blue-400 text-[11px]">
                            {onceURL}
                        </a>
                    </Link>
                </div>
            </div>) : null
         : null}
        <div className="flex flex-row items-end justify-between w-full px-3 mb-3 text-gray-700">
            <div className="flex flex-row items-center gap-1">
                {data ? (
                    <>
                        <div className="flex flex-row gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" /></svg>
                            Respondents
                        </div>
                    </>
                ) : <Skeleton width={150} count={4}/>} {data?.project?._count?.respondent >= 1 && (<div className="text-xs text-gray-700">(Total : {data?.project?._count?.respondent}&apos;s)</div>) }
            </div>
            <div className="flex flex-col items-end justify-end gap-1">
            {data ? 
                <>
                { user?.permission && ["FULL", "EDIT"].includes(user.permission) ? (
                    <>
                        <Link href={`/project/${router.query.id}/modify`}>
                            <a className="w-[7rem] flex flex-row items-center justify-end gap-2 px-3 text-xs text-center transition-all bg-[#dde7fc] rounded-md shadow-md hover:bg-[#2d6df6] hover:text-white p-[0.8px]">
                                Modify
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.867 19.125h.008v.008h-.008v-.008z" />
                                </svg>
                            </a>
                        </Link>
                        {data?.project?._count?.respondent >= 1 && (
                            showDownload ? (
                            <div 
                                onClick={()=>{setShowDownload(false)}}
                                className="cursor-pointer w-[7rem] flex flex-row items-center justify-end gap-2 px-3 text-xs text-center transition-color bg-[#dde7fc] rounded-md shadow-md hover:bg-[#2d6df6] hover:text-white p-[0.8px]">
                                Download
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 13.5l3 3m0 0l3-3m-3 3v-6m1.06-4.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                                </svg>
                            </div>
                            ) : (
                                <div className="flex flex-row justify-end gap-2">
                                    <div 
                                        className="cursor-pointer w-[7rem] flex flex-row items-center justify-end gap-2 px-5 text-xs text-center transition-all bg-[#dde7fc] rounded-md shadow-md hover:bg-[#2d6df6] hover:text-white p-[0.8px]"
                                        onClick={()=>{setDownLoading(true); downLoadExcel(respData?.respondent); setShowDownload(true); }}>
                                        Excel
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
                                        </svg>
                                    </div>
                                    <div 
                                        className="cursor-pointer w-[7rem] flex flex-row items-center justify-end gap-2 px-5 text-xs text-center transition-all bg-[#dde7fc] rounded-md shadow-md hover:bg-[#2d6df6] hover:text-white p-[0.8px]"
                                        onClick={()=>{setDownLoading(true);signZip();setShowDownload(true);}}>
                                        Sign
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                        </svg>
                                    </div>
                                </div>
                            )
                        )}
                    </>
                ) : null }
            </> : <Skeleton width={150} count={1}/> }
            </div>
        </div>
        <div className="flex flex-col h-[45%] md:h-[65%]">
            {data ? data?.project?._count?.respondent >= 1 ? (
                <div className="flex flex-row items-center w-full mb-2 ml-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <input type="text" className="h-8 m-1 text-sm border-gray-700 rounded-md shadow-md focus:outline-none focus:ring-[#2d6df6] focus:border-[#2d6df6]" placeholder="search" onChange={(e)=>{setSearchText(e.target.value);}}/>
                </div>
                )
                : null
            : <div className="ml-2">
                <Skeleton width={100} count={1}/>
              </div>
            }
            <div className="flex-grow overflow-y-scroll">
                {data ? 
                    <>
                    { data?.project?._count?.respondent >= 1 ? 
                        (
                        <>
                            <table className="relative w-full shadow-md table-fixed">
                                <thead className="text-sm text-black border-b-2 shadow-md">
                                    <tr>
                                        <th className="sticky top-0 w-20 py-2 bg-[#2d6df6] text-white">name</th>
                                        <th className="sticky top-0 py-2 bg-[#2d6df6] text-white">phone</th>
                                        <th className="sticky top-0 py-2 bg-[#2d6df6] text-white">birthday</th>
                                        <th className="sticky top-0 py-2 bg-[#2d6df6] text-white">createdAt</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-center">
                                    { respData?.respondent?.map( (resp) => {
                                        const phoneMutation = user?.permission && ["FULL", "EDIT"].includes(user.permission) ? resp?.phone : resp?.phone.substring(0, 7) + "****" ;
                                        if( resp.name.includes(searchText) || phoneMutation.includes(searchText.replace("*", "")) || resp.birthday.includes(searchText) ){
                                            return (
                                                <tr className="text-xs text-black shadow-sm odd:bg-white even:bg-gray-200 hover:bg-[#dde7fc]" key={resp?.id}>
                                                    <td className="h-8 px-1 py-1">
                                                        { user?.permission && ["FULL", "EDIT"].includes(user.permission) ? (
                                                        <Link href={`/project/${router.query.id}/resp/${resp?.id}`}>
                                                            <a className="text-blue-500 transition-all hover:text-blue-700">
                                                                {resp?.name}
                                                            </a>
                                                        </Link>
                                                        ) : resp?.name }
                                                    </td>
                                                    <td className="h-8 px-1 py-1">{phoneMutation}</td>
                                                    <td className="h-8 px-1 py-1">{resp?.birthday}</td>
                                                    <td className="h-8 px-1 py-1">{resp?.createdAt.toString().split("T")[0]}</td>
                                                </tr>
                                            )
                                        }
                                    }) }
                                </tbody>
                            </table> 
                        </>
                        ) : 
                        (
                        <div className="w-full text-center flex flex-col items-center mt-[20%] text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12a">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                            </svg>
                            <div className="text-lg">
                                No respondents
                            </div>
                        </div>
                        ) }
                    </>
                : 
                <div className="w-full max-w-lg text-center m-auto mt-[30%]">
                    <Skeleton circle width={70} height={70}/>
                </div>
                }
            </div>
        </div>

    </Layout>
  );
};

  
  export default ProjectDetail;
