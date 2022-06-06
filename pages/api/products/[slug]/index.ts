import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../../database'
import { IProduct } from '../../../../interfaces'
import { ProductModel } from '../../../../models'


type Data = 
{
    ok: boolean
    msg: string
}
|
{
    ok: boolean,
    msg: string,
    products: IProduct [],
}
|
{
  ok: boolean,
  msg: string,
  product: IProduct
}


export default function productBySlug (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'GET':
            return getProductBySlug( req, res );

        // case 'PUT':
        //     return updateEntry( req, res );

        // case 'DELETE':
        //     return deleteEntry( req, res );
    
        default:
            return res.status(400).json({
                ok: false,
                msg:`No Authorizado`
            })
    }

}

const getProductBySlug = async (req: NextApiRequest, res: NextApiResponse<Data>)  => {

    const { slug } = req.query;

    try {

        db.connect();

        const productFound = await ProductModel.findOne( { slug } ).lean();
        // console.log({productFound})

        db.disconnect();

        if(!productFound){
            res.status(404).json({
                ok: true,
                msg: `No found Product`,
            })
        }


         // TODO image para adaptar url
         productFound!.images = productFound!.images.map( image => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}/products/${image}`
        })

        
        res.status(200).json({
            ok: true,
            msg: `Data found`,
            product:  productFound!, // ! se que la data viene
            // entry: entryFound!
        })
    } catch (error) {
        db.disconnect();
        
        res.status(500).json({
            ok: true,
            msg: `Error `,
        })
    }

}
