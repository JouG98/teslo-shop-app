import { db } from "."
import { IProduct } from "../interfaces";
import { ProductModel } from "../models";


export const getProductBySlug = async ( slug : string ): Promise<IProduct | null> => {
    
    await db.connect();

    const product = await ProductModel.findOne( {slug } ).lean();
    // console.log({product})

    await db.disconnect();

    if (!product ) {
        return null
    }

    // TODO image para adaptar url
    product.images = product.images.map( image => {
        return image.includes('http') ? image : `${process.env.HOST_NAME}/products/${image}`
    })

    return JSON.parse( JSON.stringify( product ));

    // el retorno se lo hace asi por la serializacion del id de mongo

}

interface pathProps {
    slug : string;
}

export const getPathSlug = async ( ) : Promise <pathProps[]> => {
    await db.connect();

    const slug = await ProductModel.find().select('slug -_id').lean();

    await db.disconnect();

    // if (!slug ){
    //     return null;
    // }

    return slug;
}

export const getSearchByQ = async ( q : string ) :Promise <IProduct[]> => {

    q = q.toString().toLowerCase();
    await db.connect();

    const products = await ProductModel.find({
        $text:{
            $search: q
        }
    })
    .select('title images inStock price slug -_id')
    .lean()

    await db.disconnect();

    
    const updatedProducts = products.map( product => {
        // TODO image para adaptar url
        product.images = product.images.map( image => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}/products/${image}`
        })
        return product;
    })

    return updatedProducts;
}

export const getAllProducts = async () :Promise<IProduct[]> => {

    await db.connect();

    const allProducts = await ProductModel.find().lean();

    await db.disconnect();

    const updatedProducts = allProducts.map( product => {
        // TODO image para adaptar url
        product.images = product.images.map( image => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}/products/${image}`
        })
        return product;
    })

    return JSON.parse(JSON.stringify(updatedProducts)) 
    
}