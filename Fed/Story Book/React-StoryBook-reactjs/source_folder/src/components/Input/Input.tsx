import React from 'react'
import './Input.css';

export default function Input(props: any) {
    const { size = 'medium', ...rest } = props;
    return (
        <div>
            <input className={`input ${size}`} {...rest} />
        </div>
    )
}
