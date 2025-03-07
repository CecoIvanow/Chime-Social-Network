import express from 'express'

const port = 3031;
const app = express();

app.get('/', (req, res) => {
    res.send('Works successfully!');
})

app.listen(port, () => console.log('Server is listening on port http://localhost:3031'));