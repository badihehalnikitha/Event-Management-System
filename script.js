const API_URL = "http://localhost:5000/api";

// ---------- Mobile menu toggle ----------
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const hamburger = document.getElementById('hamburger');

menuToggle.addEventListener('click', () => {
   navLinks.classList.toggle('active');
   hamburger.className = navLinks.classList.contains('active')
      ? 'fas fa-times'
      : 'fas fa-bars';
});

// ---------- Smooth scroll for nav links ----------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
   anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
         target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
         });
      }
      navLinks.classList.remove('active');
      hamburger.className = 'fas fa-bars';
   });
});

// ---------- Portfolio filter ----------
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(button => {
   button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');

      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      portfolioItems.forEach(item => {
         const category = item.getAttribute('data-category');
         if (filter === 'all' || category === filter) {
            item.style.display = 'block';
            item.style.animation = 'fadeInUp 0.5s ease';
         } else {
            item.style.display = 'none';
         }
      });
   });
});

// ---------- Booking / consultation form -> backend API ----------
const bookingForm = document.querySelector('.booking-form form');

bookingForm.addEventListener('submit', async (e) => {
   e.preventDefault();

   const formData = new FormData(bookingForm);
   const data = Object.fromEntries(formData.entries());

   if (!data.name || !data.email || !data.phone || !data['event-type'] || !data.guests || !data.budget) {
      alert('Please fill in all required fields');
      return;
   }

   const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      eventType: data['event-type'],
      guests: parseInt(data.guests, 10),
      budgetRange: data.budget,
      message: data.message || '',
   };

   const submitBtn = bookingForm.querySelector('.submit-btn');
   const originalBtnText = submitBtn.textContent;
   submitBtn.disabled = true;
   submitBtn.textContent = 'Sending...';

   try {
      const res = await fetch(`${API_URL}/inquiries`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
         alert(result.message || 'Thank you for your inquiry!');
         bookingForm.reset();
      } else {
         alert(result.message || 'Something went wrong. Please try again.');
      }
   } catch (error) {
      alert('Could not reach the server. Please check your connection and try again.');
   } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
   }
});

// ---------- Scroll-in animation ----------
const observerOptions = {
   threshold: 0.1,
   rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
   entries.forEach(entry => {
      if (entry.isIntersecting) {
         entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
      }
   });
}, observerOptions);

document.querySelectorAll('.service-card, .testimonials-card').forEach(card => {
   observer.observe(card);
});
