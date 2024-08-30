### JSON Structure
```
const phoneNo = "+917941054646"

```

### Functionality
```
/**
* split country code and phone number
* @param phoneNo
* @param action "code" which type return phone number or code
*/

const splitCountryCodePhoneNo = (phoneNo, action = "") => {
  const countryCodes = CountryCodeList;
  let cCode = "+1";
  let pNo = phoneNo;
  if (phoneNo) {
    countryCodes.map((ele) => {
      const phone = ele + phoneNo;
      if (phone.includes(ele + phoneNo)) {
        const lengthCountryCode = ele.length;
        cCode = phoneNo.substring(0, lengthCountryCode);
        pNo = phoneNo.substring(lengthCountryCode);
      }
      return ele;
    });
  }
  if (action === "code") {
    return cCode;
  }
  return pNo;
};
```

### Function Calling

```
  => splitCountryCodePhoneNo(phoeNo, 'code')
  => splitCountryCodePhoneNo(phoeNo)
```

### Output Structure

```
 => +91
 => 7941054646
```


