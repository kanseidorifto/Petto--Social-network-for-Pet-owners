import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { useGetPetQuery } from '../services/petService';

import PetPostList from '../components/Post/PetPostList';
import { formatYears } from '../utils/formatYears';

const PetProfile = () => {
	const { petId } = useParams();
	const { userInfo } = useSelector((state) => state.auth);
	const petProfileInfo = useGetPetQuery(petId);
	useEffect(() => {
		document.title =
			'Petto - Профіль ' + (petProfileInfo.isSuccess ? petProfileInfo.data.givenName : '');
		return () => {
			document.title = 'Petto';
		};
	}, [petProfileInfo]);

	if (petProfileInfo.isFetching) {
		return <div>Loading...</div>;
	}
	if (petProfileInfo.isError) {
		return <div className="text-red-700">Error {petProfileInfo.error.status}</div>;
	}

	const own = petProfileInfo.data.owner._id === userInfo._id;

	return (
		<>
			<div className="flex gap-4 max-lg:flex-col-reverse ">
				<main className="flex-1">
					<div className="flex items-center justify-between px-6 py-4 text-white bg-violet-500 rounded-t-md">
						<h2 className="text-base font-medium">Дописи</h2>
					</div>
					<div className="space-y-4  [&>*:first-child]:rounded-t-none">
						<PetPostList petProfileId={petId} petProfileInfo={petProfileInfo} own={own} />
					</div>
				</main>
				<div>
					<aside className="text-white rounded-md md:w-96  bg-violet-400">
						{/* <div className="flex items-center justify-between px-6 py-4 text-white bg-violet-500 rounded-t-md">
							<h2 className="text-base font-medium">Улюбленець</h2>
						</div> */}
						<div className="select-none md:w-96 md:h-96">
							<img
								src={petProfileInfo.data.avatarUrl}
								alt="Pet Avatar"
								className="object-cover w-full h-full rounded-t-md"
							/>
						</div>
						<div className="text-center flex flex-col gap-2 md:gap-4 p-3 max-w-full">
							<p className="text-xl font-semibold">{petProfileInfo.data.givenName}</p>
							<p className="text-base">
								Порода: <span className="font-semibold">{petProfileInfo.data.breed}</span>
							</p>
							<p className="text-base">
								Вік: <span className="font-semibold">{formatYears(petProfileInfo.data.age)}</span>
							</p>
							{petProfileInfo.data.bio.length > 0 && (
								<p className="text-base max-w-full">
									Біографія: <span className="font-semibold">{petProfileInfo.data.bio}</span>
								</p>
							)}
							<p className="text-base">
								Власник:{' '}
								<Link
									to={`/profile/${petProfileInfo.data.owner._id}`}
									className="bg-amber-500 p-1 shadow-sm rounded-md font-semibold hover:underline">
									{petProfileInfo.data.owner.givenName + ' ' + petProfileInfo.data.owner.surname}
								</Link>
							</p>
						</div>
					</aside>
				</div>
			</div>
		</>
	);
};

export default PetProfile;
