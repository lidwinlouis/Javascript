'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Smooth Scroll
btnScrollTo.addEventListener('click', function (e) {
  //Current cordinates of section--1
  const s1cords = section1.getBoundingClientRect();
  console.log(`Section--1 cordinates : `, s1cords);
  //Current cordinates of scroll--to button
  const buttonCords = e.target.getBoundingClientRect();
  //const buttonCords = btnScrollTo.getBoundingClientRect();
  console.log(`Scroll To button  cordinates : `, buttonCords);
  //Current scroll x, y cordinates ie. pixels from top of page to top of view port
  //and pixels from left of page to left of viewport
  console.log(
    `Current Scroll (X-Y):`,
    `x =`,
    window.pageXOffset,
    `; y =`,
    window.pageYOffset
  );
  //Current size of view port
  console.log(
    'Width-Height of view port : ',
    document.documentElement.clientWidth,
    document.documentElement.clientHeight
  );
  //s1cords.left and s1cords.top corresponds to the cordinates of the section--1 w.r.to viewport (visible area)
  //and not the actul document. When we want to scroll to a cordinate that represents the document
  //we need to add the current scroll position from the top of the document to the view port heigh/width.
  //i.e current postition + current scroll

  //Functional without smooth transition
  // window.scrollTo(
  //   s1cords.left + window.pageXOffset,
  //   s1cords.top + window.pageYOffset
  // );

  //Adding smooth transition --  behavior: 'auto' same as above config
  window.scrollTo({
    left: s1cords.left + window.pageXOffset,
    top: s1cords.top + window.pageYOffset,
    behavior: 'smooth',
  });

  //EASY and NEW option - Works ONLY in latest browsers.
  //section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
// Page Navigation - Event Delegation

//Approach - 1 without event delegation
/*
document.querySelectorAll('.nav__link').forEach(el => {
  el.addEventListener('click', function (e) {
    e.preventDefault();
    //e.currentTarget.getAttribute('href')  //this can be used in place of currentTarget
    console.log(this.getAttribute('href'));
    const id = this.getAttribute('href');
    //The href attribute returns #section--1 which is infact id in THIS case. So use this id to scrollTo
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
});
*/

//Approach - 2 With Event Delegation

/*When there are lots of elements like nav__link in this case there will too many event listeners
attached for the same functinos. Here we use event delegation where the event will be attached to a common
parent of the elements we are interested in. When an event that originated in the child element , it bubbles
up to its parents and eventlistner attached to the parent can identify where the event orignated using e.target
Event delegation particulary useful when the target element is added to the DOM at a later point; in that case
we attach the event listener to the parent then catches the e.target in the callback 
*/
document.querySelectorAll('.nav__links').forEach(el => {
  el.addEventListener('click', function (e) {
    e.preventDefault();
    //console.log(`event.currentTarget `, e.currentTarget);
    //console.log(`event.target`, e.target);
    // console.log(e.target.getAttribute('href'));
    /*We can use .contains method to check if there is a .nav__link class*/
    if (e.target.classList.contains('nav__link')) {
      /*The href attribute returns #section--1 which is infact id in THIS case. So use this id to scrollIntoView*/
      const id = e.target.getAttribute('href');
      /*Use of optional chaining to handle cases when the click is happening on the parent divs alone.*/
      document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

///////////////////////////////////////
// Tabbed component

const tabContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabContents = document.querySelectorAll('.operations__content');

tabContainer.addEventListener('click', function (e) {
  //There is a span inside button so its possible to get e.target as that span instead of the expected button.
  //Therefore instead of checking class and finding parent in case of span we can use .closest and provide
  //the selector.
  const clicked = e.target.closest('.operations__tab');

  //Guard clause
  if (!clicked) return;

  //remove all active then add the clicked one as active.
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  //Find the content using the data-set number ; remove active class from all then add to the to-be-active one
  const actContent = document.querySelector(
    `.operations__content--${clicked.dataset.tab}`
  );
  tabContents.forEach(cont =>
    cont.classList.remove('operations__content--active')
  );
  actContent.classList.add('operations__content--active');
});

///////////////////////////////////////
//Menu fade animation

//Add event listener to the 'nav' and use Event delegation
const nav = document.querySelector('.nav');

//Method :1
const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav__links').querySelectorAll('.nav__link');
    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = opacity;
      }
    });
  }
};
/* Uncomment this block to see approach one work 
nav.addEventListener('mouseover', function (e) {
  handleHover(e, 0.5);
});
nav.addEventListener('mouseout', function (e) {
  handleHover(e, 1);
});
*/
//Method : 2
const handleHover2 = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav__links').querySelectorAll('.nav__link');
    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });
  }
};
// *********** IMPORTANT *************************//
//While using bind(), the "argument" will be treated as 'this' in the invoked function.
//If more args are needed, array or object can be used.
//Event will be available in the inovked function
nav.addEventListener('mouseover', handleHover2.bind(0.5));
nav.addEventListener('mouseout', handleHover2.bind(1));

///////////////////////////////////////
//Sticky navigation
const sectionOne = document.querySelector('#section--1');

//Option one - Using window.scroll event: works but INEFFICIENT as too many events are fired
/*
const navbar = document.querySelector('.nav');
window.addEventListener('scroll', function () {
  const initialCords = sectionOne.getBoundingClientRect();
  const viewPortTop = window.scrollY;
  if (viewPortTop > initialCords.top) {
    navbar.classList.add('sticky');
  } else {
    navbar.classList.remove('sticky');
  }
});
*/

//Option Two - Using IntersectionObserver
//We need to observe a condition where the header section moves in and out of viewport (root)
//And when the isIntersecting is false ( ie, target is out of the root/viewport ) add sticky class
//And when isIntersecting is true ( observer triggered and is visible in root/viweport ) remove sticky class
const headerOne = document.querySelector('.header');
const navbarOne = document.querySelector('.nav');
const navbarHeight = navbarOne.getBoundingClientRect().height;

//we have only one threshold hence the entries will have only one element.
const stickyHeader = function (entries, observer) {
  //destructuring = same as entries[0] as there is only element in the threshold and hence entries.
  const [entry] = entries;
  //console.log('Header :: ', entry);
  if (!entry.isIntersecting) {
    navbarOne.classList.add('sticky');
  } else {
    navbarOne.classList.remove('sticky');
  }
};
//rootMargin - will be used to give an offset to the trigger point.
const obsHeader = new IntersectionObserver(stickyHeader, {
  root: null,
  threshold: 0,
  rootMargin: `-${navbarHeight}px`,
});
obsHeader.observe(headerOne);

///////////////////////////////////////
//Reveal Sections

const allSectionsOne = document.querySelectorAll('.section');
//Callback for the IntersectionObserver
const revealCallback = function (entries, observer) {
  const [entry] = entries;
  //Guard check - return when the it is NOT intersecting
  if (!entry.isIntersecting) return;
  //
  entry.target.classList.remove('section--hidden');
  //Once the hidden style is removed from section, we no longer need to observe this target, so unobserve
  //Same is not possbile for the header as it need to attach and detach as we move up and down the page.
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealCallback, {
  root: null,
  threshold: 0.1,
});

allSectionsOne.forEach(section => {
  sectionObserver.observe(section);
  //Hide all section in this flow and later reveal based on the observer.
  //section.classList.add('section--hidden');
});

const images = document.querySelectorAll('img[data-src]');
const lazyLoad = function (entries, observer) {
  const [entry] = entries;
  //Guard check
  if (!entry.isIntersecting) return;
  const imageElement = entry.target;
  //console.log('Triggered ');
  //Set the image and once the image is set , wait for the 'load'event  on the <img>
  //to remove the blur filter. This is for slower networks where image load takes time
  imageElement.src = imageElement.dataset.src;
  imageElement.addEventListener('load', function (e) {
    imageElement.classList.remove('lazy-img');
  });
  //Once images are loaded, remove the observers.
  observer.unobserve(imageElement);
};

//rootMargin added to lazy load the image before the image is in the viewport.
const imageObserver = new IntersectionObserver(lazyLoad, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
images.forEach(image => {
  imageObserver.observe(image);
});

///////////////////////////////////////
//// Slider
///////////////////////////////////////
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');

let currentSlide = 0;
const maxSlides = slides.length;

//Functions
const goToSlide = function (currentSlide) {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${(i - currentSlide) * 100}%)`;
  });
};

// 0, 100% ,200%
//-100%, 0% ,100%
const nextSlide = function () {
  //When we reach the last slide, reset the currentSlide to first one at index 0
  if (currentSlide === maxSlides - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  goToSlide(currentSlide);
  activateDots(currentSlide);
};
// -100%, 0% ,100%
//0%, 100% ,200%
const prevSlide = function () {
  //When we reach the first slide (at index 0), reset the currentSlide to last one at (maxSlides-1)
  if (currentSlide === 0) {
    currentSlide = maxSlides - 1;
  } else {
    currentSlide--;
  }
  goToSlide(currentSlide);
  activateDots(currentSlide);
};

//Create dots
const dotContainer = document.querySelector('.dots');
const createDots = function () {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide=${i}></button>`
    );
  });
};

const activateDots = function (slide) {
  const allDots = document.querySelectorAll('.dots__dot');
  allDots.forEach(dot => {
    console.log(dot.dataset.slide == slide);
    if (dot.dataset.slide == slide) {
      dot.classList.add('dots__dot--active');
    } else {
      dot.classList.remove('dots__dot--active');
    }
  });
};

//EVENT Handlers
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);
//Event delegation
dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    //console.log('slide', slide);
    goToSlide(slide);
    activateDots(slide);
  }
});
//Use arrow keys to slide
document.addEventListener('keydown', function (e) {
  //console.log(e);
  if (e.key === 'ArrowRight') nextSlide();
  //Using short circuiting
  e.key === 'ArrowLeft' && prevSlide();
});

//Initialization of sliders and dots.
const init = function () {
  goToSlide(0);
  createDots();
  activateDots(0);
};
init();
///////////////////////////////////////
// Lectures
///////////////////////////////////////
console.log('********* Selecting Elements *********');

console.log(`document.documentElement => `, document.documentElement);
console.log(`document.head => `, document.head);
console.log(`document.body => `, document.body);
console.log(`document.title => `, document.title);
//etc.

//selects first occurence
const firstSection = document.querySelector('.section');
console.log(`document.querySelector('.section')`, firstSection);

//selects all occurence and retunrs the NodeList
const allSections = document.querySelectorAll('.section');
console.log(`document.querySelectorAll('.section')`, allSections);

const sectionWithId = document.getElementById('section--1');
console.log(`document.getElementById('section--1')`, sectionWithId);

//Returns an HTMLColleciton of all elements with Tagname 'button'
//HTMLCollection is a live datastructure, unlike NodeList, which gets updated as and when DOM gets modified.
const allButtons = document.getElementsByTagName('button');
console.log(`document.getElementsByTagName('button')`, allButtons);

//Returns an HTMLColleciton of all elements with classname  'btn'
//HTMLCollection is a live datastructure, unlike NodeList, which gets updated as and when DOM gets modified.
const allButtonsbyClass = document.getElementsByClassName('btn');
console.log(`document.getElementsByClassName('btn')`, allButtonsbyClass);

console.log('********* Creating Elements *********');

//Creating Elements
//we can use methods like .insertAdjacentHTML()
const message = document.createElement('div');
message.classList.add('cookie-message');
message.textContent =
  'We use cookies for better functionalities and analytics.';
message.innerHTML = `We use cookies for better functionalities and analytics.
<button class="btn btn--close--cookie">Got it</button>`;
const header = document.querySelector('.header');
//append() and prepend() adds the element as the last child and first child respectively.
//When you try to prepand AND append , only the second one will work, or second one will override the first.
header.prepend(message);
header.append(message);
//we can achieve multiple attach by usng element.cloneNode(true) to create a new copy before prepend/append
//header.append(message.cloneNode(true));

//before() and after() adds the element as a Sibling before and after the elemtn respectively.
//Just like append and prepend, before and after cannot work simultaneously
header.before(message);
header.after(message); // This is theone that will get finally attached to the DOM.

console.log('********* Deleting/Removing Elements *********');
//Modern approach by using .remove()
document
  .querySelector('.btn--close--cookie')
  .addEventListener('click', function () {
    //because 'message' is already in memory. We could also select before removing.
    message.remove();
    //Older approach when remove() was not available.
    //message.parentElement.removeChild(message);
  });

console.log('********* Adding styles/attributes *********');
///////////////////////////////////////
//styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';
//Only inline styles can be fetched like below and not computed styles from CSS
console.log(`message.style.color :: `, message.style.color); //from css
console.log(`message.style.backgroundColor :: `, message.style.backgroundColor); // inline style

//For getting computed styles from css or otherwise , which ever is applied to the element.
console.log(
  `getComputedStyle(message).color :: `,
  getComputedStyle(message).color
);
console.log(
  `getComputedStyle(message).height :: `,
  getComputedStyle(message).height
);

message.style.height =
  Number.parseInt(getComputedStyle(message).height) + 30 + 'px';

//CSS custom properties or CSS variables.
//Custom CSS properties cannot be set using 'assign' operator instead we need setProperty() as below.
//Check the :root pseudo-class, in csss file. begines with a double hyphen
//setProperty can be used for all properties including heigh, color etc. but then
// assignment as above is easier.
document.documentElement.style.setProperty('--color-tertiary', '#ff585f');

///////////////////////////////////////
//Attributes
const logo = document.querySelector('.nav__logo');
console.log(`logo.src =>`, logo.src);
console.log(`logo.alt =>`, logo.alt);
console.log(`logo.className =>`, logo.className);
logo.alt = 'Minimalistic Logo';
console.log(`logo.alt =>`, logo.alt);

//Non-standard (custom) attribute to the img tag --- wont work
console.log(`logo.designer =>`, logo.designer);

//Getting and setting custom attributes (or even standard attributes works like this)
console.log(`logo.getAttribute('designer') =>`, logo.getAttribute('designer'));
logo.setAttribute('designer', 'Schmedtmann');

//absolute path - same case with the href attribute
console.log(`logo.src =>`, logo.src);
//relative path using getAttribute()
console.log(`logo.getAttribute('src') =>`, logo.getAttribute('src'));

///////////////////////////////////////
//Data Attributes
console.log(`logo.dataset.versionNumber => `, logo.dataset.versionNumber);

///////////////////////////////////////
//Classes

logo.classList.add('classname-1', 'classname-2');
logo.classList.remove('classname-1');
logo.classList.toggle('c');
console.log(
  `logo.classList.contains('classname-2') => `,
  logo.classList.contains('classname-2')
);

//Do NOT USE -- Overwrites existing class
//logo.className = 'Jonas';
console.log('********* Evet listeners *********');

const h1 = document.querySelector('h1');
//Preferred way - NOTE 'mouseenter' event does not Bubble 'mouseover' will Bubble.
const h1mouseoveraction = function () {
  console.log('You have hovered over the h1 tag !!');
  //Can remove the event listener after the first time the listener is invoked.
  h1.removeEventListener('mouseenter', h1mouseoveraction);
};

h1.addEventListener('mouseenter', h1mouseoveraction);

//Another way, old apporach
/*
  h1.onmouseover = function () {
    console.log('You have hovered over the h1 tag - second approach !!');
  };
*/

console.log(
  '*********Event Propagation-Capturing ,Target and Bubbling*********'
);

//We have added event listeners to nav__link , its parent , nav__links, and its parent , nav
//When a click is performed on nav__link, the events gets propogated to its parent during the bubbling phase
//e.target shows the actual originator of the event and e.currentTarget shows the element to which capturing event is bound.
//By adding a third parameter, true , to the event handler we can use the capture phase instead of bubbling phase.
//Default value is false.
document.querySelector('.nav__link').addEventListener('click', function (e) {
  //console.log(`nav__link`, e.target, e.currentTarget);
  //In order to prevent the click event from bubbling/propogating to its parent elements use below.Not recommended
  //e.stopPropagation();
});
//If you click on the 'nav__links' the child 'nav__link' event will not get triggered.
document.querySelector('.nav__links').addEventListener('click', function (e) {
  // console.log(`nav__links`, e.target, e.currentTarget);
});
//There is a third arg to addEventListener, a boolean , which would make the event reaching the parent '
//nav' to be triggered first. Before the bubbling or target phase is reached.
/*
document.querySelector('.nav').addEventListener('click', function (e) {
  console.log(`nav`, e.target, e.currentTarget);
}, true);
*/
document.querySelector('.nav').addEventListener('click', function (e) {
  //console.log(`nav`, e.target, e.currentTarget);
});

console.log('********* DOM traversing *********');

const header1 = document.querySelector('h1');
//Going downwards : children
//This will get all children of h1 with class .highlight, no matter how deep.
console.log(header1.querySelectorAll('.highlight'));
//Lists all child nodes (as NodeLists), text, comment, span, br etc and not just elements.
console.log(`h1.childNodes =>`, header1.childNodes);
//To get only direct children (as HTMLCollection) elements, use .children
console.log(`h1.children =>`, header1.children);

//Getting first and last child
console.log(`h1.firstElementChild => `, header1.firstElementChild);
console.log(`h1.lastElementChild => `, header1.lastElementChild);
//Can also change attributes as below
//h1.firstElementChild.style.color = 'teal';

//Going upwards : parents
console.log(`h1.parentNode => `, header1.parentNode);
console.log(`h1.parentElement => `, header1.parentElement);

//closest can be used to find closest PARENTS using any selector like in query selector
//and attributes can be applied as well.
console.log(`h1.closest('header') =>`, header1.closest('.header'));
//Using custom css properties or variables to assign color after making selection.
//h1.closest('header').style.color = 'var(--color-secondary-darker)';

//Going sideways : siblings
//Get sibling element
console.log(`h1.previousElementSibling =>`, header1.previousElementSibling);
console.log(`h1.nextElementSibling =>`, header1.nextElementSibling);

//Get sibling node/element whichever is adjacent
console.log(`h1.nextElementSibling =>`, header1.nextSibling);
console.log(`h1.nextElementSibling =>`, header1.previousSibling);

//To get all siblings, go to immediate parent and get all children,
//This will also include the element itself .
console.log(`h1.parentElement.children =>`, header1.parentElement.children);

console.log('********* IntersectionObserver *********');

//Option Two - Using IntersectionObserver
const obsCallback = function (entries, observer) {
  //console.log('Crossing...', window.scrollY);
  entries.forEach(entry => {
    console.log('Entry...', entry);
  });
};
//root : The intersection point with target (sectionOne); (root) null implies the intersection point is viewport.
//threshold : percentage of intersection. It can be an array;
//0 means when the target is out of the view port(root); Get triggered when target moves in & out of the root(vewport)
//20% or 0.2 means when target is 20% visible in the viewport(root)
//1 would mean when 100% of the target is visible in the viewport (section--1 is bigger than viewport hence not possible in this case)
//rootMargin => this give the offset to the target where the observer should trigger.
const obsOptions = {
  root: null,
  threshold: [0, 0.2],
  //threshold: 0.1,
  //rootMargin : '-90px'
};
const observer = new IntersectionObserver(obsCallback, obsOptions);
//observer.observe(sectionOne);

console.log('********* Lifecycle DOM events *********');
//Event triggered when the HTML and scripts are loaded and parsed and the DOM tree is built,
//but not all resources like images are downloaded.
document.addEventListener('DOMContentLoaded', function (e) {
  console.log(`HTML parsed and DOM tree built !!!`, e);
});
//Event triggered when the page is fully loaded including all images.
window.addEventListener('load', function (e) {
  console.log(`Page fully loaded !!!`, e);
});

//Event triggered just before the window is to be closed.
window.addEventListener('beforeunload', function (e) {
  console.log(`About to be unloaded.`, e);
  e.returnValue = '';
});
