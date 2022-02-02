import AuthRouter from './auth';
import UserRouter from './user';
import PostRouter from './post';
import MessagesRouter from './message';

const AppRoutes = (app) => {
    app.use("/api/auth", AuthRouter);
    app.use("/api/user", UserRouter);
    app.use("/api/post", PostRouter);
    app.use("/api/message", MessagesRouter);
}

export default AppRoutes;
