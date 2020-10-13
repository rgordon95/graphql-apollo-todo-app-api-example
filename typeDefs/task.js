const { gql } = require('apollo-server-express');

module.exports = gql`
 extend type Query {
        task(id: ID!): Task!
        tasks: [Task!]
    }

 extend type Mutation {
        createTask(input: createTaskInput!): Task
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
`;

