import Mongoose from 'mongoose';
import { config } from '../config.js';

export async function connectDB(){
    return Mongoose.connect(config.db.host);
}


//_id -> id
export function useVirtualId(schema){
    schema.virtual('id').get(function(){
        return this._id.toString();
    });
    
    schema.set('toJSON',{virtuals:true});
    schema.set('toObject',{virtuals:true}); //console.log로 출력할 때 확인하기위해
}