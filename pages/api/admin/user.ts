import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { IUser } from '../../../interfaces';
import { UserModel } from '../../../models';
import { isValidObjectId } from 'mongoose';
import { join } from 'path';

type Data = 
{
    ok: boolean;
    msg: string;
}
|
{
    ok: boolean;
    msg: string;
    users: IUser[];
}

export default function handle (req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getUser( req, res );

        case 'PUT':
            return updateUSer(req, res);

        default:
            return res.status(400).json({
                ok: false,
                msg:`No Authorizace`,
            })
    }
}

const getUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    // puedo paginar

    await db.connect();

    const users = await UserModel.find().select('-password').lean();

    await db.disconnect();

    return res.status(200).json({
        ok: true,
        msg: `User Found`,
        users,
    })
}
const updateUSer = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { userId = '', rol = '' } = req.body

    if(!isValidObjectId(userId)){
        return res.status(400).json({
            ok: false,
            msg:`No Found ID USER`,
        })
    }

    const validRoles = ['admin', 'super-user', 'SEO', 'client'];

    if(!validRoles.includes(rol)){
        return res.status(400).json({
            ok: false,
            msg:`No ROl, use: ${validRoles.join(', ')}`,
        })
    }

    await db.connect();

    const user = await UserModel.findById(userId);

    if(!user){
        await db.disconnect();
        return res.status(400).json({
            ok: false,
            msg:`User not fount, ${userId}`,
        })
    }

    // update

    user.rol = rol;
    await user.save();

    await db.disconnect();

    return res.status(200).json({
        ok: true,
        msg: `User update`
    })
}

