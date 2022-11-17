import 'react-loading-skeleton/dist/skeleton.css'

export default function Agreement(){
    return (  
        <div className="w-full py-5">
            <style jsx>{
                `.word-keep-all {
                    word-break: keep-all;
                }`
            }</style>
            <div className="w-full mb-2 font-bold text-center text-gray-700 text-md">개인 정보 수집 및 이용 동의서</div>
            <div className="px-4 text-xs text-gray-600 word-keep-all">
                <div>
                    닐슨아이큐서비스코리아 (이하 &#x201C;회사&#x201D;라 함)는 설문조사 참여자(이하 「참여자」로 약칭)의 개인정보를 중요시하며, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」(이하 「정보통신망법」 으로 약칭) 제27조의2 제2항에 따라 참여자 여러분의 개인정보를 보호하기 위하여 다음과 같이 개인정보를 수집 및 이용 하고자 합니다. 회사는 이 「정보통신망법」을 비롯하여 개인정보와 관련된 법령 상의 개인정보보호규정 및 방송통신위원회가 제정한 &quot;개인정보보호지침&quot;을 준수하고 있습니다.
                </div>
                <div className="py-2 mt-1 text-sm font-bold">1. 수집하는 개인정보의 항목 및 수집방법</div>
                <div>
                    <div>
                        회사는 정보제공자의 본인 여부의 확인, 조사 자료 수집 및 해당자료의 분석, 해당 조사 의뢰인/의뢰사에서 필요로 하는 정보 제공 또는 회사에서 진행하는 다른 조사를 위해 아래와 같은 개인정보를 수집하고 있습니다. 참여자의 기본적 인권 침해의 우려가 있는 민감한 개인 정보(인종, 사상 및 신조, 정치적 성향이나 범죄기록 등)는 수집하지 않습니다.
                    </div>
                    <div className="mt-2">
                        가. 수집하는 개인 정보의 항목
                        <div className="mb-1 ml-1">1) 이름, 생년, 자택전화번호, 핸드폰번호, 이메일, 자택주소, 최종학력, 월 소득, 성별, 결혼 유무, 직업</div>
                        <div className="mb-1 ml-1">2) 개인식별정보 등 필수적 정보 외에 정보제공자의 동의 하에 제공된 정보</div>
                    </div>
                    <div className="mt-2">
                        나. 수집방법
                        <div className="mb-1 ml-1">1) 조사 수행, 응답 여부 확인을 위한 녹취 및 영상 녹화</div>
                    </div>
                </div>
                <div className="py-2 mt-1 text-sm font-bold">2. 개인정보의 수집 및 이용목적</div>
                    <div>회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다. 참여자가 제공한 모든 정보는 하기 목적에 필요한 용도 이외에 사용되지 않으며 이용 목적이 변경될 시에는 사전 동의를 구할 것입니다.</div>
                    <div className="mb-1 ml-1">가. 정보제공자의 본인 여부의 확인</div>
                    <div className="mb-1 ml-1">나. 조사 자료 수집 및 해당 자료의 분석</div>
                    <div className="mb-1 ml-1">다. 회사에서 진행하는 다른 조사</div>
                <div className="py-2 mt-1 text-sm font-bold">3. 개인정보 공유 및 제공</div>
                    <div>
                        회사는 참여자의 개인정보를 &quot;2. 개인정보의 수집 및 이용목적&quot;에서 고지한 범위 내에서 사용하고, 참여자의 사전 동의 없이는 동의 범위를 초과하여 이용하지 않으며, 원칙적으로 참여자의 개인정보를 외부에 제공하지 않습니다.<br/>단, 다음의 경우에는 주의를 기울여 개인정보를 이용 및 제공할 수 있습니다.
                    </div>
                    <div className="mb-1 ml-1">가. 참여자가 사전에 공개하는데 동의한 경우</div>
                    <div className="mb-1 ml-1">나. 법령과 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</div>
                    <div className="mb-1 ml-1">다. 통계작성, 학술연구 또는 시장조사 등을 위해 필요한 경우로서 특정개인을 식별할 수 없는 형태 제공 경우</div>
                <div className="py-2 mt-1 text-sm font-bold">4. 개인정보의 취급위탁</div>
                    <div>
                        회사는 조사에 참여하신 여러분의 동의 없이 개인정보 취급을 외부업체에 위탁하지 않습니다. 향후 그러한 필요가 생길 경우, 위탁 대상자와 위탁업무에 대해 여러분에게 통지하고 필요한 경우 사전 동의를 받도록 하겠습니다.
                    </div>
                <div className="py-2 mt-1 text-sm font-bold">5. 개인정보의 보유 및 이용기간</div>
                    <div>
                        원칙적으로 수집한 개인정보는 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.
                    </div>
                </div>
                
        </div>
    );
}