import type { NextApiRequest, NextApiResponse } from 'next'
import { db, SHOP_CONTANTS } from '../../../database'
import { ProductModel } from '../../../models'
import { IProduct } from '../../../interfaces/products';

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


export default function products (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'GET':
            return getProducts( req, res );

        // case 'POST':
        //     return postEntry( req, res );
        
       
        default:
            return res.status(400).json({
                ok: false,
                msg:`No Authorizado`
            })
    }

}

const getProducts = async ( req: NextApiRequest, res:NextApiResponse<Data> ) => {

    const { gender = 'all'} = req.query;

    let condition = {};
    
    // Condicion para validar los tipos de generos o articulos
    if( gender !== 'all' && SHOP_CONTANTS.validConstant.includes(`${gender}`)){
        condition = { gender }
        // console.log({condition})
    }

    // open connection db
    await db.connect();

    // Cuerpo como controlador
    const products = await ProductModel.find( condition ) // enviar la condition para que traiga esos elementos
                                    .select('title images price slug inStock -_id')
                                    // devuelve solo lo selecionado
                                    .lean();
                                    // no devuelve los metodos, es mas ligero
    // console.log({products})

    // disconnect db
    await db.disconnect();

    const updatedProducts = products.map( product => {
        // TODO image para adaptar url
        product.images = product.images.map( image => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}/products/${image}`
        })
        return product;
    })

    // respuesta
    res.status(200).json({
        ok: true,
        msg:`Products`,
        products: updatedProducts,
        // products,
    })

}

