import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { BannerService } from '../../../service/banner.service';
import { UploadImageService } from '../../../service/upload-image.service';
import { BannerDetail } from '../../../models/banner.model';
import { ToastrService, ToastrModule } from 'ngx-toastr';

@Component({
  selector: 'app-add-banner',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ToastrModule],
  templateUrl: './add-banner.component.html',
  styleUrl: './add-banner.component.scss',
  providers: [BannerService, UploadImageService, ToastrService],
})
export class AddBannerComponent {
  paramId: string | null = null;
  bannerDetail: BannerDetail;
  bannerImageUrl: string = '';
  bannerImage1: string = '';
  bannerStatus: number = 0;
  error = '';
  constructor(
    private bannerService: BannerService,
    private uploadImageService: UploadImageService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.bannerDetail = {
      banner_title: '',
      banner_title_arabic: '',
      banner_image: '',
      status: 0,
    };
  }
  /*to get parms id */
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.paramId = params.get('id');
    });
    if (this.paramId) {
      this.getBannerDetail();
    }
  }
  /* form validations */
  form = new FormGroup({
    bannerTitle: new FormControl('', { validators: [Validators.required] }),
    bannerTitleArabic: new FormControl('', {
      validators: [Validators.required],
    }),
    bannerImage: new FormControl('', { validators: [Validators.required] }),
    status: new FormControl(0, { validators: [Validators.required] }),
  });

  handleImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.error = '';

    if (
      file &&
      file.size <= 2000000 &&
      (file.type === 'image/jpeg' || file.type === 'image/png')
    ) {
      // Create a FileReader to read the file and get dimensions
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.onload = () => {
          const width = image.width;
          const height = image.height;
          const aspectRatio = width / height;

          // Define accepted aspect ratios
          const acceptedRatios = [1, 16 / 9];

          // Check if the aspect ratio is one of the accepted ratios
          if (acceptedRatios.includes(aspectRatio)) {
            this.bannerImageUrl = URL.createObjectURL(file);

            // Upload the file and handle the response
            this.uploadImageService.uploadFile(file).subscribe(
              (url: string) => {
                this.bannerImageUrl = url;
                this.form.patchValue({ bannerImage: url });
                this.error = '';
              },
              (error) => {
                console.error('Error uploading image:', error);
              }
            );
          } else {
            this.error = 'Aspect ratio must be either 1:1 or 16:9';
            this.toastr.error('Aspect ratio must be either 1:1 or 16:9');
          }
        };
        image.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.error = 'File must be (jpeg/png), File size must be 2MB or below';
      this.toastr.error(
        'File must be (jpeg/png), File size must be 2MB or below'
      );
    }
  }

  /*update the get values with update form */
  getBannerDetail() {
    this.bannerService.getSingleBanner(this.paramId!).subscribe(
      (data) => {
        this.bannerDetail = data?.data?.getBannerDetail?.data;
        this.bannerImage1 = data?.data?.getBannerDetail?.data?.banner_image;
        this.bannerStatus = data?.data?.getBannerDetail?.data?.status;
        this.form.patchValue({
          bannerTitle: this.bannerDetail?.banner_title,
          bannerTitleArabic: this.bannerDetail?.banner_title_arabic,
          bannerImage: this.bannerDetail?.banner_image,
          status: +this.bannerDetail?.status,
        });
      },
      (error) => {
        this.toastr.error('Error fetching banner data:', error);
      }
    );
  }

  /* to submit the form */
  onSubmit() {
    if (this.paramId) {
      this.bannerService
        .UpdateBannerData(
          this.paramId,
          this.form.value.bannerTitle!,
          this.form.value.bannerTitleArabic!,
          this.bannerImageUrl,
          +this.form.value.status!
        )
        .subscribe(
          (response) => {
            this.toastr.success(response?.meta?.message ?? 'updated successfully');
            this.router.navigate(['/banner']);
          },
          (error) => {
            this.toastr.error(error, 'error while update banner');
          }
        );
    } else {
      this.bannerService
        .CreateBannerData(
          this.form.value.bannerTitle!,
          this.form.value.bannerTitleArabic!,
          this.bannerImageUrl,
          +this.form.value.status!
        )
        .subscribe(
          (response) => {
            this.toastr.success(response?.meta?.message ?? 'created successfully');
            this.router.navigate(['/banner']);
          },
          (error) => {
            this.toastr.error(error, 'error while creating banner');
          }
        );
    }
  }
  /*to back navigation */
  Cancel() {
    this.form.reset();
    this.router.navigate(['/banner']);
  }
}
