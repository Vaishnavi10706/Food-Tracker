/* ============================================
   CHART.JS INTEGRATION
   ============================================ */

let nutritionChart = null;

/**
 * Initialize and render nutrition chart
 */
function renderNutritionChart(nutriments, containerId) {
  const canvas = document.getElementById(containerId);
  if (!canvas) {
    console.error('Chart container not found');
    return;
  }

  // Destroy existing chart
  if (nutritionChart) {
    nutritionChart.destroy();
  }

  const ctx = canvas.getContext('2d');

  // Prepare data
  const data = {
    labels: ['Protein', 'Carbs', 'Fats', 'Sugars', 'Fiber'],
    datasets: [{
      data: [
        nutriments?.protein || 0,
        nutriments?.carbs || 0,
        nutriments?.fat || 0,
        nutriments?.sugars || 0,
        nutriments?.fiber || 0,
      ],
      backgroundColor: [
        '#4F46E5', // Protein - Indigo
        '#10B981', // Carbs - Green
        '#F59E0B', // Fats - Amber
        '#EF4444', // Sugars - Red
        '#8B5CF6', // Fiber - Purple
      ],
      borderWidth: 0,
      hoverOffset: 8,
    }]
  };

  const config = {
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 15,
            font: {
              size: 12,
              family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            },
            color: '#1D1D1F',
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: {
            size: 14,
            weight: '600',
          },
          bodyFont: {
            size: 13,
          },
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed || 0;
              return `${label}: ${value}g`;
            }
          }
        }
      },
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 1000,
        easing: 'easeOutQuart',
      },
      cutout: '60%',
    }
  };

  nutritionChart = new Chart(ctx, config);
}

/**
 * Destroy chart
 */
function destroyChart() {
  if (nutritionChart) {
    nutritionChart.destroy();
    nutritionChart = null;
  }
}

