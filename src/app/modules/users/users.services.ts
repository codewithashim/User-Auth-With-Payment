import httpStatus from 'http-status';
import { apiResponseMessage } from '../../../shared/constants/api-response-message';
import { SortOrder } from 'mongoose';
import { IUser } from './users.interface';
import paginationPick from '../../../shared/utils/pagination-pick';
import { paginationFields } from '../../../shared/constants/common-constants';
import { paginationHelpers } from '../../../shared/helpers/pagination-helper';
import { User } from './users.models';
import ApiError from '../../../shared/errors/api-error';

const getAllUsers = async (
    requestQuery: Record<string, unknown>,
): Promise<{ meta: any; data: IUser[] }> => {
    const filters = paginationPick(requestQuery, ['searchTerm', 'role']);
    const paginationOptions = paginationPick(requestQuery, paginationFields);

    const { searchTerm, ...filtersData } = filters;
    const { page, limit, skip, sortBy, sortOrder } =
        paginationHelpers.calculatePagination(paginationOptions);

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            $or: ['email', 'name.firstName', 'name.lastName', 'role'].map(
                (field) => ({
                    [field]: {
                        $regex: searchTerm,
                        $options: 'i',
                    },
                }),
            ),
        });
    }

    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }

    const sortConditions: { [key: string]: SortOrder } = {};

    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions =
        andConditions.length > 0 ? { $and: andConditions } : {};

    const result = await User.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);

    const total = await User.countDocuments(whereConditions);

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};

const getUserById = async (id: string): Promise<IUser | null> => {
    const user = await User.findById(id);
    if (!user) {
        throw new ApiError(
            httpStatus.NOT_FOUND,
            apiResponseMessage.USERS.NOT_FOUND,
        );
    }
    return user;
};

const updateUser = async (
    id: string,
    payload: Partial<IUser>,
): Promise<IUser | null> => {
    const isExist = await User.findOne({ _id: id });
    if (!isExist) {
        throw new ApiError(
            httpStatus.NOT_FOUND,
            apiResponseMessage.USERS.NOT_FOUND,
        );
    }

    const { name, ...userData } = payload;
    const updatedUserData: Partial<IUser> = { ...userData };

    if (name && Object.keys(name).length > 0) {
        Object.keys(name).forEach((key) => {
            const nameKey = `name.${key}` as keyof Partial<IUser>;
            (updatedUserData as any)[nameKey] = name[key as keyof typeof name];
        });
    }

    const result = await User.findOneAndUpdate({ _id: id }, updatedUserData, {
        new: true,
    });
    return result;
};

const deleteUser = async (id: string): Promise<IUser | null> => {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
        throw new ApiError(
            httpStatus.NOT_FOUND,
            apiResponseMessage.USERS.NOT_FOUND,
        );
    }
    return user;
};

export const UserService = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};
