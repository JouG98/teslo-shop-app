import type { NextApiRequest, NextApiResponse } from 'next'

import fs from 'fs'

import formidable from 'formidable';

import { v2 as cloudinary } from 'cloudinary'

cloudinary.config(process.env.CLOUDINARY_URL || '');


type Data = {
    msg: string
}

export const config = {
    api:{
        bodyParser: false,
    }
}

export default function handle (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'POST':
            
            /* Calling the function `uploadFile` and passing the request and response objects to it. */
            return uploadFile( req, res );

        // case 'DELETE':
        //     return deleteFile(req, res);
            
            default:
                return res.status(400).json({ msg: 'No autorizado' })
    }
}


const saveFile = async( file : formidable.File ) : Promise<string>=> {

    /**
     * Para almacenar en forma local, no se debe hace
     */

    // const data = fs.readFileSync( file.filepath );
    // fs.writeFileSync(`./public/${file.originalFilename}`, data);
    // fs.unlinkSync(file.filepath);
    // return

    /**
     * Subir en cloudinary
     */

    const { secure_url } = await cloudinary.uploader.upload(file.filepath);
    // console.log(secure_url)
    return secure_url
}
 
const parseFile = async ( req: NextApiRequest ): Promise<string> => {

    return new Promise( ( resolve, reject ) => {

        const form = new formidable.IncomingForm();
        form.parse( req, async (err, fields, files) => {
            // console.log({err, fields, files})

            if(err) return reject(err)

            const imgURL = await saveFile( files.file as formidable.File)
            resolve(imgURL)
        })

    })
}


const uploadFile = async ( req: NextApiRequest, res: NextApiResponse ) => {

    const urlPathImg = await parseFile(req);

    return res.status(200).json({ msg: urlPathImg })
}


// Eliminar de cloudinary

const deleteFile = async ( req: NextApiRequest, res: NextApiResponse ) => {

    // const { img = ''} = req.query as { img: string};
    // console.log({req})

    // console.log({data: req.url});

    
    try {
        const img: string = req.url!;
    
    //     req.headers;
    // console.log({img})
        const [fileId, ext] = img.substring( img.lastIndexOf('%2F') + 1).split('.');
        console.log({img, fileId, ext});
        await cloudinary.uploader.destroy(fileId);
    
        return res.status(200).json({ msg: 'Deleted img' })
        
    } catch (error) {
        console.log(error)
        return res.status(400).json({ msg: 'Not Deleted img' })
    }

}