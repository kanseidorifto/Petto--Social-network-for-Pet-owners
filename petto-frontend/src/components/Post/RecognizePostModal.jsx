import Modal from 'react-modal';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useRef } from 'react';
import { Cropper } from 'react-cropper';
import 'cropperjs/dist/cropper.css';

import { dataUrlToFile } from '../../utils/dataUrlToFile';

import { toast } from 'react-toastify';
import useModal from '../../hooks/useModal';
import { recognizePet } from '../../utils/recognizePet';

Modal.setAppElement('#root');

const RecognizePostModal = ({ modalKey }) => {
	const { isModalOpen, modalData, close } = useModal(modalKey);

	const [result, setResult] = useState(null);
	const cropperRef = useRef();

	const crop = () => {
		const imageElement = cropperRef?.current;
		const cropper = imageElement?.cropper;
		return cropper?.getCroppedCanvas().toDataURL();
	};

	const closeCurrentModal = () => {
		setResult(null);
		close();
	};

	const onSubmit = async () => {
		const cropped = crop();
		const formData = new FormData();
		cropped &&
			formData.append(
				'file',
				await dataUrlToFile(cropped, `post-${Math.random(10000000)}.png`, 'image/png'),
			);
		const result = await toast.promise(recognizePet(formData), {
			pending: `Розпізнавання допису 👀`,
			success: `Допис успішно розпізнаний 👌`,
			error: `Помилка розпізнавання 🤯`,
		});
		console.log(result);
		setResult(result);
	};

	return (
		<Modal
			closeTimeoutMS={250}
			isOpen={isModalOpen}
			onAfterOpen={() => (document.body.style.overflow = 'hidden')}
			onAfterClose={() => (document.body.style.overflow = 'unset')}
			onRequestClose={close}
			className={'mx-auto w-fit my-auto p-4'}
			contentLabel="Recognize pet modal">
			<div className="flex bg-white flex-col p-6 space-y-4 border rounded-md border-amber-500 z-20 &[ReactModal__Overlay--after-open:translate-y-0]">
				<div className="flex items-center justify-between">
					<p className="text-xl text-amber-500">Розпізнати допис</p>
					<button type="button" onClick={closeCurrentModal}>
						<XMarkIcon className="w-6 h-6 text-black" />
					</button>
				</div>
				<div className="flex flex-col items-center gap-4 text-center">
					<div>
						<Cropper
							src={modalData?.picUrl}
							className="max-w-[20rem] md:max-w-[24rem] xl:max-w-[32rem] 2xl:max-w-[60rem]"
							// style={{ maxWidth: '512px', height: 'auto' }}
							autoCropArea={0.9}
							responsive={true}
							aspectRatio={1}
							viewMode={2}
							guides={false}
							ref={cropperRef}
						/>
					</div>

					{result && (
						<p className="text-lg flex items-center gap-1 leading-none">
							Результат -
							<div className="flex flex-wrap gap-1">
								<span className="px-2 py-1 border bg-amber-500 rounded-lg text-xl font-semibold text-white">
									{result.species}
								</span>
								{result.breed ? (
									<span className="px-2 py-1 border bg-amber-500 rounded-lg text-xl font-semibold text-white">
										{result.breed}
									</span>
								) : (
									<></>
								)}
							</div>
						</p>
					)}
					<button
						onClick={onSubmit}
						className="py-2.5 px-3 text-white font-semibold leading-none border rounded-xl border-violet-700 bg-violet-600">
						Розпізнати!
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default RecognizePostModal;
