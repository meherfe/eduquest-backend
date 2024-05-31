import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const assignmentSchema = new Schema({
    description: {
        type: String,
        required: true,
    },

    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['correction','workshop', 'correction examen', 'tp']
    },

    deadline: {
        type: Date,
        required: true,
    },

}, { timestamps: true });

export default model('Assignment', assignmentSchema , 'Assignment');