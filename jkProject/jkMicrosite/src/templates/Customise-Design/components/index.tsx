import { getTypeWiseComponentName } from "@util/common";
import React from "react";
import customiseSteps1 from "@templates/Customise-Design/components/Steps/customise-steps-1";
import CustomiseForm1 from "@templates/Customise-Design/components/Forms/customise-form-1";


// All Dynamic Component name for Mapping
const componentMapping: { [key: string]: any } = {
    custom_design_steps_1: customiseSteps1,
    enquiry_form_1: CustomiseForm1,
};


/**
 * Render Dynamic Component
 * @param type Template Type of Dynamic Component
 * @param name component Name
 * @param props required props
 * @returns
 */
export const getComponents = (type: string, name: string, props: any) => {
    const ComponentName = getTypeWiseComponentName(type, name);
    const RenderComponent = componentMapping[ComponentName];
    if (RenderComponent) {
        return <RenderComponent {...props} />;
    }
};
