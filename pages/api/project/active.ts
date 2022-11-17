import client from "@libs/server/client";
import withHandler, {ResponseType} from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req:NextApiRequest, res:NextApiResponse<ResponseType>){
    if( req.method === "GET" ){
        const {query: {page}} = req;
        const take = 15;
        const skip = (Number(page) - 1)*take;

        const list = await client.project.findMany({
            where:{
                status: "Active"
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                _count: {
                    select: {
                        respondent: true
                    }
                }
            },
            orderBy: [
                {
                    createdAt: 'desc'
                }
            ],
            take,
            skip
        });

        res.json({
            ok: true,
            list,
        });
    }
}

export default withApiSession(
    withHandler({
        methods: ["GET"],
        handler
    })
);