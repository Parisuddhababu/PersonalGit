### JSON Structure
```
const src = https://www.brainvire.com/wp/wp-content/uploads/2021/08/1-award-badge-inc-magazine.png
```

### Functionality
```
/**
 * @name : path has a image extension
 * @description : return boolean value
 * @param src : string
 * @returns : boolean
 */
export const IsImage = (src: string) => {
  const ImageRegx: RegExp = new RegExp(/\.(jpe?g|png|gif|svg)$/gi);
  return ImageRegx.test(src);
};
```

### Output Structure
```
1) 
IsImage(https://www.brainvire.com/brainvire.png);

=> true

----------------------------------------
2) 
IsImage(https://www.braivire.com/brainvire.txt)

=> false
```

