const { combineResolvers } = require('graphql-resolvers');
const Task = require('../database/models/task');
const User = require('../database/models/user');
const { isAuthenticated, isTaskOwner } = require('./middleware');
const { base64ToString, stringToBase64 } = require('../helper');
const loaders = require('../loaders');

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
        tasks: combineResolvers(isAuthenticated, async (parent, { cursor, limit = 20 }, { loggedInUserId }, info) => {
            try {
                const query = { user: loggedInUserId };
                if (cursor) {
                    query['_id'] = {
                        '$lt': base64ToString(cursor)
                    }
                };
                let tasks = await Task.find(query).sort({ _id: -1 }).limit(limit + 1);
                const hasNextPage = tasks.length > limit;
                tasks = hasNextPage ? tasks.slice(0, -1) : tasks;
                return {
                    taskFeed: tasks,
                    pageInfo: {
                        nextPageCursor:  hasNextPage ? stringToBase64(tasks[tasks.length - 1 ].id) : null,
                        hasNextPage, 
                      }
                    }
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
        user: async (parent, args, { loaders }) => {
            try {
                const user = await loaders.user.load(parent.user.toString())
                return user;
            } catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
}