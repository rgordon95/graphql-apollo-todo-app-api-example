const { skip } = require('graphql-resolvers');
const Task = require('../../database/models/task');
const { isValidObjectId } = require('../../database/util');

module.exports.isAuthenticated = (parent, args, { email }, info ) => {
    if (!email) {
        throw new Error('incorrect or missing email');
    }
    return skip;
}

module.exports.isTaskOwner = async (parent, { id }, { loggedInUserId }, info) => {
    try {     
        if (!isValidObjectId(id)) {
            throw new Error('invalid task id');
        }
        const task = await Task.findById(id);
        if (!task) {
            throw new Error('no task found')
        } else if (task.user.toString() !== loggedInUserId) {
            throw new Error(`You don't have permission to view this task.`);
        }
        return skip;
    } catch (error) {
        console.log('error: ', error)
        throw error;
    }
}