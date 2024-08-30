window.onscroll = function () {
    let header = document.querySelector("header");
    if (window.scrollY > 0) {
      header.classList.add("active");
    } else {
      header.classList.remove("active");
    }
  };