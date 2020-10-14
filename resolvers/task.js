const { users, tasks } = require('../constants');
const { combineResolvers } = require('graphql-resolvers');
const Task = require('../database/models/task');
const User = require('../database/models/user');
const uuid = require('uuid');
const { isAuthenticated, isTaskOwner } = require('./middleware');
const user = require('../database/models/user');

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
        tasks: combineResolvers(isAuthenticated, async (parent, { skip = 0, limit = 20 }, { loggedInUserId }, info) => {
            try {
                const tasks = await Task.find({ user: loggedInUserId}).sort({ _id: -1 }).skip(skip).limit(limit);
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
        }),
        deleteTask: combineResolvers(isAuthenticated, isTaskOwner, async (parent, { id}, { loggedInUserId }, info) => {
            try {
                const task = await Task.findByIdAndDelete(id);
                await user.updateOne({_id: loggedInUserId}, {$pull: {tasks: task.id } });
                return task;
            } catch (error) {
                console.log(error)
                throw error
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