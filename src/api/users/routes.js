const {
  UserUpdatePayloadSchema,
  UserParamsSchema,
  UserCreatePayloadSchema,
  RoleParamsSchema,
} = require('../../validators/users');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
  },
  {
    method: 'GET',
    path: '/users/{id}',
    handler: handler.getUserByIdHandler,
  },
  {
    method: 'GET',
    path: '/users/profile',
    handler: handler.getUserProfileHandler,
    options: {
      auth: 'lombokhalalroom_jwt',
    },
  },
  {
    method: 'POST',
    path: '/users/password/reset',
    handler: handler.sendResetPasswordCodeByEmailHandler,
  },
  {
    method: 'PUT',
    path: '/users/password/reset',
    handler: handler.resetUserPasswordHandler,
  },
  {
    method: 'PUT',
    path: '/users/password',
    handler: handler.changeUserPasswordHandler,
    options: {
      auth: 'lombokhalalroom_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/users/picture',
    handler: handler.putUserPictureUrlHandler,
    options: {
      auth: 'lombokhalalroom_jwt',
    },
  },
  {
    method: 'POST',
    path: '/users/admins',
    handler: handler.postUserAsAdminHandler,
  },
  {
    method: 'GET',
    path: '/users/balances',
    handler: handler.getUserBalanceHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: ['user', 'admin'],
      },
    },
  },
  {
    method: 'GET',
    path: '/super-admin/balances/{userId}',
    handler: handler.getBalanceByUserIdHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'super-admin',
      },
    },
  },
  {
    method: 'PUT',
    path: '/users/username',
    handler: handler.putUsernameByAuth,
    options: {
      auth: 'lombokhalalroom_jwt',
    },
  },

  // super admin routes

  {
    method: 'GET',
    path: '/users',
    handler: handler.getAllUsersHandler,
    options: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: ['super-admin'],
      },
      description: 'Get all users with pagination and filter',
      tags: ['api', 'users'],
    },
  },
  {
    method: 'GET',
    path: '/super-admin/users/{id}',
    handler: handler.getUserByIdHandler,
    options: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: ['super-admin'],
      },
      description: 'Get user detail by ID',
      tags: ['api', 'super-admin', 'users'],
    },
  },
  {
    method: 'PUT',
    path: '/super-admin/users/{id}',
    handler: handler.updateUserByIdHandler,
    options: {
      auth: { strategy: 'lombokhalalroom_jwt', scope: ['super-admin'] },
      description: 'Update user data by ID',
      tags: ['api', 'super-admin', 'users'],
      validate: {
        params: UserParamsSchema,
        payload: UserUpdatePayloadSchema,
      },
    },
  },
  {
    method: 'DELETE',
    path: '/super-admin/users/{id}',
    handler: handler.deleteUserByIdHandler,
    options: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: ['super-admin'],
      },
      description: 'Delete user by ID',
      tags: ['api', 'super-admin', 'users'],
    },
  },
  {
    method: 'POST',
    path: '/super-admin/users/{role}',
    handler: handler.addUserByRoleHandler,
    options: {
      auth: { strategy: 'lombokhalalroom_jwt', scope: ['super-admin'] },
      description: 'Super Admin add new user by role param (user/admin)',
      tags: ['api', 'super-admin', 'users'],
    },
  },
];

module.exports = routes;
