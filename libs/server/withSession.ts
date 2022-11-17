import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

declare module "iron-session"{
    interface IronSessionData{
        user?:{
            id: number | undefined;
        }
    }
}

const cookieOptions = {
    cookieName: "respsession",
    password: process.env.COOKIE_PASSWORD!,
}

export function withApiSession(fn:any){
    return withIronSessionApiRoute(fn, cookieOptions);
}

export function withSsrSession(handler:any){
    return withIronSessionSsr(handler, cookieOptions);
}
