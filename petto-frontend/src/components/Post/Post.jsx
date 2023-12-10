import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Popup from 'reactjs-popup';
import dayjs from 'dayjs';
import TextareaAutosize from 'react-textarea-autosize';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import {
	ChatBubbleOvalLeftIcon,
	EllipsisVerticalIcon,
	HeartIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { ViewfinderCircleIcon } from '@heroicons/react/24/outline';

import PostPopup from './PostPopup';
import {
	useCancelPostLikeMutation,
	useGetAllPostListQuery,
	useGetMyFeedPostListQuery,
	useGetPetPostListQuery,
	useGetUserPostListQuery,
	useSendPostCommentMutation,
	useSendPostLikeMutation,
} from '../../services/postService';
import useModal from '../../hooks/useModal';

const Post = ({ _id, profileId }) => {
	const { post: userProfilePost } = useGetUserPostListQuery(profileId, {
		selectFromResult: ({ data }) => ({
			post: data?.find((post) => post._id === _id),
		}),
	});
	const { post: petPost } = useGetPetPostListQuery(profileId, {
		selectFromResult: ({ data }) => ({
			post: data?.find((post) => post._id === _id),
		}),
	});
	const { post: feedPost } = useGetMyFeedPostListQuery(undefined, {
		selectFromResult: ({ data }) => ({
			post: data?.find((post) => post._id === _id),
		}),
	});
	const { post: allPost } = useGetAllPostListQuery(undefined, {
		selectFromResult: ({ data }) => ({
			post: data?.find((post) => post._id === _id),
		}),
	});
	const post = userProfilePost || petPost || feedPost || allPost;

	const [sendLike] = useSendPostLikeMutation();
	const [cancelLike] = useCancelPostLikeMutation();
	const [sendComment] = useSendPostCommentMutation();
	const { open: openModal } = useModal('recognizeModal');
	const { profile, writtenText, mediaLocations, createdAt, likes, comments, taggedPets } = post;
	const commentsWork = [...comments.filter((obj) => JSON.stringify(obj) != '{}')];
	const [commentText, setCommentText] = useState('');
	const { userInfo } = useSelector((state) => state.auth);
	const own = userInfo._id === profile._id;
	const ownLike = likes.some((obj) => obj.profile === userInfo._id);

	const handleLike = () => {
		if (!ownLike) {
			sendLike(_id);
		} else {
			cancelLike(_id);
		}
	};
	const handleSendComment = () => {
		sendComment({ postId: _id, writtenText: commentText });
		setCommentText('');
	};

	return (
		<section className="text-white rounded-md bg-violet-400">
			<div className="flex items-center px-6 py-4 space-x-2">
				<Link to={'/profile/' + profile?._id} className="font-black">
					<img
						src={profile?.avatarUrl}
						alt="avatar"
						className="w-10 h-10 bg-white rounded-full select-none"
					/>
				</Link>
				<div className="flex items-center justify-between flex-1">
					<div className="">
						<Link to={'/profile/' + profile?._id} className="font-black">
							<p className="text-sm font-semibold">{profile.givenName + ' ' + profile.surname}</p>
						</Link>
						<p className="text-sm font-light text-neutral-200">
							{dayjs(createdAt).format('DD/MM/YYYY H:mm')}
						</p>
					</div>
					<div>
						{own && (
							<Popup
								trigger={
									<button>
										<EllipsisVerticalIcon className="w-6 h-6" />
									</button>
								}
								closeOnDocumentClick
								position="bottom right">
								<PostPopup own={own} postId={_id} />
							</Popup>
						)}
					</div>
				</div>
			</div>
			<div className="w-full bg-violet-500">
				{mediaLocations?.length > 0 && (
					<Carousel
						dynamicHeight
						transitionTime={200}
						// animationHandler={'fade'}
						showArrows={mediaLocations.length > 1}
						showIndicators={mediaLocations.length > 1}
						showThumbs={false}
						showStatus={false}>
						{mediaLocations.map((media, index) => (
							<div key={media} className="relative group/item">
								<img className="select-none" src={media} alt={`postImage ${index}`} />
								<div className="absolute invisible top-0 w-full -translate-y-1 opacity-0 group-hover/item:visible group-hover/item:translate-y-1 group-hover/item:opacity-100 transition-all ease-in-out">
									<button
										onClick={() => openModal({ picUrl: media })}
										className="bg-amber-500/70 hover:bg-amber-500/50 m-2 p-0.5 rounded-md mx-auto z-10">
										<ViewfinderCircleIcon className="h-10 w-10 text-white leading-none" />
									</button>
								</div>
							</div>
						))}
					</Carousel>
				)}
			</div>
			<div className="px-6 py-4 space-y-3">
				<div>
					<Link to={'/profile/' + profile?._id} className="font-black">
						<span className="font-black">{profile.givenName + ' ' + profile.surname}</span>
					</Link>
					<span> {writtenText}</span>
				</div>
				{taggedPets.length > 0 && (
					<div className="flex flex-wrap">
						{taggedPets.map((pet, index) => (
							<Link
								key={index}
								to={`/pets/${pet._id}`}
								className="flex items-center rounded-md hover:bg-violet-300/50 transition-colors max-w-[256px] space-x-2 px-2 py-1">
								<img
									className="w-10 h-10 border-2 rounded-full select-none border-amber-400"
									src={pet.avatarUrl}
									alt="Pet"
								/>
								<span className="text-sm font-normal truncate">{pet.givenName}</span>
							</Link>
						))}
					</div>
				)}
				<div className="flex space-x-3">
					<button onClick={handleLike} className="flex items-center space-x-1">
						{ownLike ? <HeartIconSolid className="w-6 h-6" /> : <HeartIcon className="w-6 h-6" />}
						<span className="text-base leading-none">{likes.length}</span>
					</button>
					<button className="flex items-center space-x-1">
						<ChatBubbleOvalLeftIcon className="w-6 h-6" />
						<span className="text-base leading-none">{commentsWork.length}</span>
					</button>
				</div>
				<div className="">
					{commentsWork.length > 0 &&
						commentsWork
							.sort((a, b) => (dayjs(a.createdAt).isBefore(dayjs(b.createdAt)) ? 1 : -1))
							.slice(0, 4)
							.map((comment) => {
								return (
									<div className="flex space-x-2" key={comment._id}>
										<Link to={'/profile/' + comment.profile?._id} className="font-black">
											<img
												src={comment.profile?.avatarUrl}
												alt="avatar"
												className="w-8 h-8 bg-white rounded-full select-none"
											/>
										</Link>
										<div className="justify-between flex-1 ">
											<div className="flex items-center space-x-1">
												<Link to={'/profile/' + comment.profile?._id} className="font-black">
													<p className="text-base font-semibold">
														{comment.profile?.givenName + ' ' + comment.profile?.surname}
													</p>
												</Link>
												<p className="text-sm font-light text-neutral-200">
													{dayjs(comment.createdAt).format('H:mm DD/MM/YYYY')}
												</p>
											</div>
											<p>{comment.writtenText}</p>
										</div>
									</div>
								);
							})}
				</div>

				<div className="flex items-center space-x-2">
					<img src={userInfo?.avatarUrl} alt="avatar" className="w-10 h-10 bg-white rounded-full" />
					<TextareaAutosize
						className="flex-1 p-1 text-base bg-transparent rounded appearance-none resize-none transition-colors  placeholder:text-white placeholder:font-light hover:bg-violet-300/20 focus:bg-violet-300/50 focus:outline-none focus:border-none focus:ring-none"
						value={commentText}
						onChange={(e) => setCommentText(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter' && e.shiftKey === false) {
								e.preventDefault();
								handleSendComment();
							}
						}}
						placeholder="Додайте коментар..."
					/>
					<button
						onClick={handleSendComment}
						className="p-2 text-base font-medium transition-colors rounded-md text-violet-100 bg-violet-300/20 shadow hover:bg-violet-300/50">
						Опублікувати
					</button>
				</div>
			</div>
		</section>
	);
};

export default Post;
