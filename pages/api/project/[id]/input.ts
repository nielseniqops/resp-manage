import client from "@libs/server/client";
import withHandler, {ResponseType} from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req:NextApiRequest, res:NextApiResponse<ResponseType>){
    if( req.method === "GET" ){
        const {query: {id}} = req;
        
        if( id !== undefined ){
            const project = await client.project.findUnique({
                where: {
                    id: +id.toString(),
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
        methods: ["GET"],
        handler
    })
);