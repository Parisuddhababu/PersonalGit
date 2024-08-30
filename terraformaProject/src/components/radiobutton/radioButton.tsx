import React from 'react';
import { RadioButtonProps } from 'src/types/component';
import FormClasses from '@pageStyles/Form.module.scss'
import cn from 'classnames'

const RadioButtons: React.FC<RadioButtonProps> = ({
    value,
    label,
    checked,
    onChange,
    id,
    name,
    className,

}) => {
    const handleInputChange = () => {
        onChange(value);
    };

    return (
        
        <label className={cn(FormClasses['radio-btn'])} >
            <input
                type="radio"
                value={value}
                checked={checked}
                onChange={handleInputChange}
                id={id}
                name={name}
                className={className}
            />
            {label}
        </label>



    );
};

export default RadioButtons;