import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../../database';
import { IProduct } from '../../../../interfaces';
import { ProductModel } from '../../../../models';

type Data = 
{
    ok: boolean,
    msg: string,
}
|
{
    ok: boolean,
    msg: string,
    products: IProduct[]
}

export default function searchQ (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'GET':
            return searchProducts( req, res);
                        
        default:
            return res.status(404).json({
                ok: false,
                msg: `Endpoint not found`,
            })
    }
}

const searchProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    let { q = '' } = req.query;

    if ( q.length === 0 ){
        res.status(400).json({
            ok: false,
            msg: `The query is required`
        })
    }

    q = q.toString().toLowerCase();

    db.connect();
    
    const productsFound = await ProductModel.find({
        $text:{
            $search: q
        }
    })
    .select('title images price slug inStock -_id')
    .lean();

    db.disconnect();

    res.status(200).json({
        ok: true,
        msg: `Found produts`,
        products: productsFound,
    })
}