### JSON Structure
```
const arrayObjData = [
  { label: 'Brainvire', value: 1 },
  { label: 'Info', value: 2 },
  { label: 'Tech', value: 3 },
];

```

### Functionality
```
/**
   * find value from array and return it.
   * @param arrayObjData array
   * @param value string
   */
  const getValueFromArray = (arrayObjData, value) => {
    if (value) {
      const index = arrayObjData.findIndex((ele) => ele.value.toUpperCase() === value.toUpperCase());
      if (index !== -1) {
        return arrayObjData[index];
      }
      return {};
    }
    return {};
  };
```

### Function Calling

```
  getValueFromArray(arrayObjData, 'Brainvire');
```

### Output Structure

```
{ label: 'Brainvire', value: 1 }
```


