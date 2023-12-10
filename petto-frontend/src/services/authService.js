import { baseApi } from './baseService';

export const authApi = baseApi.injectEndpoints({
	reducerPath: 'authApi',
	endpoints: (builder) => ({
		getOwnerDetails: builder.query({
			query: () => ({
				url: '/user/me',
				method: 'GET',
			}),
			providesTags: (result) =>
				result
					? [
							{ type: 'Auth', id: 'user-' + result._id },
							{ type: 'Auth', id: 'userProfileDetails' },
					  ]
					: [{ type: 'Auth', id: 'userProfileDetails' }],
		}),
		getUserDetails: builder.query({
			query: (id) => ({
				url: `/user/${id}`,
				method: 'GET',
			}),
			providesTags: (result) => [{ type: 'Auth', id: 'user-' + result._id }],
		}),
		searchUser: builder.query({
			query: (search) => ({
				url: `/user/`,
				method: 'GET',
				params: {
					search,
				},
			}),
			providesTags: () => [{ type: 'Auth', id: 'SEARCH' }],
		}),
		updateOwnerDetails: builder.mutation({
			query: (details) => ({
				url: `/user/me`,
				method: 'PATCH',
				body: details,
			}),
			invalidatesTags: (result) => [
				{ type: 'Auth', id: 'user-' + result._id },
				{ type: 'Auth', id: 'userProfileDetails' },
			],
		}),
		getFriendList: builder.query({
			query: () => ({
				url: `/user/friends`,
				method: 'GET',
			}),
			providesTags: (result) =>
				result
					? [
							...result.map(({ _id }) => ({ type: 'Friends', id: 'friendRequest-' + _id })),
							{ type: 'Friends', id: 'LIST' },
					  ]
					: [{ type: 'Friends', id: 'LIST' }],
		}),
		getFriendRequestList: builder.query({
			query: (direction) => ({
				url: `/user/friends/friend-request`,
				method: 'GET',
				params: { direction },
			}),
			providesTags: (result) =>
				result
					? [
							...result.map(({ _id }) => ({ type: 'Friends', id: 'friendRequest-' + _id })),
							{ type: 'Friends', id: 'LIST' },
					  ]
					: [{ type: 'Friends', id: 'LIST' }],
		}),
		sendFriendRequest: builder.mutation({
			query: (userId) => ({
				url: `/user/friends/friend-request`,
				method: 'POST',
				params: {
					id: userId,
				},
			}),
			invalidatesTags: (result) =>
				result
					? [
							{ type: 'Friends', id: 'friendRequest-' + result._id },
							{ type: 'Friends', id: 'LIST' },
					  ]
					: [{ type: 'Friends', id: 'LIST' }],
		}),
		acceptFriendRequest: builder.mutation({
			query: (userid) => ({
				url: `/user/friends/friend-request`,
				method: 'PATCH',
				params: {
					id: userid,
				},
			}),
			invalidatesTags: (result) =>
				result
					? [
							{ type: 'Friends', id: 'friendRequest-' + result._id },
							{ type: 'Friends', id: 'LIST' },
					  ]
					: [{ type: 'Friends', id: 'LIST' }],
		}),
		cancelFriendRequest: builder.mutation({
			query: (userId) => ({
				url: `/user/friends/friend-request`,
				method: 'DELETE',
				params: {
					id: userId,
				},
			}),
			invalidatesTags: (result) =>
				result
					? [
							{ type: 'Friends', id: 'friendRequest-' + result._id },
							{ type: 'Friends', id: 'LIST' },
					  ]
					: [{ type: 'Friends', id: 'LIST' }],
		}),
	}),
});

// export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
	useGetOwnerDetailsQuery,
	useGetUserDetailsQuery,
	useLazySearchUserQuery,
	useUpdateOwnerDetailsMutation,
	useGetFriendListQuery,
	useLazyGetFriendRequestListQuery,
	useSendFriendRequestMutation,
	useAcceptFriendRequestMutation,
	useCancelFriendRequestMutation,
} = authApi;
