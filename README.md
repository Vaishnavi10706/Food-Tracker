Food-Tracker – Scan, Search & Explore Food Products
Project Overview

Food-Tracker is a web-based food product tracker that integrates with the OpenFoodFacts API to provide detailed nutritional information, eco-scores, and alternatives for scanned or searched products. It enables users to:

Search products by name or category

Scan barcodes to retrieve product information instantly

View nutritional data (calories, fat, protein, carbs, fiber, sugar, salt)

Check NutriScore & EcoScore for healthier or sustainable choices

Discover better alternatives in the same product category

Tech Stack

Frontend: HTML, CSS, JavaScript

API Integration: OpenFoodFacts REST API

Caching: Local storage for fast barcode lookups

Optional Backend: Node.js + Express with .env for secure API key handling

Folder Structure
Food-Tracker/
├── CSS/
│   ├── components.css
│   ├── screens.css
│   └── style.css
├── JS/
│   ├── api.js
│   ├── barcode.js
│   ├── charts.js
│   ├── ui.js
│   └── utils.js
├── index.html
├── add.html
├── alt.html
└── scanner.html

Features

Product Search – Type in any product name to fetch info.

Barcode Scanning – Use your webcam or phone camera to scan product barcodes.

Nutritional Analysis – Displays calories, macronutrients, fiber, sugar, and salt.

Eco & NutriScore – Provides sustainability and health ratings.

Better Alternatives – Suggests healthier or more eco-friendly alternatives in the same category.

How to Run Locally

Clone the repository:

git clone <repo-url>


Open index.html in your browser (for frontend-only setup).

For secure API key usage, run the Node.js backend:

cd server
npm install
node server.js


Make sure your .env file contains:

OPENFOODFACTS_API_KEY=your_api_key_here

Highlights

Modular JavaScript architecture (api.js, barcode.js, ui.js, utils.js)

Caching to reduce repeated API calls

User-friendly interface with real-time search and scanning

Secure API key management using .env (optional backend)

Future Improvements

Mobile-responsive design enhancements

User authentication for personalized saved items

Progressive Web App (PWA) support for offline access

Integration with additional food databases for richer insights
