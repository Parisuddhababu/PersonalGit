# React-Brainvire-POC

Node version: v16.16.0
NPM version: 9.6.7

## Table of Contents

- [Project Structure]
- [ Technologies]
- [ Setup ]
- [ Documentation & usecase ]

## Introduction

Brainvire POC Unique Features Used in New Development Brainvire V2

## Project Structure

- [node_modules]
- [public]
- [src]
- [@types]
- [components]
- [common]
- [constant]
- [header]
- [hooks]
- [sections]
- [utils]
- [assets]
- [icons]
- [images]
- [scss]
- [App.css]
- [App.tsx]
- [index.css]
- [main.tsx]
- [Router.tsx]
- [vite-env.d.ts]
- [.eslintrc.cjs]
- [.gitignore]
- [index.html]
- [package-lock.json]
- [package.json]
- [postcss.config.js]

# Technologies

- React
- TypeScript
- Vite

## List of Librarys

1.  react-glider

    #### https://www.npmjs.com/package/react-glider

    #### `npm i react-glider`

2.  react-router-dom

    #### https://www.npmjs.com/package/react-router-dom

    #### `npm i react-router-dom`

3.  react-star-ratings

    #### https://www.npmjs.com/package/react-star-ratings

    #### `npm i react-star-ratings`

4.  sass

    #### https://www.npmjs.com/package/react-star-ratings

    #### `npm i sass`

5.  node-sass

    #### https://www.npmjs.com/package/node-sass

    ### `npm i node-sass`

6.  classnames

    #### https://www.npmjs.com/package/classnames

    #### `npm i classnames`

7.  tailwindcss # https://tailwindcss.com/docs/installation

    1.  ## Install Tailwind CSS

        Install tailwindcss via npm, and create your tailwind.config.js file.

        ### `npm install -D tailwindcss`

        ### `npx tailwindcss init`

    2.  Configure your template paths
        Add the paths to all of your template files in your tailwind.config.js file.

        #### /\*_ @type {import('tailwindcss').Config} _/

                  module.exports = {
                  content: [
                    "./index.html",
                    "./src/**/*.{js,ts,jsx,tsx}",
                  ],
                   theme: {
                   extend: {},
                  },
                   plugins: [],
                  }

    3.  Add the Tailwind directives to your CSS
        Add the @tailwind directives for each of Tailwind’s layers to your main CSS file.

             @tailwind base;
             @tailwind components;
             @tailwind utilities;

## setup Command

To run this project locally, you can use the following commands:

1. Clone the repository:

   Repo: https://dev.azure.com/BrainvireInfo/Fed-BaseStructure/_git/Front_End_Documentation?path=%2F&version=GBfeature%2Freact-poc-feature-brainvire

2. Change into the directory:

   cd react-poc-feature-brainvire

3. Install the dependencies:

   npm install

4. Start the development server:

   npm run dev

5. Open the browser and navigate to http://localhost:5173/

6. Build the Project

   npm run preview

## UseCase

## ===================================================================================================================

## 1. industry-we-serve

## ===================================================================================================================

**Use Case: Industry Selection**

**Description:**

`IndustryWeServe`, is designed to showcase and navigate through a list of industries. It provides a user interface that allows users to select and view details of different industries. The component includes a dropdown menu, a horizontal slider for industry selection

**Key Features:**

1. **Dropdown Menu:**

   - Clicking on the dropdown area displays a list of industries.
   - Users can select an industry from the dropdown list.

2. **Horizontal Slider:**

   - Displays a subset of industries in a horizontally scrollable slider.
   - Users can navigate left and right through industries using navigation buttons.
   - The active industry is highlighted in the slider.

3. **Industry Information:**

   - Displays detailed information about the selected industry in a separate section.
   - Information includes the industry title and descriptions.

4. **Keyboard Accessibility:**
   - Users can navigate and select industries using the keyboard (e.g., arrow keys, Enter key).

**How to Use:**

1. **Rendering the Component:**
   - Import the `TopSectionData` component.
   - Pass an array of industry items (`industry_items[activeIndex]`) as a prop.
   - Add Proper Types

```tsx
<TopSectionData industry={industry_items[activeIndex]} />
```

2. **Providing Industry Data:**
   - Ensure that the `industry_items` prop is an array of objects, where each object represents an industry.
   - Each industry object should have properties like `industry_title` and `descriptions`.

```tsx
// Sample industry data
export const industriesData = [
  { industry_title: 'Industry 1', descriptions: 'Description 1' },
  { industry_title: 'Industry 2', descriptions: 'Description 2' },
  // Add more industry objects as needed
];
```

**Note:**
Ensure that the necessary styles, icons (`SliderNextArrow` and `SliderPrevArrow`)

**Snapshot:**

![Industry We Serve](https://dev.azure.com/BrainvireInfo/9e43166a-9cd3-4232-8a59-017698f26e78/_apis/git/repositories/9b507252-6292-49a7-b0b5-3bc86fc9d32d/items?path=/Custom%20Reusable%20Components/Brainvire-POC-reactjs/Application%20Snapshot/industry-we-serve.png&versionDescriptor%5BversionOptions%5D=0&versionDescriptor%5BversionType%5D=0&versionDescriptor%5Bversion%5D=feature/folder-structure&resolveLfs=true&%24format=octetStream&api-version=5.0)

## =====================================================================================================================--

## 2. marquee_slider

## =====================================================================================================================--

**Use Case: Client Logo Marquee Slider**

**Description:**

The `MarqueeSlider` component is designed to create an engaging and visually appealing marquee slider displaying client logos. This component is suitable for showcasing a list of trusted clients or partners on a website. It utilizes a horizontal scrolling effect to display logos continuously.

**Key Features:**

1. **Dynamic Content:**

   - Accepts a `title` prop to dynamically set the title of the marquee slider section.

2. **Client Logo Display:**

   - Renders client logos dynamically based on the `client_logo` prop.
   - Utilizes the `uuid` utility function to generate unique keys for each logo.

3. **Responsive Design:**

   - Sets the height and width of each logo for consistency and responsiveness.

4. **Horizontal Marquee Effect:**

   - Implements a horizontal marquee effect for an interactive and continuous display of client logos.
   - Uses two sets of logos in different marquee groups to create a seamless transition.

5. **Reverse Marquee:**
   - Provides an additional marquee section with logos displayed in reverse order for variety.

**How to Use:**

1. **Rendering the Component:**
   - Import the `MarqueeSlider` component.
   - Pass the necessary props, such as `title` and `client_logo`, to customize the content.

```tsx
import MarqueeSlider from './path/to/MarqueeSlider';
import { clientData } from './path/to/clientData';

// Render the component
const App = () => {
  return (
    <div>
      <MarqueeSlider title='Trusted Clients' client_logo={clientData} />
    </div>
  );
};

export default App;
```

2. **Providing Client Logo Data:**
   - Ensure that the `client_logo` prop is an array of objects, where each object represents a client logo.
   - Each logo object should have properties like `logo`, `title`, etc.

```jsx
// Sample client logo data
export const clientData = [
  { logo: 'path/to/logo1.png', title: 'Client 1' },
  { logo: 'path/to/logo2.png', title: 'Client 2' },
  // Add more logo objects as needed
];
```

**Note:**
Ensure that the necessary styles and dependencies are correctly imported and configured for the proper functioning of the marquee slider component.

**Snapshot:**

![Marquee Slider](https://dev.azure.com/BrainvireInfo/9e43166a-9cd3-4232-8a59-017698f26e78/_apis/git/repositories/9b507252-6292-49a7-b0b5-3bc86fc9d32d/items?path=/Custom%20Reusable%20Components/Brainvire-POC-reactjs/Application%20Snapshot/marquee_slider.png&versionDescriptor%5BversionOptions%5D=0&versionDescriptor%5BversionType%5D=0&versionDescriptor%5Bversion%5D=feature/folder-structure&resolveLfs=true&%24format=octetStream&api-version=5.0)

## =====================================================================================================================--

## 3. Masonry-store

## =====================================================================================================================--

**Use Case: Masonry Store Display with Interactive Features**

**Description:**

The `MasonryStore` component is designed to present a visually appealing and interactive masonry-style grid of items, such as products or services. It includes features like a dropdown effect, responsive layout adjustments, and interactive elements for a dynamic user experience.

**Key Features:**

1. **Masonry-Style Grid:**

   - Displays a masonry-style grid of items, each represented by a box.
   - Utilizes a responsive layout that adjusts based on the screen size.

2. **Interactive Dropdown Effect:**

   - Implements an interactive dropdown effect for each item box.
   - Clicking on an item toggles its visibility, revealing additional content.
   - Clicking again or on another item closes the active dropdown.

3. **Top-Right Arrow Indicator:**

   - Displays a top-right arrow indicator for each item box.
   - Provides visual cues indicating the dropdown direction.

4. **Responsive Design:**

   - Adjusts the layout and behavior for different screen sizes.
   - On larger screens (>= 1024 pixels), certain items are visually divided into column halves.

5. **Dynamic Content Rendering:**

   - Renders dynamic content for each item, including an image, title, and description.
   - Uses provided data through the `list` prop.

6. **Call-to-Action (CTA) Button:**
   - Includes a prominent CTA button at the bottom of the grid.
   - The button links to an external resource specified in the `cta` prop.

**How to Use:**

1. **Rendering the Component:**
   - Import the `MasonryStore` component.
   - Pass the necessary props, such as `title`, `list`, and `cta`, to customize the content.

```tsx
import MasonryStore from './path/to/MasonryStore';
import { sectionTwoData } from './path/to/sectionTwoData'; // Ensure that you have the necessary data

// Render the component
const App = () => {
  return (
    <div>
      <MasonryStore {...sectionTwoData} />
    </div>
  );
};

export default App;
```

2. **Providing Section Data:**
   - Ensure that the `sectionTwoData` object includes the required properties, such as `title`, `list`, and `cta`.

```tsx
// Sample section data
export const sectionTwoData = {
  title: 'Explore Our Products',
  list: [
    {
      title: 'Product 1',
      image: 'path/to/image1.jpg',
      description: 'Description 1',
    },
    {
      title: 'Product 2',
      image: 'path/to/image2.jpg',
      description: 'Description 2',
    },
    // Add more items as needed
  ],
  cta: {
    cta: { title: 'Contact Us', url: '/contact' },
  },
};
```

**Note:**
Ensure that the necessary styles, icons (`ButtonDownArrowIcon`, `TopRightAngleArrow`, `BtnRightArrow`), and dependencies are correctly imported and configured for the proper functioning of the masonry store component.

**Snapshot:**

![Masonry Store](https://dev.azure.com/BrainvireInfo/9e43166a-9cd3-4232-8a59-017698f26e78/_apis/git/repositories/9b507252-6292-49a7-b0b5-3bc86fc9d32d/items?path=/Custom%20Reusable%20Components/Brainvire-POC-reactjs/Application%20Snapshot/masonry-store.png&versionDescriptor%5BversionOptions%5D=0&versionDescriptor%5BversionType%5D=0&versionDescriptor%5Bversion%5D=feature/folder-structure&resolveLfs=true&%24format=octetStream&api-version=5.0)

## =====================================================================================================================

## 4. OurClientSay

## =====================================================================================================================

**Use Case: Testimonials Slider Component**

**Overview:**
The `OurClientSay` component is a React-based testimonials slider designed to display client reviews in an interactive and visually appealing way. This component utilizes the `react-glider` library for smooth sliding transitions and incorporates various features to enhance the user experience.

**Key Features:**

1. **Responsive Design:**

   - The testimonials slider is responsive and adapts its layout based on different screen sizes.
   - It uses breakpoints to adjust the number of visible slides, providing an optimal viewing experience on various devices.

2. **Navigation Controls:**

   - Previous and next navigation buttons allow users to manually scroll through the testimonials.
   - The navigation buttons are styled differently for desktop and mobile views, enhancing usability.

3. **Client Review Data:**

   - The component accepts a list of client reviews (`props.data`) to be displayed in the slider.
   - Each review includes a featured image, title, designation, description, rating, and verification status.

4. **Glider Configuration:**

   - The `react-glider` component is configured with options such as draggable slides, arrow navigation, and the number of slides to show and scroll.
   - Responsive settings are defined to control the number of slides displayed at different breakpoints.

5. **Star Ratings:**

   - Star ratings are dynamically generated for each testimonial based on the provided rating.
   - The star color, dimensions, and spacing are customizable.

6. **Additional Elements:**
   - Each testimonial includes the client's featured image, name, designation, description, a "Verified on Clutch" badge, and the star rating.

**How to Use:**

1. **Installation:**
   - Install the `react-glider` library and ensure it is available in your project.

```bash
npm install react-glider
```

2. **Import Component:**
   - Import the `OurClientSay` component in your project.

```Typescript
import OurClientSay from 'path/to/OurClientSay';
```

3. **Pass Testimonial Data:**
   - Provide an array of client reviews as a prop (`props.data`) to the `OurClientSay` component.

```Typescript
const testimonialData = [
  {
    title: "Client Name 1",
    designation: "CEO, Company A",
    description: "We had a great experience working with this team. They delivered high-quality results on time.",
    rating: 4.5,
    featured_image: "path/to/image1.jpg",
  },
];

<OurClientSay data={testimonialData} title="What Our Clients Say" sub_title="Testimonials from satisfied clients" />;
```

4. **Customization:**
   - Customize the component further by adjusting the styling, breakpoints, and other configurations as needed.

**Note:**
Ensure that the required icons, images, and utility functions (e.g., `uuid`) are available in your project or replace them with your preferred alternatives.

**Snapshot:**

![Our Client Say](https://dev.azure.com/BrainvireInfo/9e43166a-9cd3-4232-8a59-017698f26e78/_apis/git/repositories/9b507252-6292-49a7-b0b5-3bc86fc9d32d/items?path=/Custom%20Reusable%20Components/Brainvire-POC-reactjs/Application%20Snapshot/OurClientSay.png&versionDescriptor%5BversionOptions%5D=0&versionDescriptor%5BversionType%5D=0&versionDescriptor%5Bversion%5D=feature/folder-structure&resolveLfs=true&%24format=octetStream&api-version=5.0)

## =====================================================================================================================--

## 5. OurSuccessStories

## =====================================================================================================================--

**Use Case: Interactive Case Study Showcase Component**

**Overview:**
The `OurSuccessStories` component is a versatile React-based showcase for presenting case studies and success stories. It provides an interactive interface for users to explore different categories of case studies, view details, and navigate to additional content.

**Key Features:**

1. **Category Dropdown:**

   - The component displays a dropdown menu of case study categories.
   - Users can click on the dropdown to reveal available categories and select one.

2. **Interactive Category Links:**

   - Each category link includes an icon representing the industry and the industry name.
   - Clicking on a category link updates the displayed case studies based on the selected category.

3. **Dynamic Case Study Content:**

   - The component dynamically renders case studies based on the selected category.
   - Each case study includes a title, image, description, and a "Read More" link for additional details.

4. **Responsive Design:**

   - The layout adapts to different screen sizes, providing a seamless experience on various devices.

5. **Background Image for All Stories:**

   - The component includes a background image for an "All Stories" section.
   - The background image is displayed along with a link to view all case studies in that category.

6. **Read More Links:**

   - Each case study item includes a "Read More" link, allowing users to access the full case study details.

7. **Event Handling:**

   - The component uses event handling for dropdown visibility, item selection, and handling clicks outside the dropdown to close it.
   - Keyboard interaction is also supported for accessibility.

8. **Responsive Background Image:**
   - The background image for the "All Stories" section is displayed conditionally based on the screen size to ensure a pleasant visual experience.

**How to Use:**

1. **Installation:**

   - Ensure that the required dependencies and utility functions, such as `uuid`, are available in your project.

2. **Import Component:**
   - Import the `OurSuccessStories` component in your project.

```javascript
import OurSuccessStories from 'path/to/OurSuccessStories';
```

3. **Pass Case Study Data:**
   - Provide case study data as a prop (`props.data`) to the `OurSuccessStories` component.

```Typescript
const caseStudyData = {
  category_title: "Success Stories",
  data: [
    {
      industry: "Technology",
      category_icon: "path/to/technology-icon.png",
      casestudy: [
        {
          title: "Revolutionizing Tech",
          image: "path/to/tech-image.jpg",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          link: {
            url: "/case-study/tech-case-study",
            title: "View Case Study",
          },
        },
        // Add more case studies as needed
      ],
      page_link: {
        url: "/all-tech-stories",
        title: "View All Technology Stories",
      },
    },
    // Add more categories as needed
  ],
};

<OurSuccessStories {...caseStudyData} />;
```

**Note:**

- Customize the component further by adjusting styling, breakpoints, and other configurations as needed.
- Ensure that required icons, images, and utility functions are available in your project or replace them with your preferred alternatives.

**Snapshot:**

![Our Success Stories](https://dev.azure.com/BrainvireInfo/9e43166a-9cd3-4232-8a59-017698f26e78/_apis/git/repositories/9b507252-6292-49a7-b0b5-3bc86fc9d32d/items?path=/Custom%20Reusable%20Components/Brainvire-POC-reactjs/Application%20Snapshot/OurSuccessStories.png&versionDescriptor%5BversionOptions%5D=0&versionDescriptor%5BversionType%5D=0&versionDescriptor%5Bversion%5D=feature/folder-structure&resolveLfs=true&%24format=octetStream&api-version=5.0)

## =====================================================================================================================--

## 6. readmore_less

## =====================================================================================================================--

**Use Case: Interactive Services Offering Section**

**Overview:**
The `ReadMoreLess` component is a React-based section that displays a grid of services offering information. It provides an interactive interface where users can click on individual service items to view more details. The component utilizes hooks and validation functions to handle accordion-style behavior on smaller screens and ensures a visually appealing presentation.

**Key Features:**

1. **Accordion-style Interaction:**

   - The component enables an accordion-style interaction, allowing users to expand and collapse individual service items for a more concise view.
   - It uses the `useAccordion` custom hook for smooth scrolling to the clicked item when expanding.

2. **Responsive Design:**

   - The layout adjusts based on the screen size to provide an optimal viewing experience on both desktop and mobile devices.
   - Accordion-style behavior is activated for screens below a specified width (768 pixels in this case).

3. **Service Item Rendering:**

   - Each service item is rendered with an image, title, and a brief description.
   - Clicking on a service item expands it to reveal additional details.

4. **Active Item Styling:**

   - The active service item is visually highlighted with a different background or border, making it easy for users to identify the selected item.

5. **Event Handling:**

   - The component handles click and keyboard events for improved accessibility.
   - Clicking on a service item triggers the accordion-style interaction, and the Enter key can be used as an alternative.

6. **Corner Decoration:**

   - Each service item includes a decorative corner element (represented by the `RightSquareCornerSvg` icon).

7. **Text Trimming:**
   - The `TextTrimData` component is used to trim and display the service item descriptions, ensuring a clean and consistent presentation.

**How to Use:**

1. **Installation:**

   - Ensure that the required dependencies, utility functions (`uuid`), and icons are available in your project.

2. **Import Component:**
   - Import the `ReadMoreLess` component in your project.

```typescript
import ReadMoreLess from 'path/to/ReadMoreLess';
```

3. **Pass Service Offering Data:**
   - Provide the service offering data as a prop (`props.list`) to the `ReadMoreLess` component.

```typescript
const serviceOfferingData = {
  title: 'Our Services',
  description: 'Explore our range of services',
  list: [
    {
      data: {
        title: 'Service 1',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        image: 'path/to/service1-image.jpg',
      },
      indexPosition: 0,
    },
    // Add more service items as needed
  ],
};

<ReadMoreLess {...serviceOfferingData} />;
```

**Note:**

- Customize the component further by adjusting styling, breakpoints, and other configurations as needed.
- Ensure that required icons, images, and utility functions are available in your project or replace them with your preferred alternatives.

**Snapshot:**

![Read More Less](https://dev.azure.com/BrainvireInfo/9e43166a-9cd3-4232-8a59-017698f26e78/_apis/git/repositories/9b507252-6292-49a7-b0b5-3bc86fc9d32d/items?path=/Custom%20Reusable%20Components/Brainvire-POC-reactjs/Application%20Snapshot/readmore_less.png&versionDescriptor%5BversionOptions%5D=0&versionDescriptor%5BversionType%5D=0&versionDescriptor%5Bversion%5D=feature/folder-structure&resolveLfs=true&%24format=octetStream&api-version=5.0)

## =====================================================================================================================

## 7. ServicesWeServed

## =====================================================================================================================

**Use Case: Services We Served Section**

**Overview:**
The `ServicesWeServed` component is a React-based section that showcases a list of services provided, along with additional information in a side panel. This section aims to provide users with a comprehensive view of the services offered, navigation links, and a search feature. The component utilizes two additional components, `ServicesList` and `ServiceSidePanel`, for rendering the services grid and side panel content, respectively.

**Key Features:**

1. **Services Grid:**

   - The `ServicesList` component renders a grid of services, each represented by an icon and title.
   - Clicking on a service expands the row below it, revealing navigation links.

2. **Interactive Accordion Behavior:**

   - The services grid supports an interactive accordion behavior, allowing users to expand and collapse individual service items.
   - Keyboard navigation is supported for accessibility.

3. **Responsive Design:**

   - The layout adjusts based on the screen size to provide an optimal viewing experience on both desktop and mobile devices.
   - The side panel is conditionally displayed for screens wider than 990 pixels.

4. **Side Panel Content:**

   - The `ServiceSidePanel` component displays additional information on the side, including the section title, a description, a link to case studies, and a search feature.

5. **Search Feature:**

   - Users can input search queries in the search box and click the search button to initiate a search.
   - The search box includes a placeholder for guidance.

6. **Case Studies Link:**

   - If a case studies link is provided, it is displayed with a corresponding icon in the side panel.

7. **Customizable Icons:**
   - Icons such as `CaseStudiesIcon` and `SearchIcon` are used for visual elements, enhancing the overall design.

**How to Use:**

1. **Installation:**

   - Ensure that the required dependencies, utility functions (`uuid`), and icons are available in your project.

2. **Import Components:**
   - Import the `ServicesWeServed`, `ServicesList`, and `ServiceSidePanel` components in your project.

```typescript
import ServicesWeServed from 'path/to/ServicesWeServed';
```

3. **Pass Data to the Component:**
   - Provide the necessary data as props to the `ServicesWeServed` component.

```typescript
const servicesData = {
  title: 'Services We Served',
  data: [
    // Provide service data as needed
  ],
  sub_line: 'Explore our range of services',
  case_study_url: {
    url: '/case-studies',
    title: 'View Case Studies',
  },
  text_for_the_search_product: 'Search for our products:',
};

<ServicesWeServed {...servicesData} />;
```

**Note:**

- Customize the components further by adjusting styling, breakpoints, and other configurations as needed.
- Ensure that required icons, images, and utility functions are available in your project or replace them with your preferred alternatives.

**Snapshot:**

![Services We Served](https://dev.azure.com/BrainvireInfo/9e43166a-9cd3-4232-8a59-017698f26e78/_apis/git/repositories/9b507252-6292-49a7-b0b5-3bc86fc9d32d/items?path=/Custom%20Reusable%20Components/Brainvire-POC-reactjs/Application%20Snapshot/ServicesWeServed.png&versionDescriptor%5BversionOptions%5D=0&versionDescriptor%5BversionType%5D=0&versionDescriptor%5Bversion%5D=feature/folder-structure&resolveLfs=true&%24format=octetStream&api-version=5.0)

## =====================================================================================================================

## 8. YoutubePlay

## =====================================================================================================================

**Use Case: Interactive Company Overview Section with Embedded Video**

**Overview:**
The `YoutubePlay` component is designed to create an engaging and interactive company overview section on a website. It includes a video preview, company information, and additional links. The video starts playing when it becomes visible in the viewport, enhancing the user experience. The section adapts its layout based on the screen width for a responsive design.

**Key Features:**

1. **Video Preview:**

   - The component includes a video preview using the `OurCompanyVideo` component.
   - The video plays automatically when it becomes visible in the viewport and pauses when it's not in view, providing an interactive and seamless experience.

2. **Responsive Design:**

   - The layout adjusts based on the screen width to ensure optimal viewing on different devices.
   - The company information and other links are arranged in a grid format for better organization.

3. **Company Header:**

   - The component displays a company header with a title and a description.

4. **Company Information:**

   - Company-specific information is presented in a graphical format.
   - Each piece of information includes a count and a corresponding title.

5. **Additional Links:**

   - Links to other pages or resources related to the company are displayed in a navigation menu.

6. **Conditional Header Display:**
   - The company header is displayed differently based on the screen width. On smaller screens (width <= 990 pixels), the header is shown above the video. On larger screens (width > 990 pixels), the header is displayed to the left of the video.

**How to Use:**

1. **Installation:**

   - Ensure that the required dependencies, utility functions (`uuid`), and icons are available in your project.

2. **Import Components:**
   - Import the `YoutubePlay` component in your project.

```javascript
import YoutubePlay from 'path/to/YoutubePlay';
```

3. **Pass Data to the Component:**
   - Provide the necessary data as props to the `YoutubePlay` component.

```typescript
const companyInfoData = {
  title: 'Our Company',
  description: 'Learn more about our company and what we do.',
  video_thumb_url: '/path/to/video-thumbnail.jpg',
  company_info: [
    { count: '100+', title: 'Employees' },
    { count: '50+', title: 'Projects Completed' },
    // Add more company info items as needed
  ],
  other_page_links: [
    { url: '/services', title: 'Our Services' },
    { url: '/contact', title: 'Contact Us' },
    // Add more links as needed
  ],
};

<YoutubePlay {...companyInfoData} />;
```

**Note:**

- Customize the component further by adjusting styling, breakpoints, and other configurations as needed.
- Ensure that required icons, images, and utility functions are available in your project or replace them with your preferred alternatives.

**Snapshot:**

![YoutubePlay](https://dev.azure.com/BrainvireInfo/9e43166a-9cd3-4232-8a59-017698f26e78/_apis/git/repositories/9b507252-6292-49a7-b0b5-3bc86fc9d32d/items?path=/Custom%20Reusable%20Components/Brainvire-POC-reactjs/Application%20Snapshot/youtube_video.png&versionDescriptor%5BversionOptions%5D=0&versionDescriptor%5BversionType%5D=0&versionDescriptor%5Bversion%5D=feature/folder-structure&resolveLfs=true&%24format=octetStream&api-version=5.0)
