import { Schema, Types, model } from "mongoose";

const userSchema = Schema({
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
    friends: [{
        type: Types.ObjectId,
        ref: 'User',
    }],
    createdPosts: [{
        type: Types.ObjectId,
        red: 'Post',
    }]
})

const User = model('User', userSchema);

export default User;