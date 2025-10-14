import { AuthMiddleware } from "../middlewares/auth.middleware";
import { EmailService } from "../clients/email.service";
import { AuthController } from "./auth/auth.controller";
import { OTPService } from "./otp/otp.service";
import { UserController } from "./user/user.controller";
import { UserService } from "./user/user.service";
import { TokenService } from "../clients/token.service";
import { CategoryController } from "./category/category.controller";
import { CategoryService } from "./category/category.service";
import { ArticleController } from "./article/article.controller";
import { ArticleService } from "./article/article.service";
import { BookmarkController } from "./bookmark/bookmark.controller";
import { BookmarkService } from "./bookmark/bookmark.service";

// Services
const userService = new UserService();
const otpService = new OTPService();
const emailService = new EmailService();
const tokenService = new TokenService();
const categoryService = new CategoryService();
const articleService = new ArticleService();
const bookmarkService = new BookmarkService();

// Middlewares
export const authMiddleware = new AuthMiddleware(userService, tokenService);

// Controllers
export const authController = new AuthController(
  userService,
  otpService,
  emailService,
  tokenService
);
export const userController = new UserController(userService);
export const categoryController = new CategoryController(categoryService);
export const articleController = new ArticleController(articleService);
export const bookmarkController = new BookmarkController(bookmarkService);
