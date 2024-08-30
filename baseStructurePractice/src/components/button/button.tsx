import React from 'react';
import { ButtonProps } from 'src/types/component';

const Button = ({ label, onClick, type = 'button', primary, secondary, warning, className, children, disabled = false }: ButtonProps) => {
	const color = React.useMemo(() => {
		if (primary) {
			return 'bg-primary';
		}
		if (secondary) {
			return 'bg-secondary';
		}
		if (warning) {
			return 'bg-warning';
		}

		return 'bg-default';
	}, []);

	return (
		<button className={`btn ${color} ${className} `} type={type} onClick={onClick} disabled={disabled}>
			{children}
			{label}
		</button>
	);
};

export default React.memo(Button);
