const { gql } = require('apollo-server-express');

module.exports = gql`
    extend type Query {
        users: [User!]
        user(id: ID!): User!
    }

   extend type Mutation {
        signUp(input: signUpInput!): User
    }

    type User {
        id: ID!
        name: String!
        email: String!
        password: String!
        tasks: [Task!]
        createdAt: Date!
        updatedAt: Date!
    }

    extend type User {
        address: String
    }

    input signUpInput {
        name: String!
        email: String!
        password: String!
    }
`;