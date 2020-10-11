const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const dotEnv = require('dotenv');

dotEnv.config();

const app = express();

// body parser middleware

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use('/', (req, res, next) => {
    res.send({ message: 'hello' })
})

app.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`)
});