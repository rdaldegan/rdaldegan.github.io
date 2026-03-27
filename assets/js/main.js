document.addEventListener('DOMContentLoaded', () => {

  // Mobile menu toggle
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => nav.classList.remove('open'));
    });
  }

  // Smooth reveal on scroll
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.project, .skill-group, .about, .timeline__item, .formation__item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    observer.observe(el);
  });

  const style = document.createElement('style');
  style.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(style);

  // Lightbox carousel
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <button class="lightbox__close" aria-label="Fechar">&times;</button>
    <button class="lightbox__prev" aria-label="Anterior">&#8249;</button>
    <button class="lightbox__next" aria-label="Pr\u00f3ximo">&#8250;</button>
    <div class="lightbox__content">
      <img class="lightbox__img" src="" alt="">
      <p class="lightbox__caption"></p>
      <p class="lightbox__counter"></p>
    </div>
  `;
  document.body.appendChild(lightbox);

  const lbImg = lightbox.querySelector('.lightbox__img');
  const lbCaption = lightbox.querySelector('.lightbox__caption');
  const lbCounter = lightbox.querySelector('.lightbox__counter');
  let images = [];
  let current = 0;

  function lbShow() {
    lbImg.src = images[current].src;
    lbImg.alt = images[current].alt;
    lbCaption.textContent = images[current].caption;
    lbCounter.textContent = (current + 1) + ' / ' + images.length;
  }

  function lbOpen(container, index) {
    const figures = container.querySelectorAll('.screenshot');
    images = [];
    figures.forEach(function (fig) {
      var imgEl = fig.querySelector('img');
      var capEl = fig.querySelector('figcaption');
      images.push({
        src: imgEl.src,
        alt: imgEl.alt,
        caption: capEl ? capEl.textContent : ''
      });
    });
    current = index;
    lbShow();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function lbClose() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function lbPrev() {
    current = (current - 1 + images.length) % images.length;
    lbShow();
  }

  function lbNext() {
    current = (current + 1) % images.length;
    lbShow();
  }

  lightbox.querySelector('.lightbox__close').addEventListener('click', lbClose);
  lightbox.querySelector('.lightbox__prev').addEventListener('click', lbPrev);
  lightbox.querySelector('.lightbox__next').addEventListener('click', lbNext);

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) lbClose();
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') lbClose();
    if (e.key === 'ArrowLeft') lbPrev();
    if (e.key === 'ArrowRight') lbNext();
  });

  // Attach click to all screenshot figures
  document.querySelectorAll('.screenshots').forEach(function (container) {
    container.querySelectorAll('.screenshot').forEach(function (fig, i) {
      fig.style.cursor = 'pointer';
      fig.addEventListener('click', function () {
        lbOpen(container, i);
      });
    });
  });

});