import { Request, Response } from "express";
import { BaseController } from "../base/base.controller";
import { UserService } from "./user.service";

export class UserController extends BaseController {
  private userService: UserService;

  constructor(service: UserService) {
    super();
    this.userService = service;
  }

  getLoggedInUser = (req: Request, res: Response) => {
    return this.sendSuccessResponse(res, req.user);
  };

  getById = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      if (userId === String(req.user._id)) {
        return this.sendSuccessResponse(res, req.user);
      }

      const user = await this.userService.getById(userId);
      return this.sendSuccessResponse(res, user);
    } catch (e) {
      return this.handleError(res, e, "getById", "UserController");
    }
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      const userId = req.user._id;
      const updatedUser = await this.userService.updateById(
        String(userId),
        req.body
      );
      return this.sendSuccessResponse(
        res,
        updatedUser,
        "Account updated successfully!"
      );
    } catch (e) {
      return this.handleError(res, e, "updateUser", "UserController");
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    try {
      const userId = req.user._id;
      const deletedUser = await this.userService.softDeleteById(String(userId));

      return this.sendSuccessResponse(
        res,
        deletedUser,
        "Account deleted successfully!"
      );
    } catch (e) {
      return this.handleError(res, e, "deleteUser", "UserController");
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const userId = req.user._id;
      const { newPassword } = req.body;
      const updatedUser = await this.userService.updateById(String(userId), {
        password: newPassword,
      });

      return this.sendSuccessResponse(
        res,
        updatedUser,
        "Password updated successfully!"
      );
    } catch (e) {
      return this.handleError(res, e, "resetPassword", "UserController");
    }
  };
}
