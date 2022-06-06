import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { NextFetchEvent, NextResponse } from 'next/server';


export async function middleware ( req: NextRequest, event: NextFetchEvent ) {

    const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    // console.log({session})

    if(!session ){

        return new Response( JSON.stringify({
            msg: 'no autorizado',
        }), {
            headers: {
                'Content-Type': 'application/json'
            }
        })

    }

    const isValidRol = ['admin', 'super-user', 'SEO'];

    if(!isValidRol.includes(session.user.rol)){
        return new Response( JSON.stringify({
            msg: 'no autorizado',
        }), {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    return NextResponse.next();

}