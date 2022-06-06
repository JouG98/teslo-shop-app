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

export default function login (req: NextApiRequest, res: NextApiResponse<Data>) {
    // res.status(200).json({ name: 'Example' })
    switch (req.method) {
        case 'POST':
            return userLogin( req, res );
    
        default:
            return res.status(400).json({
                ok: false,
                msg: `Peticion no registrada`,
            })
    }
}

const userLogin = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    // throw new Error('Function not implemented.');
    const { email = '', password = '' } = req.body;

    await db.connect();

    const user = await UserModel.findOne({ email });
    
    await db.disconnect();
    
    if( !user ) {
        res.status(400).json({
            ok: false,
            msg: `Usuario no exite en la DB - Email`,
        });
    }

    if( !bcrypt.compareSync(password, user?.password!)){
        res.status(400).json({
            ok: false,
            msg: `Usuario no exite en la DB - Password`,
        });
    }

    const token = jwt.generateJWT(user?._id!, email);

    return res.status(200).json({
        ok: true,
        msg: `User Found`,
        token, 
        user:{
            email,
            name: user?.name!,
            rol: user?.rol!,
        }
    })
}

