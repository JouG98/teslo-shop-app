import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { IProduct } from '../../../interfaces';
import { ProductModel } from '../../../models';
import { isValidObjectId } from 'mongoose';

import { v2 as cloudinary } from 'cloudinary'
import products from '../products/index';

cloudinary.config(process.env.CLOUDINARY_URL || '');


type Data = 
{
    ok: boolean;
    msg: string;
}
|
{
    ok: boolean;
    msg: string;
    product: IProduct
}
|
     IProduct[];

export default function handle (req: NextApiRequest, res: NextApiResponse<Data>) 
{
    // res.status(200).json({ name: 'Example' })

    switch (req.method) {
        case 'GET':
            return getProducts(req, res);

        case 'PUT':
            return updateProduct(req, res);

        case 'POST':
            return createProduct(req, res);

        case 'DELETE':
            return deleteProduct(req, res);

        default:
            return res.status(400).json({
                ok: false,
                msg: 'No authorizace',
            })
    }
}

const  getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    await db.connect();

    const products = await ProductModel.find().sort({'title': 'asc'}).lean();

    await db.disconnect();

    const updatedProducts = products.map( product => {
        // TODO image para adaptar url
        product.images = product.images.map( image => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}/products/${image}`
        })
        return product;
    })

    res.status(200).json(
        updatedProducts
    )
}

const  updateProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    

    const { _id = '', images= [] } = req.body as IProduct;

    console.log({body : req.body})

    if(!isValidObjectId(_id)){
        return res.status(400).json({
            msg: `Id no valid`,
            ok: false
        })
    }

    if( images.length < 2 ){
        return res.status(400).json({
            msg: `Images min 2`,
            ok: false
        })
    }
    
    try {
        
        await db.connect();

        const product = await ProductModel.findById(_id);

        console.log({product})

        if(!product){
            await db.disconnect();

            return res.status(400).json({
                msg: `Product don´t exist`,
                ok: false
            })
        }

        // TODO: Eliminar img de cloudinary

        product.images.forEach( async( img ) => {
            if(!images.includes(img)){
                console.log('debe eliminar esta img:', img);

                // eliminar de cloudinary

                // Extraer el id de la img
                const [fileId, ext] = img.substring( img.lastIndexOf('/') + 1).split('.');
                console.log({img, fileId, ext});
                await cloudinary.uploader.destroy(fileId);

            } else {
                console.log('hola');
            }
        })

        await product.update( req.body );
    
        await db.disconnect();
    
        res.status(200).json({
            ok: true,
            msg: `updateProduct`,
            product
        })

    } catch (error) {
        console.log(error);

        await db.disconnect();
    
        res.status(400).json({
            ok: false,
            msg: `Check server`
            // product
        })
    }

}

const  createProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { images = [] } = req.body as IProduct;

    if(images.length < 2 )
        return res.status(400).json({
            msg: `more 2 images`,
            ok: false
        });

    try {
        await db.connect();

        const validateSlug = await ProductModel.findOne({slug: req.body.slug});

        if(validateSlug){
            await db.disconnect();
            return res.status(400).json({
                msg:`Slug duplicate`,
                ok: false,
            });
        }

        const product = new ProductModel(req.body);

        await product.save();
    
        await db.disconnect();
    
        res.status(201).json({
            ok: true,
            msg: `createProduct`
        })
        
    } catch (error) {
        console.log(error);
        await db.disconnect();
        res.status(400).json({
            ok: true,
            msg: `createProduct`
        })
    }

}

const  deleteProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    await db.connect();


    await db.disconnect();

    res.status(200).json({
        ok: true,
        msg: `deleteProduct`
    })
}

