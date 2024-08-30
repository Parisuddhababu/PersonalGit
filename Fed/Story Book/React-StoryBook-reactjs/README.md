# **[React StoryBook](#)**

## What is StoryBook? & Why is it used? 
* A development environment & playground for UI components
* Create component independently
* Showcase those components interactively in an isolated development environment 
* Ability to view the different components that have already been developed.
* View What are the different props that those developed components accept
* Ability to visually showcase those components to your stakeholders for feedback.
* Dynamically change props, accessibility score. 

## Install storybook in react project 

* npx  create-react-app react-storybook - - template typescript

* npm sb init

## For Run the storybook : 

* **npm run storybook**

## Writing stories

* ### Create a component folder & create component
    * Component.css
    * Component.tsx
    * Component.stories.tsx
        
* ### Start writing stories for components.

    * ### Component.tsx
        ```
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
        ```
	* ### Component.css
        ```
        .input {
            display: block;
            width: 400px;
            padding-left: 1rem;
            padding-right: 0.25rem;
            border: 1px solid;
            border-color: inherit;
            background-color: #fff;
        }
        .small {
            height: 2rem;
            font-size: 0.875rem;
        }
        .medium {
            height: 2.5rem;
            font-size: 1rem;
        }
        .large {
            height: 3rem;
            font-size: 1.50rem;
        }
        ```
    * ### Component.stories.tsx
        ```
        import React from "react";
        import Input from "./Input";
        
        export default {
            title: 'Input',
            component: Input
        }
        
        export const Small = () => <Input size="small" placeholder='small size input'></Input>
        export const Medium = () => <Input size="medium" placeholder='medium size input'></Input>
        export const Large = () => <Input size="large" placeholder='large size input'></Input>
        ```
## Story Hierarchy
* ### It is used for creating a group of components in a story book.
    ```
    Form
        -> Button 
        -> Input
        -> RadioButton
    ```
* ### For syntax of story hierarchy
    ```
    export default {
        title: 'Form/Input',
        component: Input
    }
    ```
 	
## Renaming Stories in v6
* ### It’s use for renaming the stories using the following syntax 
    ```
    stories.storyName = ‘story new name’;
    ``` 
	
* ### For Example 
    ```
    export const Large = () => <Input size="large" placeholder='large size input'></Input>
        
    Large.storyName = 'Large Input';
    ```

## Stories in v6
* ### Also you can sorting the stories by name
    ```
    options: {
        storySort: (a, b) =>
            a[1].kind === b[1].kind ? 0 :  
            a[1].id.localeCompare(b[1].id, undefined, { 
        numeric: true }),
    },
	```	
    > `Note:`  *copy this options object property and past in .storybook/preview.js file*

## Story within story
* ### Subscriptions.tsx	
```	
import React from "react";
import { Large } from '../Input/Input.stories';
import { Primary } from "../Button/Button.stories";

export default {
    title: 'Form/Subscriptions'
}
export const primarySubscriptions = () => (
<>
    <Large />
    <Primary />
</>
)
```

## Using args in v6	
```
const Template = args=> <Button {...args}>

export const primaryA = Template.bind({})
primaryA.args={
    variant: ‘primary’,
    children: ‘primary Args’
}
```

## Decorators  
* ### Create a new component (Center)

    - Center.tsx
    - Center.css
	    
        > `Note:` *created component it’s just for utility* 
	
- ### Implement the Decorators in `specific component`

    * First import the Center component in component which you want to implement decorators 
        ```
        import Center from "../center/Center";
        ```
    * Add the decorators in default export
        ```
        export default {
                title: 'Form/Button',
                component: Button,
                decorators: [(story: () => any) => <Center>{story()}</Center>]      //declare the decorators as a component scop
            }
        ```
* ### Implement the Decorators in `Global scop`

    * Open the preview.js file in .storybook/preview.js 
    * And add the utility component in preview.js file 

        ```
        import React from "react"
        import { addDecorator } from "@storybook/react"
        import Center from '../src/components/center/Center'

        addDecorator(stroy => <Center>{stroy()}</Center>)
        ```