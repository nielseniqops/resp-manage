import client from "@libs/server/client";
import withHandler, {ResponseType} from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req:NextApiRequest, res:NextApiResponse<ResponseType>){
    if( req.method === "POST" ){
        const {body: {search} } = req;
        
        const users = await client.user.findMany({
            where: {
                OR: [
                    {
                        email : {
                            contains: search || '',
                        }
                    },
                    {
                        name : {
                            contains: search || '',
                        }
                    },
                    {
                        phone : {
                            contains: search || '',
                        }
                    }
                ]
            },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                permission: true
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
        methods: ["POST"],
        handler
    })
);