const { gql } = require('apollo-server-express');

module.exports = gql`
    extend type Query {
        user: User!
    }

   extend type Mutation {
        signUp(input: signUpInput!): User
        login(input: loginInput!): Token
    }

    type Token {
        token: String!
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

    input loginInput {
        email: String!
        password: String!
    }

    input signUpInput {
        name: String!
        email: String!
        password: String!
    }
`;