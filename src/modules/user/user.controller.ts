import { Request, Response } from "express";
import { BaseController } from "../base/base.controller";
import { UserService } from "./user.service";
import { S3Service } from "../../clients/s3.service";
import { IUser } from "./user.type";

export class UserController extends BaseController {
  private userService: UserService;
  private s3Service: S3Service;

  constructor(service: UserService, s3Service: S3Service) {
    super();
    this.userService = service;
    this.s3Service = s3Service;
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
      const updateBody: Partial<IUser> = req.body;

      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const result = await this.s3Service.convertImageToUrl(
          req.files[0],
          "user"
        );
        updateBody.profilePicture = result;
      }
      const updatedUser = await this.userService.updateById(
        String(userId),
        updateBody
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
