import client from "@libs/server/client";
import withHandler, {ResponseType} from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import { decodeText } from "@libs/client/utils";

async function handler(req:NextApiRequest, res:NextApiResponse<ResponseType>){
    const {body: {email, password}} = req;

    const me = await client.user.findUnique({
        where:{
            email: email
        },
        select: {
            email: true,
            password: true,
            pwChange: true
        }
    });

    if( me === null || me === undefined ){
        res.json({
            ok: false,
            error: "email",
            user: null
        })
    }else{
        const submitPassword = decodeText(password);
        const mePassword = decodeText(me.password);

        if( submitPassword !== mePassword ){
            res.json({
                ok: false,
                error: "password",
                user: null
            }) 
        }else{
            const user = await client.user.findUnique({
                where:{
                    email: email
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    permission: true,
                    pwChange: true
                }
            });
            
            req.session.user = {
                id: user?.id,
            }
            await req.session.save();
            
            res.json({
                ok: true,
                user,
            })
        }
    }
}


export default withApiSession(
    withHandler({
        methods: ["POST"],
        handler
    })
);