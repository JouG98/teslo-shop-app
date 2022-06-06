import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { NextFetchEvent, NextResponse } from 'next/server';
import { jwt } from '../../utils';


export async function middleware ( req: NextRequest, event: NextFetchEvent ) {

    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    // console.log({session})

    if(!session ){

        const requestPage = req.page.name;

        return NextResponse.redirect(new URL(`/auth/login?p=${requestPage}`, req.url))

    }

    return NextResponse.next();


    /**
     * 
     * Con authenticacion personalizada - no con next auth
     * 
     * 
     const { token = '' } = req.cookies;
     // console.log(token)
 
     try {
         
         // validar el token: cambia con next auth
         await jwt.validateToken(token);
         // console.log('X aqui paso')
         return NextResponse.next();
 
     } catch (error) {
 
         console.log({error})
         
         const requestPage = req.page.name;
         // console.log({requestPage})
         // return NextResponse.redirect(`/auth/login?p=${requestPage}`);
         // return NextResponse.redirect(`/auth/login`);
 
         
          // De la documentacion de next asi lo recomienda
          
         return NextResponse.redirect(new URL(`/auth/login?p=${requestPage}`, req.url))
        }
     * 
     * 
     * 
     * 
     * 
     */


  

}