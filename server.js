const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');
const dotEnv = require('dotenv');

const resolvers = require('./resolvers');
// set env variables
dotEnv.config();

const app = express();

// cors
app.use(cors());

// body parser middleware

app.use(express.json());

const typeDefs = gql`
    type Query {
        greetings: [String!]
        task(id: ID!): Task!
        tasks: [Task!]
        users: [User!]
        user(id: ID!): User!
    }

    type Mutation {
        createTask(input: createTaskInput!): Task
        createUser(input: createUserInput!): User
    }

    type User {
        id: ID!
        name: String!
        email: String!
        tasks: [Task!]
    }

    extend type User {
        address: String
    }

    type Task {
        id: ID!
        name: String!
        completed: Boolean!
        user: User!
    }

    input createTaskInput {
        name: String!
        completed: Boolean!
        userId: ID!
    }

    input createUserInput {
        id: ID!
        name: String!
        email: String!
    }
`;

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
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