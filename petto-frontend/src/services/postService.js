import { baseApi } from './baseService';

export const postApi = baseApi.injectEndpoints({
	reducerPath: 'postApi',
	endpoints: (builder) => ({
		getAllPostList: builder.query({
			query: () => ({
				url: `/post/feed/all`,
				method: 'GET',
			}),
			providesTags: (result) =>
				// is result available?
				result
					? // successful query
					  [
							...result.map(({ _id }) => ({ type: 'Posts', id: _id })),
							{ type: 'Posts', id: 'LIST' },
					  ]
					: // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
					  [{ type: 'Posts', id: 'LIST' }],
		}),
		getMyFeedPostList: builder.query({
			query: () => ({
				url: `/post/feed`,
				method: 'GET',
			}),
			providesTags: (result) =>
				// is result available?
				result
					? // successful query
					  [
							...result.map(({ _id }) => ({ type: 'Posts', id: _id })),
							{ type: 'Posts', id: 'LIST' },
					  ]
					: // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
					  [{ type: 'Posts', id: 'LIST' }],
		}),
		getUserPostList: builder.query({
			query: (id) => ({
				url: `/post/user/`,
				method: 'GET',
				params: { id },
			}),
			providesTags: (result) =>
				// is result available?
				result
					? // successful query
					  [
							...result.map(({ _id }) => ({ type: 'Posts', id: _id })),
							{ type: 'Posts', id: 'LIST' },
					  ]
					: // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
					  [{ type: 'Posts', id: 'LIST' }],
		}),
		getPetPostList: builder.query({
			query: (id) => ({
				url: `/post/pet/`,
				method: 'GET',
				params: { id },
			}),
			providesTags: (result) =>
				// is result available?
				result
					? // successful query
					  [
							...result.map(({ _id }) => ({ type: 'Posts', id: _id })),
							{ type: 'Posts', id: 'LIST' },
					  ]
					: // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
					  [{ type: 'Posts', id: 'LIST' }],
		}),
		createUserPost: builder.mutation({
			query: (data) => ({
				url: `/post/me/`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
		}),
		removeUserPost: builder.mutation({
			query: (postId) => ({
				url: `/post/${postId}`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, id) => [
				{ type: 'Posts', id: result._id },
				{ type: 'Posts', id: 'LIST' },
			],
		}),
		sendPostLike: builder.mutation({
			query: (postId) => ({
				url: `/post/like`,
				method: 'POST',
				body: { postId },
			}),
			invalidatesTags: (result, error, id) => [{ type: 'Posts', id: result.post }],
		}),
		cancelPostLike: builder.mutation({
			query: (postId) => ({
				url: `/post/like`,
				method: 'DELETE',
				body: { postId },
			}),
			invalidatesTags: (result, error, id) => [{ type: 'Posts', id: result.post }],
		}),
		sendPostComment: builder.mutation({
			query: ({ postId, writtenText }) => ({
				url: `/post/comment`,
				method: 'POST',
				body: { postId, writtenText },
			}),
			invalidatesTags: (result, error, id) => [{ type: 'Posts', id: result.post }],
		}),
		removePostComment: builder.mutation({
			query: (commentId) => ({
				url: `/post/comment`,
				method: 'DELETE',
				body: { commentId },
			}),
			invalidatesTags: (result, error, id) => [{ type: 'Posts', id: result.post }],
		}),
	}),
});

// export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
	useGetAllPostListQuery,
	useGetMyFeedPostListQuery,
	useGetUserPostListQuery,
	useGetPetPostListQuery,
	useCreateUserPostMutation,
	useRemoveUserPostMutation,
	useSendPostLikeMutation,
	useCancelPostLikeMutation,
	useSendPostCommentMutation,
	useRemovePostCommentMutation,
} = postApi;
