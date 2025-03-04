import prisma from "../../prisma/client";

export async function getAllUsers() {
    try {
        const allUsers = await prisma.user.findMany({orderBy: {id: 'asc'}});

        return {
            success: true,
            data: allUsers,
            message: 'All users fetched successfully'
        }
    } catch (err: unknown) {
        console.log(err);
    }
}

export async function addUser(email: string, username: string, password: string) {
    try {
        const newUser = await prisma.user.create({
            data: {
                email,
                username,
                password
            }
        });

        return {
            success: true,
            data: newUser,
            message: 'User added successfully!'
        }
    } catch (err: unknown) {
        console.log(err);
    }
}