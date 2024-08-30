# React Admin Firebase

## Installation
> Using NPM
```
$ npm install --save react-admin-firebase firebase
```

> Using YARN
```
$ yarn add react-admin-firebase firebase
```

### Functionality Provided
- Firestore Dataprovider
- Firebase AuthProvider
- Login with: Google, Facebook, Github etc...
- Forgot password button...
- Firebase storage upload functionality, with upload monitoring...

### firestore Dataprovider

-  Dynamic caching of resources
- All methods implemented; (GET, POST, GET_LIST etc...)
- Filtering, sorting
- Ability to manage sub collections through app configuration
- Ability to use externally initialized firebaseApp instance
- Override firestore random id by using "id" as a field in the Create part of the resource
- Upload to the firebase storage bucket using the standard `<FileInput />` field
- Realtime updates, using ra-realtime


### Options Available (Config Options)

> Config
```
const config = {
  apiKey: "adahdlasdhaldhsls",
  authDomain: "dlahdladla",
  databaseURL: "adhalkdhaldkad",
  projectId: "akdslhaldiedasdnsa",
  storageBucket: "adlhakldshldalsnd",
  messagingSenderId: "adshlakhdlwas",
};
```
---
> Options

- rootRef
  - Use a different root document to set your resource collections, by default it uses the root collections of firestore
  - Example:
    - rootRef: 'root-collection/some-doc' | () => 'root-collection/some-doc',

- app
  - Your own, previously initialized firebase app instance
    - Example
      - app: firebaseAppInstance

- logging
  - Enable logging of react-admin-firebase
    - Example
      - logging: true

- watch
  - Resources to watch for realtime updates, will implicitly watch all resources by default, if not set.
    - Example
      - watch: ['posts']

- dontwatch
  - Resources you explicitly dont want realtime updates for
    - Example
      - dontwatch: ['comments']

- persistence
  - Authentication persistence, defaults to 'session', options are `'session'` | `'local'` | `'none'`
    - Example
      - persistence: 'session'

- disableMeta
  - Disable the metadata; `'createdate'`, `'lastupdate'`, `'createdby'`, `'updatedby'`
    - Example
      - disableMeta: false

- renameMetaFields
  - Have custom metadata field names instead of: `'createdate'`, `'lastupdate'`, `'createdby'`, `'updatedby'`
    - Example
      - 
        ```
          renameMetaFields: {
            created_at: 'my_created_at', // default: 'createdate'
            created_by: 'my_created_by', // default: 'createdby'
            updated_at: 'my_updated_at', // default: 'lastupdate'
            updated_by: 'my_updated_by', // default: 'updatedby'
          }
        ```

- dontAddIdFieldToDoc
  - Prevents document from getting the ID field added as a property
    - Example
      - dontAddIdFieldToDoc: false

- softDelete
  - Adds `'deleted'` meta field for non-destructive deleting functionality 
  - `NOTE`: Hides `'deleted'` records from list views unless overridden by filtering for {deleted: true} 
    - Example
      - softDelete: false

- associateUsersById
  - Changes meta fields like 'createdby' and 'updatedby' to store user IDs instead of email addresses
    - Example
      - associateUsersById: false

- metaFieldCasing
  - Casing for meta fields like 'createdby' and 'updatedby', defaults to `'lower'`, options are `'lower'` | `'camel'` | `'snake'` | `'pascal'` | `'kebab'`
    - Example
      - metaFieldCasing: 'lower'

- relativeFilePaths
  - Instead of saving full download url for file, save just relative path and then get download url
    - Example
      - relativeFilePaths: false

- useFileNamesInStorage
  - Add file name to storage path, when set to true the file name is included in the path
    - Example
      - useFileNamesInStorage: false

- lazyLoading
  - Use firebase sdk queries for pagination, filtering and sorting
    - Example
      - 
        ```
        lazyLoading: {
          enabled: false
        },
        ```

- firestoreCostsLogger
  - Logging of all reads performed by app (additional feature, for lazy-loading testing)
    - Example
      - 
        ```
          firestoreCostsLogger: {
            enabled: false,
            localStoragePrefix // optional
          },
        ```

- transformToDb
  - Function to transform documentData before they are written to Firestore
    - Example
      - transformToDb: (resourceName, documentData, documentId) => documentDataTransformed

---

> How to get data provider, auth provider, realtime sega
```
const dataProvider = FirebaseDataProvider(config, options);
const authProvider = FirebaseAuthProvider(config, options);
const firebaseRealtime = FirebaseRealTimeSaga(dataProvider, options);
```

---

### dataProvider Example
```
import * as React from 'react';
import { Admin, Resource } from 'react-admin';

import { PostList, PostShow, PostCreate, PostEdit } from "./posts";
import {
  FirebaseAuthProvider,
  FirebaseDataProvider,
  FirebaseRealTimeSaga
} from 'react-admin-firebase';

const config = {
  apiKey: "aaaaaaaaaaaaaaaaaaaaaaaaaaa",
  authDomain: "aaaaaaaaaaaaaaaaaaaaaaaaaaa",
  databaseURL: "aaaaaaaaaaaaaaaaaaaaaaaaaaa",
  projectId: "aaaaaaaaaaaaaaaaaaaaaaaaaaa",
  storageBucket: "aaaaaaaaaaaaaaaaaaaaaaaaaaa",
  messagingSenderId: "aaaaaaaaaaaaaaaaaaaaaaaaaaa",
};

const options = {};

const dataProvider = FirebaseDataProvider(config, options);
...
      <Admin 
        dataProvider={dataProvider} 
      >
        <Resource name="posts" list={PostList} show={PostShow} create={PostCreate} edit={PostEdit}/>
      </Admin>
...
```
---
### authProvider Example
```
const dataProvider = FirebaseDataProvider(config);
const authProvider = FirebaseAuthProvider(config);
...
      <Admin 
        dataProvider={dataProvider}
        authProvider={authProvider}
      >
...
```
---
### Realtime Updates!
- `NOTE`: Realtime updates were removed in react-admin v3.x (see `marmelab/react-admin#3908`). As such, react-admin-firebase v3.x also does not support Realtime Updates. However, much of the original code used for this functionalaity in react-admin v2.x remains - including the documentation below. For updates on the implementation of realtime please follow these issues:

  - https://github.com/benwinding/react-admin-firebase/issues/49
  - https://github.com/benwinding/react-admin-firebase/issues/57

- Get realtime updates from the firebase server instantly on your tables, with minimal overheads, using rxjs observables!

```
import {
  FirebaseRealTimeSaga,
  FirebaseDataProvider
} from 'react-admin-firebase';
...
const dataProvider = FirebaseDataProvider(config);
const firebaseRealtime = FirebaseRealTimeSaga(dataProvider);
...
      <Admin 
        dataProvider={dataProvider} 
        customSagas={[firebaseRealtime]}
      >
...
```

### Realtime Options
- Trigger realtime on only some routes using the options object

```
...
const dataProvider = FirebaseDataProvider(config);
const options = {
  watch: ['posts', 'comments'],
  dontwatch: ['users']
}
const firebaseRealtime = FirebaseRealTimeSaga(dataProvider, options);
...
```

### Upload Progress
- Monitor file upload data using custom React component which listen for following events (CustomEvent):

1) FILE_UPLOAD_WILL_START
2) FILE_UPLOAD_START
3) FILE_UPLOAD_PROGRESS
4) FILE_UPLOAD_PAUSED
5) FILE_UPLOAD_CANCELD
6) FILE_UPLOAD_COMPLETE
7) FILE_SAVED
8) All events have data passed in details key:

- fileName: the file anme
- data: percentage for FILE_UPLOAD_PROGRESS

> Official Doc: https://github.com/benwinding/react-admin-firebase

> Official example: https://github.com/benwinding/react-admin-firebase-demo-typescript