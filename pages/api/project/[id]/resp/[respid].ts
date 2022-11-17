import client from "@libs/server/client";
import withHandler, {ResponseType} from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req:NextApiRequest, res:NextApiResponse<ResponseType>){
    if( req.method === "POST" ){
        const {query: {id:queryId, respid}, body: {name, phone, birthday, residentNumber, todayPay, bankName, bankNumber,address, addressDetail, zonecode, sign, deleteFlag, pay, otherProjectAgree}} = req;
        
        if( deleteFlag ){
            const respondent = await client.respondent.delete({
                where: {
                    id: Number(respid),
                }
            });
            res.json({
                ok: true,
                respondent
            })
        }else{
            const respondent = await client.respondent.update({
                where: {
                    id: Number(respid),
                },
                data: {
                    name,
                    phone: phone.toString(),
                    birthday: birthday.toString(),
                    residentNumber: residentNumber.toString(),
                    todayPay,
                    pay,
                    bankName: bankName !== undefined && bankName !== null ? todayPay ? null : bankName.toString() : null,
                    bankNumber: bankNumber !== undefined && bankNumber !== null ? todayPay ? null : bankNumber.toString() : null,
                    address,
                    addressDetail,
                    zonecode,
                    otherProjectAgree,
                }
            });
            res.json({
                ok: true,
                respondent,
            });
        }
    }
    
    if( req.method === "GET" ){
        const {query: {id:queryId, respid}} = req;
        const respondent = await client.respondent.findFirst({
            where: {
                id: Number(respid),
            }
        })
        res.json({
            ok: true,
            respondent,
        });
    }
}

export default withApiSession(
    withHandler({
        methods: ["GET", "POST"],
        handler
    })
);