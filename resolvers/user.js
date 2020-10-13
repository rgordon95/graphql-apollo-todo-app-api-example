const uuid = require('uuid');
const { users, tasks } = require('../constants');

module.exports = {
Query: {
    user: (parent, { id }, ctx, info) => {
        const user = users.find(users => user.id === id)

        if (!user) {
            throw new Error('user not found');
        }

        return user;
    },
    users: () => {
        return users
    },
},
Mutation: {
    createUser: (parent, args, ctx, info) => {
        const user = { ...args.input, id: uuid.v4() };
        users.push(user);
        return user;
    },
},
User: {
    tasks: ({ id }) => {
        return tasks.filter(task => task.id === id);
    }
}
}