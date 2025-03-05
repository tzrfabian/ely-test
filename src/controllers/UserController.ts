import prisma from "../../prisma/client";
import Joi from "joi";

export async function getAllUsers() {
    try {
        const allUsers = await prisma.user.findMany({orderBy: {id: 'asc'}});

        return {
            success: true,
            data: allUsers,
            message: 'All users fetched successfully'
        }
    } catch (err: unknown) {
        console.log(`error fetch all users: ${err}`);
        return {
            success: false,
            message: `error fetching all users: ${err}`
        }
    }
}

const userSchema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().min(6).max(20).required(),
    password: Joi.string().min(8).required()
});

export async function addUser(email: string, username: string, password: string) {
    const emailExists = await prisma.user.findFirst({where: {email}});
    if(emailExists) {
        return {
            success: false,
            message: 'Email already exists'
        }
    }
    
    const {error} = userSchema.validate({email, username, password});
    if(error) {
        return {
            success: false,
            message: `error: ${error.details[0].message}`
        }
    }

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
        return {
            success: false,
            message: `error adding user ${err}`
        }
    }
}