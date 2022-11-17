import client from "@libs/server/client";
import withHandler, {ResponseType} from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req:NextApiRequest, res:NextApiResponse<ResponseType>){
    if( req.method === "POST" ){
        const {body: {name, opNumber, wbsNumber, group, payType}, session: {user}} = req;
        
        const project = await client.project.create({
            data: {
                name,
                opNumber : (opNumber !== "" && opNumber !== undefined && opNumber  !== null) ? opNumber : null,
                wbsNumber : (wbsNumber !== "" && wbsNumber !== undefined && wbsNumber  !== null) ? wbsNumber : null,
                group : (group !== "" && group !== undefined && group  !== null) ? group : null,
                status: "Active",
                user: {
                    connect: {
                        id: user?.id
                    }
                },
                payType
            }
        });

        res.json({
            ok: true,
            project,
        });
    }

    if( req.method === "GET" ){
        const {query: {page}} = req;
        const take = 15;
        const skip = (Number(page) - 1)*take;

        const list = await client.project.findMany({
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
        methods: ["GET", "POST"],
        handler
    })
);