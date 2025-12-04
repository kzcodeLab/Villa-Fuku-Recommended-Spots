import { spots, categories } from './spots.js';

document.addEventListener('DOMContentLoaded', () => {
  renderNavigation();
  renderContent();
});

function renderNavigation() {
  const navContainer = document.getElementById('category-nav');

  categories.forEach(cat => {
    const btn = document.createElement('a');

    // Check if this is an external link
    if (cat.external_link) {
      btn.href = cat.external_link;
      btn.target = '_blank';
      btn.rel = 'noopener noreferrer';
    } else {
      btn.href = `#${cat.id}`;
    }

    btn.className = 'nav-card';
    btn.innerHTML = `
      <div class="nav-card-image-wrapper">
        <img src="${cat.image}" alt="${cat.label_en}" class="nav-card-image">
      </div>
      <div class="nav-card-label">
        <span class="nav-label-en">${cat.label_en}</span>
      </div>
    `;
    navContainer.appendChild(btn);
  });
}

function renderContent() {
  const mainContent = document.getElementById('main-content');

  categories.forEach(cat => {
    // Filter spots for this category
    const categorySpots = spots.filter(spot => spot.category === cat.id);

    if (categorySpots.length === 0) return;

    // Create Section
    const section = document.createElement('section');
    section.id = cat.id;
    section.className = 'category-section';

    // Header
    const header = document.createElement('div');
    header.className = 'category-header';
    header.innerHTML = `
      <h2>${cat.label_jp} <span style="font-size: 0.6em; display:block; color: var(--color-text-light);">${cat.label_en}</span></h2>
      <p class="subtitle">${cat.label_cn}</p>
    `;
    section.appendChild(header);

    // Grid
    const grid = document.createElement('div');
    grid.className = 'spots-grid';

    categorySpots.forEach(spot => {
      const card = createSpotCard(spot);
      grid.appendChild(card);
    });

    section.appendChild(grid);
    mainContent.appendChild(section);
  });
}

function createSpotCard(spot) {
  const card = document.createElement('article');
  card.className = 'spot-card';

  // Generate tags HTML
  // Generate tags HTML
  // Filter out tags that match the category (case-insensitive)
  const visibleTags = spot.tags ? spot.tags.filter(tag => tag.toLowerCase() !== spot.category.toLowerCase()) : [];

  const tagsHtml = visibleTags.length > 0 ? `
        <div class="card-tags">
            ${visibleTags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
    ` : '';

  card.innerHTML = `
    <img src="${spot.image}" alt="${spot.name_en}" class="card-image" loading="lazy">
    <div class="card-content">
      <div class="card-header-row">
        <span class="card-category">${spot.category}</span>
        ${tagsHtml}
      </div>
      <h3 class="card-title">${spot.name_jp}</h3>
      <h4 class="card-title-sub">${spot.name_en === spot.name_cn ? spot.name_en : `${spot.name_en} / ${spot.name_cn}`}</h4>
      
      <div class="card-desc">
        <p>${spot.description_jp}</p>
        <p class="text-sm text-gray-600 mt-2">${spot.description_en}</p>
        <p class="lang-cn mt-1">${spot.description_cn}</p>
      </div>
      
      <div class="card-info">
        <div class="info-row">
          <span class="info-icon">🕒</span>
          <span>${spot.hours}</span>
        </div>
        <div class="info-row">
          <span class="info-icon">💳</span>
          <span>${spot.payment || '-'}</span>
        </div>
        <div class="info-row">
          <span class="info-icon">💰</span>
          <span>${spot.price}</span>
        </div>
        <div class="info-row">
          <span class="info-icon">📍</span>
          <div class="address-container">
            <p>${spot.address_jp || spot.address}</p>
            ${spot.address_en ? `<p class="text-sm text-gray-600">${spot.address_en}</p>` : ''}
          </div>
        </div>
        <div class="info-row">
          <span>${spot.access_en || spot.access || '-'}</span>
        </div>
      </div>
      
      <a href="${spot.map_link}" target="_blank" rel="noopener noreferrer" class="map-btn">
        Google Map
      </a>
    </div>
  `;

  return card;
}
