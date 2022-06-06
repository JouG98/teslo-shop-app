import { db } from "."
import { UserModel } from "../models";
import bcrypt from 'bcrypt';


export const checkUserEmailAndPassword = async ( email: string , password: string ) => {
 
    await db.connect();

    const user = await UserModel.findOne({ email });

    await db.disconnect();

    if( !user ){
        return null;
    }

    if( !bcrypt.compareSync( password, user.password )){
        return null;
    }

    const { _id, name, rol, picture, credential} = user;

    return{
        _id,
        email: email.toLowerCase(),
        name,
        rol,
        picture,
        credential,
    }
}

export const OAuthToDbUser = async (
     OAuthEmail:string, 
     OAuthName: string, 
     OAuthImage: string, 
     OAuthCredential: string ) => {

    await db.connect();

    const user = await UserModel.findOne({ email: OAuthEmail });

    if( user ) {

        await db.disconnect();

        const { _id, name, email, rol, picture, credential } = user;

        return { _id, name, email, rol, picture, credential }
    }
    
    // si no existe, creo un nuevo usuario

    const newUser = new UserModel({ 
        email: OAuthEmail, 
        name: OAuthName, 
        rol: 'client', 
        password: ':P',
        picture: OAuthImage,
        credential: OAuthCredential,
    });

    await newUser.save();

    await db.disconnect();

    const { _id, name, email, rol, picture, credential} = newUser;

    return { _id, name, email, rol, picture, credential};
}