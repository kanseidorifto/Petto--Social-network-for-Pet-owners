import Post from './Post';
import { useGetPetPostListQuery } from '../../services/postService';

const PetPostList = ({ petProfileId, petProfileInfo, own }) => {
	const profilePostList = useGetPetPostListQuery(petProfileId);
	return (
		<>
			{profilePostList?.data?.length > 0 ? (
				profilePostList.data.map((post) => (
					<Post key={post._id} {...post} profileId={petProfileId} />
				))
			) : (
				<section className="text-white rounded-md bg-violet-400">
					<p className="px-6 py-10 text-lg font-medium text-center">
						{profilePostList.isFetching
							? 'Завантаження... 🏃‍♂️'
							: `Схоже ${petProfileInfo?.data?.givenName} поки немає дописів 😿`}
					</p>
				</section>
			)}
		</>
	);
};

export default PetPostList;
