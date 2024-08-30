import React from 'react';
import { ButtonProps } from 'src/types/component';

const Button = ({ onClick, type = 'button', className, children, disabled = false, title = '' }: ButtonProps) => {
	return (
		<button className={`btn ${className}`} type={type} onClick={onClick} disabled={disabled} title={title}>
			{children}
		</button>
	);
};

export default React.memo(Button);
