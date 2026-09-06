/* ============================================
   RENTIVO — Dashboard JavaScript
   My Rentals, rental status, booking management
   ============================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initRentalTabs();
  initRentalTimeline();
});

// ── Rental Tabs (My Rentals page) ──
function initRentalTabs() {
  const tabs = document.querySelectorAll('#rentalTabs .tab');
  if (tabs.length === 0) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Show corresponding content
      const targetId = 'tab-' + tab.dataset.tab;
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });

      const target = document.getElementById(targetId);
      if (target) {
        target.classList.add('active');
        // Animate cards
        target.querySelectorAll('.rental-card').forEach((card, i) => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, i * 80);
        });
      }
    });
  });
}

// ── Rental Timeline Animation ──
function initRentalTimeline() {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;

  // Animate timeline items on load
  const items = timeline.querySelectorAll('.timeline__item');
  items.forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-10px)';
    setTimeout(() => {
      item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      item.style.opacity = '1';
      item.style.transform = 'translateX(0)';
    }, i * 120);
  });

  // Pulse animation for current status
  const currentDot = timeline.querySelector('.timeline__item.current .timeline__dot');
  if (currentDot) {
    currentDot.style.animation = 'pulse 2s infinite';
  }
}

// ── Rental Status Management ──
function updateRentalStatus(rentalId, newStatus) {
  // This would normally call an API
  if (typeof showToast === 'function') {
    showToast(`Rental status updated to: ${newStatus}`, 'success');
  }
}

// ── Extend Rental ──
function extendRental(rentalId) {
  if (typeof showToast === 'function') {
    showToast('Rental extension request submitted! We\'ll confirm availability shortly.', 'success');
  }
}

// ── Cancel Rental ──
function cancelRental(rentalId) {
  if (typeof showToast === 'function') {
    showToast('Are you sure you want to cancel this rental? Cancellation policies apply.', 'warning');
  }
}

// ── Return Rental ──
function initiateReturn(rentalId) {
  if (typeof showToast === 'function') {
    showToast('Return process initiated. You\'ll receive pickup instructions via email.', 'info');
  }
}

// ── Download Receipt ──
function downloadReceipt(rentalId) {
  if (typeof showToast === 'function') {
    showToast('Receipt downloaded successfully!', 'success');
  }
}
