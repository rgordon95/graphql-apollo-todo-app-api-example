const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { combineResolvers } = require('graphql-resolvers');

const { users, tasks } = require('../constants');
const User = require('../database/models/user');
const { isAuthenticated } = require('./middleware');

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
    login: async (parent, { input },  ctx, info) => {
        try {
        const user = await User.findOne({ email: input.email })
            if (!user) {
                throw new Error('Sorry user not found. try signing up instead')
            }

            const isPasswordValid = await bcrypt.compare(input.password, user.password);

            if (!isPasswordValid) {
                throw new Error('Sorry. invalid password')
            }
            const secret = process.env.JWT_SECRET_KEY || 'fallb@ck5ecret'
            const token = jwt.sign({ email: user.email }, secret, { expiresIn: '14 days' });
            return { token }
        } catch (error) {
            console.log(error)
            throw error;
        }
    },
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