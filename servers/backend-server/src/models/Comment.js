import { model, Schema, Types } from "mongoose";

const commentSchema = new Schema({
    text: {
        type: String,
        required: [true, 'Content is missing']
    },
    onPost: {
        type: Types.ObjectId,
        ref: 'Post',
        required: [true, 'Parent post id is missing!'],
    },
    owner: {
        type: Types.ObjectId,
        ref: 'User',
        required: [true, 'Owner id is missing !'],
    },
    createdAt: {
        type: Date,
    },
    postedOn: {
        type: String,
    }
})

const Comment = model('Comment', commentSchema);

export default Comment;