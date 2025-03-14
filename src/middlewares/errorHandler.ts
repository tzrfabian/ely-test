import { Context } from "elysia";

export function errorHandler(ctx: Context, err: any) {
    console.error("~ errorHandler ~ err:", err);

    if (err.statusCode) {
        ctx.set.status = err.statusCode;
        return { message: err.message };
    }

    switch (err.name) {
        case "BadRequest":
            ctx.set.status = 400;
            return { message: err.message };
        case "Unauthorized":
            ctx.set.status = 401;
            return { message: err.message };
        case "NotFound":
            ctx.set.status = 404;
            return { message: err.message };
        default:
            ctx.set.status = 500;
            return { message: "Internal Server Error" };
    }
}
