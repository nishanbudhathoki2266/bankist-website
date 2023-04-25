"use strict";

alert("This site isn't responsive! please use laptops or bigger devices!");

// Show modal
const btnsShowModal = document.querySelectorAll(".btn--show-modal");
const btnCloseModal = document.querySelector(".btn--close-modal");
const overlay = document.querySelector(".overlay");
const modal = document.querySelector(".modal");

// Toggle classes for Modal
const toggleModalClasses = function () {
  modal.classList.toggle("hidden");
  overlay.classList.toggle("hidden");
};

// Open Modals on click
btnsShowModal.forEach(function (btn) {
  btn.addEventListener("click", function (e) {
    toggleModalClasses();
  });
});

// Close Modal on clicking close icon
btnCloseModal.addEventListener("click", function () {
  toggleModalClasses();
});

// Close Modal on clicking anywhere on the overlay
overlay.addEventListener("click", function () {
  toggleModalClasses();
});

// Close Modal on clicking esc key
document.addEventListener("keydown", function (e) {
  if (!modal.classList.contains("hidden") && e.key === "Escape") {
    toggleModalClasses();
  }
});

//////////////////////////////////////////// SMOOTH SCROLLING //////////////////////////////////////////////////
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");

btnScrollTo.addEventListener("click", function (e) {
  // const s1coords = section1.getBoundingClientRect();
  // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);

  section1.scrollIntoView({ behavior: "smooth" });
});

///////////////////////////////////// EVENT DELEGATION AND SMOOTH NAVIGATION ///////////////////////////////////
const navLinks = document.querySelector(".nav__links");

navLinks.addEventListener("click", function (e) {
  e.preventDefault();
  const propagator = e.target;
  if (propagator !== this) {
    const navigateTo = propagator.getAttribute("href");
    const navigationSection = document.querySelector(navigateTo);
    navigationSection.scrollIntoView({ behavior: "smooth" });
  }
});

/////////////////////////// DOM TRAVERSING ///////////////////////////////
const h1 = document.querySelector("h1");
// Going downwards
// console.log(h1.querySelectorAll('.highlight'));

// console.log(h1.childNodes); All childs (including comments, texts, element etc.)
// console.log(h1.children); All element childs
// console.log(h1.lastElementChild); First and Last child!

// console.log(h1.parentNode); Parent nodes
// console.log(h1.parentElement); Parent elements

// console.log(h1.closest('html')); // upper closest.. no matter how up

// console.log(h1.parentElement.children);

/////////////////////////////////// TABBED COMPONENTS ////////////////////////////////////////////
const operations = document.querySelector(".operations");
const operationsContainer = document.querySelector(
  ".operations__tab-container"
);
const operationContents = document.querySelectorAll(".operations__content");

operationsContainer.addEventListener("click", function (e) {
  if (e.target !== e.currentTarget) {
    const propagator = e.target.closest(".btn");
    const propagatorSiblings = [...propagator.parentElement.children];

    if (!propagator.classList.contains("operations__tab--active")) {
      propagator.classList.add("operations__tab--active");

      propagatorSiblings.forEach((propagatorSibling) => {
        if (propagator !== propagatorSibling) {
          propagatorSibling.classList.remove("operations__tab--active");
        }
      });
    }

    const operationContentToShow = document.querySelector(
      `.operations__content--${propagator.dataset.tab}`
    );

    operationContents.forEach((operationContent) => {
      if (operationContent !== operationContentToShow) {
        operationContent.classList.remove("operations__content--active");
      }
    });
    operationContentToShow.classList.add("operations__content--active");

    // console.log(propagator);
  }
});

/////////////////////////////////////// NAVIGATION EFFECT ///////////////////////////
const nav = document.querySelector(".nav");
const navLinkSiblings = nav.querySelectorAll(".nav__link");
const logoSibling = nav.querySelector("img");

const setOpacity = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const propagator = e.target;

    navLinkSiblings.forEach((navLinkSibling) => {
      if (navLinkSibling !== propagator) {
        navLinkSibling.style.opacity = this;
      }
    });
    logoSibling.style.opacity = this;
  }
};

nav.addEventListener("mouseover", setOpacity.bind(0.5));
nav.addEventListener("mouseout", setOpacity.bind(1));

//////////////////// STICKY NAVIGATION //////////////////////
//// NORMAL OR OLD SCHOOL WAY ////
/*
window.addEventListener('scroll', function () {
 const initialCoords = section1.getBoundingClientRect();
 if (this.scrollY > initialCoords.top) nav.classList.add('sticky');
 else nav.classList.remove('sticky');
});
*/

//////// INTERSECTION OBSERVER API /////////

const header = document.querySelector(".header");
const navHeight = getComputedStyle(nav).height;

const headerObserver = new IntersectionObserver(
  function (entries) {
    const [entry] = entries;
    if (!entry.isIntersecting) {
      nav.classList.add("sticky");
    } else {
      nav.classList.remove("sticky");
    }
  },
  {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}`,
  }
);
headerObserver.observe(header);

/////////// REVEAL SECTIONS ON SCROLLL //////////////

const allSections = document.querySelectorAll(".section");

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // Guard clause
  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section--hidden");
  // It is also important to unobserve the visited section for the welfare of the performance
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach((section) => {
  section.classList.add("section--hidden");
  sectionObserver.observe(section);
});

//////////// LAZY IMAGES //////////////
const allImgTargets = document.querySelectorAll("img[data-src]");

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener("load", function (e) {
    entry.target.classList.remove("lazy-img");
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

allImgTargets.forEach((imgTarget) => {
  imgObserver.observe(imgTarget);
});

////////// SLIDER ////////////

function slider() {
  const slides = document.querySelectorAll(".slide");

  const slider = document.querySelector(".slider");

  const btnRight = document.querySelector(".slider__btn--right");
  const btnLeft = document.querySelector(".slider__btn--left");

  let currSlide = 0;

  // slider.style.transform = 'scale(0.3)';
  // slider.style.overflow = 'visible';

  ////// dots //////
  const dotContainer = document.querySelector(".dots");

  // Creating slider dots
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class = 'dots__dot' data-slide = '${i}'></button>`
      );
    });
  };

  // Showing which slide is active
  const activateDOt = function (slide) {
    document.querySelectorAll(".dots__dot").forEach((dot) => {
      dot.classList.remove("dots__dot--active");
      document
        .querySelector(`.dots__dot[data-slide="${slide}"]`)
        .classList.add("dots__dot--active");
      console.log(slide);
    });
  };

  const goToSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${(i - slide) * 100}%)`;
    });
  };

  const init = function () {
    // 0 , 100, 200, 300
    createDots();
    goToSlide(0);
    activateDOt(0);
  };

  init();

  const nextSlide = function () {
    if (currSlide === slides.length - 1) {
      currSlide = 0;
    } else {
      currSlide++;
    }

    goToSlide(currSlide);
    activateDOt(currSlide);
  };

  const prevSlide = function () {
    if (currSlide === 0) {
      currSlide = slides.length - 1;
    } else {
      currSlide--;
    }

    goToSlide(currSlide);
    activateDOt(currSlide);
  };

  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  // Only listening to key events if the user in testimonial section
  const testiSection = document.querySelector("#section--3");

  const testiObserver = new IntersectionObserver(
    function (entries) {
      const [entry] = entries;
      if (!entry.isIntersecting) return;

      // Sliding by key pressing
      document.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") prevSlide();
        if (e.key === "ArrowRight") nextSlide();
      });
    },
    {
      root: null,
      threshold: 0.2,
    }
  );

  testiObserver.observe(testiSection);

  dotContainer.addEventListener("click", function (e) {
    if (e.target !== e.currentTarget) {
      goToSlide(e.target.dataset.slide);
      activateDOt(e.target.dataset.slide);
    }
  });
}

slider();

/*

EXTRAS

const header = document.querySelector('.header');
const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'We use cookies for a safe browsing.';
message.innerHTML = 'We use cookies for a safe browsing <button class="btn btn--close-cookie">Got it!</button>';
header.append(message);

const btnCloseCookie = document.querySelector('.btn--close-cookie');
console.log(btnCloseCookie);

btnCloseCookie.addEventListener('click', function(){
  message.remove();
});

*/
