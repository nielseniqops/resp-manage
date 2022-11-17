import client from "@libs/server/client";
import withHandler, {ResponseType} from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req:NextApiRequest, res:NextApiResponse<ResponseType>){
    if( req.method === "POST" ){
        const {query: {id}, body: {name, opNumber, wbsNumber, group, status, payType, deleteFlag}} = req;
        
        if( id !== undefined ){
            if( deleteFlag ){
                const proejct = await client.project.delete({
                    where: {
                        id: +id.toString(),
                    }
                });
                res.json({
                    ok: true,
                });
                
            }else{
                const project = await client.project.update({
                    where: {
                        id: +id.toString(),
                    },
                    data: {
                        name,
                        opNumber : (opNumber !== "" && opNumber !== undefined && opNumber  !== null) ? opNumber : null,
                        wbsNumber : (wbsNumber !== "" && wbsNumber !== undefined && wbsNumber  !== null) ? wbsNumber : null,
                        group : (group !== "" && group !== undefined && group  !== null) ? group : null,
                        status,
                        payType
                    }
                });
                
                res.json({
                    ok: true,
                    project,
                });
            }
        }
    }

    if( req.method === "GET" ){
        const {query: {id}} = req;
        
        if( id !== undefined ){
            const project = await client.project.findUnique({
                where: {
                    id: +id.toString(),
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
                }
            });
            
            res.json({
                ok: true,
                project,
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