import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(req:NextApiRequest, res:NextApiResponse<ResponseType>){
    if( req.method === "POST" ){
        const { query : {id}, body: {email, phone, name, permission, password, pwChange} } = req;

        const emailChk = await client.user.findMany({
            where: {
                email: email,
                NOT : {
                    id: Number(id)
                }
            }
        });
        let emailFlag = emailChk.length > 0;
        let phoneFlag = false;
        if( phone !== "" && phone !== undefined && phone !== null ){
            const phoneChk = await client.user.findMany({
                where: {
                    phone: phone,
                    NOT : {
                        id: Number(id)
                    }
                }
            });
            if( phoneChk.length > 0 ){
                phoneFlag = true;
            }
        }
    
        if( emailFlag || phoneFlag ){
            return res.json({
                ok: false,
                emailFlag,
                phoneFlag
            });
        }

        if( password === null || password === undefined ){
            const user = await client.user.update({
                where:{ id: Number(id) },
                data:{
                    email,
                    name,
                    phone: phone === "" || phone === undefined || phone === null ? null : String(phone),
                    permission,
                }
            });
            res.json({
                ok: true,
                user,
            });
        }else{
            const user = await client.user.update({
                where:{ id: Number(id) },
                data:{
                    email,
                    name,
                    phone: phone === "" || phone === undefined || phone === null ? null : String(phone),
                    permission,
                    password,
                    pwChange
                }
            });
            res.json({
                ok: true,
                user,
            });
        }
        
    }
    if( req.method === "GET" ){
        const { query : {id} } = req;

        const user = await client.user.findUnique({
            where:{ id: Number(id) },
            
            select:{
                id: true,
                email: true,
                name: true,
                phone: true,
                permission: true,
                password: true
            }
        });
        
        res.json({
            ok: true,
            user,
        });
    }
}

export default withApiSession(
    withHandler({
        methods: ["GET", "POST"],
        handler
    })
);