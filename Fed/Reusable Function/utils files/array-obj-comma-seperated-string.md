### JSON Structure
```
const arrayObjData = [
  { name: 'Brainvire', value: 1 },
  { name: 'Info', value: 2 },
  { name: 'Tech', value: 3 },
];

```

### Functionality
```
/**
   * Get comma seperated string
   * @param arrayObjData
   * @returns comma seperated string
   */
  const convertCommaSeperateString = (arrayObjData) => {
    const name = arrayObjData.map((obj) => {
      return obj.name;
    });
    return name.toString();
  };
```

### Function Calling

```
  convertCommaSeperateString(arrayObjData);
```

### Output Structure

```
Brainvire,Info,Tech
```


