import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const categorySchema = new Schema({
    description: {
        type: String,
        required: true,
    },
    departement: {
        type: String,
        required: true,
        enum: ['math','physique', 'info']
    }
},  {timestamps : true}
);

export default model('Category', categorySchema , 'Category');