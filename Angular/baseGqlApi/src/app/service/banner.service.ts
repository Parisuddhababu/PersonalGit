import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GetBanner, fetchBanner } from '../framework/query/banner';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {
  BannerStatusChange,
  CreateBanner,
  DeleteBanner,
  EditBanner,
} from '../framework/mutation/banner';



@Injectable({
  providedIn: 'root',
})
export class BannerService {
  constructor(private apollo: Apollo) {}

  /*fetch banner service */
  fetchBannerData(title:string,sortBy: string, sortOrder: string,page:number,limit:number): Observable<any> {
    return this.apollo
      .watchQuery({
        query: fetchBanner,
        variables: {bannerTitle:title,sortBy:sortBy,sortOrder,page,limit},
        fetchPolicy: 'network-only',
      })
      .valueChanges.pipe(map((result: any) =>result?.data?.fetchBanner));
  }
  /*get single banner details */
  getSingleBanner(uuid: string): Observable<any> {
    return this.apollo
      .watchQuery({
        query: GetBanner,
        variables: { uuid: uuid },
        fetchPolicy: 'network-only',
      })
      .valueChanges.pipe();
  }

  /*create banner service */
  CreateBannerData(
    bannerTitle: string,
    bannerTitleArabic: string,
    bannerImage: string,
    status: number
  ): Observable<any> {
    return this.apollo.mutate({
      mutation: CreateBanner,
      variables: {
        bannerTitle: bannerTitle,
        bannerTitleArabic: bannerTitleArabic,
        bannerImage: bannerImage,
        status: +status,
      },
    });
  }
  /*update banner service */
  UpdateBannerData(
    uuid: string,
    bannerTitle: string,
    bannerTitleArabic: string,
    bannerImage: string,
    status: number
  ): Observable<any> {
    return this.apollo.mutate({
      mutation: EditBanner,
      variables: {
        uuid: uuid,
        bannerTitle: bannerTitle,
        bannerTitleArabic: bannerTitleArabic,
        bannerImage: bannerImage,
        status: +status,
      },
    });
  }
  /*delete banner service */
  DeleteBannerData(uuid: string): Observable<any> {
    return this.apollo.mutate({
      mutation: DeleteBanner,
      variables: { uuid: uuid },
    });
  }
  /*update banner status */
  UpdateBannerService(id: string, currentStatus: number) {
    const newStatus = currentStatus === 1 ? 0 : 1;
    return this.apollo.mutate({
        mutation: BannerStatusChange,
        variables: {
            status: newStatus,
            uuid: id
        }
    })
}
}
