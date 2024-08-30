import React from 'react'
import { TDatePicker } from 'src/types/component'
import FormClasses from '@pageStyles/Form.module.scss'
import cn from 'classnames'
import { Calendar } from '@components/icons/icons'

const DatePicker = ({
    id,
    label,
    name,
    type = 'date',
    onChange,
    value,
    error,
    note,
    inputIcon,
    min,
    max
}: TDatePicker) => {
    return (
        <div className={cn(FormClasses['form-group'])}>
            {
                label != undefined &&
                <label htmlFor="date">
                    {label}
                </label>
            }
            <div className={`${cn(FormClasses['input-group'])} ${cn(FormClasses['with-icon'])}`}>
                {!inputIcon && <div className={cn(FormClasses['input-icon'])}>
                        <Calendar />
                    </div>
                }
                {inputIcon && <div className={cn(FormClasses['input-icon'])}>
                        {inputIcon}
                    </div>
                }
                <input
                    className={`cursor-pointer ${cn(FormClasses['form-control'])} ${error ? 'error' : ''}`}
                    id={id}
                    type={type}
                    name={name}
                    onChange={onChange}
                    value={value}
                    min={min}
                    max={max}
                    placeholder="MM/DD/YYYY"
                />
            </div>
            {
                error != undefined &&
                <p className="text-sm text-red-600">{error}</p>
            }
            {
                note != undefined &&
                <p className="my-1 text-sm font-medium text-black">{note}</p>
            }
        </div>
    )
}

export default React.memo(DatePicker)
