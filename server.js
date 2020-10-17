const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');
const DataLoader = require('dataloader');
const dotEnv = require('dotenv');

const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');
const { connection } = require('./database/util');
const { verifyUser } = require('./helper/context/index');
const loaders = require('./loaders');

// set env variables
dotEnv.config();

const app = express();

connection();

// cors
app.use(cors());

// body parser middleware
app.use(express.json());

const userLoader = new DataLoader(keys => loaders.user.batchUsers(keys));

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ( { req } ) =>  {
        await verifyUser(req);
        return {
            email: req.email,
            loggedInUserId: req.loggedInUserId,
            loaders: {
                user: userLoader,
            }
        }
    },
    formatError: (error) => {
        return {
            message: error.message
        }  ;
    }
});

apolloServer.applyMiddleware({app, path: '/graphql'});

const PORT = process.env.PORT || 3000;

app.use('/', (req, res, next) => {
    res.send({ message: 'hello' })
})

app.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`)
    console.log(`GRAPHQL ENDPOINT: ${apolloServer.graphqlPath}`)
});