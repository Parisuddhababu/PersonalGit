import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";
import React, { useEffect, useState } from "react";
import { IBannerSection1Props } from "@templates/AppHome/components/BannerSection";
import { IHomeBannerDetails } from "@type/Pages/home";
import { IMAGE_PATH } from "@constant/imagepath";
import Head from "next/head";
const IBannerSection1 = ({ banner1, banner2 }: IBannerSection1Props) => {
	const _bannerImgList: IHomeBannerDetails[][] = [];
	if (banner1) {
		_bannerImgList.push(banner1);
	}
	if (banner2) {
		_bannerImgList.push(banner2);
	}

	const [bannerImgList] = useState<IHomeBannerDetails[][]>(_bannerImgList);

	const [activeIndex, setActiveIndex] = useState<number>(0);
	const delay = 10000;

	/**
	 * Auto Slider
	 *
	 */
	useEffect(() => {
		setTimeout(
			() =>
				setActiveIndex((prevIndex) =>
					prevIndex === bannerImgList?.length - 1 ? 0 : prevIndex + 1
				),
			delay
		);
		return () => { };
	}, [activeIndex]);

	return (
		<>
			<Head>
				<link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.homeBanner)} />
			</Head>
			{/* <main> */}
			<section className="swiper mySwiper banner-section">
				{bannerImgList?.map((ele, index) => (
					ele?.map(
						(bList: IHomeBannerDetails) =>
							index === activeIndex && (
								<a href={bList?.link || ""} key={bList.banner_title} aria-label="banner-image-link" target="_blank"
									rel="noreferrer">
									<div className="swiper-wrapper">
										<div className="swiper-slide banner-section-wrapper">
											<figure className="banner-background-image">
												<picture>
													<img
														height="700" width="1920"
														src={`${bList?.banner_image?.path
															? bList?.banner_image?.path
															: IMAGE_PATH.homeBannerPng
															}?w=1920px`}
														alt={bList?.banner_image?.name}
														title={bList?.banner_image?.name}
													/>
												</picture>
											</figure>
											<div className="container">
												<div className="banner-row">
													<div className="banner-content" />
												</div>
											</div>
										</div>
									</div>
								</a>
							)
					)
				))}
				<div className="swiper-pagination">
					{bannerImgList?.map((ele, ind) => (
						ele.map((item) => (
							<button
								aria-label="swipe-button"
								key={item._id}
								className={`swiper-pagination-bullet 	${ind === activeIndex ? "active" : ""}`}
								onClick={() => setActiveIndex(ind)}
							/>
						))
					))}
				</div>
			</section>

			{/* 
				<section className="products-section padding-top-remove">
					<div className="container">
						<h2 className="products-title">Best Selling Product</h2>
						<div className="products-wrapper">
							<div className="product-box">
								<figure>
									<picture>
										<img src="../assets/images/product1.jpg" alt="product-img" title="product-img" height="280" width="280" />
									</picture>
								</figure>
								<p className="product-description">Ocusoft Dry Eye Mask Basic Thermapod Heat Technology</p>
								<span className="product-price">$4.35<del>$8.00</del></span>
								<button className="btn btn-primary">ADD TO CART</button>
							</div>
							<div className="product-box">
								<figure>
									<picture>
										<img src="../assets/images/product2.jpg" alt="product-img" title="product-img" height="280" width="280" />
									</picture>
								</figure>
								<p className="product-description">Ocusoft Dry Eye Mask Premium Thermapod Heat Technology</p>
								<span className="product-price">$4.35<del>$8.00</del></span>
								<button className="btn btn-primary">ADD TO CART</button>
							</div>
							<div className="product-box">
								<figure>
									<picture>
										<img src="../assets/images/product3.jpg" alt="product-img" title="product-img" height="280" width="280" />
									</picture>
								</figure>
								<p className="product-description">Ocusoft Lid Scrub Allergy Eyelid Cleanser 30 Ct</p>
								<span className="product-price">$4.35<del>$8.00</del></span>
								<button className="btn btn-primary">ADD TO CART</button>
							</div>
							<div className="product-box">
								<figure>
									<picture>
										<img src="../assets/images/product4.jpg" alt="product-img" title="product-img" height="280" width="280" />
									</picture>
								</figure>
								<p className="product-description">RETAINE PM - Night Time Ointment</p>
								<span className="product-price">$4.35<del>$8.00</del></span>
								<button className="btn btn-primary">ADD TO CART</button>
							</div>
						</div>
					</div>
				</section> */}
			{/* </main> */}
		</>
	);
};

export default IBannerSection1;
