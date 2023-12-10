import { useState } from 'react';
import { useSelector } from 'react-redux';
import Popup from 'reactjs-popup';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import PetPopup from './PetPopup';
import { useGetUserPetListQuery, useRemovePetMutation } from '../../services/petService';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const PetCard = ({ _id, profileId, openUpdateModal }) => {
	const { userInfo } = useSelector((state) => state.auth);
	const { pet } = useGetUserPetListQuery(profileId, {
		selectFromResult: ({ data }) => ({
			pet: data?.find((pet) => pet._id === _id),
		}),
	});
	const own = profileId === userInfo._id;
	const [removePet] = useRemovePetMutation();
	const handleRemovePet = () => {
		if (confirm('Видалити улюбленця?')) {
			toast.promise(removePet(_id).unwrap(), {
				pending: `Видалення улюбленця ${pet.givenName} 😿`,
				success: `${pet.givenName} успішно видалений 👌`,
				error: `Помилка видалення ${pet.givenName}  🤯`,
			});
		}
	};

	const { avatarUrl, givenName } = pet;
	const [openPetPopup, setOpenPetPopup] = useState(false);

	return (
		<div className="transition-transform rounded-md w-44 bg-violet-300 hover:-translate-y-1">
			<div className="relative w-44 h-44">
				<Link to={`/pets/${pet._id}`}>
					<img src={avatarUrl} alt="Pet Avatar" className="rounded-t-md" />
				</Link>
				<Popup
					trigger={
						<button
							type="button"
							onClick={() => setOpenPetPopup(true)}
							className="absolute top-0 right-0 m-2">
							<EllipsisVerticalIcon className="w-8 h-8 text-violet-700" />
						</button>
					}
					open={openPetPopup}
					onOpen={() => setOpenPetPopup(true)}
					onClose={() => setOpenPetPopup(false)}
					closeOnDocumentClick
					position="bottom right">
					<PetPopup
						own={own}
						petId={_id}
						openEditPet={() => {
							setOpenPetPopup(false);
							openUpdateModal(pet);
						}}
						deletePet={handleRemovePet}
					/>
				</Popup>
			</div>
			<Link to={`/pets/${pet._id}`}>
				<div className="p-1 bg-violet-500 rounded-b-md">
					<p className="text-center text-white truncate">{givenName}</p>
				</div>
			</Link>
		</div>
	);
};

export default PetCard;
