const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { combineResolvers } = require('graphql-resolvers');

const Task = require('../database/models/task');
const User = require('../database/models/user');
const { isAuthenticated } = require('./middleware');

module.exports = {
Query: {
    user: combineResolvers(isAuthenticated, async (parent, args, ctx, info) => {
        const user = await User.findOne({ email });
        try {
            if (!user) {
                throw new Error('user not found');
            }
            return user;
        } catch (error) {
            console.log(error)
            throw error;
        }    
    }),
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
    tasks: async ({ id }) => {
       try {
        const tasks = await Task.find({ user: id });
        
        if (!tasks) {
            throw new Error('Sorry no tasks were found for this user')
        }

        return tasks;
       } catch (error) {
           throw error;
    }
}
}
}