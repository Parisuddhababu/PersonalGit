import React from 'react'
import FormClasses from '@pageStyles/Form.module.scss'
import cn from 'classnames'
import { CheckBoxOption, TCheckBox } from 'src/types/component'

const CheckBox = ({
    label,
    error,
    note,
    option,
    IsCheckList
}: TCheckBox) => {
    return (
        <React.Fragment>
            <div className={cn(FormClasses['form-group'])}>
                {
                    label != undefined &&
                    <label htmlFor="CheckBox">
                        {label}
                    </label>
                }
                <div className={cn(FormClasses['checkbox-group'], `${ IsCheckList ? FormClasses['checkbox-group-list'] :''}`)}>
                    {option?.map((optionList: CheckBoxOption, index: number) => 
                        <>
                            <label htmlFor={optionList.id} key={`${index+1}`} className={cn(FormClasses['checkbox-item'])}>
                                <input
                                    className={`${cn(FormClasses['form-control'])} ${error ? 'error' : ''}`}
                                    id={optionList.id}
                                    type='checkbox'
                                    name={optionList.name}
                                    value={optionList.value}
                                />                                
                                <span>
                                    {optionList.name }
                                </span>
                            </label>
                        </>
                    )}
                </div>
                {
                    error != undefined &&
                    <p className="text-red-600 text-sm">{error}</p>
                }
                {
                    note != undefined &&
                    <p className="text-black text-sm font-medium my-1">{note}</p>
                }
            </div>
        </React.Fragment>
    )
}

export default React.memo(CheckBox)
