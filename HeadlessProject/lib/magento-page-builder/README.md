#Rich content
Use this component to render contents which are built with Magento Page builder form admin.
This will render page builder contents like tabs, sliders, dynamic products etc

**Usage**

```jsx
import { RichContent } from '@lib/magento-page-builder/rich-content';
<RichContent html={data.cmsPage.content} />;
```

\***\*Page Builder Integration: Custom Content Types DOCS\*\***

```
https://magento.github.io/pwa-studio/pagebuilder/
```

**_PageBuilder Content Type_**

```
//example rich slider configurations + custom content type
export const contentType = {
    tabs: {
        type: 'rich-slider',
        classes: 'tab-slider',
        props: {
            sliderSettings: {
                slidesToShow: 1,
                dots: true,
                arrows: true,
                infinite: false,
                adaptiveHeight: false,
                prevArrow: <PrevIcon size="20" />,
                nextArrow: <NextIcon size="20" />
            }
        }
    },
    column: {
        type: 'hubspot-column',
        classes: 'hubspot-column'
    }
};

export const ComponentConfig = {
    'hubspot-column': {
        configAggregator: hubSpotColumnConfigAggregator,
        component: dynamic(() => import('./ContentTypes/HubSpotColumn'))
    }
}

<RichContent html={data.cmsPage.content} extend={true} config={contentType} extendedContentTypeConfig={ComponentConfig} />;
```

**Props**

```jsx
html : type string (Whole HTML content from CMS)
extend : type bool (has extended content type)
config: type object (extended content type and settings as props)
AddToWishlistLabel - label/icon for add to wishlist.
AddToWishlist - Wishlist Component
ProductTile - Custom product tile for displaying in Product Widget
productQuery - Custom Product query for displaying Products in the Widget
extendedContentTypeConfig - Extended content type config for adding new or overriding existing content type
```
