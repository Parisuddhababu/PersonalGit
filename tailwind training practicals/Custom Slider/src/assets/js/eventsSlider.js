document.addEventListener('DOMContentLoaded', function () {
    const slides = document.querySelectorAll('.eventSlide');
    const dotsContainer = document.querySelector('.dots-container');
    let currentIndex = 0;

    // Create dots based on number of slides
    slides.forEach((slide, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
        dotsContainer.appendChild(dot);
    });

    // Autoplay functionality
    let autoplayInterval = setInterval(() => {
        goToSlide((currentIndex + 1) % slides.length);
    }, 3000);

    // Function to navigate to a specific slide
    function goToSlide (index) {
        const slideWidth = slides[0].offsetWidth;
        const offset = -index * slideWidth;
        slides.forEach((slide) => {
            slide.style.transform = `translateX(${offset}px)`;
        });
        dotsContainer.querySelector('.dot.active').classList.remove('active');
        dotsContainer.querySelectorAll('.dot')[index].classList.add('active');
        currentIndex = index;
    }

    // Pause autoplay on hover
    document.querySelector('.event-slider').addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });

    // Resume autoplay on mouse leave
    document.querySelector('.event-slider').addEventListener('mouseleave', () => {
        clearInterval(autoplayInterval);
        autoplayInterval = setInterval(() => {
            goToSlide((currentIndex + 1) % slides.length);
        }, 3000);
    });
});
