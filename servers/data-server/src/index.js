import express, { urlencoded } from 'express'
import mongoose from 'mongoose'
import 'dotenv/config'
import routes from './routes.js';

const port = process.env.PORT
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

app.use(express.urlencoded({ extended: false }));
app.use(routes);

// Express starting
app.listen(port, () => console.log(`Server is listening on port http://localhost:${port}`));