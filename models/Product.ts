import mongoose, { Schema, model, Model} from 'mongoose';
import { IProduct } from '../interfaces/products';

const productSchema = new Schema({
    description: { type: String, required: true, default: '' },
    images: [ {type: String} ],
    inStock: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    sizes: [{
        type: String,
        enum: {
            values: [ 'XS','S','M','L','XL','XXL','XXXL'],
            message: `{VALUE} no valid`
        },
        default: 'XS'
    }],
    slug: { type: String, required: true, unique: true}, 
    tags: [ { type: String, }],
    title: { type: String, required: true, default: '' },
    type: {
        type: String,
        enum: {
            values: [ 'shirts','pants','hoodies','hats' ],
            message: `{VALUE} no valid`
        },
        default: 'shirts',
    },
    gender: {
        type: String,
        enum: {
            values: [ 'men','women','kid','unisex' ],
            message: `{VALUE} no valid`
        },
        default: 'men',

    }
},
{
    timestamps: true // crea el createdAt y UpdateAt
},);

// TODO: Crear indice de mongo

productSchema.index({
    title: 'text',
    tags: 'text',
});
// esto para hacer la busqueda entre 2 columnas



const Product: Model<IProduct> = mongoose.models.Product || model('Product', productSchema);

export default Product;