import client from "@libs/server/client";
import withHandler, {ResponseType} from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req:NextApiRequest, res:NextApiResponse<ResponseType>){
    if( req.method === "POST" ){
        const {query: {id:queryId}, body: {name, phone, birthday, residentNumber, todayPay, bankName, bankNumber,address, addressDetail, zonecode, sign, pay, otherProjectAgree}} = req;

        if( queryId !== undefined ){
            const phoneChk = await client.respondent.findFirst({
                where:{
                    AND : [
                        {
                            projectId: +queryId,
                            phone
                        }
                    ]
                },
                select: {
                    id: true,
                    name: true,
                    phone: true
                }
            })

            const residentChk = await client.respondent.findFirst({
                where:{
                    AND : [
                        {
                            projectId: +queryId,
                            birthday,
                            residentNumber,
                        }
                    ]
                },
                select: {
                    id: true,
                    name: true,
                    phone: true
                }
            })

            if( phoneChk || residentChk){
                res.json({
                    ok: false,
                    phoneChk,
                    residentChk,
                    error: "DuplicationAnswer"
                });
            }else{
                const respondent = await client.respondent.create({
                    data: {
                        name,
                        phone: phone.toString(),
                        otherProjectAgree,
                        birthday: birthday.toString(),
                        residentNumber: residentNumber.toString(),
                        todayPay,
                        pay,
                        bankName: bankName !== undefined ? bankName.toString() : null,
                        bankNumber: bankNumber !== undefined ? bankNumber.toString() : null,
                        address,
                        addressDetail,
                        zonecode,
                        sign,
                        project: {
                            connect: {
                                id: +queryId
                            }
                        }
                    }
                });
    
                res.json({
                    ok: true,
                    respondent,
                });
            }            
        }
    }
    if( req.method === "GET" ){
        const {query: {id:queryId}, body: {phone}} = req;

        if( queryId !== undefined ){
            if( phone !== undefined && phone !== null ){
                const respondent = await client.respondent.findFirst({
                    where:{
                        AND: [
                            {
                                projectId: +queryId,
                            },
                            {
                                phone: phone
                            }
                        ]
                    },
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        birthday: true,
                        residentNumber: true,
                        address: true,
                        addressDetail : true,
                        zonecode : true,
                    }
                });
    
                res.json({
                    ok: true,
                    respondent,
                });
            }else{
                const respondent = await client.respondent.findMany({
                    where:{
                        projectId: +queryId,
                    },
                    orderBy: {
                        createdAt: "desc"
                    },
                    include: {
                        project : {
                            select : {
                                name: true,
                                opNumber: true,
                                wbsNumber: true,
                                group: true,
                            }
                        }
                    }
                });
    
                res.json({
                    ok: true,
                    respondent,
                });
            }
        }
    }
}

export default withApiSession(
    withHandler({
        methods: ["GET", "POST"],
        handler
    })
);