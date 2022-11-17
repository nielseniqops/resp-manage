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
import SignatureCanvas from "react-signature-canvas";
import Btn from "@components/btn";
import Dropdown from "@components/dropDown";
import 'animate.css';
import { cls } from "@libs/client/utils";
import Agreement from "@components/agreement";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

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
  pay: number|string;
  sign: string|undefined;
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

  useEffect(()=>{
    if( router ){
        if( router.query.mode !== null && router.query.mode !== undefined ){
            if( !["direct", "ableback", "once"].includes(router.query.mode.toString()) ){
                router.replace("/404");
            }
        }
    }
  }, [router]);

  const { data } = useSWR(router.query.id ? `/api/project/${router.query.id}/input` : null);

  const [registerResp, {loading, data:registData, error}] = useMutation<RegisterRespMutation>(`/api/project/${router.query.id}/resp`);
  const [submitBtn, setSubmitBtn] = useState<boolean>(false);

  const [openPostcode, setOpenPostcode] = useState<boolean>(false);

  const [dupchk, setDupchk] = useState<boolean>(false);
  const [dupVar, setDupVar] = useState<string|undefined>();

  const [todayPayChk, settodayPayChk] =  useState<boolean>(false);
  
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

  const signCanvas = useRef() as React.MutableRefObject<any>;
  const signClear = () => {
    signCanvas.current.clear();
    setValue("sign", undefined);
  }
  const signValid = () => {
    const sighHeight = signCanvas.current.getTrimmedCanvas().height;
    const sighWidth = signCanvas.current.getTrimmedCanvas().width;
    const signUrl = signCanvas.current.getTrimmedCanvas().toDataURL('image/png');
    
    if( sighHeight > 50 && sighWidth > 50 ){
        setValue("sign", signUrl);
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
  const onValid = async ({name, phone, birthday, residentNumber, todayPay, bankName, bankNumber, address, addressDetail, zonecode, sign, pay, otherProjectAgree}:NewRespProps) => {
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
    
    registerResp({name, phone, birthday, residentNumber, todayPay, bankName, bankNumber, address, addressDetail, zonecode, sign, pay, otherProjectAgree});
    return;
  }

  useEffect( ()=>{
    if( registData && registData.ok ){
        const pid = registData?.respondent?.projectId;
        if( router.query.mode === "direct" ){
            router.push(`/project/${pid}`);
        }
        else if ( router.query.mode === "ableback" ){
            router.push(`/project/${pid}/complete`);
        }
        else if ( router.query.mode === "once" || router.query.mode === undefined ){
            router.replace(`/project/${pid}/qranswer`);
        }
    }
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
  }, [registData]);
  
  useEffect(()=>{
    settodayPayChk(data?.project?.payType !== "Cash" ? false : true);
  },[data]);

  useEffect( ()=>{
    setValue("todayPay", todayPayChk);
    setValue("bankName", undefined);
    setValue("bankNumber", undefined);
    formChange();
  }, [todayPayChk])

  
  const bankList = ["카카오뱅크","국민은행","기업은행","농협은행","신한은행","산업은행","우리은행","한국씨티은행","하나은행","SC제일은행","경남은행","광주은행","대구은행","도이치은행","뱅크오브아메리카","부산은행","산립조합중앙회","저축은행","새마을금고","수협은행","신협중앙회","우체국","전북은행","제주은행","중국건설은행","중국공상은행","중국은행","BNP파리바은행","HSBC은행","JP모간체이스은행","케이뱅크","토스뱅크","교보증권","대신증권","DB금융투자","메리츠증권","미래에셋증권","부국증권","삼성증권","신영증권","신한투자증권","현대차증권","유안타증권","유진투자증권","이베스트투자증권","케이프투자증권","키움증권","한국포스증권","하나증권","한국포스증권","하나증권","하이투자증권","한국투자증권","한화투자증권","KB증권","다올투자증권","BNK투자증권","NH투자증권","카카오페이증권","IBK투자증권","토스증권"];

  const [agreement, setAgreement] = useState<boolean>(false);
  const [agreeItems, setAgreeItems] = useState([
    {icon: true, check : false, title : (<div>1. 본인에 관한 정보는, 닐슨아이큐서비스코리아와 조사를 의뢰한 회사가 본인의 신분을 확인하는 절차에 대해서만 사용된다는 사실을 이해하고 있습니다.</div>)},
    {icon: true, check : false, title : (
        <div>
            2. 조사 중에 본인에게 보여주는 모든 정보 <span className="font-bold">(제품, 사진, 광고, 제품명, 조사에 참여한 사실 등)</span>는 기밀 사항이라는 사실을 알고,
            <div className="flex flex-col gap-2 my-2 text-md">
            	<div className="ml-1">&gt; 제 3자에게 그 어떤 <span className="font-bold">기밀 사항도 노출하지 않으며</span> 본인 및 제 3자의 <span className="font-bold">이익에 이용하지 않겠습니다.</span></div>
                <div className="ml-1">&gt; 기밀 사항들에 관해 <span className="font-bold">글 작성, 복사 및 사진 촬영, 이미지 기록 등 어떠한 형태의 기록과 발설, 공유 행위도 하지 않겠습니다.</span></div>
                <div className="ml-3">○ 이는 구두로 발설, 인터넷 상의 활동 (사진 / 게시 글 / 스크랩 등의 테스트 제품에 대한 어떠한 정보 공유, 유출 등)도 포함 됨을 숙지 하였습니다.</div>
            </div>
        </div>
    )},
    {icon: true, check : false, title : (<div>3. 상기 사항 들을 모두 숙지 하였으며 만일 서약사항을 위반했을 경우에는 <span className="font-bold">닐슨 컴퍼니</span>는 저에게 <span className="font-bold">법적 책임을 물을 수 있으며 관할 법원이 법적 절차</span>를 관할하게 될 것이라는 데 동의합니다.</div>)},
    {icon: true, check : false, title : (<div>4. 기입된 개인 정보는 모두 진실임을 서약합니다</div>)},
]);
const [goodJob, setGoodJob] = useState<boolean>(false);
const [showInputs, setShowInputs] = useState<boolean>(false);
useEffect(()=>{
    if( agreeItems.filter((item)=> !item.check).length === 0 ){
        setGoodJob(true);
        setTimeout(()=>{
            setShowInputs(true);
            window.scrollTo(0, 0);
        }, 2000);
    }
}, [agreeItems]);

  return (
    <Layout title={data?.project?.name} canGoBack={router.query.mode === "direct" ? true : false} seoTitle="Respdent | NielsenIQ OPS" goBackUrl={`/project/${router?.query?.id}`}>
        {data && data.project.status === "Active" ? 
            !agreement ? (<div className="animate__animated animate__fadeInDown">
                            <Agreement />
                            <div className="flex flex-col items-center pb-5 mt-5">
                                <div 
                                    onClick={()=>{setAgreement(true); window.scrollTo(0, 0);}}
                                    className="w-32 py-1 text-sm text-center text-white transition-colors bg-black rounded-md shadow-md cursor-pointer hover:bg-green-400 hover:text-black">
                                    확 인
                                </div>
                            </div>
                        </div>)
            : agreement && showInputs ? (
                <div className="flex flex-col items-center justify-center w-full px-5 pb-20 overflow-y-auto animate__animated animate__fadeInDown">
                <form onChange={formChange} onClick={formChange} onTouchEnd={formChange} onSubmit={handleSubmit(onValid, onInValid)} className="flex flex-col justify-center w-full text-gray-700">
                    <div className="flex flex-row items-end justify-center gap-1 w-full sm:w-[60%] m-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div className="w-full">
                            <InputText name="name" type="text" label="이름" register={register("name", {
                                onBlur: (e)=>{
                                    if( !/^[가-힣|a-z|A-Z]+$/.test(e.target.value) ){
                                        setError("name", {message: "이름 확인 필요"});
                                    }else{
                                        clearErrors("name");
                                    }
                                },
                            })} onSetValue={setValue}/>
                        </div>
                    </div>
                    <div className="w-full sm:w-[60%] text-center m-auto pl-8">{errors.name ? <Errorset text={errors.name.message}/> : null}</div>

                    <div className="flex flex-row items-end justify-center gap-1 w-full sm:w-[60%] m-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                        </svg>
                        <div className="w-full">
                            <InputText name="phone" type="number" label="전화번호" register={register("phone", {
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
                                <InputText name="birthday" type="number" label="앞자리" register={register("birthday", {
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
                                <InputText name="residentNumber" type="number" label="뒷자리" register={register("residentNumber", {
                                    minLength: {
                                        value: 7,
                                        message: "주민번호 7자리 입력"
                                    },
                                    maxLength: {
                                        value: 7,
                                        message: "주민번호 7자리 입력"
                                    }
                                })} onSetValue={setValue}/>
                            </div>
                        </div>
                    </div>
                    <div className="w-full sm:w-[60%] text-center m-auto">
                            <div className="w-full text-center">{errors.birthday ? <Errorset text={errors.birthday.message}/> : null}</div>
                            <div className="w-full text-center">{errors.residentNumber ? <Errorset text={errors.residentNumber.message}/> : null}</div>
                    </div>
                    { !todayPayChk ? (
                        <div className="flex flex-col justify-center w-full sm:w-[60%] m-auto ">
                            <div className="flex flex-row items-center justify-between gap-1 ml-1 text-sm text-gray-700 mt-7">
                                <div className="flex flex-row items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                                    </svg>
                                    계좌
                                </div>
                            </div>
                            <div className="relative flex flex-col items-center w-full gap-1 -mt-3">
                                <div className="w-full mt-2">
                                    <Dropdown name="bankName" label="은행명" register={register("bankName")} options={bankList} setValueFunction={setValue} addionalClass={"grid grid-col w-80 overflow-scroll h-32"} searchFlag={true}/>
                                </div>
                                <div className="w-full -mt-3">
                                    <InputText name="bankNumber" type="number" label="계좌번호" register={register("bankNumber", {
                                        minLength: {
                                            value: 5,
                                            message: "계좌번호 확인 필요"
                                        }
                                    })} onSetValue={setValue}/>
                                </div>
                            </div>
                        </div>
                        ) : null }
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
                        <div className="w-full sm:w-[60%] mt-2">
                            <input type="button" defaultValue={!openPostcode ? "검 색" : "닫 기"} onClick={postHandle.clickButton} className="w-full border-[1px] border-gray-500 text-center rounded-md shadow-md hover:bg-green-400 transition-all"/>
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
                            <InputText name="addressDetail" type="text" label="상세 주소" register={register("addressDetail")} onSetValue={setValue}/>
                        </div>
                    </div>
                    <div className="w-full sm:w-[60%] text-center m-auto">{errors.addressDetail ? <Errorset text={errors.addressDetail.message}/> : null}</div>

                    <div className="flex flex-row items-end justify-center gap-1 w-full sm:w-[60%] m-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                        </svg>
                        <div className="w-full">
                            <InputText name="pay" type="number" label="지급액" register={register("pay")} onSetValue={setValue}/>
                        </div>
                    </div>
                    <div className="w-full sm:w-[60%] text-center m-auto pl-8">{errors.pay ? <Errorset text={errors.pay.message}/> : null}</div>

                    <div className="flex flex-row items-center justify-center w-full sm:w-[60%] mt-8 text-center m-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                            </svg>
                            <div className="text-center">회사에서 진행하는 다른 조사 활용 여부</div>
                        </div>
                        <div className="w-full mt-2 text-center">{errors.otherProjectAgree ? <Errorset text={errors.otherProjectAgree.message}/> : null}</div>
                    <div className="flex flex-row gap-5 justify-between mt-5 m-auto w-[80%] sm:w-[50%]">
                        <div
                            onClick={()=>{setValue("otherProjectAgree", true);}} 
                            className={cls("w-32 pt-2 pb-2 text-sm text-center text-white transition-colors bg-black rounded-md shadow-md cursor-pointer hover:bg-green-400 hover:text-black", watch("otherProjectAgree") === true ? "bg-green-400 text-black" : "")}>
                            동의함</div>
                        <div 
                            onClick={()=>{setValue("otherProjectAgree", false);}} 
                            className={cls("w-32 pt-2 pb-2 text-sm text-center text-white transition-colors bg-black rounded-md shadow-md cursor-pointer hover:bg-green-400 hover:text-black", watch("otherProjectAgree") === false ? "bg-green-400 text-black" : "")}>
                            동의하지 않음</div>
                    </div>

                    <div className="w-full sm:w-[60%] m-auto">
                        <div className="flex flex-row items-center gap-1 mb-4 ml-1 text-sm text-gray-700 mt-7">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                            <div className="flex flex-row items-center justify-between w-full">
                                <div>서명</div>
                                <div onClick={signClear}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div onClick={signValid} onTouchEnd={signValid} className="flex flex-col items-center">
                            <SignatureCanvas 
                                ref={signCanvas}
                                canvasProps={{
                                    width: 300,
                                    height: 170,
                                    className: "border-[1.5px] border-gray-700 rounded-md shadow-md hover:border-green-400",
                                }}
                            />
                        </div>
                    </div>
                    {dupchk ? 
                    <div className="w-full sm:w-[60%] text-center m-auto flex mt-3">
                        <div className="m-auto">
                            <Errorset text={`이미 입력된 응답자입니다.`}/>
                            <div className="font-bold text-red-400">{dupVar}</div>
                        </div>
                    </div> : null}
                    {submitBtn ? (
                        <div className="w-full sm:w-[60%] m-auto">
                            <Btn label={loading ? "LOADING" : "제 출"} loading={loading}/>
                        </div>
                    ) : null}
                </form>
                </div>) 
                : (<div className={cls("relative px-5 pb-10", goodJob ? "pointer-events-none" : "")}>
                        <div 
                            className={cls("z-[100] w-full flex flex-row justify-center fixed left-5 top-[45%] text-green-400 -ml-5 pointer-events-none overflow-hidden touch-none", goodJob ? "" : "hidden")}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={cls("w-28 h-28 p-3 bg-white rounded-full", goodJob ? "animate__animatied animate__bounceIn" : "hidden")}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                            </svg>
                        </div>
                        <div className={cls("w-full transition-all", goodJob ? "opacity-50" : "")}>
                            <div className="flex flex-row items-center gap-1 mb-5 text-lg text-gray-600">
                            <div className="w-full font-bold text-center text-gray-700 text-md">보안규정 준수서약</div>
                            </div>
                            <div className="flex flex-col gap-2 text-sm font-bold text-gray-600">
                                <div>본인은 다음과 같은 사항을 준수할 것을 서약합니다.</div>
                                <div>아래 4가지 사항을 확인하면서 각각 클릭 하신 뒤 진행해 주십시오.</div>
                            </div>
                            {agreeItems.map((item, index)=>{
                                return (
                                    <div key={index} 
                                        onClick={()=>{
                                            const curr = agreeItems[index];
                                            curr.check = !curr.check;
                                            setAgreeItems([...agreeItems]);
                                        }}
                                        className={cls("flex text-sm flex-col gap-1 p-2 mt-3 text-gray-600 transition-all rounded-md cursor-pointer hover:bg-green-200 hover:shadow-md", item.check ? "text-green-500" : "")}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={cls("-ml-1 w-6 h-6 text-red-400", item.check ? "text-green-500 animate__animated animate__bounceIn" : "text-gray-400")}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            {item.title}
                                        </div>
                                    </div>
                                )
                            } )}
                            <div className="w-full mt-5 text-sm font-bold text-center text-gray-700">
                                개인정보 수집 및 이용에 동의하며, 보안규정 준수에 서약하여 서명 합니다.
                            </div>
                            <div className="w-full mt-2 font-bold text-center text-gray-700 text-md">
                                닐슨 코리아 귀중
                            </div>
                        </div>
                    </div>)
        : data && data.project.status === "Close" ? 
                (<div className="flex flex-col items-center justify-center w-full px-5 pb-10">
                    <div className="mt-5 text-red-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-14 h-14">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                    </div>
                    <div className="mt-5 text-2xl font-bold text-red-400">CLOSE PROJECT</div>
                </div>)
            : (<div className="flex flex-row items-center justify-center w-full py-10 text-center">
                <div>
                    <Skeleton circle width={70} height={70}/>
                </div>
            </div>)
        }
    </Layout>
  );
};


export default AddResp;
