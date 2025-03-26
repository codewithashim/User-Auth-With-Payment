import { SortOrder } from 'mongoose';

type IOptions = {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: SortOrder;
};

type IOptionsResult = {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: SortOrder;
};

/**
 * Calculates pagination details based on the provided options.
 *
 * @param {IOptions} options - The pagination options.
 * @param {number} [options.page=1] - The current page number.
 * @param {number} [options.limit=10] - The number of items per page.
 * @param {string} [options.sortBy='createdAt'] - The field to sort by.
 * @param {string} [options.sortOrder='desc'] - The order to sort by (asc or desc).
 * @returns {IOptionsResult} The calculated pagination details.
 * @returns {number} IOptionsResult.page - The current page number.
 * @returns {number} IOptionsResult.limit - The number of items per page.
 * @returns {number} IOptionsResult.skip - The number of items to skip.
 * @returns {string} IOptionsResult.sortBy - The field to sort by.
 * @returns {string} IOptionsResult.sortOrder - The order to sort by.
 */

const calculatePagination = (options: IOptions): IOptionsResult => {
    const page = Number(options.page || 1);
    const limit = Number(options.limit || 10);
    const skip = (page - 1) * limit;

    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || 'desc';

    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder,
    };
};

export const paginationHelpers = {
    calculatePagination,
};
