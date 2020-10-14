const { users, tasks } = require('../constants');
const { combineResolvers } = require('graphql-resolvers');
const Task = require('../database/models/task');
const User = require('../database/models/user');
const uuid = require('uuid');
const { isAuthenticated, isTaskOwner } = require('./middleware');

module.exports = {
    Query: {
        task: combineResolvers(isAuthenticated, isTaskOwner, async (parent, { id }, ctx, info) => {
            try {
                const task = await Task.findById(id);
                 return task; 
            } catch (error) {
                throw error;
             }
            }),
        tasks: combineResolvers(isAuthenticated, async (parent, args, { loggedInUserId }, info) => {
            try {
                const tasks = await Task.find({ user: loggedInUserId})
                return tasks;
            } catch (error) {
                console.log(error);
                throw error
            }
        }),
    },
    Mutation: {
        createTask: combineResolvers(isAuthenticated, async (parent, { input }, { email }, info) => {
         try {
            const user = await User.findOne({ email: email })
            const task = new Task({ ...input, user: user.id });
            const result = await task.save();
            user.tasks.push(result.id);
            await user.save();
            return result;
         } catch (error) {
             console.log(error);
             throw error;
         }
        }),
        updateTask: combineResolvers(isAuthenticated, isTaskOwner, async (parent, { id , input }, ctx, info) => {
            try {
                const task = await Task.findByIdAndUpdate(id, { ...input }, { new: true });

                if (!task) {
                    throw new Error('no task found');
                }

                return task;

            } catch (error) {
                console.log(error)
                throw error;
            }
        })
    },
    Task: {
        user: async (parent) => {
            try {
                const user = await User.findById(parent.user);
                return user;
            } catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
}