import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getBaseUrl, getHeaders } from '../../utils/api';

export const userManagementApi = createApi({
  reducerPath: 'userManagementApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
    prepareHeaders: () => getHeaders(),
  }),
  tagTypes: ['Users', 'Roles', 'MainMenus', 'SubMenus', 'MenuRoles'],
  endpoints: (builder) => ({
    // Users
    getUsersList: builder.query({
      query: () => '/api/UserManagement/GetUsersList',
      providesTags: ['Users'],
    }),
    getUserById: builder.query({
      query: (userId) => `/api/UserManagement/GetUserById?userId=${userId}`,
      providesTags: ['Users'],
    }),
    saveUser: builder.mutation({
      query: (userData) => ({
        url: '/api/UserManagement/SaveUser',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Users'],
    }),
    updateUser: builder.mutation({
      query: (userData) => ({
        url: '/api/UserManagement/UpdateUser',
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['Users'],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/api/UserManagement/DeleteUserById?userId=${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),
    deactivateUser: builder.mutation({
      query: (userId) => ({
        url: `/api/UserManagement/DeactivateUserById?userId=${userId}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Users'],
    }),

    // Roles
    getRoleList: builder.query({
      query: () => '/api/UserManagement/GetRoleList',
      providesTags: ['Roles'],
    }),
    getRoleById: builder.query({
      query: (roleId) => `/api/UserManagement/GetRoleById?roleId=${roleId}`,
      providesTags: ['Roles'],
    }),
    saveRole: builder.mutation({
      query: (roleData) => ({
        url: '/api/UserManagement/SaveRole',
        method: 'POST',
        body: roleData,
      }),
      invalidatesTags: ['Roles'],
    }),
    updateRole: builder.mutation({
      query: (roleData) => ({
        url: '/api/UserManagement/UpdateRole',
        method: 'PUT',
        body: roleData,
      }),
      invalidatesTags: ['Roles'],
    }),
    deleteRole: builder.mutation({
      query: (roleId) => ({
        url: `/api/UserManagement/DeleteRoleById?roleId=${roleId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Roles'],
    }),

    // Main Menus
    getMainMenuList: builder.query({
      query: () => '/api/UserManagement/GetMainMenuList',
      providesTags: ['MainMenus'],
    }),
    getMainMenuById: builder.query({
      query: (mainMenuId) => `/api/UserManagement/GetMainMenuById?mainMenuId=${mainMenuId}`,
      providesTags: ['MainMenus'],
    }),
    saveMainMenu: builder.mutation({
      query: (mainMenuData) => ({
        url: '/api/UserManagement/SaveMainMenu',
        method: 'POST',
        body: mainMenuData,
      }),
      invalidatesTags: ['MainMenus'],
    }),
    updateMainMenu: builder.mutation({
      query: (mainMenuData) => ({
        url: '/api/UserManagement/UpdateMainMenu',
        method: 'PUT',
        body: mainMenuData,
      }),
      invalidatesTags: ['MainMenus'],
    }),
    deleteMainMenu: builder.mutation({
      query: (mainMenuId) => ({
        url: `/api/UserManagement/DeleteMainMenuById?mainMenuId=${mainMenuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MainMenus'],
    }),

    // Sub Menus
    getSubMenuList: builder.query({
      query: () => '/api/UserManagement/GetSubMenuList',
      providesTags: ['SubMenus'],
    }),
    getSubMenuListByMainMenu: builder.query({
      query: (mainMenuId) => `/api/UserManagement/GetSubMenuListByMainMenuId?mainMenuId=${mainMenuId}`,
      providesTags: ['SubMenus'],
    }),
    getSubMenuByMainMenuIdList: builder.query({
      query: (mainMenuId) => `/api/UserManagement/GetSubMenuListByMainMenuId?mainMenuId=${mainMenuId}`,
      providesTags: ['SubMenus'],
    }),
    getSubMenuById: builder.query({
      query: (subMenuId) => `/api/UserManagement/GetSubMenuById?subMenuId=${subMenuId}`,
      providesTags: ['SubMenus'],
    }),
    saveSubMenu: builder.mutation({
      query: (subMenuData) => ({
        url: '/api/UserManagement/SaveSubMenu',
        method: 'POST',
        body: subMenuData,
      }),
      invalidatesTags: ['SubMenus'],
    }),
    updateSubMenu: builder.mutation({
      query: (subMenuData) => ({
        url: '/api/UserManagement/UpdateSubMenu',
        method: 'PUT',
        body: subMenuData,
      }),
      invalidatesTags: ['SubMenus'],
    }),
    deleteSubMenu: builder.mutation({
      query: (subMenuId) => ({
        url: `/api/UserManagement/DeleteSubMenuById?subMenuId=${subMenuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SubMenus'],
    }),

    // Menu Roles
    getMenuRoleList: builder.query({
      query: (roleId) => roleId 
        ? `/api/UserManagement/GetMenuRoleList?roleId=${roleId}`
        : '/api/UserManagement/GetMenuRoleList',
      providesTags: ['MenuRoles'],
    }),
    getMenuRolesByRoleId: builder.query({
      query: (roleId) => `/api/UserManagement/GetMenuRolesByRoleId?roleId=${roleId}`,
      providesTags: ['MenuRoles'],
    }),
    saveMenuRole: builder.mutation({
      query: (menuRoleData) => ({
        url: '/api/UserManagement/SaveMenuRole',
        method: 'POST',
        body: menuRoleData,
      }),
      invalidatesTags: ['MenuRoles'],
    }),
    assignMenuToRole: builder.mutation({
      query: (menuRoleData) => ({
        url: '/api/UserManagement/AssignMenuToRole',
        method: 'POST',
        body: menuRoleData,
      }),
      invalidatesTags: ['MenuRoles'],
    }),
    deleteMenuRole: builder.mutation({
      query: (menuRoleId) => ({
        url: `/api/UserManagement/DeleteMenuRole/${menuRoleId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MenuRoles'],
    }),
  }),
});

export const {
  // Users
  useGetUsersListQuery,
  useGetUserByIdQuery,
  useSaveUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useDeactivateUserMutation,

  // Roles
  useGetRoleListQuery,
  useGetRoleByIdQuery,
  useSaveRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,

  // Main Menus
  useGetMainMenuListQuery,
  useGetMainMenuByIdQuery,
  useSaveMainMenuMutation,
  useUpdateMainMenuMutation,
  useDeleteMainMenuMutation,

  // Sub Menus
  useGetSubMenuListQuery,
  useGetSubMenuListByMainMenuQuery,
  useGetSubMenuByMainMenuIdListQuery,
  useGetSubMenuByIdQuery,
  useSaveSubMenuMutation,
  useUpdateSubMenuMutation,
  useDeleteSubMenuMutation,

  // Menu Roles
  useGetMenuRoleListQuery,
  useGetMenuRolesByRoleIdQuery,
  useSaveMenuRoleMutation,
  useAssignMenuToRoleMutation,
  useDeleteMenuRoleMutation,
} = userManagementApi; 