import express from 'express';
import { UserController } from './users.controller';
import validateRequest from '../../../shared/middleware/validation-middleware';
import { ENUM_USER_ROLE } from '../../../shared/enums/users-enum';
import { userValidation } from './users.validation';
import authGuard from '../../../shared/middleware/auth-middleware';

const router = express.Router();

/**
 * @route GET /api/users
 * @description Get all users
 * @access Private (Admin only)
 */
router.get('/', authGuard(ENUM_USER_ROLE.ADMIN), UserController.getAllUsers);

/**
 * @route GET /api/users/:id
 * @description Get a user by ID
 * @access Private (Admin or Owner)
 */
router.get(
    '/:id',
    authGuard(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
    UserController.getUserById,
);

/**
 * @route PATCH /api/users/:id
 * @description Update a user
 * @access Private (Admin or Owner)
 */
router.patch(
    '/:id',
    authGuard(
        ENUM_USER_ROLE.ADMIN,
        ENUM_USER_ROLE.USER,
    ),
    validateRequest(userValidation.updateUserZodSchema),
    UserController.updateUser,
);

/**
 * @route DELETE /api/users/:id
 * @description Delete a user
 * @access Private (Admin only)
 */

router.delete(
    '/:id',
    authGuard(ENUM_USER_ROLE.ADMIN),
    UserController.deleteUser,
);

export const UserRoutes = router;
