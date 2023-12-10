import { baseApi } from './baseService';

export const petApi = baseApi.injectEndpoints({
	reducerPath: 'petApi',
	endpoints: (builder) => ({
		getMyPetList: builder.query({
			query: () => ({
				url: `/pet/me`,
				method: 'GET',
			}),
			providesTags: () => [{ type: 'Pets', id: 'LIST' }],
		}),
		getUserPetList: builder.query({
			query: (id) => ({
				url: `/pet/user/`,
				method: 'GET',
				params: { id },
			}),
			providesTags: (result) =>
				result
					? [
							...result.map(({ _id }) => ({ type: 'Pets', id: 'pet-' + _id })),
							{ type: 'Pets', id: 'LIST' },
					  ]
					: [{ type: 'Pets', id: 'LIST' }],
		}),
		getPet: builder.query({
			query: (petId) => ({
				url: `/pet/${petId}`,
				method: 'GET',
			}),

			providesTags: (result) => [{ type: 'Pets', id: 'pet-' + result._id }],
		}),
		createPet: builder.mutation({
			query: (data) => ({
				url: `/pet/me`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: [{ type: 'Pets', id: 'LIST' }],
		}),
		updatePet: builder.mutation({
			query: ({ petId, data }) => ({
				url: `/pet/${petId}`,
				method: 'PATCH',
				body: data,
			}),
			invalidatesTags: (result) => [{ type: 'Pets', id: 'pet-' + result._id }],
		}),
		removePet: builder.mutation({
			query: (petId) => ({
				url: `/pet/${petId}`,
				method: 'DELETE',
			}),
			invalidatesTags: (result) => [{ type: 'Pets', id: 'pet-' + result._id }],
		}),
	}),
});

// export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
	useGetMyPetListQuery,
	useGetUserPetListQuery,
	useGetPetQuery,
	useCreatePetMutation,
	useUpdatePetMutation,
	useRemovePetMutation,
} = petApi;
