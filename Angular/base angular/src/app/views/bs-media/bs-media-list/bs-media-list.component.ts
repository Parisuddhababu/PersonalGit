import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { first } from 'rxjs/operators';
import { BaseComponent } from '../../../_components/base.component';
import { BsMediaServiceService } from '../../../_services/bs-media-service.service';

@Component({
  selector: 'app-bs-media-list',
  templateUrl: './bs-media-list.component.html',
  styleUrls: ['./bs-media-list.component.scss'],
})
export class BsMediaListComponent extends BaseComponent implements OnInit {
  fileName = '';
  file = '';
  filter = this.defaultFilterData;
  model: any;
  isSingleClick = true;

  // folder creation
  fname: string;
  newFolderName: string;
  folderPath = '';
  parentIdList: any = [];

  // get Details
  selectedItemsPath = '/';
  selectedItems = '';
  selectTabName = '';
  moveBackPath = '/';
  moveBackPathId: any;
  showMoveBackPath = false;
  newfileExtension = true;

  submitted = false;
  private mediaID: string;
  private changeStatusType: string;
  private changedStatus: string;
  items = [];
  selectedItemsDetails: any;
  loadingIndicator = false;

  grid = false;
  select_folder: any;
  selected_folder_name: any;
  fileTypeAllow: any;

  detailsShowHide = true;

  constructor(private bsMediaService: BsMediaServiceService) {
    super();
  }

  ngOnInit() {
    this.filter = this.filterService.getState('mediaFilter', this.filter);
    this.getAllFolderList();
  }

  /* select Item every Tab*/
  onSelect(id) {
    this.isSingleClick = true;
    setTimeout(() => {
      if (this.isSingleClick) {
        this.selectedItems = id;
        const key = this.items.findIndex((k) => k.uuid === this.selectedItems);

        const addSelecteddetails = [];
        addSelecteddetails.push(this.items[key]);
        this.selectedItemsDetails = addSelecteddetails['0'];
        this.newfileExtension = this.selectedItemsDetails.type === 'folder' ? false : true;
        // this.selectedItemsPath = relativePath;
      }
    }, 250);
  }

  /*Double click on any items*/
  onSelectDoubleClick(id, relativePath, type) {
    if (type === 'folder') {
      this.isSingleClick = false;
      this.selectedItems = '';
      this.selectedItemsPath = this.addingSlashFirstLast(relativePath);

      const addParentId = this.parentIdList;
      addParentId.push(id);
      this.moveBackPathId = id; // for move back items
      this.parentIdList = addParentId;
      this.loader.showLoader();
      this.getAllFolderList();
    }
  }

  /* tab change make selected items empty*/
  tabChangeSelectedItemEmpty(tabName) {
    this.selectedItems = '';
    this.selectedItemsPath = '/';
    this.selectTabName = tabName;
    this.parentIdList = [];
    this.fileTypeAllow =
      this.selectTabName === 'image'
        ? 'image/*'
        : this.selectTabName === 'video'
        ? 'video/*'
        : this.selectTabName === 'audio'
        ? 'audio/*'
        : this.selectTabName === 'application'
        ? 'application/*'
        : '*';
    this.getAllFolderList();
  }

  /* grid view and list view */
  gridView(gridName) {
    this.grid = gridName;
  }

  showHideDetails() {
    this.detailsShowHide = this.detailsShowHide === true ? false : true;
  }

  /* get all details */
  public getAllFolderList() {
    // For save filter, sorting, pagenumber and size in storage
    this.filterService.saveState('mediaFilter', this.filter);
    this.items = []; // flush data
    this.loadingIndicator = true;
    // this.loader.showLoader();
    this.bsMediaService
      .getAllMediaFolderAndFile({
        folderpath: this.selectedItemsPath,
        filterType: this.selectTabName,
        searchBy: this.filter.keyword_search,
        orderBy: this.filter.order_by === '' ? 'asc' : this.filter.order_by,
        sortBy: this.filter.direction === '' ? 'name' : this.filter.direction,
      })
      .pipe(first())
      .subscribe(
        (resp) => {
          /* for path selected (open) and file display if that file in path
           *  otherwise display only folder for that used foreach loop
           */
          const data = [];
          if (this.selectTabName !== '') {
            resp.data.forEach((result) => {
              if (result.type !== 'file') {
                data.push(result); // folder
              } else {
                if (result.type === 'file' && result.folderpath === (this.selectedItemsPath === '/' ? '' : this.selectedItemsPath)) {
                  data.push(result);
                }
              }
            });
            this.items = data;
          } else {
            this.items = resp.data;
          }

          this.loadingIndicator = false;
          this.loader.hideLoader();
        },
        (error) => {
          this.loadingIndicator = false;
          this.loader.hideLoader();
        }
      );
  }

  /* Search Apply */
  public searchApply() {
    this.rerender();
  }
  get defaultFilterData() {
    return {
      keyword_search: '',
      order_by: '',
      direction: '',
    };
  }
  /* Reset Search */
  public resetSearch() {
    this.filter = this.defaultFilterData;
    this.rerender();
  }

  /* rerender data */
  private rerender(): void {
    this.getAllFolderList();
  }

  /* Browse Open For Select File */
  public openFile() {
    document.getElementById('importItems').click();
  }

  /* Change Media File */
  public changeFile(event: any) {
    if (event.target.files[0] !== undefined) {
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        if (this.selectTabName === 'image' && this.iconManage('imageTypesCompare', event.target.files[0].type) === false) {
          const message = await this.getTranslation('PLEASE_UPLOAD_VALID_FILE', 'image');
          this.toastr.error(message);
          return;
        }
        if (this.selectTabName === 'video' && this.iconManage('videoTypesCompare', event.target.files[0].type) === false) {
          const message = await this.getTranslation('PLEASE_UPLOAD_VALID_FILE', 'video');
          this.toastr.error(message);
          return;
        }
        if (this.selectTabName === 'audio' && this.iconManage('audioTypesCompare', event.target.files[0].type) === false) {
          const message = await this.getTranslation('PLEASE_UPLOAD_VALID_FILE', 'audio');
          this.toastr.error(message);
          return;
        }
        if (this.selectTabName === 'application' && this.iconManage('applicationTypesCompare', event.target.files[0].type) === false) {
          const fileTypes = ['text/css', 'text/csv', 'text/html', 'text/javascript', 'text/css'];
          if (fileTypes.includes(event.target.files[0].type) === false) {
            const message = await this.getTranslation('PLEASE_UPLOAD_VALID_FILE', 'document');
            this.toastr.error(message);
            return;
          }
        } else {
          this.file = event.target.files[0];
          this.fileName = event.target.files[0].name;
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  /* Import Media */
  public importFile() {
    this.loader.showLoader();
    const formData: FormData = new FormData();
    formData.append('file', this.file);
    formData.append('folderpath', this.selectedItemsPath === '/' ? '' : this.selectedItemsPath);
    formData.append('parent_id', this.parentIdList);

    this.bsMediaService
      .uploadBsMedia(formData)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.meta.status === true) {
            this.loader.hideLoader();
            this.toastr.success(data.meta.message);
            this.submitted = false;
            this.file = '';
            this.fileName = '';
            this.rerender();
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.loader.hideLoader();
          });
        }
      );
  }

  /* Cancel Import Media */
  cancelImport() {
    this.file = '';
    this.fileName = '';
  }

  /* Open Modal For Add New Folder */
  openModalForAddNewFolder(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  /* Open any Modal Popup for DELETE, MOVE and RENAME*/
  async openModal(template: TemplateRef<any>) {
    if (!this.selectedItems) {
      const message = await this.getTranslation('PLEASE_SELECT_FILE_OR_FOLDER');
      this.toastr.error(message);
      return;
    }

    /* get only folder data for move list - start*/
    const onlyFolder: any = [];
    this.items.forEach((item, index) => {
      if (item.type === 'folder') {
        if (item.uuid !== this.selectedItems) {
          onlyFolder.push(this.items[index]);
        } else {
          this.fname = item.name; // used only for folder new name
        }
      } else {
        if (item.uuid === this.selectedItems) {
          this.fname = item.name; // selected item name if not a folder than
        }
      }
    });
    this.select_folder = onlyFolder;
    // for display move back one folder path with it's value
    if (this.selectedItemsPath !== '/') {
      const endIndex = this.selectedItemsPath.split('/'); // last index
      if (endIndex) {
        const index = this.selectedItemsPath.lastIndexOf(endIndex[endIndex.length - 2]); // last occurence index
        this.moveBackPath = this.addingSlashFirstLast(this.selectedItemsPath.substring(0, index));
      }
    }
    this.showMoveBackPath = this.selectedItemsPath === '/' ? false : true;
    /*get only folder data for move list - end*/

    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  /* Hide Modal */
  decline(): void {
    this.modalRef.hide();
    this.fname = '';
    this.newFolderName = '';
    this.selected_folder_name = '';
    this.submitted = false;
  }

  /* Add New Folder */
  public addNewFoler(newFolderFrm: NgForm) {
    this.submitted = true;
    if (newFolderFrm.invalid) {
      return;
    }
    this.loader.showLoader();
    const formData = new FormData();
    formData.append('name', this.fname.trim());
    formData.append('folderpath', this.selectedItemsPath === '/' ? '' : this.selectedItemsPath);
    formData.append('parent_id', this.parentIdList);
    this.bsMediaService
      .createFolder(formData)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.meta.status === true) {
            this.modalRef.hide();
            this.toastr.success(data.meta.message);
            this.fname = '';
            this.submitted = false;
            this.rerender();
            this.loader.hideLoader();
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.loader.hideLoader();
          });
        }
      );
  }

  /* ReName Media */
  public renameFolder(renameFolderFrm: NgForm) {
    this.submitted = true;
    if (renameFolderFrm.invalid) {
      return;
    }
    this.loader.showLoader();
    const formData = new FormData();

    formData.append('folderpath', this.selectedItemsPath === '/' ? '' : this.selectedItemsPath);
    formData.append('filename', this.fname);
    formData.append('new_filename', this.newFolderName.trim());
    formData.append('fileid', this.selectedItems);
    this.bsMediaService
      .renameBsMedia(formData)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.meta.status === true) {
            this.modalRef.hide();
            this.toastr.success(data.meta.message);
            this.fname = '';
            this.newFolderName = '';
            this.submitted = false;
            this.rerender();
            this.loader.hideLoader();
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.loader.hideLoader();
          });
        }
      );
  }

  /* Delete Media */
  public async deleteManageBsMedia() {
    if (!this.selectedItems) {
      const message = await this.getTranslation('PLEASE_SELECT_FILE_OR_FOLDER');
      this.toastr.error(message);
    } else {
      this.loader.showLoader();
      this.mediaID = this.selectedItems; // id for deleted
      this.bsMediaService
        .deleteFolder({ id: this.mediaID })
        .pipe(first())
        .subscribe(
          (data) => {
            if (data.meta.status === true) {
              this.modalRef.hide();
              this.loader.hideLoader();
              this.toastr.success(data.meta.message);
              // after successfully delete please make empty seleted items
              this.selectedItems = '';
              this.fname = '';
              this.rerender();
            }
          },
          (error) => {
            this.errorHandler(this.toastr, this.translateService, error, () => {
              this.loader.hideLoader();
            });
          }
        );
    }
  }

  /* Move Folder*/
  moveFoler(moveFolderFrm: NgForm) {
    this.submitted = true;
    if (moveFolderFrm.invalid) {
      return;
    }

    this.loader.showLoader();
    const formData = new FormData();
    let rootFolderSelect = true;

    /* Root Folder Detection*/
    const key = this.items.findIndex((k) => k.uuid === this.selected_folder_name);
    if (key !== -1) {
      rootFolderSelect = this.items[key].folderpath === '/' ? true : false;
    }

    /* Move to Back than find id for back folder*/
    if (this.selected_folder_name === 'back') {
      if (this.parentIdList.length >= 2) {
        const totalLength = this.parentIdList.length;
        this.selected_folder_name = this.parentIdList[totalLength - 2]; // second last folder Id
      } else {
        this.selected_folder_name = this.moveBackPathId; // for after root folder than only used
      }
    }

    /* root folder than make destination 0 */
    if (this.moveBackPath === '/' && rootFolderSelect) {
      formData.append('destinationid', '0');
    } else {
      formData.append('destinationid', this.selected_folder_name);
    }
    formData.append('sourceid', this.selectedItems);

    this.bsMediaService
      .moveBsMedia(formData)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.meta.status === true) {
            this.decline();
            this.loader.hideLoader();
            this.toastr.success(data.meta.message);
            // after successfully moved make empty seleted items
            this.selectedItems = '';
            // this.selectedItemsPath = '/';
            this.rerender();
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.loader.hideLoader();
            this.decline();
          });
        }
      );
  }

  /* Back One Folder */
  backOneFolder() {
    if (this.selectedItemsPath !== '/') {
      const endIndex = this.selectedItemsPath.split('/'); // last index
      if (endIndex) {
        const index = this.selectedItemsPath.lastIndexOf(endIndex[endIndex.length - 2]); // last occurence index
        this.selectedItemsPath = this.addingSlashFirstLast(this.selectedItemsPath.substring(0, index));

        // maintianing a parent id list for add time last element remove
        const backParentId = this.parentIdList;
        backParentId.splice(-1, 1);
        this.parentIdList = backParentId;
        this.selectedItems = '';
        this.loader.showLoader();
        this.getAllFolderList();
      }
    } else {
      this.toastr.error('You are in root folder');
    }
  }

  /* Adding '/' first and last position*/
  addingSlashFirstLast(name) {
    if (name.startsWith('/')) {
      if (name.endsWith('/')) {
        return name;
      } else {
        return name + '/';
      }
    } else {
      name = '/' + name;
      if (name.endsWith('/') === false) {
        return name + '/';
      }
    }
  }

  /* Bytes to KB convert*/
  convertBytesToKb(bytes) {
    /** 
    if (bytes === 0) {
      return '0 Kb';
    }
    const decimals = 2;
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = 'KB';

    const kbSize = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, kbSize)).toFixed(dm)) + ' ' + sizes;
    **/
    return this.bytesToSize(bytes);
  }

  bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) {
      return `0 ${sizes[0]}`;
    }
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)) + '', 10);
    if (i === 0) return `${bytes} ${sizes[i]})`;
    return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
  }

  /* dynamic Icon Manage */
  iconManage(type, item) {
    const audioTypes = 'audio';
    const imageTypes = 'image';
    const videoTypes = 'video';
    const applicationTypes = 'application';

    if (type === 'imageTypesCompare') {
      return item.includes(imageTypes) === true ? true : false;
    }
    if (type === 'videoTypesCompare') {
      return item.includes(videoTypes) === true ? true : false;
    }
    if (type === 'audioTypesCompare') {
      return item.includes(audioTypes) === true ? true : false;
    }
    if (type === 'applicationTypesCompare') {
      return item.includes(applicationTypes) === true ? true : false;
    }
  }
}
