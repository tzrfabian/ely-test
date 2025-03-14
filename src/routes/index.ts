import { Elysia } from "elysia";
import { getAllUsers, addUser } from "../controllers/UserController";
import { errorHandler } from "../middlewares/errorHandler";

const userRoutes = new Elysia({ prefix: "/users" })
    .get("/", async (ctx: any) => {
        try {
            return await getAllUsers(ctx);
        } catch (err) {
            return errorHandler(ctx, err);
        }
    })
    .post("/", async (ctx: any) => {
        try {
            // Read the body once and store it
            const { email, username, password } = ctx.body;

            // Pass extracted values to addUser
            return await addUser(ctx, email, username, password);
        } catch (err) {
            return errorHandler(ctx, err);
        }
    });

export default userRoutes;
