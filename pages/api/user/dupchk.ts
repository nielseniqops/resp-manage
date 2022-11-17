import client from "@libs/server/client";
import withHandler, {ResponseType} from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req:NextApiRequest, res:NextApiResponse<ResponseType>){
    const {body: {email, phone}} = req;

    const emailChk = await client.user.findMany({
        where:{
            email: email
        }
    });
    let emailFlag = emailChk.length > 0;
    let phoneFlag = false;
    if( phone !== "" && phone !== undefined && phone !== null ){
        const phoneChk = await client.user.findMany({
            where:{
                phone: phone
            }
        });
        if( phoneChk.length > 0 ){
            phoneFlag = true;
        }
    }

    res.json({
        ok: true,
        email: emailFlag,
        phone: phoneFlag
    })
}

export default withApiSession(
    withHandler({
        methods: ["POST"],
        handler
    })
);