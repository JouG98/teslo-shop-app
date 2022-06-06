import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { UserModel } from '../../../models';
import bcrypt from 'bcrypt';
import { jwt, validations } from '../../../utils';

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

export default function register (req: NextApiRequest, res: NextApiResponse<Data>) {
    // res.status(200).json({ name: 'Example' })
    switch (req.method) {
        case 'POST':
            return registerUser( req, res );
    
        default:
            return res.status(400).json({
                ok: false,
                msg: `Peticion no registrada`,
            })
    }
}

const registerUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    // throw new Error('Function not implemented.');
    const { name= '', email = '', password = '' } = req.body as { name: string, email: string, password: string}; 


    if( name.length < 2) {
        return res.status(400).json({
            ok: false,
            msg: `name is required`,
        })
    }

    if( !email ) {
        return res.status(400).json({
            ok: false,
            msg: `email is required`,
        })
    }

    if( password.length < 6 ) {
        return res.status(400).json({
            ok: false,
            msg: `password is required`,
        })
    }

    if( !validations.isValidEmail(email)){
        return res.status(400).json({
            ok: false,
            msg: `email no valid`,
        })
    }

    await db.connect();

    // si correo ya existe
    const user = await UserModel.findOne({email});

    if( user ){

        await db.disconnect();
        return res.status(400).json({
            ok:false,
            msg: `User exist`
        })
    }

    try {
        
        const newUser = new UserModel({
            name,
            email: email.toLowerCase(),
            password: bcrypt.hashSync(password, 10),
            rol: 'client'
        })
        
        await newUser.save( { validateBeforeSave: true} );

        const token = jwt.generateJWT(newUser?._id!, email);

        return res.status(200).json({
            ok: true,
            msg: `User Created`,
            token, 
            user:{
                email,
                name: newUser?.name!,
                rol: newUser?.rol!,
            }
        })

    } catch (error) {

        console.log(error)
        res.status(400).json({
            ok: false,
            msg: `Error`,
        })
        
    }


    
   

   
}

