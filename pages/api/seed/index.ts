import type { NextApiRequest, NextApiResponse } from 'next'
import { db, SeedData } from '../../../database'
import { ProductModel, UserModel } from '../../../models';

type Data = {
    ok: boolean,
    msg: string
}

export default async function seed (req: NextApiRequest, res: NextApiResponse<Data>) {

    if (process.env.NODE_ENV === 'production'){
        return res.status(401).json({
            ok: true,
            msg: `No autorizaed`
        })
    }

    await db.connect();

    await UserModel.deleteMany();  // elimina todo el doc de la db

    await UserModel.insertMany( SeedData.initialData.users );

    await ProductModel.deleteMany();  // elimina todo el doc de la db

    await ProductModel.insertMany( SeedData.initialData.products );

    await db.disconnect();


    res.status(200).json({
       ok: true,
       msg: 'Se insertó la data' 
    })
}