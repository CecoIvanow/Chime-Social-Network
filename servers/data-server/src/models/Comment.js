import { model, Schema, Types } from "mongoose";

const commentSchema = new Schema({
    text: {
        type: String
    },
    onPost: {
        type: Types.ObjectId,
        ref: 'Post'
    },
    owner: {
        type: Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Comment = model('Comment', commentSchema);

export default Comment;