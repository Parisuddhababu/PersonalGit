import React from "react";
import Button from "./Button";

export default {
    title: 'Form/Button',
    component: Button,
    // decorators: [(story: () => any) => <Center>{story()}</Center>]      //declare the decorators as a component scop
}
export const Primary = () => <Button variant="primary">Primery</Button>
export const Secondary = () => <Button variant="secondary">Secondary</Button>
export const Success = () => <Button variant="success">Success</Button>
export const Danger = () => <Button variant="danger">Danger</Button>

// Using args in v6
// const Template = (args: any) => <Button {...args} />;
// export const PrimaryA = Template.bind({})
// PrimaryA.args = {
//     variant: 'primary',
//     children: 'primary Args'
// }