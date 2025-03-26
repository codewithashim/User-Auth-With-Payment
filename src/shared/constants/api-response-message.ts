export const apiResponseMessage = {
    SUCCESS: 'Request was successful',
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',

    AUTH: {
        ACCESS_GRANTED: 'Access granted',
        ACCESS_DENIED: 'Access denied',
        LOGIN_SUCCESS: 'Login successful',
        LOGOUT_SUCCESS: 'Logout successful',
        REGISTER_SUCCESS: 'User registered successfully',
        INVALID_CREDENTIALS: 'Invalid email or password',
        UNAUTHORIZED: 'Unauthorized access',
        TOKEN_EXPIRED: 'Token has expired',
        TOKEN_INVALID: 'Invalid token',
        TOKEN_MISSING: 'Token is missing',
        REFRESH_TOKEN_SUCCESS: 'Token refreshed successfully',
        REFRESH_TOKEN_INVALID: 'Invalid refresh token',
        REFRESH_TOKEN_EXPIRED: 'Refresh token has expired',
        REFRESH_TOKEN_MISSING: 'Refresh token is missing',
        PASSWORD_RESET_SUCCESS: 'Password reset successful',
        PASSWORD_CHANGE_SUCCESS: 'Password changed successfully',
        FORGOT_PASSWORD_EMAIL_SENT: 'Password reset email sent successfully',
        INVALID_OLD_PASSWORD: 'Invalid old password',
        INVALID_RESET_TOKEN: 'Invalid reset token',
    },

    USERS: {
        FETCH_SUCCESS: 'Users retrieved successfully',
        FETCH_SINGLE_SUCCESS: 'User retrieved successfully',
        CREATE_SUCCESS: 'User created successfully',
        UPDATE_SUCCESS: 'User updated successfully',
        DELETE_SUCCESS: 'User deleted successfully',
        NOT_FOUND: 'User not found',
        EMAIL_EXISTS: 'Email already exists',
    },

    HEALTH: {
        SERVER_RUNNING: 'Server is up and running',
    },

    VALIDATION: {
        BAD_REQUEST: 'Invalid request parameters',
        MISSING_FIELDS: 'Required fields are missing',
    },

    DATABASE: {
        CONNECTION_SUCCESS: 'Database connected successfully',
        CONNECTION_ERROR: 'Database connection failed',
    },

    ERROR: {
        INTERNAL_SERVER_ERROR: 'Internal server error',
        FORBIDDEN: 'You do not have permission to perform this action',
        NOT_FOUND: 'Resource not found',
    },

    PAYMENTS : {
        WEBHOOK_PROCESSED: 'Webhook processed successfully',
        FETCH_SINGLE_SUCCESS: 'Payment retrieved successfully',
        FETCH_SUCCESS: 'Payments retrieved successfully',
        CHECKOUT_SUCCESS: 'Checkout successful',
        NOT_FOUND: 'Payment not found',
    }
};
