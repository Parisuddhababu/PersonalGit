import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CONFIGCONSTANTS } from '../../config/app-constants';
import { AutoUnsubscribe } from '../../_decorator/autounsubscribe';
import { DashboardService } from '../../_services/dashboard.service';

@Component({
  templateUrl: 'dashboard.component.html',
})
@AutoUnsubscribe()
export class DashboardComponent implements OnInit {
  installCount = 0;
  uninstallCount = 0;
  todayInstallCount = 0;
  todayUninstallCount = 0;
  count_date = [new Date(new Date().setDate(new Date().getDate() - 30)), new Date()];
  readonly dateRangeConfig = CONFIGCONSTANTS.dateRangeConfig;

  public constructor(private dashboardService: DashboardService, private toastr: ToastrService, private translate: TranslateService) {}
  ngOnInit(): void {
    this.refreshData();
  }
  getInstallUninstallCount(type) {
    const data = {
      event_type: type,
      from_date: this.count_date ? moment(this.count_date[0]).format(CONFIGCONSTANTS.ApiRequestFormat) : '',
      to_date: this.count_date ? moment(this.count_date[1]).format(CONFIGCONSTANTS.ApiRequestFormat) : '',
    };
    this.dashboardService.getAllTotalCount(data).subscribe(
      (res: any) => {
        const resData = res.data[0];
        if (type === 'install') {
          this.installCount = resData ? resData.totalcount : 0;
        } else if (type === 'uninstall') {
          this.uninstallCount = resData ? resData.totalcount : 0;
        }
      },
      async (error) => {
        const statusError = error;
        if (statusError && statusError.meta) {
          this.toastr.error(statusError.meta.message);
        } else {
          const message = await this.translate.get('SOMETHING_WENT_WRONG').toPromise();
          this.toastr.error(message);
        }
      }
    );
  }
  getTodayCount(type) {
    const data = {
      event_type: type,
      from_date: moment().format(CONFIGCONSTANTS.ApiRequestFormat),
      to_date: moment().format(CONFIGCONSTANTS.ApiRequestFormat),
    };
    this.dashboardService.getAllTotalCount(data).subscribe(
      (res: any) => {
        const resData = res.data[0];
        if (type === 'install') {
          this.todayInstallCount = resData ? resData.totalcount : 0;
        } else if (type === 'uninstall') {
          this.todayUninstallCount = resData ? resData.totalcount : 0;
        }
      },
      async (error) => {
        const statusError = error;
        if (statusError && statusError.meta) {
          this.toastr.error(statusError.meta.message);
        } else {
          const message = await this.translate.get('SOMETHING_WENT_WRONG').toPromise();
          this.toastr.error(message);
        }
      }
    );
  }
  refreshData() {
    this.getTodayCount('install');
    this.getTodayCount('uninstall');
    this.getInstallUninstallCount('install');
    this.getInstallUninstallCount('uninstall');
  }
  searchApplyCount() {
    this.getInstallUninstallCount('install');
    this.getInstallUninstallCount('uninstall');
  }
  resetSearchCount() {
    this.count_date = [new Date(new Date().setDate(new Date().getDate() - 30)), new Date()];
    this.getInstallUninstallCount('install');
    this.getInstallUninstallCount('uninstall');
  }
}
