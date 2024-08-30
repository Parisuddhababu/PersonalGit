
$(document).ready(function () {
    $('.slider-slider-container').slick({
        centerMode: true,
        centerPadding: '60px',
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        arrows: true,
        autoplaySpeed: 2000,
        prevArrow: "<img src ='./assets/images/webp/prev.webp' height='30' width='30' class='prevArrow'/> ",
        nextArrow: "<img src ='./assets/images/webp/next.webp'  height='30' width='30' class='nextArrow'/> ",
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '140px',
                    slidesToShow: 1,
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '140px',
                    slidesToShow: 1,
                },
            },
        ],
    });
});
$(document).ready(function () {
    $('.events-slider').slick({
        centerPadding: '60px',
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        dots: true,
        arrows: false,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    centerPadding: '40px',
                    slidesToShow: 1,
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    centerPadding: '40px',
                    slidesToShow: 1,
                },
            },
        ],
    });
});
