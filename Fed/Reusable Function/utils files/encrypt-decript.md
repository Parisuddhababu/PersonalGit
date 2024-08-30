### JSON Structure
```
const str = "Hello Brainers"
const obj = {
  name: 'Brainvire',
  website: 'www.brainvire.com'
}
```

### Functionality
```
/**
 * Encode an object or string into a base64-encoded JSON string.
 *
 * @param {Object} obj Object or string
 * @return {String}
 * @private
 */
export const encodeBase64 = (obj) => {
  const str = JSON.stringify(obj)
  return Buffer.from(str).toString('base64')
}

/**
 * Decode a base64 value.
 *
 * @param {String} string
 * @return {Object}
 */
export const decodeBase64 = (string) => {
  const body = Buffer.from(string, 'base64').toString('utf8')
  return JSON.parse(body)
}
```

### Output Structure
```
=> Encryption Uses

1) Encrypt String 
encodeBase64(str);

=> Output: adsadhallqeqwexcqpweuqpwaljsdalscnasdasldhasldgwydajsdacasdakdsjaskdahsjdkkuh

------------------------------

2) Encrypt Object 
encodeBase64(obj);

=> Output: ahsdlasdlieqqslannalcskdqkuwgdkabsxbxaadsajdakdhhkuashdalsda

------------------------------
=> Decryption Uses

1) Decrypt String 
decodeBase64(str);

=> Output: "Hello Brainers"

------------------------------

2) Decrypt Object 
decodeBase64(obj);

=> Output: {
  name: 'Brainvire',
  website: 'www.brainvire.com'
}

```

