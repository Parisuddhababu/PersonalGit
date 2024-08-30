# JEST (javascript testing tools)

[Jest](https://jestjs.io/) is a JavaScript testing framework developed by Facebook. In the context of React.js, Jest is often used as the primary testing tool for writing and running unit tests, integration tests, and other types of tests for React applications.

### Purpose

- Unit Testing
  - Test Components
- Snapshot Testing
  - Component Snapshots
- Test Suites and Cases
  - Organized Testing
- Asynchronous Testing
  - Async Testing Support
- Mocking and Spying
  - Mock Functions
- Code Coverage Reports
- Easy Setup and Configuration
  - Zero Configuration
- Snapshot Testing for UI Components
  - Visual Regression Testing
- Testing React Hooks
  - Hooks Testing Library
- Create React App Integration

### Usage & Installation command

#### Using NPM

```bash
$ npm install --save-dev jest
```

#### Using Yarn

```bash
$ yarn add --dev jest
```

#### Update package.json

- update package.json filr for running command

```bash
{
  "scripts": {
    "test": "jest"
  }
}
```

### Simple First Example

- If Javascript file having function like this

```bash
function sum(a, b) {
  return a + b;
}
module.exports = sum;
```

- Then for testing file create sum.test.js and put this code like this

```bash
const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

- now run command

```bash
$ yarn run test "OR"
$ Npm run test
```

### Using typescript via ts-jest

```bash
$ yarn add --dev @types/jest
```

### Using Matchers

- Jest uses a matchers to compare your values in different different way
- Here given below link is all matchers listed
- https://jestjs.io/docs/expect

### Truthiness

- `toBeNull` - matches only null
- `toBeUndefined` - matches only undefined
- `toBeTruthy` - matches anything that an if statement treat as true
- `toBeFalsy` - matches anything that an if statement treat as false

```bash
test('null', () => {
  const n = null;
  expect(n).toBeNull();
  expect(n).toBeDefined();
  expect(n).not.toBeUndefined();
  expect(n).not.toBeTruthy();
  expect(n).toBeFalsy();
});


test('zero', () => {
  const z = 0;
  expect(z).not.toBeNull();
  expect(z).toBeDefined();
  expect(z).not.toBeUndefined();
  expect(z).not.toBeTruthy();
  expect(z).toBeFalsy();
});
```

### Numbers

- Comparing number have matcher equivalent
- `toBeGreaterThan()`
- `toBeGreaterThanOrEqual()`
- `toBeLessThan()`
- `toBeLessThanOrEqual()`
- `toEqual()`
- `toBeCloseTo` => used for floating numbers

### Strings

- We can check string with regular expression
- `toMatch(“regular expression”)`

```bash
test('there is no I in team', () => {
  expect('team').not.toMatch(/I/);
});


test('but there is a "stop" in Christoph', () => {
  expect('Christoph').toMatch(/stop/);
});
```

### Array & Iterable

- We can check if array or iterable having particular item or not
- `toContain()`

```bash
const shoppingList = [
  'diapers',
  'kleenex',
  'trash bags',
  'paper towels',
  'milk',
];


test('the shopping list has milk on it', () => {
  expect(shoppingList).toContain('milk');
  expect(new Set(shoppingList)).toContain('milk');
});
```

### Exception

- If we want to check any function execution at that time it is giving error or not
- `toThrow()`

```bash
function compileAndroidCode() {
  throw new Error('you are using the wrong JDK');
}

test('compiling android goes as expected', () => {
  expect(() => compileAndroidCode()).toThrow();
  expect(() => compileAndroidCode()).toThrow(Error);


  // You can also use the exact error message or a regexp
  expect(() => compileAndroidCode()).toThrow('you are using the wrong JDK');
  expect(() => compileAndroidCode()).toThrow(/JDK/);
});
```

### Testing Asynchronous Code

- When we have code that run asynchronous jest need to know when the code it is testing completed

```bash
test('the data is peanut butter', done => {
  function callback(data) {
    try {
      expect(data).toBe('peanut butter');
      done();
    } catch (error) {
      done(error);
    }
  }


  fetchData(callback);
});
```

### Promises

```bash
test('the data is peanut butter', () => {
  return fetchData().then(data => {
    expect(data).toBe('peanut butter');
  });
});
```

### Resolver / Reject

- We can also used a .resolver matcher in our expected statement

```bash
test('the data is peanut butter', () => {
  return expect(fetchData()).resolves.toBe('peanut butter');
});
```

### Async / Await

```bash
test('the data is peanut butter', async () => {
  const data = await fetchData();
  expect(data).toBe('peanut butter');
});

test('the fetch fails with an error', async () => {
  expect.assertions(1);
  try {
    await fetchData();
  } catch (e) {
    expect(e).toMatch('error');
  }
});
```

### Setup & Teardown

- While writing testing we have some setup work that we need to happen before test run
  > Repeating Setup For may test cases
  - If we have some work like loop execution before, after repeatedly at that time we can used a beforeEach and afterEach

```bash
beforeEach(() => {
  initializeCityDatabase();
});

afterEach(() => {
  clearCityDatabase();
});

test('city database has Vienna', () => {
  expect(isCity('Vienna')).toBeTruthy();
});

test('city database has San Juan', () => {
  expect(isCity('San Juan')).toBeTruthy();
});
```

> One time Setup

- In some cases, you only need to do setup once, at the beginning of a file. This can be especially bothersome when the setup is asynchronous, so you can't do it inline. Jest provides beforeAll and afterAll to handle this situation.

```bash
beforeAll(() => {
  return initializeCityDatabase();
});

afterAll(() => {
  return clearCityDatabase();
});

test('city database has Vienna', () => {
  expect(isCity('Vienna')).toBeTruthy();
});

test('city database has San Juan', () => {
  expect(isCity('San Juan')).toBeTruthy();
});
```

> Scoping (describe)

```bash
// Applies to all tests in this file
beforeEach(() => {
  return initializeCityDatabase();
});


test('city database has Vienna', () => {
  expect(isCity('Vienna')).toBeTruthy();
});


test('city database has San Juan', () => {
  expect(isCity('San Juan')).toBeTruthy();
});


describe('matching cities to foods', () => {
  // Applies only to tests in this describe block
  beforeEach(() => {
    return initializeFoodDatabase();
  });

  test('Vienna <3 veal', () => {
    expect(isValidCityFoodPair('Vienna', 'Wiener Schnitzel')).toBe(true);
  });

  test('San Juan <3 plantains', () => {
    expect(isValidCityFoodPair('San Juan', 'Mofongo')).toBe(true);
  });
});
```

> Order of Execution of Describe and test block

```bash
 describe('outer', () => {
  console.log('describe outer-a');

  describe('describe inner 1', () => {
    console.log('describe inner 1');
    test('test 1', () => {
      console.log('test for describe inner 1');
      expect(true).toEqual(true);
    });
  });
  console.log('describe outer-b');

  test('test 1', () => {
    console.log('test for describe outer');
    expect(true).toEqual(true);
  });

  describe('describe inner 2', () => {
    console.log('describe inner 2');
    test('test for describe inner 2', () => {
      console.log('test for describe inner 2');
      expect(false).toEqual(false);
    });
  });
  console.log('describe outer-c');
});

// describe outer-a
// describe inner 1
// describe outer-b
// describe inner 2
// describe outer-c
// test for describe inner 1
// test for describe outer
// test for describe inner 2
```

### Mock Functions

- Mock functions allow you to test the links between code by erasing the actual implements of functions capturing the call of the functions
- Capturing the instance of the constructor function when initiated with new
  > Two way to implements Mock functions
- creating a mock function to use in test code
- Writing a mock manually to override a module

> Using Mock functions

- Let's imagine we're testing an implementation of a function forEach, which invokes a callback for each item in a supplied array.

```bash
function forEach(items, callback) {
  for (let index = 0; index < items.length; index++) {
    callback(items[index]);
  }
}
```

- To test this function, we can use a mock function, and inspect the mock's state to ensure the callback is invoked as expected.

```bash
const mockCallback = jest.fn(x => 42 + x);
forEach([0, 1], mockCallback);

// The mock function is called twice
expect(mockCallback.mock.calls.length).toBe(2);

// The first argument of the first call to the function was 0
expect(mockCallback.mock.calls[0][0]).toBe(0);

// The first argument of the second call to the function was 1
expect(mockCallback.mock.calls[1][0]).toBe(1);

// The return value of the first call to the function was 42
expect(mockCallback.mock.results[0].value).toBe(42);
```

> .mock Property

```bash
const myMock = jest.fn();


const a = new myMock();
const b = {};
const bound = myMock.bind(b);
bound();


console.log(myMock.mock.instances);
// > [ <a>, <b> ]
// The function was called exactly once
expect(someMockFunction.mock.calls.length).toBe(1);

// The first arg of the first call to the function was 'first arg'
expect(someMockFunction.mock.calls[0][0]).toBe('first arg');

// The second arg of the first call to the function was 'second arg'
expect(someMockFunction.mock.calls[0][1]).toBe('second arg');

// The return value of the first call to the function was 'return value'
expect(someMockFunction.mock.results[0].value).toBe('return value');

// This function was instantiated exactly twice
expect(someMockFunction.mock.instances.length).toBe(2);

// The object returned by the first instantiation of this function
// had a `name` property whose value was set to 'test'
expect(someMockFunction.mock.instances[0].name).toEqual('test');

// The first argument of the last call to the function was 'test'
expect(someMockFunction.mock.lastCall[0]).toBe('test');
```

> Mock Return Value

```bash
const myMock = jest.fn();
console.log(myMock());
// > undefined

myMock.mockReturnValueOnce(10).mockReturnValueOnce('x').mockReturnValue(true);

console.log(myMock(), myMock(), myMock(), myMock());
// > 10, 'x', true, true
```

> Mocking Module

```bash
import axios from 'axios';
import Users from './users';

jest.mock('axios');

test('should fetch users', () => {
  const users = [{name: 'Bob'}];
  const resp = {data: users};
  axios.get.mockResolvedValue(resp);

  // or you could use the following depending on your use case:
  // axios.get.mockImplementation(() => Promise.resolve(resp))

  return Users.all().then(data => expect(data).toEqual(users));
});
```

> Mocking Partial

- Subsets of a module can be mocked and the rest of the module can keep their actual implementation

```bash
//test.js
import defaultExport, {bar, foo} from '../foo-bar-baz';

jest.mock('../foo-bar-baz', () => {
  const originalModule = jest.requireActual('../foo-bar-baz');

  //Mock the default export and named export 'foo'
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(() => 'mocked baz'),
    foo: 'mocked foo',
  };
});

test('should do a partial mock', () => {
  const defaultExportResult = defaultExport();
  expect(defaultExportResult).toBe('mocked baz');
  expect(defaultExport).toHaveBeenCalled();

  expect(foo).toBe('mocked foo');
  expect(bar()).toBe('bar');
});
```

> Mock Implementation

- Please refer this link for better example: https://jestjs.io/docs/mock-functions

> Mock Name

- You can optionally provide a name for your mock functions, which will be displayed instead of "jest.fn()" in the test error output. Use this if you want to be able to quickly identify the mock function reporting an error in your test output.

```bash
const myMockFn = jest
  .fn()
  .mockReturnValue('default')
  .mockImplementation(scalar => 42 + scalar)
  .mockName('add42');
```

> Custom Matchers

- Finally, in order to make it less demanding to assert how mock functions have been called, we've added some custom matcher functions for you

```bash
// The mock function was called at least once
expect(mockFunc).toHaveBeenCalled();

// The mock function was called at least once with the specified args
expect(mockFunc).toHaveBeenCalledWith(arg1, arg2);

// The last call to the mock function was called with the specified args
expect(mockFunc).toHaveBeenLastCalledWith(arg1, arg2);

// All calls and the name of the mock is written as a snapshot
expect(mockFunc).toMatchSnapshot();
```

- These matchers are sugar for common forms of inspecting the .mock property. You can always do this manually yourself if that's more to your taste or if you need to do something more specific

```bash
// The mock function was called at least once
expect(mockFunc.mock.calls.length).toBeGreaterThan(0);

// The mock function was called at least once with the specified args
expect(mockFunc.mock.calls).toContainEqual([arg1, arg2]);

// The last call to the mock function was called with the specified args
expect(mockFunc.mock.calls[mockFunc.mock.calls.length - 1]).toEqual([
  arg1,
  arg2,
]);

// The first arg of the last call to the mock function was `42`
// (note that there is no sugar helper for this specific of an assertion)
expect(mockFunc.mock.calls[mockFunc.mock.calls.length - 1][0]).toBe(42);

// A snapshot will check that a mock was invoked the same number of times,
// in the same order, with the same arguments. It will also assert on the name.
expect(mockFunc.mock.calls).toEqual([[arg1, arg2]]);
expect(mockFunc.getMockName()).toBe('a mock name');
```

### Jest Platform

> Jest Changed files

- Tool for identifying modified files in a git/hg repository. Exports two functions:
- `getChangedFilesForRoots` returns a promise that resolves to an object with the changed files and repos.
- `findRepos` returns a promise that resolves to a set of repositories contained in the specified path.

```bash
const {getChangedFilesForRoots} = require('jest-changed-files');

// print the set of modified files since last commit in the current repo
getChangedFilesForRoots(['./'], {
  lastCommit: true,
}).then(result => console.log(result.changedFiles));
```

> Jest Diff

- Tool for identifying changes on data.

```bash
const {diff} = require('jest-diff');


const a = {a: {b: {c: 5}}};
const b = {a: {b: {c: 6}}};


const result = diff(a, b);


// print diff
console.log(result);
```

> Jest docblock

- Adding comments on jest file

```bash
const {parseWithComments} = require('jest-docblock');


const code = `
/**
 * This is a sample
 *
 * @flow
 */


 console.log('Hello World!');
`;


const parsed = parseWithComments(code);


// prints an object with two attributes: comments and pragmas.
console.log(parsed);
```

> Jest-get-type

- For identifying a primitive type of any javascript value.

```bash
const {getType} = require('jest-get-type');


const array = [1, 2, 3];
const nullValue = null;
const undefinedValue = undefined;


// prints 'array'
console.log(getType(array));
// prints 'null'
console.log(getType(nullValue));
// prints 'undefined'
console.log(getType(undefinedValue));
```

> Jest-validate

- Tool for configuration submitted by users.
- `hasDeprecationWarnings`, a boolean indicating whether the submitted configuration has deprecation warnings,
- `isValid`, a boolean indicating whether the configuration is correct or not.

```bash
const {validate} = require('jest-validate');


const configByUser = {
  transform: '<rootDir>/node_modules/my-custom-transform',
};


const result = validate(configByUser, {
  comment: '  Documentation: http://custom-docs.com',
  exampleConfig: {transform: '<rootDir>/node_modules/babel-jest'},
});


console.log(result);
```

> Jest-worker

- Module used for parallelization of tasks.

```bash
=> Heavy.task.js
module.exports = {
  myHeavyTask: args => {
    // long running CPU intensive task.
  },
};

=> Main.js
async function main() {
  const worker = new Worker(require.resolve('./heavy-task.js'));

  // run 2 tasks in parallel with different arguments
  const results = await Promise.all([
    worker.myHeavyTask({foo: 'bar'}),
    worker.myHeavyTask({bar: 'foo'}),
  ]);

  console.log(results);
}

main();
```

> Pretty-format

- Exports a function that converts any JavaScript value into a human-readable string.

```bash
const {format: prettyFormat} = require('pretty-format');


const val = {object: {}};
val.circularReference = val;
val[Symbol('foo')] = 'foo';
val.map = new Map([['prop', 'value']]);
val.array = [-0, Infinity, NaN];


console.log(prettyFormat(val));

```

---

# Project Setup from Scratch - Type Script

---

## Jest React Type script app setup Steps

> Step 1

```
npx-create-react-app jest-typescript --template typescript
```

> Step 2

```
npm i --save react react-dom @types/react @types/react-dom typescript @types/node  @types/jest jest ts-jest babel-jest
```

> Step 3

```
npm i --save-dev enzyme enzyme-adapter-react-16 jest react-test-renderer @types/enzyme
```

> Step 4

```
npm install @babel/core @babel/preset-env @babel/preset-react babel-loader
```

> Step 5: Create new file inside a src folder and give it's name like `webpack.config.js`

```
	const path = require('path');
	module.exports = {
	    entry: './src/app.js',
	    output: {
	        filename: 'bundle.js',
	        path: path.join(__dirname, 'public')
	    },
	    module: {
	        rules: [{
	            loader: 'babel-loader',
	            resolve: {
	                extensions: ['.js', '.jsx', '.ts', '.tsx']
	            },
	            exclude: /node_modules/
	        }]
	    }
	};
```

> Step 6: create new file inside a src folder and give it's name like `.babelrc`

```
	{
	  "presets": [
	      "@babel/preset-env",
	      "@babel/preset-react"
	  ]
	}
```

> Step 7: Create new file in root folder `jest-preprocessor.js`

```
	const tsc = require('typescript');
	const tsConfig = require('./tsconfig.json');

	module.exports = {
	    process(src, path) {
	        if (path.endsWith('.ts') || path.endsWith('.tsx') || path.endsWith('.js')) {
	            return tsc.transpile(src, tsConfig.compilerOptions, path, []);
	        }
	        return src;
	    },
	};
```

> Step 8: Create new file in root folder `jest-setup.js`

```
	const enzyme = require("enzyme");
	const Adapter = require("enzyme-adapter-react-16");

	enzyme.configure({ adapter: new Adapter() });
```

> Step 9: Create new file in root folder `jest-shim.js`

```
	global.requestAnimationFrame = function(callback) {
	  setTimeout(callback, 0);
	};
```

> Step 10: Create new file in root folder `jest.config.js`

```
	module.exports = {
	  verbose: true,
	  roots: ["<rootDir>/src"],
	  transform: {
	    "^.+\\.tsx?$": "ts-jest"
	  },
	  // Test spec file resolution pattern
	  // Matches parent folder `__tests__` and filename
	  // should contain `test` or `spec`.
	  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",

	  // Module file extensions for importing
	  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	  moduleNameMapper: {
	    "\\.(css|less)$": "<rootDir>/src/globals.d.ts"
	  },
	  testEnvironment: 'jsdom',
	  preset: 'ts-jest',
	  transform: {
	    '^.+\\.(ts|tsx)?$': 'ts-jest',
	    "^.+\\.(js|jsx)$": "babel-jest",
	  },
	  setupFiles: [
	    "<rootDir>/jest-shim.js",
	    "<rootDir>/jest-setup.js"
	  ]
	};
```

> Step 11: Create new folder inside src `__tests__`

> Step 12: inside `tsconfig.json` file need to add line

```
	"types": ["react/next", "react-dom/next"]
```
