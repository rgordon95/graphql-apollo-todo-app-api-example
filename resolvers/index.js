const { GraphQLDateTime } = require('graphql-iso-date');

const userResolver = require('./user');
const taskResolver = require('./task');

const customDataScalarResolver= {
    Date: GraphQLDateTime
};

module.exports = [
    userResolver,
    taskResolver,
    customDataScalarResolver
];