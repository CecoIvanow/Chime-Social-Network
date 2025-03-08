import express, { urlencoded } from 'express'
import mongoose from 'mongoose'
import routes from './routes.js';
import 'dotenv/config'

const port = 4012;
const app = express();

// MongoDB setup
const URI = process.env.DATABASE_URI;
try {
    await mongoose.connect(URI);

    console.log('Successfully connected to DB');
} catch (error) {
    console.log('Failed to connect to DB');
    console.error(error.message)
}

//CORS enable
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
})

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(routes);

// Express starting
app.listen(port, () => console.log(`Server is listening on port http://localhost:4012`));