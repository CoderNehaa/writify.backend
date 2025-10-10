import App from "./app";
import { PORT } from "./config/environment";

// routers
import authRouter from "./modules/auth/auth.route";
import userRouter from "./modules/user/user.route";
import categoryRouter from "./modules/category/category.route";import articleRouter from "./modules/article/article.route";


const routers = [
  { path: "auth", router: authRouter },
  { path: "user", router: userRouter },
  { path: "category", router: categoryRouter },
  { path: "article", router: articleRouter },
];

// define and start server
const app = new App(PORT, routers);
app.listen();
