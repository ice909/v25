document.addEventListener('DOMContentLoaded', function () {
  document
    .querySelector('#app > d-header')
    .shadowRoot.querySelector('div').style.position = 'unset';
  const monolith = document.querySelector('.monolith');
  const maxRadius = 680;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const visibleHeight = entry.intersectionRect.height;
        const totalHeight = entry.boundingClientRect.height - 64;
        if (visibleHeight <= window.innerHeight - 780 + 64) {
          monolith.style.borderRadius = '0';
          return;
        }
        const currentRadius = Math.min(
          maxRadius,
          (visibleHeight / totalHeight) * maxRadius
        );
        monolith.style.borderRadius = `${currentRadius}px ${currentRadius}px 0 0`;
      });
    },
    { threshold: Array.from({ length: 101 }, (_, i) => i / 100) }
  );

  observer.observe(monolith);
});
