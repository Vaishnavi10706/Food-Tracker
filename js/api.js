/* ============================================
   API FUNCTIONS - OpenFoodFacts Integration
   ============================================ */

// Load configuration (config.js must be loaded before this file)
const API_BASE = CONFIG?.OPENFOODFACTS_API_BASE || 'https://world.openfoodfacts.org';
const CACHE_DURATION = CONFIG?.CACHE_DURATION || 1000 * 60 * 60; // 1 hour

// Optional: Add API key to requests if needed in the future
// const API_KEY = CONFIG?.OPENFOODFACTS_API_KEY || '';

/**
 * Search for products
 */
async function searchProducts(query, page = 1) {
  if (!query || query.trim().length === 0) {
    return { products: [], count: 0 };
  }

  try {
    const url = `${API_BASE}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=20&page=${page}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Search failed');
    }
    
    const data = await response.json();
    return {
      products: data.products || [],
      count: data.count || 0
    };
  } catch (error) {
    console.error('Search error:', error);
    return { products: [], count: 0 };
  }
}

/**
 * Get product by barcode
 */
async function getProductByBarcode(barcode) {
  if (!barcode) {
    return null;
  }

  // Check cache first
  const cacheKey = `product_${barcode}`;
  const cached = getCachedItem(cacheKey);
  if (cached && cached.timestamp && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const url = `${API_BASE}/api/v0/product/${barcode}.json`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Product not found');
    }
    
    const data = await response.json();
    
    if (data.status === 0 || !data.product) {
      return null;
    }

    const product = normalizeProduct(data.product);
    
    // Cache the result
    setCachedItem(cacheKey, {
      data: product,
      timestamp: Date.now()
    });

    return product;
  } catch (error) {
    console.error('Barcode lookup error:', error);
    return null;
  }
}

/**
 * Normalize product data from API
 */
function normalizeProduct(product) {
  return {
    code: product.code || product._id || '',
    name: product.product_name || product.product_name_en || 'Unknown Product',
    brand: product.brands || product.brand || '',
    image_url: getImageUrl(product),
    nutriments: {
      energy: product.nutriments?.['energy-kcal_100g'] || product.nutriments?.['energy-kcal'] || null,
      carbs: product.nutriments?.carbohydrates_100g || product.nutriments?.carbohydrates || null,
      sugars: product.nutriments?.sugars_100g || product.nutriments?.sugars || null,
      fat: product.nutriments?.fat_100g || product.nutriments?.fat || null,
      saturatedFat: product.nutriments?.['saturated-fat_100g'] || product.nutriments?.['saturated-fat'] || null,
      protein: product.nutriments?.proteins_100g || product.nutriments?.proteins || null,
      fiber: product.nutriments?.fiber_100g || product.nutriments?.fiber || null,
      salt: product.nutriments?.salt_100g || product.nutriments?.salt || null,
    },
    nutriScore: product.nutriscore_grade || product.nutriscore_grade || null,
    ecoScore: product.ecoscore_grade || product.ecoscore_grade || null,
    categories: product.categories || '',
    ingredients: product.ingredients_text || '',
    raw: product // Keep raw data for advanced features
  };
}

/**
 * Get better alternatives (similar products with better scores)
 */
async function findAlternatives(product) {
  if (!product || !product.categories) {
    return [];
  }

  try {
    // Extract main category
    const categories = product.categories.split(',').map(c => c.trim());
    const mainCategory = categories[0] || '';
    
    if (!mainCategory) {
      return [];
    }

    // Search for products in same category
    const searchResult = await searchProducts(mainCategory, 1);
    const alternatives = searchResult.products
      .map(p => normalizeProduct(p))
      .filter(p => {
        // Filter: same category, different product, better or equal nutri/eco score
        if (p.code === product.code) return false;
        if (!p.nutriScore || !p.ecoScore) return false;
        
        const currentNutri = product.nutriScore?.toLowerCase() || 'e';
        const currentEco = product.ecoScore?.toLowerCase() || 'e';
        const altNutri = p.nutriScore?.toLowerCase() || 'e';
        const altEco = p.ecoScore?.toLowerCase() || 'e';
        
        // Grade comparison: a < b < c < d < e
        const gradeOrder = { 'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5 };
        const nutriBetter = gradeOrder[altNutri] <= gradeOrder[currentNutri];
        const ecoBetter = gradeOrder[altEco] <= gradeOrder[currentEco];
        
        return nutriBetter || ecoBetter;
      })
      .sort((a, b) => {
        // Sort by better scores first
        const gradeOrder = { 'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5 };
        const aNutri = gradeOrder[a.nutriScore?.toLowerCase() || 'e'];
        const bNutri = gradeOrder[b.nutriScore?.toLowerCase() || 'e'];
        return aNutri - bNutri;
      })
      .slice(0, 6); // Top 6 alternatives

    return alternatives;
  } catch (error) {
    console.error('Alternatives search error:', error);
    return [];
  }
}

/**
 * Helper to get image URL from product
 */
function getImageUrl(product) {
  if (product.image_url) {
    return product.image_url;
  }
  if (product.image_front_url) {
    return product.image_front_url;
  }
  if (product.images && product.images.front) {
    const imageId = product.images.front[Object.keys(product.images.front)[0]];
    if (imageId) {
      return `https://images.openfoodfacts.org/images/products${imageId}`;
    }
  }
  return 'https://via.placeholder.com/400?text=No+Image';
}

