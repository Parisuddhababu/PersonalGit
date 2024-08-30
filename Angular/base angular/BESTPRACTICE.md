# Angular : Best Practices

### 1. Proper `Commenting` to be added in all files

- How to add the comment over the functions show below.

```typescript
/**
 * Show number of records in datatable
 * @param value show total entries value 10,25,50,100
 **/
```

---

### 2. No `repeated` code (For that create common Base component and Base Injector)

- Please refer to the `src/app/utils/common.ts` where we have created the common function which we had used all over the project.

---

### 3. Create `common validator` file for all modules validation

- Please refer to `src/app/_validators/common.validator.ts`
- Example shows the validation if you need to create a custom one.

```typescript
import { AbstractControl, ValidatorFn } from '@angular/forms';

export function NoWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    if (control.value) {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { whitespace: 'value is only whitespace' };
    }
    return null;
  };
}
```

---

### 4. `Linting Process` Should be Run on Commit Process with Proper Commit Message.

- Always run `ng lint` command before committing files to check all the ts-lint errors and should clear all errors before committing.
- The commit message should start as per project specification if the project is on JIRA base then you should start with [Jira-id]: meaningful message (ex: Created new user component). [Status: DONE, WIP], if the project is on azure [#Task-ID]: message. [status], sometimes it depends on the project also.
- Before Commit the code all the validation will check by default.
- For eg:- `[Venus - 120]: Worked on User Module - [Status: Done]`.
- `Just Note`

```typescript
  "config": {
      "commit-message-validator": {
        "_comment": "Validate that all commits contain ticket number.",
        "pattern": "[^a-z]+-[0-9]+:.+",
        "errorMessage": "Commit message MUST begin with a ticket number, following this format: `XYZ-12: Your message here`\nFor Ex:=> [Base-Structure - 120]: Work on User Module - [Status: Done]"
      }
    },
    "husky": {
      "hooks": {
        "commit-msg": "commit-message-validator",
        "pre-commit": "pretty-quick --staged && npm run lint:fix && npm run lint",
        "pre-push": "npm run build:only"
      }
    }
```

---

### 5. Proper Variable and Method Type and Scope

- Always try to keep the methods Name, Variable, Components, Scope Name should be messaging full.
- Always use a lower camel case for the names.

```typescript
setPage(pageInfo) {
    this.pageNumber = pageInfo.offset;
    this.rerender(false);
  }
```

---

### 6. Common Modal (Change Status and Delete)

- Create Status and Delete Confirmation Modal as a common one to use through the project.
- Please refer to `src/app/_modal/description.component.ts`.

---

### 7. Common Constant file, Create Enum file for static content, Common status classes and icon constant

- Please refer to `src/app/utils/enum-const.ts`.
- Common const should always in a common file.

---

### 8. Error and Success handler for API response

- Always add the `Error Handler` for the API call as well as for the success.

```typescript
(error) => {
  this.errorHandler(this.toastr, this.translateService, error, () => {
    this.loader.hideLoader();
    this.submitted = false;
  });
};
```

---

### 9. Scroll to particular invalid input when submit button

- When we create any add edit form on submit it should focus on the error input element.
- Please refer to `src/app/_directives/invalid-form-scroll-ngform.directive.ts`.

---

### 10. Should add `AutoUnsubscribe` for API subscription.

- Add the `AutoUnsubscribe` decorator to the component.

```typescript
@AutoUnsubscribe()
export class CountryAddEditComponent extends BaseComponent implements OnInit {}
```

- It will help to cancel all the pending requests if we switch them in between components.
- The service which is Subscription assigned that only service will be canceled.

```typescript
countrySaveSub: Subscription;
this.countrySub = this.locationService
  .getCountryById(this._id)
  .pipe(first())
  .subscribe((response) => {}
```

---

### 11. `Package Security` with SNYK

- Run `npm run test` for the SNYK vulnerability files to test the security.
- Run `npm audit --prod` to check the vulnerability.
- Run `npm audit fix --only=production` it will try to fix up all the vulnerabilities which it automatically can fix up, some of them have to fix manually.
- `Note:-` Automatic Fixes of Vulnerability can create an issue.

---

### 12. Password Show/Hide Functionality

- Add the password to show hide.

```html
<div class="input-group">
  <div class="input-group-prepend">
    <span class="input-group-text"><i class="icon-lock"></i></span>
  </div>
  <input formControlName="password" [type]="showPass ? 'text' : 'password'" class="form-control" placeholder="Password" />
  <i class="fa fa-lg" [ngClass]="showPass ? 'fa-eye' : 'fa-eye-slash'" (click)="showPass = !showPass" aria-hidden="true"></i>
</div>
```

---

### 13. List page filter value should be from getter method (Common getter use for initial filter and reset filter)

- Create the getter method for the initial filter.

```typescript
get defaultFilterData() {
    return {
      status: '',
      gender: '',
      phone_number: '',
      fullname: '',
      email: '',
    };
  }
```

- Also use the filterService to get and set and store the filter.

- Setter Method for the Filter

```typescript
this.filter = this.filterService.getState('userFilter', this.filter);
```

- Getter method for the filter

```typescript
this.filterService.saveState('userFilter', this.filter);
```

---

### 14. Common modal for view Image and View Description (Show more content)

- Use the common view image and view description component for the enlargement of the image.
- `src/app/_modal > src/app/_modal/description.component.ts, src/app/_modal/view-image.component.ts`

---

### 15. Common service for common API's

TODO: Need to add File Path at least.

---

### 16. Shared module for Common modules

- Add the common components, directives, pipe and register into a shared module.
- File path `src/app/_module/shared.module.ts`, it will specify for the project level.

---

### 17. Display and API Request Date Format into one place Constant and DatePicker Config.

- Please refer to `src/app/config/app-constants.ts`
- Please refer to `src/app/config/app-config.ts` for API.
- The file path will be specified to project structure.

---

### 18. For theme common theme color variable.

- `src/scss/_variables.scss` if need to change theme change the color in this file.

---

### 19. Encrypt and Decrypt editor content.

- For security level Use encryption services where needed.

```typescript
const decrypted = localStorage.getItem('currentUser');
const currentUser = this.EncrDecr.get(CONFIG.EncrDecrKey, decrypted);
```

---

### 20. Usage of Logger functionality

- Don’t use console functionality, if the component is extended from the base component.

```typescript
this.logger.log('Data not Fetch');
```

- For Specify log, error use appropriate methods.
- If the base component is not extended we can use the logger service directly by injecting it to the constructor.
- Strictly use the type wise logger functions to log the proper request formats.

---

### 21. Content Security Policy (CSP)

- Content Security Policy (CSP) is a computer security standard that provides an added layer of protection, From the HTML standards, we need to take care about to add the CSP content all the time when we start any new Project, for more details please refer to the https://www.netsparker.com/blog/web-security/content-security-policy/.

```html
header("Content-Security-Policy: default-src 'self' 'unsafe-eval' 'unsafe-inline'; connect-src 'self' 'unsafe-eval' https://*.addthis.com/
https://addthis.com https://moatads.com https://*.moatads.com https://*.addthisedge.com https://addthisedge.com 'unsafe-inline'; img-src
'self' 'unsafe-eval' https://*.medznat.ru/ https://medznat.ru 'unsafe-inline'; media-src 'self' 'unsafe-eval' https://*.medznat.ru/
https://medznat.ru 'unsafe-inline';script-src 'self' 'unsafe-eval' https://*.addthis.com/ https://addthis.com https://moatads.com
https://*.moatads.com https://*.addthisedge.com https://addthisedge.com 'unsafe-inline'; frame-src 'self' https://*.addthis.com/
https://addthis.com https://moatads.com https://*.moatads.com https://*.addthisedge.com https://addthisedge.com; object-src 'self'");
```

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self' 'unsafe-eval' 'unsafe-inline'; connect-src 'self' 'unsafe-eval' https://*.addthis.com/ https://addthis.com https://moatads.com https://*.moatads.com https://*.addthisedge.com https://addthisedge.com 'unsafe-inline';
 img-src 'self' 'unsafe-eval' https://*.medznat.ru/ https://medznat.ru 'unsafe-inline'; media-src 'self' 'unsafe-eval' https://*.medznat.ru/ https://medznat.ru 'unsafe-inline';
  script-src 'self' 'unsafe-eval' https://*.addthis.com/ https://addthis.com https://moatads.com https://*.moatads.com https://*.addthisedge.com https://addthisedge.com 'unsafe-inline'; 
  frame-src 'self' https://*.addthis.com/ https://addthis.com https://moatads.com https://*.moatads.com https://*.addthisedge.com https://addthisedge.com; object-src 'self'"
/>
```

---

### 22. Google Analytics

- For SEO Perspective Enhancement on Angular Side, we need to add Google Analytics Code.
- Needs to `change the Angular Routing Strategy` From HashLocationStrategy to PathLocation strategy.
- UnComment below Hashlocationstrategy from `app.module.ts`

```typescript
{
  provide: LocationStrategy,
  useClass: HashLocationStrategy
}
```

- Now create below `google-analytics-service`
- Please refer the base project file `src/app/_services/google-analytics.service.ts`
- Now define two variables for `google analytics` enable and `google analyticsId` in config.

```typescript
export const GOOGLE_ANALYTICS_ID = 'xx-xx-xxxx';
export const ENABLE_GOOGLE_ANALYTICS = true;
```

- Now call `loadGoogleAnalytics` and visit page in app.component.

```typescript
constructor() {
  GoogleAnalyticsService.loadGoogleAnalytics();
}
ngOnInit() {
  this.router.events.subscribe((evt) => {
    if (!(evt instanceof NavigationEnd)) {
      return;
    }
    GoogleAnalyticsService.visitPage();
      window.scrollTo(0, 0);
    });
}
```

- `Note: Just for refrence its only for server team` For Location Strategy some configuration needs to be added from the `server side`. (needs to create virtual host and point to the index.html of the dist folder)

```html
<IfModule mod_rewrite.c>
  RewriteEngine On # Redirection of requests to index.html RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR] RewriteCond
  %{DOCUMENT_ROOT}%{REQUEST_URI} -d RewriteRule ^.*$ - [NC,L] # Redirect all non-file routes to index.html RewriteRule ^(?!.*\.).*$
  index.html [NC,L]
</IfModule>
```

---

### 23. W3C validation (SSR)

- If we are using Google Analytics, we need to do W3C validation for each and every HTML page.

---

### 24. Google Page Speed (SSR)

- Google page speed test should be done for the better performance of the website for the angular side user panel.

---

TODO: ## To Do Suggestions

- We can add convert base64 to file to common class component
- We can create a common file upload view component reuse component.
- We can add a copy to the clipboard function to the common level.
- We should create Models for the response data object for the back track of the object key value.
- We can add the getFileExtension function to the common level.
