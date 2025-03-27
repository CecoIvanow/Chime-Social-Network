import { Schema, Types, model } from "mongoose";

const userSchema = new Schema({
    email: {
        type: String,
        // required: [true, 'Email is requred!'],
    },
    password: {
        type: String,
        // required: [true, 'Password is required!'],
    },
    firstName: {
        type: String,
        // required: [true, 'First name is required!']
    },
    lastName: {
        type: String,
        // required: [true, 'Last name is required!']
    },
    birthday: {
        type: String,
        // required: [true, 'Birthday is required!']
    },
    gender: {
        type: String,
        // required: [true, 'Gender is required!']
    },
    imageUrl: {
        type: String,
    },
    bio: {
        type: String,
    },
    location: {
        type: String,
    },
    occupation: {
        type: String,
    },
    education: {
        type: String,
    },
    status: {
        type: String,
    },
    createdAt: {
        type: Date,
    },
    friends: [{
        type: Types.ObjectId,
        ref: 'User',
    }],
    createdPosts: [{
        type: Types.ObjectId,
        ref: 'Post',
    }]
})

const User = model('User', userSchema);

export default User;