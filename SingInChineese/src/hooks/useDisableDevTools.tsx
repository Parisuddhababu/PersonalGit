import { useEffect } from 'react';

const useDisableDevTools = () => {
	useEffect(() => {
		const disableContextMenu = (e: MouseEvent) => e.preventDefault();
		const disableDevTools = (e: KeyboardEvent) => {
			if (
				(e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) || // Ctrl+Shift+I
				(e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) || // Ctrl+Shift+J
				(e.ctrlKey && (e.key === 'U' || e.key === 'u')) || // Ctrl+U
				e.key === 'F12'
			) {
				e.preventDefault();
			}
		};

		document.addEventListener('contextmenu', disableContextMenu);
		document.addEventListener('keydown', disableDevTools);

		return () => {
			document.removeEventListener('contextmenu', disableContextMenu);
			document.removeEventListener('keydown', disableDevTools);
		};
	}, []);
};

export default useDisableDevTools;
