/**
 * ResumeAI Pro – Main Application Script (Vanilla JS)
 * Handles global UI interactions, navigation, modals, toasts, and FAQ accordions.
 */

// Global Toast Notification System
const Toast = {
  container: null,

  init() {
    if (!this.container) {
      let el = document.getElementById('toast-container');
      if (!el) {
        el = document.createElement('div');
        el.id = 'toast-container';
        document.body.appendChild(el);
      }
      this.container = el;
    }
  },

  show(message, type = 'info', duration = 3500) {
    this.init();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';

    toast.innerHTML = `<span>${icon}</span><span style="flex: 1;">${this.escapeHTML(message)}</span>`;
    this.container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  success(msg) { this.show(msg, 'success'); },
  error(msg) { this.show(msg, 'error'); },
  info(msg) { this.show(msg, 'info'); },

  escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};

// Global DOM Ready Handlers
document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
  initFaqAccordion();
  initAnalyticsPlaceholder();
});

// Mobile Navigation Toggle
function toggleMobileMenu() {
  const navMenu = document.querySelector('.nav-links') || document.querySelector('.navigation-menu') || document.querySelector('nav');
  const toggleBtn = document.querySelector('.mobile-toggle');

  if (navMenu) {
    navMenu.classList.toggle('active');
    const isExpanded = navMenu.classList.contains('active');
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', isExpanded);
    }
  }
}

function initMobileNavigation() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-links') || document.querySelector('.navigation-menu') || document.querySelector('nav');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });

    // Close menu when clicking on any navigation link
    const links = navMenu.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking anywhere outside
    document.addEventListener('click', (e) => {
      if (!toggleBtn.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

// FAQ Accordion
function initFaqAccordion() {
  const faqGrid = document.querySelector('.faq-grid');
  const faqItems = document.querySelectorAll('.faq-item');

  if (!faqItems.length) return;

  // Initialize ARIA accessibility attributes
  faqItems.forEach((item, index) => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (questionBtn && answer) {
      const answerId = answer.id || `faq-answer-${index + 1}`;
      answer.id = answerId;
      questionBtn.setAttribute('aria-controls', answerId);
      questionBtn.setAttribute('aria-expanded', item.classList.contains('active') ? 'true' : 'false');
    }
  });

  // Event listener with delegation for reliable expand/collapse accordion behavior
  if (faqGrid) {
    faqGrid.addEventListener('click', (e) => {
      const questionBtn = e.target.closest('.faq-question');
      if (!questionBtn) return;

      const currentItem = questionBtn.closest('.faq-item');
      if (!currentItem) return;

      const isAlreadyActive = currentItem.classList.contains('active');

      // Collapse all FAQ items
      faqItems.forEach(item => {
        item.classList.remove('active');
        const btn = item.querySelector('.faq-question');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      // If it wasn't already active, expand the clicked question
      if (!isAlreadyActive) {
        currentItem.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  } else {
    // Direct event listener fallback
    faqItems.forEach(item => {
      const questionBtn = item.querySelector('.faq-question');
      if (questionBtn) {
        questionBtn.addEventListener('click', () => {
          const isAlreadyActive = item.classList.contains('active');
          faqItems.forEach(other => {
            other.classList.remove('active');
            const otherBtn = other.querySelector('.faq-question');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          });
          if (!isAlreadyActive) {
            item.classList.add('active');
            questionBtn.setAttribute('aria-expanded', 'true');
          }
        });
      }
    });
  }
}

// Analytics and SEO Measurement Placeholder
function initAnalyticsPlaceholder() {
  // Google Analytics 4 (GA4) Placeholder
  // To activate real tracking:
  // 1. Replace G-XXXXXXXXXX with your Google Analytics Measurement ID
  // 2. Uncomment the script snippet below in your production HTML
  /*
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
  */

  // Google Search Console meta verification is added to index.html <head>
  // Google AdSense tag placeholder can be mounted in template slots
}

// Export for module usage
window.Toast = Toast;
window.toggleMobileMenu = toggleMobileMenu;
window.initFaqAccordion = initFaqAccordion;
