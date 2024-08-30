import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BannerService } from '../../service/banner.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { BannerType } from '../../models/banner.model';
import { Subscription } from 'rxjs';
import { ToastrService, ToastrModule } from 'ngx-toastr';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    PaginationComponent,
    ToastrModule,
  ],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss',
  providers: [BannerService, ToastrService],
})
export class BannerComponent implements OnInit, OnDestroy {
  bannerData: BannerType[] = [];
  bannerCount: number = 0;
  sortBy: string = '';
  sortOrder: string = '';
  page: number = 1;
  limit: number = 10;
  form = new FormGroup({
    bannerTitleControl: new FormControl(''),
  });
  private subscriptions: Subscription = new Subscription();
  constructor(
    private bannerService: BannerService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  /*navigate to edit page */
  onEditBanner(uuid: string) {
    this.router.navigate([`/banner/edit/${uuid}`]);
  }

  ngOnInit(): void {
    const titleControlSubscription = this.form
      .get('bannerTitleControl')
      ?.valueChanges.subscribe((value) => {
        this.page = 1;
        this.fetchBanners(
          value!,
          this.sortBy,
          this.sortOrder,
          this.page,
          this.limit
        );
      });
    if (titleControlSubscription) {
      this.subscriptions.add(titleControlSubscription);
    }
    this.page = 1;
    this.fetchBanners('', this.sortBy, this.sortOrder, this.page, this.limit);
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  /*banner fetch method */
  fetchBanners(
    title: string,
    sortBy: string,
    sortOrder: string,
    page: number,
    limit: number
  ): void {
    const fetchBannersSubscription = this.bannerService
      .fetchBannerData(title, sortBy, sortOrder, page, limit)
      .subscribe({
        next: (res) => {
          this.bannerData = res?.data?.BannerData || [];
          this.bannerCount = res?.data?.count;
        },
        error: (error) => {
          this.toastr.error('Error fetching banner data:', error);
        },
      });
    this.subscriptions.add(fetchBannersSubscription);
  }

  // Method to toggle sorting parameters and fetch banners
  toggleSorting(sortBy: string): void {
    if (this.sortBy === sortBy) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = sortBy;
      this.sortOrder = 'asc';
    }
    this.updateSorting();
  }
  /* method to update sorting parameters and fetch banners */
  updateSorting(): void {
    const title = this.form.get('bannerTitleControl')?.value ?? '';
    this.fetchBanners(
      title,
      this.sortBy,
      this.sortOrder,
      this.page,
      this.limit
    );
  }
  /*banner pagination method */
  onPageChanged(newPage: number): void {
    this.page = newPage;
    const title = this.form.get('bannerTitleControl')?.value ?? '';
    this.fetchBanners(
      title,
      this.sortBy,
      this.sortOrder,
      this.page,
      this.limit
    );
  }

  /*banner delete method */
  onDeleteBanner(uuid: string) {
    if (confirm('Are you sure you want to delete?')) {
      const deleteBannerSubscription = this.bannerService
        .DeleteBannerData(uuid)
        .subscribe({
          next: (response) => {
            if (response?.data?.deleteBanner.meta.message) {
              this.toastr.success('deleted successfully');
              this.page=1;
              this.bannerData = this.bannerData.filter(
                (banner) => banner.uuid !== uuid
              );
            } else {
              this.toastr.error(
                'Error deleting banner:',
                response.data.deleteBanner.message
              );
            }
          },
          error: (error) => {
            this.toastr.error('Error deleting banner:', error);
          },
        });
      this.subscriptions.add(deleteBannerSubscription);
    } else {
      this.router.navigate(['/banner']);
    }
  }

  /*banner status change */
  toggleActive(banner: { uuid: string; status: number }) {
    const toggleActiveSubscription = this.bannerService
      .UpdateBannerService(banner.uuid, banner.status)
      .subscribe({
        next: () => {
          this.toastr.success( 'status updated successfully');
        },
        error: (err) => {
          this.toastr.error('Error while updating status', err);
        },
      });
    this.subscriptions.add(toggleActiveSubscription);
  }
}
