const images = Array.from(document.querySelectorAll('img'));

const preloadImage = (img) => {
  const imageSrc = img.dataset.src;
  img.setAttribute('src', imageSrc);
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.intersectionRatio > 0) {
      observer.unobserve(entry.target);
      preloadImage(entry.target);
    }
  })
}, {
  root: null,
  rootMargin: '50px 0px',
  threshold: 0.01
});
images.forEach(($img, index) => {
  console.logt($img);
  observer.observe($img);
})