import React from "react";
import Input from "./Input";

export default {
    title: 'Form/Input',
    component: Input
}

export const Small = () => <Input size="small" placeholder='small size input'></Input>
export const Medium = () => <Input size="medium" placeholder='medium size input'></Input>
export const Large = () => <Input size="large" placeholder='large size input'></Input>

Large.storyName = 'Large Input';