const carouselTrack = document.getElementById("carousel-track");
const transitionStyle = "transform 0.7s ease-in-out";
let carouselTimeout;
const paginationDots = document.querySelectorAll(".testimonials__pagination-dot");
let currentIndex = -1;
// mobile menu and overlay
const body = document.getElementById("body");
const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenuCloseButton = document.getElementById("mobile-menu-close-button");
const mobileMenuOverlay = document.getElementById("overlay");
const navBarMobile = document.getElementById("nav-bar-mobile");
// swipe function
const carousel = document.getElementById("carousel");
let startX = 0;
let endX = 0;

// email form
const emailForm = document.getElementById("emailForm");
const emailMessage = document.getElementById("email-message");

function remToPx(rem) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

function setupTrack() {
  carouselTrack.style.transition = transitionStyle;
}

function updatePaginationDots() {
  paginationDots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentIndex);
  });
}

function startCarousel() {
  moveRight();
  carouselTimeout = setTimeout(startCarousel, 4000);
}

function moveRight() {

  if(!carouselTrack) return;

  carouselTrack.style.transition = "none";
  carouselTrack.prepend(carouselTrack.lastElementChild);
  carouselTrack.classList.add("move-left");
  carouselTrack.offsetWidth;
  carouselTrack.style.transition = transitionStyle;
  carouselTrack.classList.remove("move-left");

  // Update current index
  currentIndex = (currentIndex + 1) % paginationDots.length;
  updatePaginationDots();
}

function moveLeft() {

  if(!carouselTrack) return;

  carouselTrack.style.transition = "none";
  carouselTrack.append(carouselTrack.firstElementChild);
  carouselTrack.classList.add("move-right");
  carouselTrack.offsetWidth;
  carouselTrack.style.transition = transitionStyle;
  carouselTrack.classList.remove("move-right");

  // Update current index
  currentIndex = (currentIndex - 1 + paginationDots.length) % paginationDots.length;
  updatePaginationDots();
}

function stopCarousel() {
  clearTimeout(carouselTimeout);
}

function restartCarousel() {
  clearTimeout(carouselTimeout);
  carouselTimeout = setTimeout(startCarousel, 4000);
}

document.addEventListener("DOMContentLoaded", function() {
  setupTrack();
  startCarousel();
});

// email form
function handleSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  const emailInput = data["email"];

  if(validateEmail(emailInput)) {
    if(emailMessage.classList.contains("error")) {
      emailMessage.classList.remove("error");
    }
    emailMessage.textContent = "Successfully registered!";
  } else {
    emailMessage.classList.add("error");
    emailMessage.textContent = "Please insert a valid email.";
  }
}

function validateEmail(email) {
  const emailRegex = /(?:[a-z0-9+!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;
  return emailRegex.test(email);
}

emailForm.addEventListener('submit', handleSubmit);

// overlay and menu

function overlayListener() {
  mobileMenuOverlay.setAttribute('aria-hidden', true);
  mobileMenuOverlay.removeEventListener('transitionend', overlayListener);
}

function menuListener() {
  navBarMobile.setAttribute('aria-hidden', true);
  navBarMobile.removeEventListener('transitionend', menuListener);
}

function toggleMenu() {
  const isMenuOpen = mobileMenuButton.getAttribute('aria-expanded') === 'true';
  
  // Change attributes to new menu states
  mobileMenuButton.setAttribute('aria-expanded', !isMenuOpen);

  if (!isMenuOpen) {
      //open menu

      //overlay settings
      mobileMenuOverlay.removeEventListener('transitionend', overlayListener);
      mobileMenuOverlay.setAttribute('aria-hidden', false);

      //menu settings
      navBarMobile.removeEventListener('transitionend', menuListener);
      navBarMobile.setAttribute('aria-hidden', isMenuOpen);

      void mobileMenuOverlay.offsetHeight;

      //prevent scroll on body
      body.classList.add("no-scroll");

      //overlay settings
      mobileMenuOverlay.classList.add('mobile-menu-overlay--active');

      //menu settings
      navBarMobile.classList.add('nav-bar-mobile--active');

      // hide / show menu buttons
      mobileMenuButton.classList.add("hide");
      mobileMenuCloseButton.classList.remove("hide");

  } else {

      //close menu

      //overlay settings
      mobileMenuOverlay.addEventListener('transitionend', overlayListener);
      mobileMenuOverlay.classList.remove('mobile-menu-overlay--active');

      //remove prevent scroll on body
      body.classList.remove("no-scroll");

      //menu 
      navBarMobile.addEventListener('transitionend', menuListener);
      navBarMobile.classList.remove('nav-bar-mobile--active');

      // hide / show menu buttons
      mobileMenuButton.classList.remove("hide");
      mobileMenuCloseButton.classList.add("hide");
      
  }
}

mobileMenuButton.addEventListener('click', toggleMenu);
mobileMenuCloseButton.addEventListener('click', toggleMenu);

// clicking off the menu closes the menu
document.addEventListener("click", function (event) {

  const isMenuOpen = mobileMenuButton.getAttribute('aria-expanded') === 'true';

  // Check if the click was outside the menu and not on the button
  if (!navBarMobile.contains(event.target) && !mobileMenuButton.contains(event.target) && isMenuOpen) {
    toggleMenu();
  }

});

// swipe functionality

carousel.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

carousel.addEventListener("touchend", (e) => {
  endX = e.changedTouches[0].clientX;

  if (endX - startX > 50) { // Right swipe threshold
    moveRight();
    restartCarousel();
  } else if (startX - endX > 50) { // Left swipe threshold
    moveLeft();
    restartCarousel();
  }
});
