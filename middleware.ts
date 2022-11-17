import { NextRequest, NextFetchEvent, userAgent } from "next/server";
import { NextResponse } from "next/server";


export function middleware(req:NextRequest, ev:NextFetchEvent){
    const { device, isBot } = userAgent(req);
    const res = NextResponse.next();
    let enterFlag = false;
    if( isBot ){
        //return new Response("Please don't be a bot.", {status: 403});
        //return NextResponse.rewrite("Please don't be a bot.", {status: 403});
    }
    else if( isBot !== undefined ){
        if( req.url.startsWith("/enter") ){
            req.cookies.delete("respsession");
        }
        if( !req.url.includes("/enter") ){
            if( req.url.includes("/resp") ){
                if( req.url.includes("mode=direct") ){
                    if( !req.cookies.get("respsession") ){
                        enterFlag = true;
                    }
                }
            }else{
                if( !req.cookies.get("respsession") ) {
                    enterFlag = true;
                }
            }
            if( !req.url.includes("/qranswer") && !req.url.includes("/complete") ){
                if( enterFlag ){
                    const url = req.nextUrl.clone();
                    url.pathname = '/enter';
                    return NextResponse.redirect(url);
                }
            }
        }
    }
}

export const config = {
    matcher: ['/', '/enter', '/user/:path*', '/project/:path*', '/search/:path*'],
}