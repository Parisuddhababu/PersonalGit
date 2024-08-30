import React from 'react'
import './Center.css';
export default function Center(props: any) {
    return (
        <div className='center'>
            {props.children}
        </div>
    )
}
