import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { apiResponseMessage } from '../../../shared/constants/api-response-message';
import catchAsync from '../../../shared/utils/catch-async';
import { UserService } from './users.services';
import sendResponse from '../../../shared/utils/send-response';
import { IUser } from './users.interface';

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.getAllUsers(req.query);
    sendResponse<IUser[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: apiResponseMessage.USERS.FETCH_SUCCESS,
        meta: result.meta,
        data: result.data,
    });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await UserService.getUserById(id);

    sendResponse<IUser>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: apiResponseMessage.USERS.FETCH_SINGLE_SUCCESS,
        data: result,
    });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedData = req.body;
    const result = await UserService.updateUser(id, updatedData);

    sendResponse<IUser>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: apiResponseMessage.USERS.UPDATE_SUCCESS,
        data: result,
    });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await UserService.deleteUser(id);

    sendResponse<IUser>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: apiResponseMessage.USERS.DELETE_SUCCESS,
        data: result,
    });
});

export const UserController = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};
