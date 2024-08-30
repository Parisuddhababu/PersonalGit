
$(document).ready(function () {
    $('.slider-slider-container').slick({
        centerMode: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: false,
        arrows: true,
        centerPadding: '0px',
        prevArrow: "<img src ='./assets/images/webp/prev.webp' height='48' width='23' class='prevArrow'/> ",
        nextArrow: "<img src ='./assets/images/webp/next.webp'  height='48' width='23' class='nextArrow'/> ",
        responsive: [
            {
                breakpoint: 1280,
                settings: {
                    arrows: false,
                    centerMode: false,
                    slidesToShow: 2,
                    autoplay:true

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
        centerPadding: '60px',
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
                    centerPadding: '40px',
                    slidesToShow: 1,
                },
            },
        ],
    });
});
