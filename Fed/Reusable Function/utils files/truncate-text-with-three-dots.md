### JSON Structure
```
const str = Lorem Ipsum is simply dummy text of the printing and typesetting industry.
```

### Functionality
```
/**
 * @name : text ellipsis
 * @param str
 * @param limit
 * @description :  truncate a text or line with ellipsis
 */
export const TextTruncate = (str: string, limit: number) => {
  return str.length > limit ? `${str.substr(0, limit)}...` : str;
};
```

### Output Structure
```
1) 
TextTruncate(str, 15)

=> Lorem Ipsum is s...

```

