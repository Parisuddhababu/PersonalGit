### JSON Structure
```
const firstName = 'First Name'
const lastName = 'Last Name'
```

### Functionality
```
export const ConstantMessages = (label = "", count = "") => {
  const Messages = {
    phoneNumber: `Enter a valid ${label}`,
    nameMaxCharater: `Max ${label} Characters are allowed`,
    nameMinCharacter: `Too short`,
    nameAlphabetCharacter: `${label} allow only alphabets and special character`,
    isRequired: `${label} is required`,
    maximumCharacter: `${label} must be less than ${count} characters`,
    mustBeValidCharacter: `Must be a valid ${label}`,
    minimumCharacter: `Minimum ${count} ${label}`,
    labelOnly: `${label} `,
    labelShouldBeNumber: `${label} should be number`,
    labelValid: `Please enter valid ${label}`,
    mustMatch: `${label} must match`
  };
  return Messages;
};
export default ConstantMessages;
```

### Function Calling
```
=> ConstantMessages(firstName).nameAlphabetCharacter
=> ConstantMessages(lastName).isRequired
=> ConstantMessages('30').nameMaxCharater
=> ConstantMessages(lastName, '20').maximumCharacter
```


### Output Structure
```
=> "First Name allow only alphabets and special character"
=> "Last Name is required"
=> "Max 30 Characters are allowed"
=> "Last Name must be less than 20 characters"
```
