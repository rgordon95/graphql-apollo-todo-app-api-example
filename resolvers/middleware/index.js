const { skip } = require('graphql-resolvers');

module.exports.isAuthenticated = (parent, args, { email }, info ) => {
    if (!email) {
        throw new Error('incorrest or missing email')
    }
    return skip;
}