import client from "@libs/server/client";
import withHandler, {ResponseType} from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import { encodeText } from "@libs/client/utils";

async function handler(req:NextApiRequest, res:NextApiResponse<ResponseType>){
    const {body: {email, password}} = req;
    
    await client.user.update({
        where:{
            email
        },
        data: {
            password,
            pwChange: true
        }
    })

    res.json({
        ok: true,
    });
}

export default withApiSession(
    withHandler({
        methods: ["POST"],
        handler
    })
);