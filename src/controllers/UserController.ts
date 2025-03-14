import { Context } from "elysia";
import prisma from "../../prisma/client";
import Joi from "joi";
import { errorHandler } from "../middlewares/errorHandler";
import { jwt } from "@elysiajs/jwt";

export async function getAllUsers(ctx: Context) {
    try {
        const allUsers = await prisma.user.findMany({orderBy: {id: 'asc'}});

        return {
            success: true,
            data: allUsers,
            message: 'All users fetched successfully'
        }
    } catch (err: unknown) {
        console.log(`error fetch all users: ${err}`);
        return errorHandler(ctx, err);
        // return {
        //     success: false,
        //     message: `error fetching all users: ${err}`
        // }
    }
}

const userSchema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().min(6).max(20).required(),
    password: Joi.string().min(8).required()
});

export async function addUser(ctx: Context, email: string, username: string, password: string) {
    // joi error handling
    const {error} = userSchema.validate({email, username, password});
    if(error) {
        throw {
            statusCode: 400,
            code: 'VALIDATION ERROR',
            message: `error: ${error.message.replace(/"/g, '')}`
        }
    }

    // check if email already exists
    const emailExists = await prisma.user.findFirst({where: {email}});
    if(emailExists) {
        throw {
            statusCode: 409,
            code: 'EMAIL EXISTS',
            message: 'Email already exists'
        }
    }
    
    // encrypt password using bun
    const bcryptHashPass = await Bun.password.hash(password, {
        algorithm: "bcrypt",
        cost: 4, 
      });

    try {
        const newUser = await prisma.user.create({
            data: {
                email: email,
                username: username,
                password: bcryptHashPass
            }
        });

        return {
            success: true,
            data: newUser,
            message: 'User added successfully!'
        }
    } catch (err: unknown) {
        console.log(`error adding user: ${err}`);
        return errorHandler(ctx, err);
    }
}

export async function loginUser(ctx: Context, email: string, password: string) {
    // check if email exists
    const user = await prisma.user.findFirst({where: { email }});
    if(!user) {
        throw {
            statusCode: 404,
            code: 'UNAUTHORIZED',
            message: 'Invalid email or password'
        }
    }

    // compare password correct or not
    const passwordMatch = await Bun.password.verify(password, user.password);
    if(!passwordMatch) {
        throw {
            statusCode: 401,
            code: 'UNAUTHORIZED',
            message: 'Invalid email or password'
        }
    }

    const token = await ctx.jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username,
    });

    return {
        success: true,
        message: 'Login successful',
        token: token
    }
}