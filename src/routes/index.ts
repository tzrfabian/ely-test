import { Elysia } from 'elysia'
import { getAllUsers } from '../controllers/UserController'
import { addUser } from '../controllers/UserController'

const userRoutes = new Elysia({ prefix: '/users' })
    .get('/', () => getAllUsers())
    .post('/', (req: {body: {
        email: string, username: string, password: string
    }}) => addUser(req.body.email, req.body.username, req.body.password))

export default userRoutes