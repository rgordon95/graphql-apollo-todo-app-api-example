const { users, tasks } = require('../constants');
const { combineResolvers } = require('graphql-resolvers');
const Task = require('../database/models/task');
const User = require('../database/models/user');
const uuid = require('uuid');
const { isAuthenticated } = require('./middleware');

module.exports = {
    Query: {
        task: (parent, args, ctx, info) => {
             return tasks.find(task => task.id === args.id)
        },
        tasks: () => {
            return tasks
        },
     
    },
    Mutation: {
        createTask: combineResolvers(isAuthenticated, async (parent, { input }, { email }, info) => {
         try {
            const user = await User.findOne({ email: email })
            const task = new Task({ ...input, id: uuid.v4(), user: user.id });
            const result = await task.save();
            user.tasks.push(result.id);
            await user.save();
            return result;
         } catch (error) {
             console.log(error);
             throw error;
         }
        }),
    },
    Task: {
        user: (parent) => {
            return users.find(user => user.id === parent.userId) 
        },
    },
}