### JSON Structure
```
const url_1 = https://www.brainvire.com/portfolio/
const url_2 = https://www.brainvire.com/portfolio/mean-mern/
const url_3 = https://www.brainvire.com/
```

### Functionality
```
/**
 * @name : determineUrlType
 * @param url
 * @description : validate if url is external,internal, single slug or multiple slug
 */
export const determineUrlType = (link: string) => {
  // const expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  const expression = /(https|http|www)?:\/\/((?:[\w\d-]+\.)+[\w\d]{2,})/i;
  const queryExpression = /(\?|\&)([^=]+)\=([^&]+)/;
  const regex = new RegExp(expression);
  const queryRegex = new RegExp(queryExpression);
  if (regex.test(link) && !link.includes("brainvire.com")) return 0;
  else if (queryRegex.test(link)) return 5;
  else {
    const parsedUrl = link.split("/");
    const passedSlugs = parsedUrl.filter((item) => item !== "");
    return passedSlugs.length;
  }
};

/**
  * Handle Function call
  */
  export const HandleURLType = (url: string) => {
    const slug = determineUrlType(url);
    
    switch (slug) {
      case 0:
        console.log("External URL");
      
      case 1:
        console.log("single slug")

      case 2:
        console.log("Multiple Slug");

      case 5:
        console.log("Single Slug)

      default:
        console.log("Default Link");
    }
  }
```


### Output Structure
```
=> handleURLType(url_1);
=> handleURLType(url_2);
=> handleURLType(url_3);

------------------------------
=> single slug
=> Multiple Slug
=> Default Link
```