/* ============================================
   UI RENDERING FUNCTIONS
   ============================================ */

/**
 * Render food card
 */
function renderFoodCard(product, container) {
  const card = document.createElement('div');
  card.className = 'food-card fade-in';
  card.onclick = () => {
    window.location.href = `add.html?code=${product.code}`;
  };

  const imageUrl = getImageUrl(product);
  
  card.innerHTML = `
    <img src="${imageUrl}" alt="${product.name}" class="food-card-image" loading="lazy" onerror="this.src='https://via.placeholder.com/400?text=No+Image'">
    <div class="food-card-content">
      <h3 class="food-card-title">${formatProductName(product.name)}</h3>
      <p class="food-card-brand">${product.brand || 'Unknown Brand'}</p>
      <div class="food-card-stats">
        <div class="food-card-stat">
          <span class="food-card-stat-label">Calories</span>
          <span class="food-card-stat-value">${formatNutrition(product.nutriments?.energy, ' kcal')}</span>
        </div>
        ${product.nutriScore ? `
        <div class="food-card-stat">
          <span class="food-card-stat-label">Grade</span>
          <span class="badge ${getGradeClass(product.nutriScore)}">${product.nutriScore.toUpperCase()}</span>
        </div>
        ` : ''}
      </div>
    </div>
  `;

  container.appendChild(card);
  
  // Preload image
  preloadImage(imageUrl).catch(() => {});
}

/**
 * Render skeleton loader
 */
function renderSkeletonCard(container) {
  const skeleton = document.createElement('div');
  skeleton.className = 'skeleton-card skeleton';
  skeleton.innerHTML = `
    <div class="skeleton-image skeleton"></div>
    <div class="skeleton-line skeleton"></div>
    <div class="skeleton-line skeleton skeleton-line-short"></div>
    <div class="skeleton-line skeleton skeleton-line-medium"></div>
  `;
  container.appendChild(skeleton);
}

/**
 * Render search result item
 */
function renderSearchResult(product, container) {
  const item = document.createElement('div');
  item.className = 'search-result-item';
  item.onclick = () => {
    window.location.href = `add.html?code=${product.code}`;
  };

  const imageUrl = getImageUrl(product);
  
  item.innerHTML = `
    <img src="${imageUrl}" alt="${product.name}" class="search-result-image" loading="lazy" onerror="this.src='https://via.placeholder.com/50?text=No+Image'">
    <div class="search-result-info">
      <div class="search-result-name">${formatProductName(product.name)}</div>
      <div class="search-result-brand">${product.brand || 'Unknown Brand'}</div>
    </div>
  `;

  container.appendChild(item);
}

/**
 * Render empty state
 */
function renderEmptyState(container, message = 'No items found', submessage = 'Try a different search term') {
  container.innerHTML = `
    <div class="empty-state">
      <div class="empty-state-icon">🔍</div>
      <div class="empty-state-text">${message}</div>
      <div class="empty-state-subtext">${submessage}</div>
    </div>
  `;
}

/**
 * Render nutrition grid
 */
function renderNutritionGrid(nutriments, container) {
  const nutritionData = [
    { label: 'Calories', value: nutriments?.energy, unit: ' kcal' },
    { label: 'Carbs', value: nutriments?.carbs, unit: 'g' },
    { label: 'Sugars', value: nutriments?.sugars, unit: 'g' },
    { label: 'Fat', value: nutriments?.fat, unit: 'g' },
    { label: 'Saturated Fat', value: nutriments?.saturatedFat, unit: 'g' },
    { label: 'Protein', value: nutriments?.protein, unit: 'g' },
    { label: 'Fiber', value: nutriments?.fiber, unit: 'g' },
    { label: 'Salt', value: nutriments?.salt, unit: 'g' },
  ];

  container.innerHTML = nutritionData.map(item => `
    <div class="nutrition-item">
      <div class="nutrition-label">${item.label}</div>
      <div class="nutrition-value">
        ${formatNutrition(item.value, '')}
        <span class="nutrition-unit">${item.unit}</span>
      </div>
    </div>
  `).join('');
}

/**
 * Clear container
 */
function clearContainer(container) {
  container.innerHTML = '';
}

/**
 * Show search results dropdown
 */
function showSearchResults(products, container) {
  clearContainer(container);
  
  if (products.length === 0) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'block';
  products.slice(0, 8).forEach(product => {
    renderSearchResult(product, container);
  });
}

/**
 * Hide search results dropdown
 */
function hideSearchResults(container) {
  container.style.display = 'none';
}

