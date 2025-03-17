import { model, Schema, Types } from "mongoose";

const postSchema = new Schema({
    text: {
        type: String
    },
    owner: {
        type: Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
    },
    postedOn: {
        type: String,
    },
    comments: [{
        type: Types.ObjectId,
        ref: 'Comment'
    }],
    likes: [{
        type: Types.ObjectId,
        ref: 'User'
    }],
})

const Post = model('Post', postSchema);

export default Post;