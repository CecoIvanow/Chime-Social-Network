import express, { urlencoded } from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import 'dotenv/config'

import routes from './routes.js';

const port = 4012;
const app = express();

// MongoDB setup
const URI = `mongodb+srv://${process.env.DATABASE_NAME}:${process.env.DATABASE_PASSWORD}@cluster0.f93mo.mongodb.net/?appName=Cluster0` || 'mongodb://127.0.0.1:/Chime';
try {
    await mongoose.connect(URI);

    console.log('Successfully connected to DB');
} catch (error) {
    console.log('Failed to connect to DB');
    console.error(error.message)
}

//CORS enable
app.use((req, res, next) => {
    const whitelistedOrigins = [
        'http://localhost:4569',
        'http://localhost:3567',
        '0.0.0.0:4569',
        '0.0.0.0:3567',
    ]

    const originIndex = whitelistedOrigins.indexOf(req.headers.origin);

    res.header('Access-Control-Allow-Origin', whitelistedOrigins[originIndex]);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    next();
})

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(routes);

// Express starting
app.listen(port, "0.0.0.0", () => console.log(`Server is listening on port http://localhost:4012`));