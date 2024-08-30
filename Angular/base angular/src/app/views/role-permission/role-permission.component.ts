import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { TreeviewConfig, TreeviewHelper, TreeviewItem } from 'ngx-treeview';
import { first } from 'rxjs/operators';
import { CONFIGCONSTANTS } from '../../config/app-constants';
import { BaseComponent } from '../../_components/base.component';
import { ManageuserService } from '../../_services/manageuser-service';
import { Role } from './../../model/role';
import { RolePermissionService } from './../../_services/role-permission.service';

@Component({
  selector: 'app-role-permission',
  templateUrl: './role-permission.component.html',
  styleUrls: ['./role-permission.component.scss'],
})
export class RolePermissionComponent extends BaseComponent implements OnInit {
  @ViewChild('myModal', { static: true }) public myModal: ModalDirective;
  keyValuePermissionArr = [];
  roleList: Role[] = [];
  global_search = '';
  private filteredData = [];

  private changeStatusId: number;
  private changeStatusType: string;
  private changedStatus: string;
  @ViewChild('roleForm', { static: true }) form: any;
  model: any = new Role('', 'Active');
  roleModalId: number;
  roleModalTitle: string;

  currRoleId: number = null;

  dropdownEnabled = true;
  items: TreeviewItem[];
  allPermissions: any[];
  values: number[];
  config = TreeviewConfig.create({
    hasAllCheckBox: true,
    hasFilter: false,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 500,
  });

  isPermissionSub = false;

  /***
   * 'key' [means disabledArray index] : contains the key that you want to disable
   * 'child_role' : contains the array of keys on which this array_key is
   *                checked or unchecked and it will depend on the boolean parameter
   *                'strict_check'. if we have more then one keys and if we set
   *                strict_check to 'true' then Parent Key would be selected if all it's
   *                key elements are selected together and if we set strict_check to 'false'
   *                then Parent Key would be depended to any one of selection of key elements.
   * 'strict_check' : optional parameter default value false
   */
  disabledArray = CONFIGCONSTANTS.rolePermissionDisabled;

  constructor(private rolePermissionService: RolePermissionService, private manageuserService: ManageuserService) {
    super();
  }

  ngOnInit() {
    this.getAllRoleList();
  }
  /**
   * Show number of records in datatable
   * @param value show total entries value 10,25,50,100
   */
  public changeLimit(value) {
    this.size = value;
  }
  onHidden(): void {
    this.form.reset();
  }
  /**
   * Get Role list data
   */
  private getAllRoleList(): void {
    this.rolePermissionService
      .getAllRoleList()
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.data.length === 0) {
            this.roleList = [];
          } else {
            this.roleList = data.data;
            this.filteredData = data.data;
            if (this.roleList.length) {
              this.currRoleId = data.data[0].id;
              this.getRolePermissions(this.currRoleId);
            } else {
              this.currRoleId = null;
            }
          }
        },
        (error) => {
          this.logger.error(error);
        }
      );
  }

  addRole() {
    this.roleModalTitle = 'Add New Role';
    this.model = new Role('', 'Active');
    this.roleModalId = null;
    this.form.resetForm();
    this.myModal.show();
  }

  editRole(id, name, status) {
    this.roleModalTitle = 'Update Role [' + name + ']';
    this.model = new Role(name, status);
    this.roleModalId = id;
    this.myModal.show();
  }
  /**
   * Create/Update Role data
   */
  public saveRole() {
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    const data = {
      name: this.manageuserService.trimText(this.model.name),
      status: this.model.status,
    };
    if (this.roleModalId) {
      this.updateRole(data, this.roleModalId);
    } else {
      this.createRole(data);
    }
  }

  private createRole(formData) {
    this.rolePermissionService
      .createRole(formData)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.myModal.hide();
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

  private updateRole(formData, id) {
    this.rolePermissionService
      .updateRole(formData, id)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.myModal.hide();
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

  private rerender(): void {
    this.getAllRoleList();
  }

  openModal(template: TemplateRef<any>, id, status) {
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
    this.changeStatusId = id;
    this.changeStatusType = status;
  }

  confirm(): void {
    this.changeStatus(this.changeStatusId, this.changeStatusType);
  }

  decline(): void {
    this.modalRef.hide();
  }
  /**
   * Change CMS status Active or Inactive
   */
  public changeStatus(id, status) {
    this.changedStatus = status === this.statusEnum.active ? this.statusEnum.inactive : this.statusEnum.active;
    this.rolePermissionService
      .changeRoleStatus(this.changedStatus, id)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.meta.status === true) {
            this.modalRef.hide();
            this.toastr.success(data.meta.message);
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
  /**
   * Get role wise permission data
   * @param id Role id
   */
  public getRolePermissions(id) {
    const items: TreeviewItem[] = [];
    if (!id) {
      this.items = items;
      return;
    }
    const newArray = [];
    this.rolePermissionService.getRolePermissions(id).subscribe((data) => {
      this.allPermissions = data.data;
      this.keyValuePermissionArr = [];
      for (const permission of this.allPermissions) {
        if (permission.parent === '#') {
          newArray[permission.id] = { text: permission.text, value: null, children: [] };
        } else {
          this.keyValuePermissionArr[permission.permission_key] = permission.text;
          newArray[permission.parent].children.push({
            text: permission.text,
            value: permission.id,
            checked: permission.state.selected,
          });
        }
      }
      for (const par in newArray) {
        if (newArray.hasOwnProperty(par)) {
          const item = new TreeviewItem(newArray[par]);
          items.push(item);
        }
      }
      this.items = items;
    });
  }

  onFilterChange(value: string) {
    this.logger.info('filter:', value);
  }
  /**
   * save role wise permission
   */
  public async savePermission() {
    this.isPermissionSub = true;
    if (!this.currRoleId) {
      const message = await this.getTranslation('PLEASE_SELECT_ROLE');
      this.toastr.error(message);
      this.isPermissionSub = false;
      return;
    } else if (!this.values.length) {
      const message = await this.getTranslation('NO_PERMISSION_SELECTED');
      this.toastr.error(message);
      this.isPermissionSub = false;
      return;
    }

    this.rolePermissionService
      .assignPermissions(this.values, this.currRoleId)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.meta.status === true) {
            this.toastr.success(data.meta.message);
          }
          this.isPermissionSub = false;
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.loader.hideLoader();
            this.isPermissionSub = false;
          });
        }
      );
  }
  /**
   * Datatabe global search
   * @param event get search input value
   */
  public filterDatatable(event) {
    const val = event.target.value.toLowerCase();
    // get the key names of each column in the dataset
    const keys = ['name', 'status'];
    // assign filtered matches to the active datatable
    this.roleList = this.filteredData.filter(function (item) {
      // iterate through each row's column data
      for (let i = 0; i < keys.length; i++) {
        // check for a match
        if ((item[keys[i]] && item[keys[i]].toString().toLowerCase().indexOf(val) !== -1) || !val) {
          // found match, return true to add to result set
          return true;
        }
      }
    });
    // whenever the filter changes, always go back to the first page
    this.datatable.offset = 0;
  }

  onSelectedChange($event, treeview) {
    let array = [];
    array = array.concat(treeview.selection.checkedItems);
    array = array.concat(treeview.selection.uncheckedItems);
    this.processArray(array, $event, this.disabledArray);
    this.values = $event;
  }
  processArray(array, $event, disabledArray) {
    for (const key in disabledArray) {
      if (key && this.checkAllKeysValid(key, disabledArray[key]['child_role'])) {
        const id = this.getPermissionValueByText(array, this.keyValuePermissionArr[key]);
        const strict =
          disabledArray[key]['strict_check'] !== undefined && typeof disabledArray[key]['strict_check'] === 'boolean'
            ? disabledArray[key]['strict_check']
            : false;
        const operator = strict === true ? '&&' : '||';
        let condition = '';
        disabledArray[key]['child_role'].forEach((element) => {
          const checkId = this.getPermissionValueByText(array, this.keyValuePermissionArr[element]);
          if (condition.length > 0) {
            condition += ' ' + operator + ' ' + $event.includes(checkId);
          } else {
            condition += $event.includes(checkId);
          }
        });
        if (eval(condition)) {
          TreeviewHelper.findItemInList(this.items, id).disabled = false;
          TreeviewHelper.findItemInList(this.items, id).checked = true;
          TreeviewHelper.findItemInList(this.items, id).disabled = true;
          if (!$event.includes(id)) {
            $event.push(id);
          }
        } else {
          TreeviewHelper.findItemInList(this.items, id).disabled = false;
          TreeviewHelper.findItemInList(this.items, id).checked = false;
          TreeviewHelper.findItemInList(this.items, id).disabled = true;
          if ($event.includes(id)) {
            $event.splice($event.indexOf(id), 1);
          }
        }
      }
    }
  }
  getPermissionValueByText(array, text) {
    return array.filter((ele) => ele.text.toUpperCase() === text.toUpperCase())[0].value;
  }

  checkAllKeysValid(key, values) {
    let result = false;
    const keys = Object.keys(this.keyValuePermissionArr);

    if (keys.includes(key)) {
      result = values.every((element, index) => {
        if (!keys.includes(element)) {
          return false;
        } else {
          return true;
        }
      });
    }
    return result;
  }
}
