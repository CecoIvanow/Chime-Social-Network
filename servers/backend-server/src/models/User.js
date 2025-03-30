import { Schema, Types, model } from "mongoose";

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required!'],
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
    },
    firstName: {
        type: String,
        required: [true, 'First name is required!'],
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required!'],
    },
    birthday: {
        type: String,
        required: [true, 'Birthday is required!'],
    },
    gender: {
        type: String,
        required: [true, 'Gender is required!'],
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
    memberSince: {
        type: String
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

userSchema.pre('validate', function (next) {
    if (!this.firstName) {
        return next(new Error('First name is required!'))

    } else if (!this.lastName) {
        return next(new Error('Last name is required!'))

    } else if (!this.email) {
        return next(new Error('Email is required!'))

    } else if (!this.birthday) {
        return next(new Error('Birthday is required!'))

    } else if (!this.password) {
        return next(new Error('Password is required!'))

    } else if (!this.gender) {
        return next(new Error('Gender is required!'))

    }
    
    next();
})

const User = model('User', userSchema);

export default User;