import client from "@libs/server/client";
import withHandler, {ResponseType} from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req:NextApiRequest, res:NextApiResponse<ResponseType>){
    if( req.method === "POST" ){
        const {body: {search}} = req;

        const projects = await client.project.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains : search
                        }
                    },
                    {
                        user: {
                            name: {
                                contains : search
                            }
                        }
                    },
                    {
                        opNumber: {
                            contains : search
                        }
                    },
                    {
                        wbsNumber: {
                            contains : search
                        }
                    },
                ]
                
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
            ]
        });

        res.json({
            ok: true,
            projects,
        });
    }
}

export default withApiSession(
    withHandler({
        methods: ["POST"],
        handler
    })
);