## Sonarqube Documentation

SonarQube is an open-source platform designed for continuous inspection of code quality to perform automatic reviews with static analysis of code to detect bugs, code smells, and security vulnerabilities on over 20 programming languages.

### Purpose:

1. Code Quality Analysis

   - Static Code Analysis

2. Maintainability and Readability

   - Code Complexity
   - Code Duplication

3. Security Vulnerability Detection

   - Security Rules

4. Integration with CI/CD Pipelines

   - Automated Code Reviews

5. Custom Quality Profiles
   - Configurable Rules

## Sonarqube Errors With it's Solution

### Sonarqube Install & Setup in VS Code

- Go to VS Code Sidebar › Extensions or Press Ctrl + Shift + X in Windows
- Search SonarLint Extensions in Marketplace
- Click on the extension SonarLint
- Click on Install
- After installing, You can see sonarLint Rules tab in the VS Code Sidebar.
- Click on TypeScript -> You can see all the rules.
- You can activate or deactivate any below mentioned rules.

### Sonarqube Error Resolving

### 1. "===" and "!==" should be used instead of "==" and "!="

- ##### Solution:
  - For this Whenever you used condition we need to add with it's type comparison for example below
    - Ex:
      ```
        <!-- Error code -->
        if (code.length == 0 && error.length != 0) {
          // your other codes here...
        }
      ```
      ```
        <!-- Solution code -->
        if (code.length === 0 && error.length !== 0) {
          // your other codes here...
        }
      ```

### 2. Optional chaining should be preferred

- ##### Solution:
  - `?.` optional chain expressions provide undefined if an object is null or undefined. Because the optional chain operator only chains when the property value is null or undefined, it is much safer than relying upon logical AND operator chaining &&; which chains on any truthy value
    - Ex:
      ```
        <!-- Error code -->
        if (foo && foo.a && foo.a.b && foo.a.b.c) {
          const data = foo.a.b.c;
        }
      ```
      ```
        <!-- Solution code -->
        if (foo?.a?.b?.c) {
          const data = foo?.a?.b?.c
        }
      ```

### 3. React's useState hook should not be used directly in the render function or body of a component

- ##### Solution

  - React’s useState hook setter function should not be called directly in the body of a component, otherwise it would produce an infinite render loop. This can happen by mistake. Most commonly, the setter function is called from an event handler.

    - Ex:

      ```
        <!-- Error code -->
        const ShowLanguage = () => {
            const [language, setLanguage] = useState("en-US");
            // Makes an issue below line
            setLanguage(navigator.language);

            return (
              <section>
                <button onClick={() => setLanguage("en-US")}>English</button>
              </section>
            );
        }
      ```

      ```
        <!-- Solution code -->
        const ShowLanguage = () => {
            const [language, setLanguage] = useState(navigator.language);

            return (
              <section>
                <button onClick={() => setLanguage("en-US")}>English</button>
              </section>
            );
        }
      ```

### 4. "await" should only be used with promises

- ##### Solution
  - The await operator is used to wait for a Promise and get its fulfillment value. It can only be used inside an async function or at the top level of a module
    - Ex:
      ```
        <!-- Error Code -->
          let x = 42;
          await x; // this line having error
      ```
      ```
        <!-- Solution Code -->
        let x = new Promise(resolve => resolve(42));
        await x;
      ```

### 5. No array index for keys in JSX list components

- ##### Solution
  - React expects a unique identifier for performance optimizations. An array index is not a stable identifier most of the time. This results in unnecessary renders when the array items change index following some mutation. When components have state, this might also provoke bugs that are hard to diagnose.
    - Ex:
      ```
        <!-- Error Code -->
          const generateButtons = (props) => {
            return props.buttons.map((button, index) => {
              <Button key={index}>{button.number}</Button>
            });
          }
      ```
      ```
        <!-- Solution Code -->
          function generateButtons(props) {
            return props.buttons.map((button, index) => {
              // Here you need to add unique key in button attributes
              <Button key={button.number}>{button.number}</Button>
            });
          }
      ```

### 6. Imports from the same modules should be merged

- ##### Solution
  - Multiple imports from the same module should be merged together to improve readability.
    - Ex:
      ```
        <!-- Error Code -->
          import { B1 } from 'b';
          import { B2 } from 'b';
      ```
      ```
        <!-- Solution Code -->
          import { B1, B2 } from 'b';
      ```

### 7. Ternary operators should not be nested

- ##### Solution
  - you should discourage the use of nested ternary operators. It makes the code harder to read because, indirectly, your eyes scan the code vertically
    - Ex:
      ```
        <!-- Error Code -->
          const getReadableStatus = (job) => {
            return job.isRunning() ? "Running" : job.hasErrors() ? "Failed" : "Succeeded ";
          }
      ```
      ```
        <!-- Solution Code -->
        const getReadableStatus = (job) => {
          if (job.isRunning()) {
            return "Running";
          }
          return job.hasErrors() ? "Failed" : "Succeeded";
        }
      ```

### 8. Related "if/else if" statements should not have the same condition

- ##### Solution
  - A chain of if/else if statements is evaluated from top to bottom. At most, only one branch will be executed: the first one with a condition that evaluates to true.
  * Ex:
    ```
      <!-- Error Code -->
      const example = (condition1, condition2 bool) => {
        if (condition1) {
        } else if (condition1) { // Error here in this line
        }
      }
    ```
    ```
      <!-- Solution Code -->
      const example = (condition1, condition2 bool) => {
        if (condition1) {
        } else if (condition2) {
        }
      }
    ```

### 9. Jump statements should not be redundant

- ##### Solution
  - Jump statements such as return and continue let you change the default flow of program execution, but jump statements that direct the control flow to the original direction are just a waste of keystrokes.
  * Ex:
    ```
    <!-- Error Code -->
    const foo = () => {
      while (condition1) {
        if (condition2) {
          continue; // Error Code
        } else {
          doTheThing();
        }
      }
      return; // this is a void (non return) method
    }
    ```
    ```
    <!-- Solution Code -->
    const foo = () => {
      while (condition1) {
        if (!condition2) {
          doTheThing();
        }
      }
    }
    ```

### 10. Function returns should not be invariant

- ##### Solution
  - When a function is designed to return an invariant value, it may be poor design, but it shouldn’t adversely affect the outcome of your program
  * Ex:
    ```
    <!-- Error Code -->
    const foo = () => {
      if (a === b) {
        return b;
      }
      return b;
    }
    ```
    ```
    <!-- Solution Code -->
    const foo = () => {
      return b;
    }
    ```

### 11. React Hooks should be properly called

- ##### Solution

  - Always use Hooks at the top level of your React function, before any early returns.

  * Ex:

    ```
    <!-- Error Code -->
    const Profile = () => {
      const [ordersCount, setOrdersCount] = useState(0);
      if (ordersCount !== 0) {
        useEffect(function() { // Noncompliant, this Hook is called conditionally
          localStorage.setItem('ordersData', ordersCount);
        });
      }

      return <div>{ getName() }</div>
    }

    const getName = () => {
      const [name] = useState('John'); // Noncompliant, this Hook is called from simple JavaScript function
      return name;
    }
    ```

    ```
    <!-- Solution Code -->
    const Profile = () => {
      const [ordersCount, setOrdersCount] = useState(0);
      useEffect(function() {
        if (ordersCount !== 0) {
          localStorage.setItem('ordersData', ordersCount);
        }
      });

      const [name] = useState('John');
      return <div>{ name }</div>
    }
    ```

### 12. Unnecessary imports should be removed

- ##### Solution

  - Unused and useless imports should not occur if that is the case. Leaving them in reduces the code’s readability, since their presence can be confusing

    - Ex:

      ```
      <!-- Error Code -->
      import { useState } from 'react';

      return (
        <div>Hello Brainers</div>
      )
      ```

      ```
      return (
        <div>Hello Brainers</div>
      )
      ```

### 13. Cognitive Complexity of functions should not be too high

- #### Solution
  - Cognitive Complexity is a measure of how hard the control flow of a function is to understand. Functions with high Cognitive Complexity will be difficult to maintain.
    - Ex:
      ```
       <!--Error Code  -->
       const dataGetInParticularFormat = () => {
        // this function having 140 lines of code then need to reduce it
       }
      ```
      ```
        <!-- Solution Code -->
        const dataGetINParticularFormat = () => {
          // add some logic inside this function
          // create a new function and call that function from here and add remaining logic inside that function
        }
      ```

### 14. Alternatives in regular expressions should be grouped when used with anchors

- ### Solution

  - In regular expressions, anchors (^, $, \A, \Z and \z) have higher precedence than the | operator. So in a regular expression like ^alt1|alt2|alt3$, alt1 would be anchored to the beginning, alt3 to the end and alt2 wouldn’t be anchored at all.

    - Ex:

      ```
        <!-- Error Code -->
        => ^a|b|c$
      ```

      ```
        <!-- Solution Code -->
        => ^(?:a|b|c)$
      ```

### 15. Template literals should not be nested

- ### Solution

      * Template literals are an elegant way to build a string without using the + operator to make strings concatenation more readable.However, it’s possible to build complex string literals by nesting together multiple template literals, and therefore lose readability and maintainability.
        - Ex:
          ```
            <!-- Error Code  -->
            let color = "red";
            let count = 3;
            let message = `I have ${color ? `${count} ${color}` : count} apples`;

          ------------------------------------------

            <!-- Solution Code -->
            let color = "red";
            let count = 3;
            let apples = color ? `${count} ${color}` : count;
            let message = `I have ${apples} apples`
          ```

### 16. Sections of code should not be commented out

- ### Solution
  - Programmers should not comment out code as it bloats programs and reduces readability.Unused code should be deleted and can be retrieved from source control history if required.

### 17. Two branches in a conditional structure should not have exactly the same implementation

- ### Solution

  - Having two cases in a switch statement or two branches in an if chain with the same implementation is at best duplicate code, and at worst a coding error. If the same logic is truly needed for both instances, then in an if chain they should be combined, or for a switch, one should fall through to the other.

    - Ex:

      ```
        <!-- Error Code -->
        switch (i) {
          case 1:
            doFirstThing();
            doSomething();
            break;
          case 2:
            doSomethingDifferent();
            break;
          case 3:  // Noncompliant; duplicates case 1's implementation
            doFirstThing();
            doSomething();
            break;
          default:
            doTheRest();
        }

        if (a >= 0 && a < 10) {
          doFirstThing();
          doTheThing();
        }
        else if (a >= 10 && a < 20) {
          doTheOtherThing();
        }
        else if (a >= 20 && a < 50) {
          doFirstThing();
          doTheThing();  // Noncompliant; duplicates first condition
        }
        else {
          doTheRest();
        }
      ```

      ```
        <!-- Solution Code -->
        if (a == 1) {
          doSomething();  //no issue, usually this is done on purpose to increase the readability
        } else if (a == 2) {
          doSomethingElse();
        } else {
          doSomething();
        }
      ```

### 18. Disallow `.bind()` and arrow functions in JSX props

- ### Solution

  - Using Function.prototype.bind and arrows functions as attributes will negatively impact performance in React. Each time the parent is rendered, the function will be re-created and trigger a render of the component causing excessive renders and more memory use. Wrapping the function in a useCallback hook will avoid additional renders. This rule ignores Refs. This rule does not raise findings on DOM nodes since that may require wrapping the DOM in a component. Still, better performance can be achieved if this rule is respected in DOM nodes too.

    - Ex:

      ```
        <!-- Error Code -->
          <Component onClick={this._handleClick.bind(this)}></Component>
          <Component onClick={() => handleClick()}></Component>
      ```

      ```
        <!-- Solution Code -->
        function handleClick() {
            //...
        }

        <Component onClick={handleClick}></Component>
      ```

### 19. "as const" assertions should be preferred

- ### Solution
  - use let if the variable's value will change during the code
  - use const if it won't and you / your team want to use const in those situations in the project you're working on; it's a matter of style

### 20. React components should not be nested

- ### Solution

  - Nested components are defined in an enclosing one and can be simple functions or arrow expressions. React recreates them systematically during the render pass because it doesn’t know they haven’t changed. This hurts performance as the components are recreated too many times. However, this can also hide surprising bugs where the state of the nested components is lost between renders. Trying to use useCallback hooks for child components is also discouraged. You should actually refactor this code to define a component on its own, passing props if needed.

    - Ex:

      ```
        <!-- Error Code -->
        function Component() {
          function UnstableNestedComponent() {
            return <div />;
          }

          return (
            <div>
              <UnstableNestedComponent />
            </div>
          );
        }
        function SomeComponent({ footer: Footer }) {
          return (
            <div>
              <Footer />
            </div>
          );
        }

        function Component() {
          return (
            <div>
              <SomeComponent footer={ () => <div /> } /> { /* footer is a component nested inside 'Component' */ }
            </div>
          );
        }
        class Component extends React.Component {
          render() {
            function UnstableNestedComponent() {
              return <div />;
            }

            return (
              <div>
                <UnstableNestedComponent />
              </div>
            );
          }
        }
      ```

      ```
      <!-- Solution Code -->
      function OutsideDefinedComponent(props) {
        return <div />;
      }

      function Component() {
        return (
          <div>
            <OutsideDefinedComponent />
          </div>
        );
      }
      function Component() {
        return <SomeComponent footer={ <div /> } />;
      }
      class Component extends React.Component {
        render() {
          return (
            <div>
              <SomeComponent />
            </div>
          );
        }
      }
      ```

### 21. Make sure that using this pseudorandom number generator is safe here.

- ### Solution

  - They want to alert you to the fact that Math.random is not a true random generator but a PRNG. If you need this to be safe you need a CSPRNG.
    When software generates predictable values in a context requiring unpredictability, it may be possible for an attacker to guess the next value that will be generated, and use this guess to impersonate another user or access sensitive information.

    - Ex:

      ```
        <!-- Error Code -->
        <List key={`${group}-${Math.random()}`}>
        </List>
      ```

      ```
      <!-- Solution Code -->
      export const generateSecureRandomNumber = () => {
        const array = new Uint32Array(1);
        if (window?.crypto) {
          window.crypto.getRandomValues(array);
        }
        const randomNumber = array[0];
        return randomNumber;
      }

      <List key={generateSecureRandomNumber()}></List>
      ```

### 22. Make Sure not using resource integrity feature is safe here.

- ### Solution

  - The integrity attribute allows a browser to check the fetched script to ensure that the code is never loaded if the source has been manipulated. Subresource Integrity (SRI) is a W3C specification that allows web developers to ensure that resources hosted on third-party servers have not been altered. Use of SRI is recommended!. When using SRI, the webpage holds the hash and the server holds the file (the .js file in this case). The browser downloads the file, then checks it, to make sure that it is a match with the hash in the integrity attribute. If it matches, the file is used, and if not, the file is blocked.

    - Ex:

      ```
      <!-- Error Code -->
        <script src="YOUR_JS_LINK"> </script>
      ```

      ```
        <!-- Solution Code -->
        <script src="YOUR_JS_LINK" integrity="Your Integrity Key" crossorigin="anonymous"></script>

        <!-- Notes -->
        If Your code is doesn't have integrity code then you can generate your integrity code from below link and add in your script tag

        Link: https://www.srihash.org/
      ```

### 23. The object passed as the value prop to the Context provider changes every render.

 - ### Solution
 - The object passed as the value prop to the ConfiguratorContext.Provider changes on every render.To resolve this, we can make use of the useMemo hook to memoize the context value. Using of useMemo, ensures that it is only recalculated when the state variable changes. This improves the performance of your context provider by preventing unnecessary renders when the context value remains the same.
    
    - Ex:
     
       ```
       <!-- Error Code -->
        
        export const ConfiguratorContext = createContext({});
        
        const ConfiguratorProvider = ({ children }) => {
          const [state, setState] = useState(null);
        
          return (
            <ConfiguratorContext.Provider value={{ state, setState }}>
              {children}
            </ConfiguratorContext.Provider>
          );
        };
        
        <!-- Solution Code -->
        
        export const ConfiguratorContext = createContext({});

        const ConfiguratorProvider = ({ children }) => {
          const [state, setState] = useState(null);
          const contextValue = useMemo(() => {
            return { state, setState };
          }, [state]);
          return (
            <ConfiguratorContext.Provider value={contextValue}>
              {children}
            </ConfiguratorContext.Provider>
          );
        };
       ```
        
        
        
### 24. Extract the assignment of "obj[is[0]]" from this expression.     

 - ### Solution
 - To resolve this, you can split the assignment into a separate line to make the code clearer and potentially avoid any unintended side effects. 
 
    - Ex:
     
       ```
        <!-- Error Code -->

        else if (is.length === 1 && value !== undefined) return (obj[is[0]] = value);
        
        <!-- Solution Code -->
        
        else if (is.length === 1 && value !== undefined) {
         
            const propertyName = is[0];
            obj[propertyName] = value;
            return obj[propertyName];
            
          }
   
       ```
         
