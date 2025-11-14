/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

/**
 * Debounce function to limit API calls
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Format number with unit
 */
function formatNutrition(value, unit = 'g') {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }
  return ${Math.round(value)}${unit};
}

/**
 * Get grade color class
 */
function getGradeClass(grade) {
  if (!grade) return 'badge-grade';
  const gradeLower = grade.toLowerCase();
  return badge-grade badge-${gradeLower};
}

/**
 * Show loading overlay
 */
function showLoading(message = 'Loading...') {
  const overlay = document.createElement('div');
  overlay.className = 'loading-overlay';
  overlay.id = 'loading-overlay';
  overlay.innerHTML = `
    <div>
      <div class="loading-spinner"></div>
      <div class="loading-text">${message}</div>
    </div>
  `;
  document.body.appendChild(overlay);
}

/**
 * Hide loading overlay
 */
function hideLoading() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.remove();
  }
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = toast toast-${type};
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--card-bg);
    color: var(--text-primary);
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    z-index: 10000;
    animation: slideUp 0.3s ease;
  `;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * Get cached item from localStorage
 */
function getCachedItem(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Set cached item to localStorage
 */
function setCachedItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to cache item:', e);
  }
}

/**
 * Get recent scans from localStorage
 */
function getRecentScans() {
  return getCachedItem('recentScans') || [];
}

/**
 * Add to recent scans
 */
function addToRecentScans(product) {
  const recent = getRecentScans();
  // Remove if already exists
  const filtered = recent.filter(item => item.code !== product.code);
  // Add to beginning
  filtered.unshift(product);
  // Keep only last 10
  const limited = filtered.slice(0, 10);
  setCachedItem('recentScans', limited);
}

/**
 * Preload image
 */
function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Format product name
 */
function formatProductName(name) {
  if (!name) return 'Unknown Product';
  return name.length > 60 ? name.substring(0, 60) + '...' : name;
}

/**
 * Get image URL with fallback (for normalized products)
 */
function getImageUrl(product) {
  if (product.image_url) {
    return product.image_url;
  }
  return 'https://via.placeholder.com/400?text=No+Image';
}