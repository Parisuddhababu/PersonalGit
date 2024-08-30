# Azure DevOps

### 1.0.0 Setup the Projects
```
Requirements:
  Node Version: 18.12.1
  NPM Version: 8.19.2

1) npm install
2) npm i -g prettier
3) npm run assets:build
4) npm run build
5) npm run maintenance:dev
5) npm run dev
```
#### 1.0.1 Do Not Add Prettier Package in package.json file
### 1.0.2 Create a new .prettierrc name file and add below code in that file.
```
  <!-- Do Not Commit this file as well -->
  {
    "printWidth": 120,
    "tabWidth": 2,
    "singleQuote": false,
    "trailingComma": "es5",
    "semi": true,
    "endOfLine": "lf"
  }
```

### 2.0.0 Before Commit we Need to follow this steps

```
1) npm run assets:build
2) npm run lint
3) npm run build
5) npm run format
```
- If Above all command execute successfully without any error then only we need to commit the our code.

- Commit message pattern that we follow
  - [Module Name] - Your Commit Message (Changes that you made) - [Status => WIP | DONE]

### 3.0.0 Deployment Commands
```
Development Mode:
1) npm run maintenance:dev

Staging Mode:
1) npm run maintenance:stage

Production Mode:
1) npm run maintenance:prod
```

### 3.0.1 Development Starting Commands in local
```
1) Open accountCode.tsx file and find then function `getWebsiteCode` function and in that function you required to change url of api request param to your demo server url for the dynamic account code required
  Ex:
    <!-- Current File Code  -->
    let obj = {
      url: req === "https://localhost:3000" || req === "https://undefined" ? publicRuntimeConfig.FRONT_URL : getHostnameFromRegex(req),
    };

    <!-- Local development required changes -->
    let obj = {
      url: 'https://jkstagms1.demo.brainvire.dev/',
    };
2) After Development done while doing commit your code please revert account code file and do not commit anything in account code file

3) npm run maintenance:dev
```

### 4.0.0 Instruction to Add New Package

- First Check if it is develop by custom code then we can create a new custom component and try to reduce the adding a new package.
- Before adding a new package first we need to check package dependencies and exeution time, build size, g-zip build size by given below link
  - https://bundlephobia.com/

### 4.0.1 Adding Static Image in Component
- If we require to add any static image to our component with path then we need to define that path in `src/constant/imagepath.ts` file and used that variable in our component

### 4.0.2 Href Link Rendering (Link Component)
- If we need to render a link tag then we used a next Link component component in all over the project. for Example

```
import Link from "next/link";

<Link link="/blog" >
  <a className="blog-list">Blog</a>
</Link>
```

### 4.0.3 Image Rendering (Custom CustomImage Component)
- If We need to display in any section then we already created a common component for that and we need to used that component in all over the project. for example

```
const CustomImage = dynamic(() => import("@components/CustomImage/CustomImage"));

  <CustomImage
    src={parentCat?.new_arrival_image?.path}
    alt={parentCat?.new_arrival_image?.name}
    title={parentCat?.new_arrival_image?.name}
    height="778px"
    width="1920px" />
```

### 4.0.4 Image Zoom Feature (Custom Created)
- If we required to add Image zoom feature on hover the image then we have created a custom hook to handle it and we don't need to add any new package.

```

  <!-- In Your Respective CSS file you need to add below css - start -->
    .img-zoom-custom-img {
      z-index: 1;
      position: absolute;
      left: calc(100% - 50%);
      top: 0;
      opacity: 1;
      border: 1px solid lightgray;
      background-color: #ffffff;
      background-repeat: no-repeat;
    }

    .image-zoom-hover {
      position: absolute;
      width: 50px;
      height: 50px;
      border: 1px solid lightgray;
    }
  <!-- CSS - end -->


  const { mouseEnter, onMouseMove, mouseLeave, imgWidth, imgHeight, x, y, showMagnifier } = useZoomImageHook();

  <img
    src={`${selectedImage?.path ? selectedImage?.path : IMAGE_PATH.noImagePng}?w=${728}`}
    alt={selectedImage?.name ? selectedImage?.name : "No Image"}
    title={selectedImage?.name ? selectedImage?.name : "No Image"}
    height={"660px"}
    width={"728"}
    onMouseEnter={(e) => mouseEnter(e)}
    onMouseMove={(e) => onMouseMove(e)}
    onMouseLeave={() => mouseLeave()}
  />

  <!-- Respective place you can add on hover it will render -->
  <ImageZoom
    src={selectedImage?.path ? selectedImage?.path : IMAGE_PATH.noImagePng}
    imgWidth={imgWidth}
    imgHeight={imgHeight}
    x={x}
    y={y}
    showMagnifier={showMagnifier}
  />
```

### 5.0.1 Components Creation

1. First we need to take html and css file from the designed repository
    - 1.1. Make a CSS file based on defined component only not for the page wise for which page contains which component deviation you can check from the below link
      - Link: https://docs.google.com/spreadsheets/d/1v78zBSY9sXy1Gevbvf43LgVZUxseui89woE-s4kotSs/edit#gid=0

      - In above link Also we need to take care or the limitation columns as well if in limitation column it is added not divided then we can't create seperate component for that.

      For Example:
        Home Page
          - We have total 10 component as per sheet wise and we need to create 10 component wise css like below

              - File name like `banner-yourtemplatenumber`
              - src/assets/scss/components/banner-1.scss
              - src/assets/scss/components/about-us-1.scss
              - src/assets/scss/components/customize-your-jewellery-1.scss

    - 1.2. Each Seperate section having a margin-bottom css requirement wise both it is required
    - 1.3. If particular section having background color then it is having margin-bottom & padding as per css requirement wise both it is required
    - 1.4. - You must use dynamic value which is define as a dynamic variable you can check reference from variable.scss
    - 1.5. - First you need to confirm your design with your supirior then only you need to go to client confirmation
2. Make a Section wise component With folder
3. Particular format you need to gives a file name like below
  - Format: apiReturnSequenceSectionName-templateNumber.tsx
  - Example
    ```
      <!-- For Reference `templates/AppHome` -->
      api response json Sequence:
        "sequence": [
          "aboutus_data",
          "category",
          "customize_jewellery",
          "our_benefits",
          "download_app",
          "testimonials",
          "blog"
        ],
      ------------------------------------------------
      Section Wise File name
        1) aboutus_data-1.tsx
        2) category-1.tsx
        3) customize_jewellery-1.tsx
        4) our_benifits-1.tsx
        5) download_app-1.tsx
        6) testimonials-1.tsx
        7) blog-1.tsx
    ```
6. For Dynamic component based on api response you need to create. for this you need to add below function in Page wise index.tsx file like below
  - Example
    ```
    <!--For Reference  `templates/AppHome/components/index.tsx` file -->
    /**
    * Render Dynamic Component
    * @param type
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

    ```
7. For Adding style css based on component wise we already created function and we need to used that.
  - Example:
    ```
    <!-- For Reference `templates/AppHome/components/banner-section-1.tsx` -->
    <Head>
      <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.homeBannerSection)} />
    </Head>
    ```
8. For Final Step Page wise component render you need to add function that render all your component dynamic based on api response. in this function you need to add dynamic component render `type` and passing data to that particular components
  - Example:
    ```
      <!-- For Reference: `templates/AppHome/app-home.tsx` -->

      /**
      * props?.data?.[ele]?.type: Type of component coming from api based on template
      * data: props?.data?.[ele]?.data: Section wise your props
      * getComponents(): function already above created return component section wise
      */
      {props?.sequence?.map((ele) =>
            getComponents(props?.data?.[ele]?.type, ele, {
              data: props?.data?.[ele]?.data,
            })
          )}
    ```

9. Open Shared Excel Sheet and write down api response and listed out not used key into integration.

10. Create CSS file seprately for any new section as a components.


### Take Care points While Developing Sites
1. Any New task come first we need to properly understand like development wise, user experience through and any other page it will afftect or not and write down the all details in below sheet link in tab New task Discussion & time line & Priority
    - Link: https://docs.google.com/spreadsheets/d/1xgLNbLyfuyo0rBMle4FZ9A9SyhU6jt0PvmN8HTV-30s/edit#gid=1447015899
2. We need to define properly type of each of the variable and `strictly don't used a any type`
3. Your developed code can be passed in each and every sonarqube & elint rules
4. Whenever you required please used custom hook for better common component
5. We need to design component like we can re-used if they required in other page as well.
6. Unit Level Testing should be properly done by the respective developer which includes `Logical Flow, User Journey Flow, Responsive Flow, Best Practices, Google Web Vitals - FCP, LCP, CLS with Green Signal` as it is an E-Commerce Sites etc.
7. After your development done of any changes you need to do properly unit testing on demo & staging server then only you can inform your supirior to task is DONE.
8. While you develop any of the new page, component or doing any change then please cross check of while we loading any other template type like template 1, template 2 etc. at that time design & functionality was not break. Also we need to check with design and functionality with suffling of the each and every component in single page.
9. Always do have confirmation from a Superior Person regarding Functionality/Features to Keep on top based on the User Journey and Logical as it is an E-Commerce Site rather than doing it based on Assumption.
10. The Call Out Process should be done at the right time to cover a task properly.
11. Feasibility Test should be properly verified before sharing estimation.
12. During execution time, do note about the unforeseen cases which seem challenging so that we can find a proper solution and can be helpful to plan accordingly further. Recommended to update the same details in some excel sheets by coordinating with Akash. Refer to point no 1.
13. Daily Task Updates should give a clear understanding of it.
14. Ownership of each task should be taken properly to execute it as per requirement.
15. After Development Done Please remove un-wanted & commented code from your component and also remove the console, alert message.