const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');
const dotEnv = require('dotenv');

const { tasks, users } = require('./constants');

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

    type User {
        id: ID!
        name: String!
        email: String!
        tasks: [Task!]
    }

    type Task {
        id: ID!
        name: String!
        completed: Boolean!
        user: User!
    }
`;

const resolvers = {
    Query: {
        task: (parent, args, ctx, info) => {
             return tasks.find(task => task.id === args.id)
        },
        tasks: () => {
            return tasks
        },
        user: (parent, { id }, ctx, info) => {
            const user = users.find(users => user.id === id)

            if (!user) {
                throw new Error('user not found');
            }

            return user;
        },
        users: () => {
            return users
        },
    },
    Task: {
        user: (parent) => {
            return users.find(user => user.id === parent.userId) 
        },
        name: () => "test-tasj"
    },
    User: {
        tasks: ({ id }) => {
            return tasks.filter(task => task.id === id);
        }
    }
};

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