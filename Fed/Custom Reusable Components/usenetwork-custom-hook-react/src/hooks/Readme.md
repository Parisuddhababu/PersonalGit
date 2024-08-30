# Custom useNetwork Hook

### How to Used

```
const useNetworkStatus=useNetwork();
const {online}=useNetworkStatus;
```

## Available Variables

| Property | Type                  | Required | Explanation                                      |
| -------- | --------------------- | -------- | ------------------------------------------------ |
| Since    | undefined `OR` string | Yes      | Time since network connected                     |
| online   | boolean               | Yes      | shows network connection status as true or false |

## Props Type With Defination

- useNetworkProps
  ```
  useNetworkProps {
      since:undefined | string;
      online:boolean;
  }
  ```

## Example

- Conditional network checking

  ```
   useEffect(()=>{
    if(online){
  //Some condition goes here
    }
    else{
      //Print else condition here 
    }
  })

  ```
