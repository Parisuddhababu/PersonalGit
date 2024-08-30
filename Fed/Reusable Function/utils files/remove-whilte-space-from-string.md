### JSON Structure
```
const str = "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
```

### Functionality
```
/**
 * @name : stringOnly
 * @param str
 * @description : remove space from string
 *
 */
export const stringOnly = (str: string): string => {
  return str.replace(/\s/g, "");
};
```

### Output Structure
```
1) 
stringOnly(str)

=> "LoremIpsumissimplydummytextoftheprintingandtypesettingindustry."

```

