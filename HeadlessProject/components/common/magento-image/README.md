# Image

A hook and a utility to easily display images

##Usage

```js
import Image from '@corratech/pylot-image'

<Image
    src={image}
    alt={product.name}
    width={320}
    height={320}
/>

```

**Props**

| props          | type           | required/default                          | info                                                       |
| -------------- | -------------- | ----------------------------------------- | ---------------------------------------------------------- |
| src            | string         | required:yes                              | image url                                                  |
| alt            | string         | required:no                               | image alt                                                  |
| width          | number         | required:yes                              | image width                                                |
| height         | number         | required:yes                              | image height                                               |

