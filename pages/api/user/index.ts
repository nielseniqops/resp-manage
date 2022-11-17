import client from "@libs/server/client";
import withHandler, {ResponseType} from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import { encodeText } from "@libs/client/utils";

async function handler(req:NextApiRequest, res:NextApiResponse<ResponseType>){
    if( req.method === "POST" ){
        const {body: {email, phone, name, permission}} = req;
        
        const user = await client.user.create({
            data: {
                email,
                password: encodeText("password123@"),
                phone: phone === "" || phone === undefined || phone === null ? null : String(phone),
                name,
                permission,
            }
        });

        res.json({
            ok: true,
            user,
        });
    }
    if( req.method === "GET" ){
        const users = await client.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                permission: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        res.json({
            ok: true,
            users,
        });
    }
}

export default withApiSession(
    withHandler({
        methods: ["GET", "POST"],
        handler
    })
);