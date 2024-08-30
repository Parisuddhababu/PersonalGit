import { useEffect } from 'react';

const useEscapeKeyPress = (callback: () => void) => {
	useEffect(() => {
		function onEscapeKeyPress(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				callback();
			}
		}

		window.addEventListener('keydown', onEscapeKeyPress);
		return () => {
			window.removeEventListener('keydown', onEscapeKeyPress);
		};
	}, [callback]);
};
export default useEscapeKeyPress;
