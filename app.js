// Act 29 Mining Training – Main Application Logic

let scores = JSON.parse(localStorage.getItem('miningScores') || '{}');
let currentModule = null;
let currentQuiz = null;
let questionIndex = 0;
let correctAnswers = 0;
let quizStartTime = 0;

const els = {
  moduleGrid: document.getElementById('moduleGrid'),
  searchInput: document.getElementById('searchInput'),
  completedCount: document.getElementById('completedCount'),
  overallPass: document.getElementById('overallPass'),
  moduleTitle: document.getElementById('moduleTitle'),
  videoPlayer: document.getElementById('videoPlayer'),
  dashCompleted: document.getElementById('dashCompleted'),
  dashPassRate: document.getElementById('dashPassRate'),
  dashCertificates: document.getElementById('dashCertificates'),
  completedModulesList: document.getElementById('completedModulesList'),
  breadcrumbNav: document.getElementById('breadcrumbNav'),
  breadcrumbItems: document.getElementById('breadcrumbItems'),
  modulesContainer: document.getElementById('modulesContainer'),
  certList: document.getElementById('certList'),
  moduleAccordion: document.getElementById('moduleAccordion'),
  resourcesAccordion: document.getElementById('resourcesAccordion')
};

function hideAllScreens() {
  document.querySelectorAll(
    '#welcomeScreen, #modulesContainer, #descriptionsScreen, #resourcesScreen, #moduleView, #videoScreen, #quizScreen, #resultsScreen, #certificatesScreen, #communityScreen, #dashboardScreen, #aboutScreen, #contactScreen'
  ).forEach(el => el.classList.add('d-none'));
}

function showScreen(id) {
  hideAllScreens();
  document.getElementById(id).classList.remove('d-none');
  updateBreadcrumbs(id);
  if (id !== 'videoScreen') els.videoPlayer.src = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateBreadcrumbs(screen) {
  els.breadcrumbNav.classList.remove('d-none');
  els.breadcrumbItems.innerHTML = '<li class="breadcrumb-item"><a href="#" onclick="showHome(); return false;">Home</a></li>';

  if (screen === 'welcomeScreen') {
    els.breadcrumbNav.classList.add('d-none');
    return;
  }

  let title = '';
  if (screen === 'modulesContainer') title = 'Modules';
  else if (screen === 'descriptionsScreen') title = 'Descriptions';
  else if (screen === 'resourcesScreen') title = 'Resources';
  else if (screen === 'moduleView') title = moduleNames[currentModule] || 'Module';
  else if (screen === 'videoScreen') title = 'Video';
  else if (screen === 'quizScreen') title = 'Quiz';
  else if (screen === 'resultsScreen') title = 'Results';
  else if (screen === 'certificatesScreen') title = 'Certificates';
  else if (screen === 'communityScreen') title = 'Community';
  else if (screen === 'dashboardScreen') title = 'Dashboard';
  else if (screen === 'aboutScreen') title = 'About Us';
  else if (screen === 'contactScreen') title = 'Contact Us';

  if (title) {
    if (['moduleView', 'videoScreen', 'quizScreen', 'resultsScreen'].includes(screen)) {
      els.breadcrumbItems.innerHTML += '<li class="breadcrumb-item"><a href="#" onclick="showModulesList(); return false;">Modules</a></li>';
      if (screen !== 'moduleView') {
        els.breadcrumbItems.innerHTML +=
          '<li class="breadcrumb-item"><a href="#" onclick="loadModule(currentModule); return false;">' +
          (moduleNames[currentModule] || 'Module') + '</a></li>';
      }
    }
    els.breadcrumbItems.innerHTML +=
      '<li class="breadcrumb-item active" aria-current="page">' + title + '</li>';
  } else {
    els.breadcrumbNav.classList.add('d-none');
  }
}

function updateProgress() {
  const done = Object.keys(scores).length;
  const passed = Object.values(scores).filter(v => v?.passed).length;
  const rate = done ? Math.round((passed / done) * 100) : 0;

  if (els.completedCount) els.completedCount.textContent = done;
  if (els.overallPass) els.overallPass.textContent = rate + '%';
  if (els.dashCompleted) els.dashCompleted.textContent = `${done}/24`;
  if (els.dashPassRate) els.dashPassRate.textContent = rate + '%';
  if (els.dashCertificates) els.dashCertificates.textContent = passed;
}

function sortModules(sortType = 'name-asc') {
  const modulesArray = Object.entries(moduleNames).map(([key, name]) => ({
    key,
    name,
    progress: scores[key]?.percentage || 0,
    passed: scores[key]?.passed || false
  }));

  if (sortType === 'name-asc') modulesArray.sort((a, b) => a.name.localeCompare(b.name));
  else if (sortType === 'name-desc') modulesArray.sort((a, b) => b.name.localeCompare(a.name));
  else if (sortType === 'progress-desc') modulesArray.sort((a, b) => b.progress - a.progress);

  const activeFilter = document.querySelector('[data-filter].active')?.dataset.filter || 'all';
  const term = els.searchInput?.value.trim().toLowerCase() || '';

  els.moduleGrid.innerHTML = '';

  modulesArray.forEach(({ key, name }) => {
    if (term && !name.toLowerCase().includes(term)) return;
    if (activeFilter === 'basic' && advancedModules.includes(key)) return;
    if (activeFilter === 'advanced' && !advancedModules.includes(key)) return;

    const card = document.createElement('div');
    card.className = 'col-12 col-sm-6 col-lg-4 col-xl-3';
    card.innerHTML = `
      <div class="module-card ${advancedModules.includes(key) ? 'advanced' : ''}" data-module="${key}">
        <div class="card-body">
          <div class="icon-wrapper"><i class="bi ${moduleIcons[key] || 'bi-shield-check'}"></i></div>
          <h6 class="module-name">${name}</h6>
          ${scores[key] ? `<span class="progress-badge ${scores[key].passed ? 'bg-success-soft' : 'bg-warning-soft'}">${scores[key].percentage}%</span>` : ''}
        </div>
      </div>
    `;
    card.querySelector('.module-card').addEventListener('click', () => loadModule(key));
    els.moduleGrid.appendChild(card);
  });
}

function renderModules(filter = 'all', term = '') {
  if (!els.moduleGrid) return;
  els.moduleGrid.innerHTML = '';
  Object.entries(moduleNames).forEach(([key, name]) => {
    if (term && !name.toLowerCase().includes(term.toLowerCase())) return;
    if (filter === 'basic' && advancedModules.includes(key)) return;
    if (filter === 'advanced' && !advancedModules.includes(key)) return;

    const card = document.createElement('div');
    card.className = 'col-12 col-sm-6 col-lg-4 col-xl-3';
    card.innerHTML = `
      <div class="module-card ${advancedModules.includes(key) ? 'advanced' : ''}" data-module="${key}">
        <div class="card-body">
          <div class="icon-wrapper"><i class="bi ${moduleIcons[key] || 'bi-shield-check'}"></i></div>
          <h6 class="module-name">${name}</h6>
          ${scores[key] ? `<span class="progress-badge ${scores[key].passed ? 'bg-success-soft' : 'bg-warning-soft'}">${scores[key].percentage}%</span>` : ''}
        </div>
      </div>
    `;
    card.querySelector('.module-card').addEventListener('click', () => loadModule(key));
    els.moduleGrid.appendChild(card);
  });
  updateProgress();
}

function loadModule(key) {
  currentModule = key;
  if (key === 'community_chat') {
    showScreen('communityScreen');
  } else {
    els.moduleTitle.textContent = moduleNames[key] || key;
    showScreen('moduleView');
  }
}

function startVideo() {
  if (!currentModule || !videos[currentModule]) return;
  els.videoPlayer.src = videos[currentModule] + "?autoplay=1&rel=0";
  showScreen('videoScreen');
}

function renderCompletedModules() {
  if (!els.completedModulesList) return;
  els.completedModulesList.innerHTML = '';
  if (Object.keys(scores).length === 0) {
    els.completedModulesList.innerHTML = '<li class="list-group-item text-center text-muted">No modules completed yet</li>';
    return;
  }
  Object.entries(scores)
    .sort((a, b) => new Date(b[1].timestamp) - new Date(a[1].timestamp))
    .forEach(([key, data]) => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.innerHTML = `
        <div>
          <strong>${moduleNames[key] || key}</strong><br>
          <small class="text-muted">${data.timestamp}</small>
        </div>
        <span class="badge ${data.passed ? 'bg-success' : 'bg-danger'} rounded-pill fs-6">
          ${data.percentage}%
        </span>
      `;
      els.completedModulesList.appendChild(li);
    });
}

function showCertificates() {
  renderCertificates();
  showScreen('certificatesScreen');
}

function renderCertificates() {
  const container = document.getElementById('certList');
  if (!container) return;

  container.innerHTML = '';

  const completed = Object.entries(scores)
    .filter(([_, data]) => data.passed)
    .sort((a, b) => new Date(b[1].timestamp) - new Date(a[1].timestamp));

  if (completed.length === 0) {
    container.innerHTML = `
      <div class="alert alert-info text-center">
        You haven't earned any certificates yet.<br>
        Complete some modules to get started!
      </div>
    `;
    return;
  }

  completed.forEach(([key, data]) => {
    const item = document.createElement('div');
    item.className = 'list-group-item d-flex justify-content-between align-items-center';
    item.innerHTML = `
      <div>
        <strong>${moduleNames[key] || key}</strong><br>
        <small class="text-muted">Completed: ${data.timestamp} • Score: ${data.percentage}%</small>
      </div>
      <button class="btn btn-success btn-sm" onclick="downloadSpecificCertificate('${key}')">
        Download PDF
      </button>
    `;
    container.appendChild(item);
  });
}

function showDescriptions() {
  renderDescriptions();
  showScreen('descriptionsScreen');
}

function renderDescriptions() {
  const accordion = document.getElementById('moduleAccordion');
  if (!accordion) return;

  accordion.innerHTML = '';

  Object.entries(moduleNames).forEach(([key, name], index) => {
    const desc = moduleDescriptions[key] || "Description not available.";
    const item = document.createElement('div');
    item.className = 'accordion-item';
    item.innerHTML = `
      <h2 class="accordion-header" id="heading${index}">
        <button class="accordion-button ${index === 0 ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse"
                data-bs-target="#collapse${index}" aria-expanded="${index === 0}" aria-controls="collapse${index}">
          ${name}
        </button>
      </h2>
      <div id="collapse${index}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}"
           aria-labelledby="heading${index}" data-bs-parent="#moduleAccordion">
        <div class="accordion-body">
          ${desc.replace(/\n/g, '<br>')}
        </div>
      </div>
    `;
    accordion.appendChild(item);
  });
}

function showResources() {
  renderResources();
  showScreen('resourcesScreen');
}

function renderResources() {
  const accordion = document.getElementById('resourcesAccordion');
  if (!accordion) return;

  accordion.innerHTML = '';

  Object.entries(moduleNames).forEach(([key, name], index) => {
    const res = moduleResources[key] || "No additional resources available for this module.";
    const item = document.createElement('div');
    item.className = 'accordion-item';
    item.innerHTML = `
      <h2 class="accordion-header" id="resHeading${index}">
        <button class="accordion-button ${index === 0 ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse"
                data-bs-target="#resCollapse${index}" aria-expanded="${index === 0}" aria-controls="resCollapse${index}">
          ${name}
        </button>
      </h2>
      <div id="resCollapse${index}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}"
           aria-labelledby="resHeading${index}" data-bs-parent="#resourcesAccordion">
        <div class="accordion-body">
          ${res.replace(/\n/g, '<br>')}
        </div>
      </div>
    `;
    accordion.appendChild(item);
  });
}

function showHome() {
  showScreen('welcomeScreen');
}

function showModulesList() {
  const activeFilter = document.querySelector('[data-filter].active')?.dataset.filter || 'all';
  renderModules(activeFilter, els.searchInput?.value.trim() || '');
  showScreen('modulesContainer');
}

function showDashboard() {
  renderCompletedModules();
  showScreen('dashboardScreen');
}

function showCommunity() {
  showScreen('communityScreen');
}

function showAbout() {
  showScreen('aboutScreen');
}

function showContact() {
  showScreen('contactScreen');
}

function backToModule() {
  els.videoPlayer.src = '';
  loadModule(currentModule);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('watchVideo')?.addEventListener('click', startVideo);
  document.getElementById('startQuiz')?.addEventListener('click', startQuiz);
  document.getElementById('nextBtn')?.addEventListener('click', nextQuestion);

  els.searchInput?.addEventListener('input', () => {
    const filter = document.querySelector('[data-filter].active')?.dataset.filter || 'all';
    renderModules(filter, els.searchInput.value.trim());
  });

  document.querySelectorAll('[data-filter]').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('[data-filter]').forEach(el => el.classList.remove('active'));
      item.classList.add('active');
      document.getElementById('filterLabel').textContent = `Filter: ${item.textContent}`;
      renderModules(item.dataset.filter, els.searchInput?.value.trim() || '');
    });
  });

  document.querySelectorAll('[data-sort]').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      document.getElementById('sortLabel').textContent = `Sort: ${item.textContent}`;
      sortModules(item.dataset.sort);
    });
  });

  document.querySelectorAll('[data-view]').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      document.getElementById('viewLabel').textContent = item.textContent;
      if (item.dataset.view === 'list') {
        els.modulesContainer.classList.add('module-list-view');
      } else {
        els.modulesContainer.classList.remove('module-list-view');
      }
    });
  });

  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 992) {
        bootstrap.Collapse.getInstance(document.getElementById('navbarContent'))?.hide();
      }
    });
  });

  document.querySelector('.contact-form')?.addEventListener('submit', e => {
    // FormSubmit handles the actual send; we just give feedback
  });

  // Initialization
  showHome();
  renderModules();
  renderCompletedModules();
  updateProgress();
  document.querySelector('[data-filter="all"]')?.classList.add('active');
});
