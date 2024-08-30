document.addEventListener('DOMContentLoaded', function () {
  const slides = document.getElementById('imageSliderContainer');
  const previousButton = document.getElementById('previousButton');
  const nextButton = document.getElementById('nextButton');
  const slideWidth = slides.clientWidth;
  const slidesToShow = 3;
  const slideCount = slides.children.length;
  const duplicatedSlidesCount = slidesToShow;
  const totalSlides = slideCount + duplicatedSlidesCount;
  let currentIndex = 0;

  for (let i = 0; i < duplicatedSlidesCount; i++) {
    const cloneSlide = slides.children[i].cloneNode(true);
    slides.appendChild(cloneSlide);
  }

  function goToSlide (index) {
    if (index < 0) {
      index = totalSlides - slidesToShow;
    } else if (index > totalSlides - slidesToShow) {
      index = 0;
    }

    const adjustedIndex = index % slideCount;

    slides.style.transform = `translateX(-${adjustedIndex * (slideWidth / slidesToShow)}px)`;
    currentIndex = index;

    const allSlides = document.querySelectorAll('.image-slide');
    allSlides.forEach(slide => slide.classList.remove('img-scale'));

    const currentSlide = allSlides[adjustedIndex + 3];
    currentSlide.classList.add('img-scale');
  }

  function prevSlide () {
    goToSlide(currentIndex - 1);
  }

  function nextSlide () {
    goToSlide(currentIndex + 1);
  }

  previousButton.addEventListener('click', prevSlide);
  nextButton.addEventListener('click', nextSlide);

  goToSlide(currentIndex);
});