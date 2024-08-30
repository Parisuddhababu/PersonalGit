> ## Append Time to current data 
### JSON Structure
```
const time = 14:22

```

### Functionality
```
/**
* Add time to current data
* @param Time
*/
const getCutOffTime = (cuttOffTime) => {
  const date = new Date();
  if (cuttOffTime) {
    const splitTime = cuttOffTime.split(":");
    if (splitTime.length >= 1) {
      date.setHours(splitTime[0], splitTime[1]);
      return date;
    }
  }
  return null;
};
```

### Function Calling

```
  getCutOffTime(time);
```

### Output Structure

```
Thu Mar 31 2022 14:22:00 GMT+0530 (India Standard Time)
```

---

> ## Convert Date string to time format hh:mm

### JSON Structure
```
const date = Thu Mar 31 2022 14:22:00 GMT+0530 (India Standard Time)

```

### Functionality
```
/**
* Convert Date string to time format hh:mm
* @param strDate
* @returns
*/
const toTimeStamp = (strDate) => {
  const userLocale = navigator.language;
  const dt = new Date(strDate).toLocaleTimeString(userLocale, {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  return dt;
};
```

### Function Calling

```
  toTimeStamp(date);
```

### Output Structure

```
14:22
```