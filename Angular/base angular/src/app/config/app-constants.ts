export const persistPageWiseFilter = true;

export enum LogLevel {
  All = 0,
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4,
  Off = 5,
}

export const LogMethods = {
  [LogLevel.All]: 'log',
  [LogLevel.Debug]: 'debug',
  [LogLevel.Info]: 'info',
  [LogLevel.Warn]: 'warn',
  [LogLevel.Error]: 'error',
};

export const CONFIGCONSTANTS = {
  siteName: 'Base Angular Admin',
  dateFormat: 'MM/dd/yyyy hh:mm:ss',
  dateShortFormat: 'MM/dd/yyyy',
  momentDateTime24Format: 'MM/DD/YYYY hh:mm:ss',
  momentDateTime12Format: 'MM/DD/YYYY h:mm A',
  momentTime24Format: 'hh:mm:ss',
  momentTime12Format: 'hh:mm A',
  momentDateFormat: 'MM/DD/YYYY',
  languageOption: true,
  ApiRequestFormat: 'YYYY-MM-DD',
  Api24RequestFormat: 'YYYY-MM-DD HH:mm:ss',
  dateRangeConfig: {
    rangeInputFormat: 'MM/DD/YYYY',
    containerClass: 'theme-red',
    rangeSeparator: ' To ',
    showWeekNumbers: false,
  },
  CKEditorConfig: {
    allowedContent: true,
    extraPlugins: 'sourcedialog,uploadimage',
    forcePasteAsPlainText: true,
    removePlugins: 'sourcearea',
    language: 'en',
    // removeButtons:"Cut,Copy,Paste,PasteText,PasteFromWord,Undo,Redo,Find,Replace,
    // SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,
    // HiddenField,Image,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,About",
    uploadUrl: 'https://ckeditor.com/apps/ckfinder/3.4.5/core/connector/php/connector.php?command=QuickUpload&type=Files&responseType=json',
    // Configure your file manager integration. This example uses CKFinder 3 for PHP.
    // filebrowserBrowseUrl: 'https://ckeditor.com/apps/ckfinder/3.4.5/ckfinder.html',
    // filebrowserImageBrowseUrl: 'https://ckeditor.com/apps/ckfinder/3.4.5/ckfinder.html?type=Images',
    // filebrowserUploadUrl: 'https://ckeditor.com/apps/ckfinder/3.4.5/core/connector/php/connector.php?command=QuickUpload&type=Files',
    filebrowserImageUploadUrl: 'https://ckeditor.com/apps/ckfinder/3.4.5/core/connector/php/connector.php?command=QuickUpload&type=Images',
    removeDialogTabs: 'image:advanced;link:advanced',
  },
  datatableConfig: {
    reorderable: false,
    scrollbarH: true,
    serverSorting: true,
    clientSorting: false,
    serverPaging: true,
    clientPaging: false,
    piningRight: false,
    headerHeight: 50,
    footerHeight: 50,
    rowHeight: 'auto',
    dtMessages: {
      emptyMessage: 'No data',
      totalMessage: 'TOTAL_RECORDS',
    },
    page: {
      size: 10,
      pageNumber: 0,
      totalReords: 0,
    },
    limitList: [10, 25, 50, 100],
  },
  dataTableIndexColumnWidth: '100',
  /*
   * 'key' [means disabledArray index] : contains the key that you want to disable
   * 'child_role' : contains the array of keys on which this array_key is
   *                checked or unchecked and it will depend on the boolean parameter
   *                'strict_check'. if we have more then one keys and if we set
   *                strict_check to 'true' then Parent Key would be selected if all it's
   *                key elements are selected together and if we set strict_check to 'false'
   *                then Parent Key would be depended to any one of selection of key elements.
   * 'strict_check' : optional parameter default value false */
  rolePermissionDisabled: {
    CMS_UPDATE: {
      child_role: ['CMS_CREATE', 'CMS_DELETE', 'CMS_LIST'],
      strict_check: true,
    },
    FAQ_CREATE: {
      child_role: ['FAQ_UPDATE'],
    },
  },
  // BackEnd Side ClientId, Secret
  // clientId: '648735729667-pad8fqi9od1mml4prip0ulcbdsfcg1o2.apps.googleusercontent.com',
  // clientSecret: 'RzjUp4o5BGf2l1T7-HSiTuvy',

  // Front Team ClientId, Secret for Testing
  clientId: '696054366143-66ff703cum6j6p621ikcvduq9qlrioam.apps.googleusercontent.com',
  clientSecret: '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',
  calendarScope: 'https://www.googleapis.com/auth/calendar',
  suggestionId: 9,
  departmentId: 1,
  locationId: 6,
  imageUpload: {
    ALLOW_FILE_TYPE: ['image/jpeg', 'image/jpg', 'image/png'],
    MAX_FILE_SIZE: 2,
    MESSAGE: 'PLEASE_UPLOAD_VALID_FILE',
    FILE: 'jpeg, jpg, png',
  },
  logLevel: LogLevel.All,
};

export enum ChatType {
  ONE_TO_ONE = 'one-to-one',
  GROUP = 'group',
}
export enum ModuleType {
  FULL_SCREEN = 'full-screen',
  POPUP = 'popup',
}
