//https://codepen.io/anon/pen/qyKJNO?editors=0010


const images = document.querySelectorAll('img[data-src]');
const config = {
  rootMargin: '50px 0px',
  threshold: 0.01
};

let observer;

if ('IntersectionObserver' in window) {
  observer = new IntersectionObserver(onChange, config);
  images.forEach(img => observer.observe(img));
} else {
  console.log('%cIntersection Observers not supported', 'color: red');
  images.forEach(image => loadImage(image));
}

const loadImage = image => {
  image.classList.add('fade-in');
  image.src = image.dataset.src;
}

function onChange(changes, observer) {
  changes.forEach(change => {
    if (change.intersectionRatio > 0) {
      // Stop watching and load the image
      loadImage(change.target);
      observer.unobserve(change.target);
    }
    
  });
}