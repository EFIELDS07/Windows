/* ========================= Begalle Bros - script.js Interactive behavior & polished UX ========================= */

/* -------------------- Helpers -------------------- */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/* -------------------- MOBILE NAV -------------------- */
const navToggle = $("#navToggle");
const navLinks = $("#mobileMenu");
const navbar = $("#navbar");
if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
        navLinks.classList.toggle("open");
    });
}
if (navbar) {
    window.addEventListener("scroll", () => {
        navbar.classList.toggle("scrolled", window.scrollY > 50);
    });
}

/* -------------------- SMOOTH SCROLL -------------------- */
$$('nav a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        if (navLinks) navLinks.classList.remove("open");
        target.scrollIntoView({ behavior: "smooth" });
    });
});

/* -------------------- HERO SLIDESHOW -------------------- */
(function heroSlideshow(){
    const slides = $$(".slide");
    if (!slides.length) return;
    let currentSlide = 0;
    function switchSlide() {
        slides.forEach(s => s.classList.remove("active"));
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add("active");
    }
    // start with first active if none
    if (!slides.some(s => s.classList.contains("active"))) slides[0].classList.add("active");
    setInterval(switchSlide, 3000);
})();

/* ---------- TESTIMONIAL CAROUSEL (auto + pause) ---------- */
(function testimonials(){
    const track = $('.testimonial-track');
    if(!track) return;
    const items = $$('.testimonial');
    if(!items.length) return;
    let index = 0;
    const speed = 3500;
    let t;
    function update(){
        const w = items[0].getBoundingClientRect().width + 20; // approximate gap
        track.style.transform = `translateX(-${index * w}px)`;
    }
    function next(){ index = (index + 1) % items.length; update(); }
    function start(){ t = setInterval(next, speed); }
    function stop(){ clearInterval(t); }
    // pause on hover of track's parent if present
    const parent = track.parentElement;
    if (parent) {
        parent.addEventListener('mouseenter', stop);
        parent.addEventListener('mouseleave', start);
    }
    window.addEventListener('resize', update);
    update();
    start();
})();

/* ---------- GALLERY LIGHTBOX (click to open) ---------- */
(function lightbox(){
    const imgs = $$('.gallery-grid img');
    if(!imgs.length) return;
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    const img = document.createElement('img');
    lb.appendChild(img);
    document.body.appendChild(lb);
    imgs.forEach(i => {
        i.addEventListener('click', () => {
            img.src = i.src;
            lb.classList.add('open');
        });
    });
    lb.addEventListener('click', (e) => {
        if (e.target === lb || e.target === img) lb.classList.remove('open');
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && lb.classList.contains('open')) lb.classList.remove('open');
    });
})();

/* ---------- BEFORE/AFTER SLIDER (mouse + touch) ---------- */
(function beforeAfter(){
    const container = document.querySelector('.before-after');
    if(!container) return;
    const after = container.querySelector('.after');
    const slider = container.querySelector('.slider');
    if(!after || !slider) return;
    let dragging = false;
    function setPos(clientX){
        const rect = container.getBoundingClientRect();
        let pos = clientX - rect.left;
        pos = Math.max(0, Math.min(pos, rect.width));
        after.style.width = pos + 'px';
        slider.style.left = pos + 'px';
    }
    slider.addEventListener('mousedown', ()=>dragging=true);
    window.addEventListener('mouseup', ()=>dragging=false);
    window.addEventListener('mousemove', (e)=>{ if(dragging) setPos(e.clientX); });

    // touch support
    slider.addEventListener('touchstart', ()=>dragging=true,{passive:true});
    window.addEventListener('touchend', ()=>dragging=false);
    window.addEventListener('touchmove', (e)=>{ if(dragging) setPos(e.touches[0].clientX); },{passive:true});

    // initialize center (defer if width is 0)
    function init() {
        const rect = container.getBoundingClientRect();
        if (rect.width === 0) {
            requestAnimationFrame(init);
            return;
        }
        const mid = Math.round(rect.width / 2);
        after.style.width = mid + 'px';
        slider.style.left = mid + 'px';
    }
    init();
})();

/* ---------- REVEAL ON SCROLL (IntersectionObserver) ---------- */
(function reveals(){
    const elements = $$('.reveal');
    if (!elements.length) return;
    const obs = new IntersectionObserver((entries, o)=> {
        entries.forEach(e=>{
            if(e.isIntersecting){
                e.target.classList.add('show');
                o.unobserve(e.target);
            }
        });
    }, {threshold:0.2});
    elements.forEach(el => obs.observe(el));
})();

/* ---------- PERFORMANCE: lazy load hints for gallery images ---------- */
$$('.gallery-grid img').forEach(img => {
    if(!img.hasAttribute('loading')) img.setAttribute('loading','lazy');
});

/* ---------- OPTIONAL: keyboard close for any lightbox already created ---------- */
document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const lb = document.querySelector('.lightbox.open');
    if (lb) lb.classList.remove('open');
});

/* -------------------- SCROLL REVEAL FOR MISSION SECTION -------------------- */
const missionText = document.querySelector('.mission-text');
const missionPhoto = document.querySelector('.mission-photo');
function revealMission() {
    const trigger = window.innerHeight * 0.8;
    if (missionText) {
        const rect1 = missionText.getBoundingClientRect();
        if (rect1.top < trigger) missionText.style.opacity = 1;
    }
    if (missionPhoto) {
        const rect2 = missionPhoto.getBoundingClientRect();
        if (rect2.top < trigger) missionPhoto.style.opacity = 1;
    }
}
window.addEventListener('scroll', revealMission);
window.addEventListener('load', revealMission);

/* ======================================================
     INTERACTIVE MISSION SECTION: PARALLAX + PARTICLES + PULSE
     ====================================================== */
// Parallax movement for mission image
const missionImg = document.querySelector(".mission-photo img");
const missionPhotoWrap = document.querySelector(".mission-photo");
if (missionImg && missionPhotoWrap) {
    missionPhotoWrap.addEventListener("mousemove", (e) => {
        const rect = missionPhotoWrap.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 16;
        missionImg.style.transform = `scale(1.05) translate(${x}px, ${y}px)`;
    });
    missionPhotoWrap.addEventListener("mouseleave", () => {
        missionImg.style.transform = "scale(1)";
    });
}

// Pulse animation when mission section enters view
const missionTitle = document.querySelector(".mission-text h2");
function pulseTitleOnScroll() {
    if (!missionTitle) return;
    const rect = missionTitle.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.6) {
        missionTitle.classList.add("scrolled");
        window.removeEventListener("scroll", pulseTitleOnScroll);
    }
}
window.addEventListener("scroll", pulseTitleOnScroll);

// Floating particles generator
function createMissionParticles() {
    const target = document.querySelector(".mission-split");
    if (!target) return;
    const container = document.createElement("div");
    container.classList.add("mission-particles");
    target.appendChild(container);
    for (let i = 0; i < 22; i++) {
        const p = document.createElement("span");
        p.style.left = Math.random() * 100 + "%";
        p.style.bottom = "-40px";
        p.style.animationDelay = (Math.random() * 10) + "s";
        p.style.opacity = (Math.random() * 0.4 + 0.2).toString();
        container.appendChild(p);
    }
}
createMissionParticles();

/* ======================================================
     PROCESS SECTION INTERACTIVITY
     ====================================================== */
const processSection = document.querySelector(".process-section");
const processSteps = document.querySelectorAll(".process-step");
const processIcons = document.querySelectorAll(".process-icon");
function revealProcess() {
    if (!processSection) return;
    const rect = processSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.75) {
        processSection.classList.add("revealed");
        processSteps.forEach((step, i) => {
            setTimeout(() => {
                step.classList.add("revealed");
                if (processIcons[i]) processIcons[i].classList.add("active");
            }, i * 250);
        });
        window.removeEventListener("scroll", revealProcess);
    }
}
window.addEventListener("scroll", revealProcess);

/* ======================================================
     ABOUT US SCROLL REVEAL
     ====================================================== */
const aboutSection = document.querySelector(".about-section");
function revealAbout() {
    if (!aboutSection) return;
    const rect = aboutSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.75) {
        aboutSection.classList.add("revealed");
        window.removeEventListener("scroll", revealAbout);
    }
}
window.addEventListener("scroll", revealAbout);

/* ======================================================
     TESTIMONIALS: SCROLL REVEAL
     ====================================================== */
const testimonialHeader = document.querySelector(".testimonials-header");
const testimonialCarousel = document.querySelector(".testimonials-carousel");
function revealTestimonials() {
    if (!testimonialHeader || !testimonialCarousel) return;
    const rect = testimonialHeader.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) {
        testimonialHeader.classList.add("show");
        testimonialCarousel.classList.add("show");
        window.removeEventListener("scroll", revealTestimonials);
    }
}
window.addEventListener("scroll", revealTestimonials);

/* ======================================================
     TESTIMONIALS: AUTO-SCROLL + DRAG SCROLL
     ====================================================== */
(function carouselDragAuto(){
    const carousel = document.getElementById("testimonialsCarousel");
    if (!carousel) return;
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    carousel.addEventListener("mousedown", (e) => {
        isDown = true;
        carousel.classList.add("dragging");
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });
    carousel.addEventListener("mouseleave", () => { isDown = false; carousel.classList.remove("dragging"); });
    carousel.addEventListener("mouseup", () => { isDown = false; carousel.classList.remove("dragging"); });
    carousel.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2.8; // scroll speed
        carousel.scrollLeft = scrollLeft - walk;
    });

    // touch support for dragging
    carousel.addEventListener("touchstart", (e) => {
        isDown = true;
        startX = e.touches[0].pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    }, {passive:true});
    carousel.addEventListener("touchend", () => { isDown = false; });
    carousel.addEventListener("touchmove", (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2.8;
        carousel.scrollLeft = scrollLeft - walk;
    }, {passive:true});

    // Auto-scroll (looping)
    const autoInterval = setInterval(() => {
        if (!isDown) {
            carousel.scrollLeft += 2;
            if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth) {
                carousel.scrollLeft = 0;
            }
        }
    }, 30);

    // duplicate testimonials track for continuous loop if present
    const testiTrack = document.querySelector(".testi-track");
    if (testiTrack) {
        const clone = testiTrack.innerHTML;
        testiTrack.innerHTML += clone;
    }
})();
/* ======================================================
     CONTACT FORM INTERACTIVITY
     ====================================================== */
const contactInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
if (contactInputs.length) {
    contactInputs.forEach(input => {
        input.addEventListener('focus', () => { input.style.transform = "scale(1.03)"; });
        input.addEventListener('blur', () => { input.style.transform = "scale(1)"; });
    });
}
document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.querySelector(".nav-menu");

  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("show");
  });
});
document.querySelectorAll('#mobileMenu a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('show');
  });
});

