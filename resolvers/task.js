const { users, tasks } = require('../constants');
const uuid = require('uuid');

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
        createTask: (parent, args, ctx, info) => {
            const task = { ...args.input, id: uuid.v4() };
            tasks.push(task);
            return task;
        },
    },
    Task: {
        user: (parent) => {
            return users.find(user => user.id === parent.userId) 
        },
    },
}