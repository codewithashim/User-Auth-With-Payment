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

    PROJECTS: {
        FETCH_SUCCESS: 'Projects retrieved successfully',
        FETCH_SINGLE_SUCCESS: 'Project retrieved successfully',
        CREATE_SUCCESS: 'Project created successfully',
        UPDATE_SUCCESS: 'Project updated successfully',
        DELETE_SUCCESS: 'Project deleted successfully',
        NOT_FOUND: 'Project not found',
        NAME_EXISTS: 'Project name already exists',
        INVALID_DATES: 'Invalid project dates',
        INVALID_CLIENT: 'Invalid client information',
        INVALID_PARTIES: 'Invalid parties involved',
        FETCH_BY_CITY_SUCCESS:
            'Projects for the specified city retrieved successfully',
        ACTIVE_PROJECTS_FETCH_SUCCESS: 'Active projects retrieved successfully',
        COMPLETED_PROJECTS_FETCH_SUCCESS:
            'Completed projects retrieved successfully',
        UPCOMING_PROJECTS_FETCH_SUCCESS:
            'Upcoming projects retrieved successfully',
    },

    PARTIES: {
        FETCH_SUCCESS: 'Parties retrieved successfully',
        FETCH_SINGLE_SUCCESS: 'Party retrieved successfully',
        CREATE_SUCCESS: 'Party created successfully',
        UPDATE_SUCCESS: 'Party updated successfully',
        DELETE_SUCCESS: 'Party deleted successfully',
        NOT_FOUND: 'Party not found',
        NAME_EXISTS: 'Party with this name already exists',
        INVALID_TYPE: 'Invalid party type',
        INVALID_GST: 'Invalid GST information',
        INVALID_PARTY_ID: 'Invalid party ID format',
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
};
