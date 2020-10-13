const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const { users, tasks } = require('../constants');
const User = require('../database/models/user');

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
    signUp: async (parent, { input }, ctx, info) => {
        try {
            const user = await User.findOne({ email: input.email });
            if (user) {
                throw new Error('Sorry user exists. try logging in')
            }
            const hashedPassword = await bcrypt.hash(input.password, 12);
            const newUser = new User({...input, password: hashedPassword})
            const createdUser = await newUser.save();
            return createdUser;
        } catch (error) {
            throw error;
        }
    },
},
User: {
    tasks: ({ id }) => {
        return tasks.filter(task => task.id === id);
    }
}
}