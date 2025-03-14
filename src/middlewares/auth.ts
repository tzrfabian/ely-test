import { Context } from "elysia";

export async function auth(ctx: Context) {
    try {
        const token = ctx.headers.authorization?.split(" ")[1];
        if (!token) {
            throw { statusCode: 401, message: "No token provided" };
        }

        const payload = await ctx.jwt.verify(token);
        if (!payload) {
            throw { statusCode: 401, message: "Invalid token" };
        }

        ctx.user = payload;
    } catch (err: unknown) {
        throw { statusCode: 401, message: "Unauthorized" };
    }
}