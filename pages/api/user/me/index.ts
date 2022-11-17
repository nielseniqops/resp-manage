import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(req:NextApiRequest, res:NextApiResponse<ResponseType>){
    if( req.method === "GET" ){
        if( req.session.user !== undefined ){
            const profile = await client.user.findUnique({
                where:{ id:req.session.user?.id },
                select:{
                    id: true,
                    email: true,
                    name: true,
                    phone: true,
                    permission: true,
                }
            });
            
            res.json({
                ok: true,
                profile,
            });
        }else{
            res.json({
                ok: true,
                profile: null,
            });
        }
    }
}

export default withApiSession(
    withHandler({
        methods: ["GET", "POST"],
        handler
    })
);