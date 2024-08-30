
$(document).ready(function () {
    $('.slider-slider-container').slick({
        centerPadding: '0',
        centerMode: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: false,
        arrows: true,
        prevArrow: "<img src ='./src/assets/images/webp/prev.webp' height='48' width='23' class='prevArrow'/> ",
        nextArrow: "<img src ='./src/assets/images/webp/next.webp'  height='48' width='23' class='nextArrow'/> ",
        responsive: [
            {
                breakpoint: 1280,
                settings: {
                    arrows: false,
                    centerMode: false,
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    centerMode: true,
                    slidesToShow: 1,
                    autoplay:true
                },
            },
        
        ],
    });
});

$(document).ready(function () {
    $('.events-slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        // autoplay: true,
        autoplaySpeed: 2000,
        dots: true,
        arrows: false,
        fade:true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    });
});