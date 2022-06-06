import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { UserModel } from '../../../models';
import bcrypt from 'bcrypt';
import { jwt } from '../../../utils';

type Data = 
|
{
    ok: boolean,
    msg: string,
}
|
{
    ok: boolean,
    msg: string,
    token: string,
    user:{
        name: string,
        email: string,
        rol: string,
    }
}

export default function validateToken (req: NextApiRequest, res: NextApiResponse<Data>) {
    // res.status(200).json({ name: 'Example' })
    switch (req.method) {
        case 'GET':
            return userLogin( req, res );
    
        default:
            return res.status(400).json({
                ok: false,
                msg: `Peticion no registrada`,
            })
    }
}

const userLogin = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    // const { email = '', password = '' } = req.body;

    const { token = ''} =  req.cookies as { token: string };
    let userId;
    try {
        userId =  await jwt.validateToken(token);
        
    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: `Error en el token`,
        });
    }

    await db.connect();

    const user = await UserModel.findById(userId);

 
    
    await db.disconnect();
    
    if( !user ) {
        res.status(401).json({
            ok: false,
            msg: `Usuario no exite en la DB`,
        });
    }

   
    

    return res.status(200).json({
        ok: true,
        msg: `Verifica token`,
        token:  jwt.generateJWT(user?._id!, user?.email!), 
        user:{
            email: user?.email!,
            name: user?.name!,
            rol: user?.rol!,
        }
    })
}

