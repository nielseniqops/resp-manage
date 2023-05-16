import type { NextPage } from "next";
import Layout from "@components/layout";
import InputText from "@components/inputText";
import { useForm } from "react-hook-form";
import Errorset from "@components/error";
import { Respondent } from "@prisma/client";
import useMutation from "@libs/client/useMutation";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import useSWR from "swr";
import DaumPostcode from "react-daum-postcode";
import Btn from "@components/btn";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
import Image from "next/image";
import Dropdown from "@components/dropDown";
import { cls } from "@libs/client/utils";
import useUser from "@libs/client/useUser";

interface NewRespProps {
  name: string;
  phone: string;
  otherProjectAgree: boolean;
  birthday: string;
  residentNumber: string;
  todayPay: boolean;
  bankName?: string
  bankNumber?: string
  address: string;
  addressDetail: string;
  zonecode: string;
  sign: string|undefined;
  respid: number;
  pay: number|string;
  deleteFlag: boolean;
}

interface RegisterRespMutation{
  ok: boolean;
  respondent: Respondent;
  phoneChk: Respondent;
  residentChk: Respondent;
  error?: string;
}

const AddResp: NextPage = ({}) => {
  const { register, handleSubmit, setValue, setError, formState: { errors }, watch, clearErrors} = useForm<NewRespProps>();
  const router = useRouter();
  const { user } = useUser();
  const { data } = useSWR(router.query.id ? `/api/project/${router.query.id}/input` : null);
  const [registerResp, {loading, data:registData, error}] = useMutation<RegisterRespMutation>(`/api/project/${router.query.id}/resp/${router.query.respid}`);
  const { data:respData } = useSWR(router.query.id && router.query.respid ? `/api/project/${router.query.id}/resp/${router.query.respid}` : null);
  const [respDataLoading, setRespDataLoading] = useState<boolean>(true);
  
  const [saveChk, setSaveChk] = useState<boolean>(false);

  const [submitBtn, setSubmitBtn] = useState<boolean>(false);

  const [openPostcode, setOpenPostcode] = useState<boolean>(false);

  const [dupchk, setDupchk] = useState<boolean>(false);
  const [dupVar, setDupVar] = useState<string|undefined>();

  const [todayPayChk, settodayPayChk] =  useState<boolean>(false);

  useEffect(()=>{
    if( respData && respData.respondent){
        const {name, phone, birthday, residentNumber, todayPay, bankName, bankNumber, address, addressDetail, zonecode, sign, pay, otherProjectAgree} = respData.respondent;
        setValue("name", name);
        setValue("phone", phone);
        setValue("birthday", birthday);
        setValue("residentNumber", residentNumber);
        settodayPayChk(todayPay);
        setValue("bankName", bankName);
        setValue("bankNumber", bankNumber);
        setValue("address", address);
        setValue("addressDetail", addressDetail);
        setValue("zonecode", zonecode);
        setValue("sign", sign);
        setValue("pay", pay);
        setValue("otherProjectAgree", otherProjectAgree);
    }
    if( respData && respData.respondent === null ){
        router.replace("/404");
    }else{
        setRespDataLoading(false);
    }
  }, [respData]);

  const postHandle = {
    clickButton: ()=>{
        setOpenPostcode(current => ! current);
    },
    selectAddress: (addressData: any) => {
        if( addressData ){
            setValue("address", addressData.address);
            setValue("zonecode", addressData.zonecode);
        }
        setOpenPostcode(false);
    }
  }


  const formChange = () => {
    const nameChk = (watch("name") !== undefined && watch("name") !== "") ? true : false;
    const phoneChk = (watch("phone") !== undefined && watch("phone") !== "") ? true : false;
    const birthChk = (watch("birthday") !== undefined && watch("residentNumber") !== undefined) && (watch("birthday") !== "" && watch("residentNumber") !== "") ? true : false;
    const bankChk = (!todayPayChk && (watch("bankName") !== undefined && watch("bankNumber") !== undefined) && (watch("bankName") !== "" && watch("bankNumber") !== "")) || todayPayChk ? true : false;
    const addressChk = (watch("address") !== undefined && watch("addressDetail") !== undefined && watch("zonecode") !== undefined) && (watch("address") !== "" && watch("addressDetail") !== "" && watch("zonecode") !== "") ? true : false;
    const sighChk = (watch("sign") !== undefined && watch("sign") !== "") ? true : false;
    const payChk = (watch("pay") !== undefined && watch("pay") !== "") ? true : false;
    const otherProjectAgreeChk = (watch("otherProjectAgree") !== undefined && watch("otherProjectAgree") !== null) ? true : false;
    
    if( nameChk && phoneChk && birthChk && addressChk && sighChk && bankChk && payChk && otherProjectAgreeChk){
        setSubmitBtn(true);
    }else{
        setSubmitBtn(false);
    }
}
  const onInValid = async () => {
        return;
  }
  const onValid = async ({name, phone, birthday, residentNumber, todayPay, bankName, bankNumber, address, addressDetail, zonecode, sign, deleteFlag, pay, otherProjectAgree}:NewRespProps) => {
    if(loading) return;
    let errFlag = false;
    
    if( name === "" || name === undefined || name === null ){
        setError("name", {message: "필수 입력"});
        errFlag = true;
    }
    if( phone === "" || phone === undefined || phone === null ){
        setError("phone", {message: "필수 입력"});
        errFlag = true;
    }
    if( birthday === "" || birthday === undefined || birthday === null ){
        setError("birthday", {message: "필수 입력"});
        errFlag = true;
    }
    if( residentNumber === "" || residentNumber === undefined || residentNumber === null ){
        setError("residentNumber", {message: "필수 입력"});
        errFlag = true;
    }
    if( (address === "" || address === undefined || address === null) || (zonecode === "" || zonecode === undefined || zonecode === null) || (addressDetail === "" || addressDetail === undefined || addressDetail === null)){
        setError("addressDetail", {message: "필수 입력"});
        errFlag = true;
    }
    if( !todayPay && ((bankName === "" || bankName === undefined || bankName === null) || (bankNumber === "" || bankNumber === undefined || bankNumber === null)) ){
        setError("bankNumber", {message: "필수 입력"});
        errFlag = true;
    }
    if( pay === "" || pay === undefined || pay === null ){
        setError("pay", {message: "필수 입력"});
        errFlag = true;
    }
    if( otherProjectAgree === undefined || otherProjectAgree === null){
        setError("otherProjectAgree", {message: "동의 여부 선택"});
        errFlag = true;
    }


    if( errFlag ) return;
    
    registerResp({name, phone, birthday, residentNumber, todayPay, bankName, bankNumber, address, addressDetail, zonecode, sign, deleteFlag, pay, otherProjectAgree});
    setSaveChk(true);
    return;
  }
  
  useEffect(()=>{
    if( data && data.project === null ){
        router.replace('/404');
    }
  },[data]);

  useEffect( ()=>{
    if( registData && registData.ok == false && registData.error ){
        setDupchk(true);
        if( registData.phoneChk !== null && registData.residentChk === null){
            setDupVar("(전화번호 중복)");
        }
        if( registData.phoneChk === null && registData.residentChk !== null){
            setDupVar("(주민번호 중복)");
        }
        if( registData.phoneChk !== null && registData.residentChk !== null){
            setDupVar("(전화번호/주민번호 중복)");
        }
        return;
    }
    if( saveChk ){
        if( registData && registData.ok ){
            const pid = registData?.respondent?.projectId;
            router.push(`/project/${pid}`);
        }
    }
  }, [registData]);
  
  useEffect( ()=>{
    setValue("todayPay", todayPayChk);
    formChange();
  }, [todayPayChk])

  const [ deleteChk, setDeleteChk ] = useState<boolean>(false);
  const deleteHandle = ()=>{
    setDeleteChk(!deleteChk);
    setValue("deleteFlag", !deleteChk);
  }

  useEffect(()=>{
    setValue("deleteFlag", deleteChk);
  }, []);

  const downLoadSign = ()=>{
    const alink = document.createElement("a");
    alink.href = watch("sign") || '';
    alink.download = `${router.query.respid}_${router.query.id}_${respData.respondent.name}_sign.png`;
    alink.click();
  }

  const bankList = ["카카오뱅크","국민은행","기업은행","농협은행","신한은행","산업은행","우리은행","한국씨티은행","하나은행","SC제일은행","경남은행","광주은행","대구은행","도이치은행","뱅크오브아메리카","부산은행","산립조합중앙회","저축은행","새마을금고","수협은행","신협중앙회","우체국","전북은행","제주은행","중국건설은행","중국공상은행","중국은행","BNP파리바은행","HSBC은행","JP모간체이스은행","케이뱅크","토스뱅크","교보증권","대신증권","DB금융투자","메리츠증권","미래에셋증권","부국증권","삼성증권","신영증권","신한투자증권","현대차증권","유안타증권","유진투자증권","이베스트투자증권","케이프투자증권","키움증권","한국포스증권","하나증권","한국포스증권","하나증권","하이투자증권","한국투자증권","한화투자증권","KB증권","다올투자증권","BNK투자증권","NH투자증권","카카오페이증권","IBK투자증권","토스증권"];

  const [ deletePermission, setDeletePermission ] = useState<boolean>(false);

  useEffect( ()=>{
    if( user ){
      if( user.permission === "FULL" ){
        setDeletePermission(true);
      }
      if( data && data.ok ){
        if( user.id === data.project.userId ){
          setDeletePermission(true);
        }
      }
      if( user.permission === "VIEW" ){
        setDeletePermission(false);
      }
    }
  }, [user, data])

  return (
    <Layout title={data && data.ok ? `응답 수정` : ""} canGoBack={true} seoTitle="Respdent | NielsenIQ OPS" goBackUrl={`/project/${router?.query?.id}`}>
        {respDataLoading ? (
                <div className="flex flex-row items-center justify-center w-full px-5 pb-10 mt-8">
                    <Skeleton width={70} height={70} circle/>
                </div>
            )
            : data && data?.project?.status === "Active" ? (
                    <div className="flex flex-col items-center justify-center w-full px-5 pb-10 overflow-y-auto">
                        <form onChange={formChange} onClick={formChange} onTouchEnd={formChange} onSubmit={handleSubmit(onValid, onInValid)} className="flex flex-col justify-center w-full text-gray-700">
                            <div className="flex flex-row justify-end w-full mt-2">
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

                            { deleteChk ? (
                                <div className="flex flex-col items-center w-full mt-5 animate__animated animate__bounceIn">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-red-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                    </svg>
                                    <div className="text-2xl text-red-400">
                                        Deletes the current respondent
                                    </div>
                                </div>
                            ) : (
                                <>
                                <div className="flex flex-row items-end justify-center gap-1 w-full sm:w-[60%] m-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <div className="w-full">
                                        <InputText defaultValue={watch("name")} name="name" type="text" label="이름" register={register("name", {
                                            onBlur: (e)=>{
                                                if( !/^[가-힣|a-z|A-Z]+$/.test(e.target.value) ){
                                                    setError("name", {message: "이름 확인 필요"});
                                                }else{
                                                    clearErrors("name");
                                                }
                                            }
                                        })} onSetValue={setValue}/>
                                    </div>
                                </div>
                                <div className="w-full sm:w-[60%] text-center m-auto pl-8">{errors.name ? <Errorset text={errors.name.message}/> : null}</div>

                                <div className="flex flex-row items-end justify-center gap-1 w-full sm:w-[60%] m-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                                    </svg>
                                    <div className="w-full">
                                        <InputText  defaultValue={watch("phone")} name="phone" type="number" label="전화번호" register={register("phone", {
                                            min: {
                                                value: 1,
                                                message: "전화번호 확인 필요"
                                            },
                                            max: {
                                                value: 99999999999,
                                                message: "전화번호 확인 필요"
                                            },
                                            minLength: {
                                                value: 10,
                                                message: "전화번호 확인 필요"
                                            }
                                        })} onSetValue={setValue}/>
                                    </div>
                                </div>
                                <div className="w-full sm:w-[60%] text-center m-auto pl-8">{errors.phone ? <Errorset text={errors.phone.message}/> : null}</div>

                                <div className="w-full sm:w-[60%] m-auto">
                                    <div className="flex flex-row items-center gap-1 ml-1 text-sm text-gray-700 mt-7">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                                        </svg>
                                        <div>
                                            주민등록번호
                                        </div>
                                    </div>
                                    <div className="flex flex-row items-center justify-center gap-1 -mt-3">
                                        <div className="w-full">
                                            <InputText  defaultValue={watch("birthday")} name="birthday" type="number" label="앞자리" register={register("birthday", {
                                                minLength: {
                                                    value: 6,
                                                    message: "생년월일 6자리 숫자로 입력"
                                                },
                                                maxLength: {
                                                    value: 6,
                                                    message: "생년월일 6자리 숫자로 입력"
                                                }
                                            })} onSetValue={setValue}/>
                                        </div>
                                        <div className="flex flex-row items-center justify-center pt-5 text-lg">
                                            -
                                        </div>
                                        <div className="w-full">
                                            <InputText  defaultValue={watch("residentNumber")} name="residentNumber" type="number" label="뒷자리" register={register("residentNumber", {
                                                minLength: {
                                                    value: 7,
                                                    message: "뒷자리 7자리 입력"
                                                },
                                                maxLength: {
                                                    value: 7,
                                                    message: "뒷자리 7자리 입력"
                                                }
                                            })} onSetValue={setValue}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full sm:w-[60%] text-center m-auto">
                                        <div className="w-full text-center">{errors.birthday ? <Errorset text={errors.birthday.message}/> : null}</div>
                                        <div className="w-full text-center">{errors.residentNumber ? <Errorset text={errors.residentNumber.message}/> : null}</div>
                                </div>

                                <div className="flex flex-col justify-center w-full sm:w-[60%] m-auto ">
                                    <div className="flex flex-row items-center justify-between gap-1 ml-1 text-sm text-gray-700 mt-7">
                                        <div className="flex flex-row items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                                            </svg>
                                            계좌
                                        </div>
                                        <div className="px-1 py-[0.7px] border-[1px] cursor-pointer border-gray-500 text-center rounded-md shadow-md hover:bg-[#2d6df6] hover:border-[#2d6df6] hover:text-white transition-all" onClick={()=>{settodayPayChk(!todayPayChk)}}>
                                            {todayPayChk ? "계좌 지급" : "현금 지급"}
                                        </div>
                                    </div>
                                    { !todayPayChk ? (
                                        <div className="flex flex-col items-center w-full gap-1 -mt-3">
                                            <div className="w-full mt-2">
                                                {/* <InputText name="bankName" type="text" label="은행명" register={register("bankName")} onSetValue={setValue}/> */}
                                                <Dropdown defaultValue={watch("bankName") || undefined} name="bankName" label="은행명" register={register("bankName")} options={bankList} setValueFunction={setValue} addionalClass={"grid grid-col w-80 overflow-scroll h-32"} searchFlag={true}/>
                                            </div>
                                            <div className="w-full -mt-3">
                                                <InputText defaultValue={watch("bankNumber") || undefined} name="bankNumber" type="number" label="계좌번호" register={register("bankNumber", {
                                                    minLength: {
                                                        value: 5,
                                                        message: "계좌번호 확인 필요"
                                                    }
                                                })} onSetValue={setValue}/>
                                            </div>
                                        </div>
                                    ) : null }
                                </div>
                                {!todayPayChk ? (<div className="w-full sm:w-[60%] text-center m-auto mt-1">{errors.bankNumber ? <Errorset text={errors.bankNumber.message}/> : null}</div>) : null}
                                <div className="w-full sm:w-[60%] m-auto">
                                    <div className="flex flex-row items-center gap-1 ml-1 text-sm text-gray-700 mt-7">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
                                        </svg>
                                        <div className="flex flex-row items-center justify-start w-full gap-2">
                                            <div className="w-10">주 소</div>
                                        </div>
                                    </div>
                                    { watch().address ? (
                                        <div className="w-full mt-2 ml-5 text-sm text-left text-gray-700">
                                            <div className="flex flex-row items-center w-full gap-2">
                                                <div className="w-20 text-center">주소</div>
                                                <div>{ watch().address }</div>
                                            </div>
                                            <div className="flex flex-row items-center w-full gap-2">
                                                <div className="w-20 text-center">우편번호</div>
                                                <div>{ watch().zonecode }</div>
                                            </div>
                                        </div>
                                    ) : null }
                                </div>
                                <div className="flex flex-row items-center justify-center w-full">
                                    <div className="w-full sm:w-[60%] mt-2 cursor-pointer">
                                        <input type="button" defaultValue={!openPostcode ? "검 색" : "닫 기"} onClick={postHandle.clickButton} className="w-full border-[1px] border-gray-500 text-center rounded-md shadow-md hover:bg-[#2d6df6] hover:border-[#2d6df6] hover:text-white transition-all cursor-pointer outline-none ring-0 focus:ring-1 focus:ring-[#2d6df6]"/>
                                    </div>
                                </div>
                                {/* 주소 API 사용 */}
                                { openPostcode &&
                                    <div className="w-full mt-2 text-md">
                                        <DaumPostcode
                                            onComplete={postHandle.selectAddress}
                                            autoClose={false}
                                        />
                                    </div>
                                }
                                <div className="flex flex-row items-end justify-center gap-1 w-full sm:w-[60%] m-auto">
                                    <div className="w-full">
                                        <InputText  defaultValue={watch("addressDetail")} name="addressDetail" type="text" label="상세 주소" register={register("addressDetail")} onSetValue={setValue}/>
                                    </div>
                                </div>
                                <div className="w-full sm:w-[60%] text-center m-auto">{errors.addressDetail ? <Errorset text={errors.addressDetail.message}/> : null}</div>

                                <div className="flex flex-row items-end justify-center gap-1 w-full sm:w-[60%] m-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                                    </svg>
                                    <div className="w-full">
                                        <InputText defaultValue={watch("pay")} name="pay" type="number" label="지급액" register={register("pay")} onSetValue={setValue}/>
                                    </div>
                                </div>
                                <div className="w-full sm:w-[60%] text-center m-auto pl-8">{errors.pay ? <Errorset text={errors.pay.message}/> : null}</div>


                                <div className="flex flex-row items-center justify-center w-full sm:w-[60%] mt-8 text-center m-auto">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                                        </svg>
                                        <div>회사에서 진행하는 다른 조사 활용 여부</div>
                                    </div>
                                    <div className="w-full mt-2 text-center">{errors.otherProjectAgree ? <Errorset text={errors.otherProjectAgree.message}/> : null}</div>
                                    <div className="flex flex-row gap-5 justify-between mt-5 m-auto w-[80%] sm:w-[50%]">
                                        <div
                                            onClick={()=>{setValue("otherProjectAgree", true);}} 
                                            className={cls("w-32 pt-2 pb-2 text-sm text-center transition-colors rounded-md shadow-md cursor-pointer hover:bg-[#2d6df6] hover:text-white border-[1px] hover:border-[#2d6df6]", watch("otherProjectAgree") === true ? "bg-[#2d6df6] text-white border-[#2d6df6]" : "text-gray-700 border-gray-500")}>
                                            동의함</div>
                                        <div 
                                            onClick={()=>{setValue("otherProjectAgree", false);}} 
                                            className={cls("w-32 pt-2 pb-2 text-sm text-center transition-colors rounded-md shadow-md cursor-pointer hover:bg-[#2d6df6] hover:text-white border-[1px] hover:border-[#2d6df6]", watch("otherProjectAgree") === false ? "bg-[#2d6df6] text-white border-[#2d6df6]" : "text-gray-700 border-gray-500")}>
                                            동의하지 않음</div>
                                </div>

                                <div className="w-full sm:w-[60%] m-auto">
                                    <div className="flex flex-row items-center gap-1 mb-4 ml-1 text-sm text-gray-700 mt-7">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                        </svg>
                                        <div className="flex flex-row items-center justify-between w-full">
                                            <div>서명</div>
                                            <div className="cursor-pointer" onClick={downLoadSign}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative w-full h-44">
                                        { watch("sign") ? (
                                            <Image
                                                src={watch("sign") || ""}
                                                layout="fill"
                                                className="object-none"/>
                                        ) : null }
                                    </div>
                                </div>
                                {dupchk ? 
                                <div className="w-full sm:w-[60%] text-center m-auto flex mt-3">
                                    <div className="m-auto">
                                        <Errorset text={`이미 입력된 응답자입니다.`}/>
                                        <div className="font-bold text-red-400">{dupVar}</div>
                                    </div>
                                </div> : null}
                                </>
                            ) }
                            {submitBtn ? (
                                <div className="w-full sm:w-[60%] m-auto">
                                    <Btn label={loading ? "LOADING" : "SAVE"} loading={loading}/>
                                </div>
                            ) : null}
                        </form>
                </div>
                )
            :
            (data && data?.project?.status === "Close") && 
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


export default AddResp;
