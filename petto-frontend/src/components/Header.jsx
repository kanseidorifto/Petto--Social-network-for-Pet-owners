import { Bars3Icon } from '@heroicons/react/24/outline';
import useModal from '../hooks/useModal';

const Header = () => {
	const { open: openBurger } = useModal('mobileNavModal');

	return (
		<header className="w-full bg-violet-500">
			<div className="container py-3 px-4 mx-auto flex justify-between">
				<span className="text-2xl leading-none text-pacifico text-amber-400">Petto</span>
				{openBurger && (
					<button
						type="button"
						onClick={openBurger}
						className="align-middle rounded md:hidden justify-self-end focus:outline-none hover:bg-amber-400/30 transition-colors">
						<Bars3Icon className="w-8 h-8 text-amber-400" />
					</button>
				)}
			</div>
		</header>
	);
};

export default Header;
