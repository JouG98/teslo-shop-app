import mongoose, { Schema, model, Model } from 'mongoose'
import { IUser } from '../interfaces';

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    picture: { type: String },
    rol: {
        type: String, 
        enum:{
        values: ['client', 'admin','super-user', 'SEO'],
        message: '{VALUE}, required',
        default: 'client',
        required: true,
    }},
    status:{ type: Boolean, default: true },
    google:{ type: Boolean, default: false },
    credential: {
        type: String,
        enum:{
            values: ['credentials', 'github', 'google', 'facebook'],
            message: '{VALUE}, required',
            default: 'credentials',
        }
    }

},
{
    timestamps: true, // create and update
});

const User:Model<IUser> = mongoose.models.User || model('User', userSchema);

export default User;