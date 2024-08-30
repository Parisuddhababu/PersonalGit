# Angular v12 Base Admin Panel - Brainvire

## Prerequisites

> Before you begin, make sure your development environment includes Node.js and an npm package manager.

#### Node JS - version > 12.14.1

- Download Node JS from [nodejs.org](https://www.nodejs.org) - HTML to Markdown converter
- Run below command for verify version of Node JS.

```
$ node -v
```

#### NPM Package Manager

- Run below command for Installing latest NPM

```bash
$ npm install npm@latest -g
```

- Run below command for verify version of NPM.

```bash
$ npm -v
```

#### Angular CLI

- Run below command for Installing latest Angular

```bash
$ npm install -g @angular/cli
```

- Run below command for verify version of NPM.

```bash
$ ng --version
```

#### Base Admin Panel Setup

- Get the clone and Install all Dependencies by using below command.

```bash
$ git clone https://git.brainvire.com/angular/baseng12.git
$ cd baseng12
$ npm install
$ ng serve --open
```

#### Below is an structure of files.

```
baseng12/
├── e2e/
├── src/
│   ├── app/
│   ├── assets/
│   ├── environments/
│   ├── scss/
│   ├── index.html
│   └── ...
├── .angular-cli.json
├── ...
├── package.json
└── ...
```

## Admin Folder Structure

| Predefined Files  | Purpose                                                                                                       |
|-------------------|---------------------------------------------------------------------------------------------------------------|
| .editorconfig     | Configuration for code editors                                                                                |
| .gitignore        | Config for Untracking Files                                                                                   |
| README .md        | Documentation of APP                                                                                          |
| angular.json      | Configuration file for Angular APP for Serving, Build, etc                                                    |
| package.json      | Contain the name of all third parties packages                                                                |
| package-lock.json | Provides version information for all packages installed into node_modules by the npm client                   |
| src/              | Source files for Modification the Application.                                                                |
| node_modules/     | Install the dependencies on the based of Package.JSON File                                                    |
| tsconfig.json     | Default TypeScript configuration                                                                              |
| tslint.json       | Default TSLint configuration. Use ng lint command to resolve programmatic and stylistic errors in application |

## SRC Supported Files - Source Files

| Predefined Files | Purpose                                                                                                                                                                |
|------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| app              | Contains the component files in which your application logic and data are defined.                                                                                     |
| assets/          | Contains image and other asset files                                                                                                                                   |
| environments/    | Contains build configuration options. They contains two file development environment and production environment                                                        |
| favicon.ico      | An icon to use for this application in the bookmark bar.                                                                                                               |
| index.html       | The main HTML page. The CLI automatically adds all JavaScript and CSS files when building your app, so you don't need to add any `<script>` or `<link>` tags manually. |
| main.ts          | The main entry point for your application. Bootstraps the application's root module (AppModule) to run in the browser.                                                 |
| polyfills.ts     | Cross & Old Browsing Support.                                                                                                                                          |
| styles.sass      | Main Sass file which imports other sass file for application purpose.                                                                                                  |
| test.ts          | Use for unit testing                                                                                                                                                   |

## APP Supported Files - Working Directory

| Working Files         | Purpose                                                                                                                         |
|-----------------------|---------------------------------------------------------------------------------------------------------------------------------|
| app.component.ts      | Defines the logic for the app's root component, named AppComponent.                                                             |
| app.component.html    | Defines the HTML template associated with the root AppComponent.                                                                |
| app.component.css     | Defines the base CSS stylesheet for the root AppComponent                                                                       |
| app.component.spec.ts | Defines a unit test for the root AppComponent                                                                                   |
| app.module.ts         | Defines the root module, named AppModule, assemble the application. Initially declares only the AppComponent.                   |
| app.routing.ts        | This is a Main Routing File which combines all the modules to Lazy Load the Data.                                               |
| \_guards/             | CanActivate is an Angular interface. It is used to force user to login into application before navigating to the route.         |
| \_helpers/            | Add Authorization in all API’s request header for security purpose.                                                             |
| \_module/             | Used directives, pipes, and components into one module and then import in other modules.                                        |
| \_pipe/               | A pipe takes in data as input and transforms it to a desired output.                                                            |
| \_services/           | They contain methods that maintain data throughout application, i.e. data does not get refreshed and is available all the time. |
| \_validators/         | Create custom validation functions.                                                                                             |
| config/               | `app.config.ts` - Consists of API Endpoint in form of URL. `app.constant.ts` - Application constant data or configuration.      |
| model/                | Declare data and type of Array.                                                                                                 |
| views/                | Contains project modules                                                                                                        |

## Example:-

#### Create SubAdmin Files

- Create Module Files

```bash
$ ng generate module manage-subadmin --routing=true
```

- Create Component Files For Subadmin

```bash
$ ng generate component subadmin
```

- Create Component Files for Subadmin List

```bash
$ ng generate component subadmin-list
```

- Create Component File of Add & Edit Functionality

```bash
$ ng generate component subadmin-add-edit
```

#### Import Subadmin Module to App Routing File

```bash
$ {
    path: 'subadmin',
    loadChildren: () =>   import('./views/manage-subadmin/subadmin.module').then(m =>  m.SubadminModule),
    canActivateChild: [AuthGuard]
}
```

#### Include Subadmin in Side Bar Menu

`Path : /containers/default-layout/default-layout.component.html`

#### Subadmin.module.ts - Sub Module of Components of SubAdmin

- Module Name: `SubadminModule`
- Purpose: Used to `import` module and `declare` component. Only one module create for each module. Import this module in routing file.

#### Subadmin-routing.module.ts - Sub Routing Files of SubAdmin

- Module Name: `SubadminRoutingModule`
- Purpose: Use to create different URLs or Routes for list, add & edit component.

#### Subadmin.component.ts

- Component Name:- SubadminComponent
- Purpose: Use to Combine Subadmin template and style. It is an main component of this module.

#### Subadmin.component.html

- Purpose: Used for render the view based of the `routing`.

#### Subadmin.component.scss

- Purpose: Used for styling the component.

#### Similiarly it would be for Subadmin-List, Subadmin-Add, Subadmin-Edit

## Angular Commands

| Commands                          | Description                               |
|-----------------------------------|-------------------------------------------|
| ng add <collection> [options]     | Adding new NPM Packages                   |
| ng build <project> [options]      | Build an project                          |
| ng generate <schematic> [options] | Generate Component, Services, etc.        |
| ng new <name> [options]           | Creating an New APP.                      |
| ng serve <project> [options]      | Serve an Application for development      |
| ng update [options]               | Used for Updating NPM Packages.           |
| ng lint <project> [options]       | Debug the Code Standard of an Application |
| ng help [options]                 | For help to different Commands            |
| ng version [options]              | Check CLI Version                         |
| ng deploy <project> [options]     | Used for deploy build of application      |

## How to install New Packages...?

#### Example:- http://swimlane.github.io/ngx-datatable/

#### Install Packages:-

```
$ npm i @swimlane/ngx-datatable --save
```

#### Adding CSS for packages

For using Material Theme, need to add below code in `Angular.JSON` file under `styles` array or import directly in `style.scss` file.

```
    "node_modules/@swimlane/ngx-datatable/index.css",
    "node_modules/@swimlane/ngx-datatable/themes/material.css",
    "node_modules/@swimlane/ngx-datatable/assets/icons.css",
```

#### Import Module in Main Module File.

```bash
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
@NgModule({
    imports: [ NgxDatatableModule ]
})
```

#### In Component based TS File, define rows and columns.

```
rows = [
    { name: 'Austin', gender: 'Male', company: 'Swimlane' },
    { name: 'Dany', gender: 'Male', company: 'KFC' }
  ];
columns = [
    { prop: 'name' },
    { name: 'Gender' },
    { name: 'Company' }
  ];
```

#### In Component based HTML File, define an table.

```
<ngx-datatable
        [rows]="rows"
        [columns]="columns">
 </ngx-datatable>
```
