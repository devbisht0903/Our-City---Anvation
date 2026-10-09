/**
 * OurCity — Application Logic & Controller
 * Apple-Style Professional Minimalist Implementation
 * High-Precision SVG India Map Pan & Zoom, Left-Aligned Back Navigation,
 * Account Logout, Before/After Slider, and Transparency Hub.
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Global Application State
  // ---------------------------------------------------------------------------
  const state = {
    currentCityId: 'mumbai',
    currentProjectId: 'MUM-TUN-01',
    activeInterface: 'interface-1',
    isLoggedIn: false,
    currentUser: {
      name: 'Guest Citizen',
      email: '',
      city: 'Mumbai',
      avatar: 'GC',
      role: 'Citizen Auditor'
    },
    reportVerified: false,
    complaintPhotos: [],
    adminPhotoObjectUrls: [],
    faceCameraStream: null,
    faceCaptureComplete: false,
    activeFilters: {
      type: 'all',
      status: 'all'
    },
    publicReports: [
      {
        id: 'REP-IND-104',
        city: 'mumbai',
        projectId: 'MUM-PRK-03',
        category: 'Disproportionate Spend vs Physical Progress',
        text: 'Dredging excavators removed from site 3 weeks ago yet weekly municipal expense report claims 400 machine hours. Demanding physical site inspection.',
        witness: 'Arjun Deshmukh (Civic Auditor)',
        date: '3 days ago',
        upvotes: 48,
        status: 'Under Verification'
      },
      {
        id: 'REP-IND-105',
        city: 'delhi',
        projectId: 'DEL-BRG-02',
        category: 'Contractor Idling Claim Investigation',
        text: 'Contractor submitted ₹42 Cr idle machinery compensation claim for June-August while nearby residents recorded casting yard completely empty.',
        witness: 'Meera Sen (Advocate)',
        date: '5 days ago',
        upvotes: 89,
        status: 'Escalated to Docket'
      }
    ]
  };

  // ---------------------------------------------------------------------------
  // SVG Icon Helpers
  // ---------------------------------------------------------------------------
  const icons = {
    thumbUp: `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>`,
    thumbDown: `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path></svg>`,
    arrowRight: `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`
  };

  // ---------------------------------------------------------------------------
  // DOM Element Selectors
  // ---------------------------------------------------------------------------
  const dom = {
    // Navigation & Header
    navBtns: document.querySelectorAll('.nav-item-btn'),
    headerCityName: document.getElementById('current-city-name-nav'),
    headerCityBtn: document.getElementById('header-city-indicator'),
    headerUserName: document.getElementById('header-user-name'),
    headerUserAvatar: document.getElementById('header-user-avatar'),
    brandHomeBtn: document.getElementById('brand-home-btn'),
    globalHeaderBackBtn: document.getElementById('global-header-back-btn'),
    btnHeaderLogout: document.getElementById('btn-header-logout'),
    btnOpenAdmin: document.getElementById('btn-open-admin'),

    // Interface Back Buttons (Left side)
    i2BackBtn: document.getElementById('i2-back-btn'),
    i3BackBtn: document.getElementById('i3-back-btn'),
    i4BackBtn: document.getElementById('i4-back-btn'),

    // Interface views
    views: {
      'interface-1': document.getElementById('interface-1'),
      'interface-2': document.getElementById('interface-2'),
      'interface-3': document.getElementById('interface-3'),
      'interface-4': document.getElementById('interface-4')
    },

    // Interface 1: Auth & Map
    svgMap: document.getElementById('india-svg-map'),
    mapZoomGroup: document.getElementById('map-zoom-group'),
    btnResetMapZoom: document.getElementById('btn-reset-map-zoom'),
    spotlightOverlay: document.getElementById('map-spotlight-overlay'),
    spotlightTitle: document.getElementById('spotlight-title'),
    spotlightDesc: document.getElementById('spotlight-desc'),
    spotlightCircle: document.getElementById('spotlight-circle'),
    cityNodes: document.querySelectorAll('.city-node-group'),
    cityCards: document.querySelectorAll('.city-pick-card'),
    btnGetStarted: document.getElementById('btn-get-started'),
    authWrapper: document.getElementById('auth-form-wrapper'),
    loginSuccessWrapper: document.getElementById('login-success-wrapper'),
    authForm: document.getElementById('citizen-auth-form'),
    authNameInput: document.getElementById('citizen-name-input'),
    authEmailInput: document.getElementById('citizen-email-input'),
    welcomeTitle: document.getElementById('welcome-citizen-title'),

    // Interface 2: City Projects
    i2CityTitle: document.getElementById('i2-city-title'),
    i2CityTagline: document.getElementById('i2-city-tagline'),
    i2StatProjects: document.getElementById('i2-stat-projects'),
    i2StatBudget: document.getElementById('i2-stat-budget'),
    i2StatScore: document.getElementById('i2-stat-score'),
    i2StatAuditors: document.getElementById('i2-stat-auditors'),
    i2ChangeCityBtn: document.getElementById('i2-change-city-btn'),
    cityProjectsGrid: document.getElementById('city-projects-grid'),
    typeFilterBtns: document.querySelectorAll('#project-type-filters .filter-pill'),
    statusFilterBtns: document.querySelectorAll('#project-status-filters .filter-pill'),

    // Interface 3: Project Detail
    btnBackToI2: document.getElementById('btn-back-to-i2'),
    overviewBlock: document.getElementById('project-overview-block'),
    i3TypeTag: document.getElementById('i3-type-tag'),
    i3StatusPill: document.getElementById('i3-status-pill'),
    i3SanctionCode: document.getElementById('i3-sanction-code'),
    i3ProjectTitle: document.getElementById('i3-project-title'),
    i3ProjectOverview: document.getElementById('i3-project-overview'),
    i3KpiAllocated: document.getElementById('i3-kpi-allocated'),
    i3KpiProgress: document.getElementById('i3-kpi-progress'),
    i3KpiMatch: document.getElementById('i3-kpi-match'),
    i3ContractorName: document.getElementById('i3-contractor-name'),
    i3ContractorExp: document.getElementById('i3-contractor-exp'),
    i3ContractorCompleted: document.getElementById('i3-contractor-completed'),
    i3ContractorOntime: document.getElementById('i3-contractor-ontime'),
    i3ContractorRating: document.getElementById('i3-contractor-rating'),
    btnViewContractorProfile: document.getElementById('btn-view-contractor-profile'),

    // Simulation Slider
    simulationAfterImg: document.getElementById('simulation-after-img'),
    simulationBeforeImg: document.getElementById('simulation-before-img'),
    sliderBeforeWrapper: document.getElementById('slider-before-wrapper'),
    sliderHandle: document.getElementById('slider-handle'),
    sliderRangeInput: document.getElementById('slider-range-input'),
    simulationCaption: document.getElementById('i3-simulation-caption'),
    specCommute: document.getElementById('spec-commute'),
    specCarbon: document.getElementById('spec-carbon'),
    specSpeed: document.getElementById('spec-speed'),
    specLongevity: document.getElementById('spec-longevity'),

    // Budget Section
    budgetKpiSanctioned: document.getElementById('budget-kpi-sanctioned'),
    budgetKpiSpent: document.getElementById('budget-kpi-spent'),
    budgetKpiEac: document.getElementById('budget-kpi-eac'),
    budgetKpiCpi: document.getElementById('budget-kpi-cpi'),
    budgetBarsContainer: document.getElementById('budget-bars-container'),
    btnJumpToSec4: document.getElementById('btn-jump-to-sec4'),

    // YouTube Comments
    commentsCountHeader: document.getElementById('comments-count-header'),
    ytCommentInput: document.getElementById('yt-comment-input'),
    btnYtSubmit: document.getElementById('btn-yt-submit'),
    btnYtCancel: document.getElementById('btn-yt-cancel'),
    ytCommentsFeed: document.getElementById('yt-comments-feed'),
    ytCurrentAvatar: document.getElementById('yt-current-avatar'),
    btnOpenWhistleblowerModal: document.getElementById('btn-open-whistleblower-modal'),
    reportVerificationNotice: document.getElementById('report-verification-notice'),
    btnReportAddPhoto: document.getElementById('btn-report-add-photo'),
    reportPhotosInput: document.getElementById('report-photos-input'),
    reportPhotoCount: document.getElementById('report-photo-count'),
    reportPhotoList: document.getElementById('report-photo-list'),
    reportDetailsFields: document.getElementById('report-details-fields'),

    // Interface 4: Transparency
    tenderTenderId: document.getElementById('tender-tender-id'),
    tenderTableBody: document.getElementById('tender-table-body'),
    sec4ContractorTitle: document.getElementById('sec4-contractor-title'),
    sec4ContractorLead: document.getElementById('sec4-contractor-lead'),
    sec4ContractorHq: document.getElementById('sec4-contractor-hq'),
    sec4ContractorCompleted: document.getElementById('sec4-contractor-completed'),
    sec4ContractorIntegrity: document.getElementById('sec4-contractor-integrity'),
    sec4ContractorPastProjects: document.getElementById('sec4-contractor-past-projects'),
    btnFilePublicReport: document.getElementById('btn-file-public-report'),
    publicReportsDocket: document.getElementById('public-reports-docket-list'),
    newsReportsGrid: document.getElementById('news-reports-grid'),
    aiMatchPercentage: document.getElementById('ai-match-percentage'),
    aiScoreMaterial: document.getElementById('ai-score-material'),
    aiBarMaterial: document.getElementById('ai-bar-material'),
    aiScoreTender: document.getElementById('ai-score-tender'),
    aiBarTender: document.getElementById('ai-bar-tender'),
    aiScoreProgress: document.getElementById('ai-score-progress'),
    aiBarProgress: document.getElementById('ai-bar-progress'),
    aiScoreMedia: document.getElementById('ai-score-media'),
    aiBarMedia: document.getElementById('ai-bar-media'),
    aiVerdictText: document.getElementById('ai-verdict-text'),
    aiKeyNotesList: document.getElementById('ai-key-notes-list'),

    // Modals
    contractorModal: document.getElementById('contractor-modal'),
    modalCloseContractor: document.getElementById('modal-close-contractor'),
    modalContractorName: document.getElementById('modal-contractor-name'),
    modalContractorExp: document.getElementById('modal-contractor-exp'),
    modalContractorCount: document.getElementById('modal-contractor-count'),
    modalContractorRate: document.getElementById('modal-contractor-rate'),
    modalContractorRating: document.getElementById('modal-contractor-rating'),
    modalContractorProjectsList: document.getElementById('modal-contractor-projects-list'),

    reportModal: document.getElementById('report-modal'),
    modalCloseReport: document.getElementById('modal-close-report'),
    whistleblowerForm: document.getElementById('public-whistleblower-form'),
    verificationModal: document.getElementById('verification-modal'),
    modalCloseVerification: document.getElementById('modal-close-verification'),
    verificationSteps: document.getElementById('verification-steps'),
    verificationSuccess: document.getElementById('verification-success'),
    aadhaarPhotoInput: document.getElementById('aadhaar-photo-input'),
    aadhaarFileStatus: document.getElementById('aadhaar-file-status'),
    btnAddAadhaarPhoto: document.getElementById('btn-add-aadhaar-photo'),
    faceCameraPreview: document.getElementById('face-camera-preview'),
    faceCapturePreview: document.getElementById('face-capture-preview'),
    btnStartFaceCamera: document.getElementById('btn-start-face-camera'),
    btnCaptureFacePhoto: document.getElementById('btn-capture-face-photo'),
    facePhotoStep: document.getElementById('face-photo-step'),
    faceFileStatus: document.getElementById('face-file-status'),
    btnCompleteVerification: document.getElementById('btn-complete-verification'),
    btnReturnToReport: document.getElementById('btn-return-to-report'),
    adminLoginModal: document.getElementById('admin-login-modal'),
    modalCloseAdminLogin: document.getElementById('modal-close-admin-login'),
    adminLoginForm: document.getElementById('admin-login-form'),
    adminLoginError: document.getElementById('admin-login-error'),
    adminDashboardModal: document.getElementById('admin-dashboard-modal'),
    btnCloseAdminDashboard: document.getElementById('btn-close-admin-dashboard'),
    adminComplaintsList: document.getElementById('admin-complaints-list'),
    adminCommentsList: document.getElementById('admin-comments-list'),
    adminComplaintCount: document.getElementById('admin-complaint-count'),
    adminCommentCount: document.getElementById('admin-comment-count')
  };

  // ---------------------------------------------------------------------------
  // City locations on the 800 x 900 India map
  // ---------------------------------------------------------------------------
  const CITY_COORDINATES = {
    delhi: {
      cx: 280,
      cy: 284,
      scale: 2.7,
      name: 'Delhi (NCR)',
      desc: '44 Public Projects · Capital Region Corridors'
    },
    mumbai: {
      cx: 192,
      cy: 531,
      scale: 2.7,
      name: 'Mumbai',
      desc: '38 Public Projects · Coastal Highway & Marine Tunnels'
    },
    kolkata: {
      cx: 509,
      cy: 440,
      scale: 2.7,
      name: 'Kolkata',
      desc: '26 Public Projects · Subaqueous Riverine & Elevated Links'
    },
    bangalore: {
      cx: 288,
      cy: 689,
      scale: 2.7,
      name: 'Bengaluru',
      desc: '36 Public Projects · Silicon Corridor & Transit Expressways'
    }
  };

  // ---------------------------------------------------------------------------
  // Navigation & View Switching
  // ---------------------------------------------------------------------------
  function switchInterface(targetId) {
    if (!dom.views[targetId]) return;

    // Update active nav button
    dom.navBtns.forEach(btn => {
      if (btn.getAttribute('data-target') === targetId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Hide all views, display target
    Object.keys(dom.views).forEach(key => {
      const el = dom.views[key];
      if (key === targetId) {
        el.classList.add('active-view');
      } else {
        el.classList.remove('active-view');
      }
    });

    state.activeInterface = targetId;

    // Control visibility of Global Header Back Button
    if (dom.globalHeaderBackBtn) {
      if (targetId === 'interface-1') {
        dom.globalHeaderBackBtn.classList.remove('visible');
      } else {
        dom.globalHeaderBackBtn.classList.add('visible');
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Interface-specific initializations
    if (targetId === 'interface-2') {
      renderCityProjects();
    } else if (targetId === 'interface-3') {
      renderProjectDetail();
    } else if (targetId === 'interface-4') {
      renderTransparencyHub();
    }
  }

  // Handle Back Navigation
  function handleNavigateBack() {
    if (state.activeInterface === 'interface-4') {
      switchInterface('interface-3');
    } else if (state.activeInterface === 'interface-3') {
      switchInterface('interface-2');
    } else if (state.activeInterface === 'interface-2') {
      switchInterface('interface-1');
    }
  }

  // ---------------------------------------------------------------------------
  // INTERFACE 1: High-Precision SVG India Map Pan & Zoom
  // ---------------------------------------------------------------------------
  function zoomMapToCity(cityId) {
    const coords = CITY_COORDINATES[cityId];
    if (!coords || !dom.mapZoomGroup) return;

    const viewW = 800;
    const viewH = 900;
    const s = coords.scale;
    // Calculate translation to position (coords.cx, coords.cy) at center (viewW/2, viewH/2)
    const tx = (viewW / 2) - (coords.cx * s);
    const ty = (viewH / 2) - (coords.cy * s);

    // Smooth transform on the inner SVG group
    dom.mapZoomGroup.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;

    // Position spotlight circle
    if (dom.spotlightCircle) {
      dom.spotlightCircle.setAttribute('cx', coords.cx);
      dom.spotlightCircle.setAttribute('cy', coords.cy);
      dom.spotlightCircle.setAttribute('opacity', '1');
    }

    // Toggle localized detailed urban overlays
    ['delhi', 'mumbai', 'kolkata', 'bangalore'].forEach(cKey => {
      const el = document.getElementById(`zoom-features-${cKey}`);
      if (el) {
        if (cKey === cityId) {
          el.classList.add('active');
        } else {
          el.classList.remove('active');
        }
      }
    });

    // Update bottom spotlight feedback card
    if (dom.spotlightTitle && dom.spotlightDesc && dom.spotlightOverlay) {
      dom.spotlightTitle.textContent = `${coords.name} Metropolitan Region`;
      dom.spotlightDesc.textContent = coords.desc;
      dom.spotlightOverlay.classList.add('active');
    }

    // Highlight selected city node
    dom.cityNodes.forEach(node => {
      const nodeCity = node.getAttribute('data-city');
      const pin = node.querySelector('.city-node-pin');
      const ring = node.querySelector('.city-node-ring');
      if (nodeCity === cityId) {
        if (pin) pin.style.fill = '#0071e3';
        if (ring) ring.style.stroke = 'rgba(0, 113, 227, 0.6)';
      } else {
        if (pin) pin.style.fill = '#86868b';
        if (ring) ring.style.stroke = 'rgba(0, 0, 0, 0.1)';
      }
    });

    // Sync city selection cards on the right
    dom.cityCards.forEach(card => {
      if (card.getAttribute('data-city') === cityId) {
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }
    });

    // Update global state & header indicator
    state.currentCityId = cityId;
    const cityData = CIVIC_DATA.cities[cityId];
    if (cityData) {
      dom.headerCityName.textContent = cityData.name;
      if (cityData.projects && cityData.projects.length > 0) {
        state.currentProjectId = cityData.projects[0].id;
      }
    }
  }

  // Reset Map View to Full National Scale
  function resetMapZoom() {
    if (!dom.mapZoomGroup) return;
    dom.mapZoomGroup.style.transform = 'translate(0px, 0px) scale(1)';

    if (dom.spotlightCircle) {
      dom.spotlightCircle.setAttribute('opacity', '0');
    }

    ['delhi', 'mumbai', 'kolkata', 'bangalore'].forEach(cKey => {
      const el = document.getElementById(`zoom-features-${cKey}`);
      if (el) el.classList.remove('active');
    });

    dom.cityNodes.forEach(node => {
      const pin = node.querySelector('.city-node-pin');
      const ring = node.querySelector('.city-node-ring');
      if (pin) pin.style.fill = '#0071e3';
      if (ring) ring.style.stroke = 'rgba(0, 113, 227, 0.35)';
    });

    if (dom.spotlightOverlay) {
      dom.spotlightOverlay.classList.remove('active');
    }
  }

  // ---------------------------------------------------------------------------
  // Account Authentication & Logout
  // ---------------------------------------------------------------------------
  function triggerLoginSuccess(name, email) {
    state.isLoggedIn = true;
    state.currentUser.name = name;
    state.currentUser.email = email;
    state.currentUser.avatar = name.split(/\s+/).map(n => n[0]).join('').toUpperCase().slice(0, 2);

    dom.headerUserName.textContent = state.currentUser.name;
    dom.headerUserAvatar.textContent = state.currentUser.avatar;
    if (dom.ytCurrentAvatar) dom.ytCurrentAvatar.textContent = state.currentUser.avatar;

    dom.authWrapper.style.display = 'none';
    dom.loginSuccessWrapper.style.display = 'block';

    if (dom.welcomeTitle) {
      dom.welcomeTitle.textContent = `Welcome, ${state.currentUser.name}`;
    }

    zoomMapToCity(state.currentCityId);
  }

  function handleLogout() {
    state.isLoggedIn = false;
    state.currentUser = {
      name: 'Guest Citizen',
      email: '',
      city: 'Mumbai',
      avatar: 'GC',
      role: 'Citizen Auditor'
    };

    dom.headerUserName.textContent = state.currentUser.name;
    dom.headerUserAvatar.textContent = state.currentUser.avatar;
    if (dom.ytCurrentAvatar) dom.ytCurrentAvatar.textContent = 'GC';

    // Reset login form in Interface 1
    if (dom.authWrapper) dom.authWrapper.style.display = 'block';
    if (dom.loginSuccessWrapper) dom.loginSuccessWrapper.style.display = 'none';
    if (dom.authForm) dom.authForm.reset();

    // Navigate back to Interface 1
    switchInterface('interface-1');
    resetMapZoom();

    alert('You have been logged out.');
  }

  // ---------------------------------------------------------------------------
  // INTERFACE 2: City Projects List View
  // ---------------------------------------------------------------------------
  function renderCityProjects() {
    const city = CIVIC_DATA.cities[state.currentCityId];
    if (!city) return;

    dom.i2CityTitle.textContent = `${city.name} Infrastructure Portfolio`;
    dom.i2CityTagline.textContent = `${city.badge} · ${city.tagline}`;
    dom.i2StatProjects.textContent = city.stats.totalProjects;
    dom.i2StatBudget.textContent = city.stats.activeBudget;
    dom.i2StatScore.textContent = city.stats.transparencyScore;
    dom.i2StatAuditors.textContent = city.stats.citizenAuditors;

    const filteredProjects = city.projects.filter(p => {
      const matchType = state.activeFilters.type === 'all' || p.type === state.activeFilters.type;
      const matchStatus = state.activeFilters.status === 'all' || p.status === state.activeFilters.status;
      return matchType && matchStatus;
    });

    dom.cityProjectsGrid.innerHTML = '';
    if (filteredProjects.length === 0) {
      dom.cityProjectsGrid.innerHTML = `
        <div style="grid-column: span 2; text-align: center; padding: 4rem; color: var(--text-secondary);">
          <p style="font-size: 1.05rem;">No projects match the selected criteria.</p>
          <button class="filter-pill active" style="margin: 1rem auto; display: inline-flex;" onclick="document.querySelector('[data-type=all]').click()">Reset Filters</button>
        </div>
      `;
      return;
    }

    filteredProjects.forEach(proj => {
      const card = document.createElement('article');
      card.className = 'project-card';
      card.setAttribute('data-id', proj.id);

      const statusText = proj.status === 'healthy' ? 'On Track' : proj.status === 'watch' ? 'Under Review' : 'Discrepancy';

      card.innerHTML = `
        <div class="project-card-header">
          <span class="project-type-tag">${proj.typeLabel}</span>
          <span class="project-status-pill ${proj.status}">
            ${statusText}
          </span>
        </div>

        <div class="project-card-body">
          <h3>${proj.title}</h3>
          <div class="project-contractor-line">
            <span>Contractor:</span> <strong>${proj.contractor.name}</strong>
          </div>

          <div class="progress-cluster">
            <div class="progress-labels">
              <span>Physical Completion</span>
              <strong>${proj.budget.progress}%</strong>
            </div>
            <div class="progress-track">
              <div class="progress-fill ${proj.status}" style="width: ${proj.budget.progress}%;"></div>
            </div>
          </div>

          <div class="project-kpi-footer">
            <div>
              <span style="font-size: 0.72rem; color: var(--text-secondary); display: block;">Total Sanction</span>
              <span class="kpi-budget-sum">₹${proj.budget.allocated.toLocaleString('en-IN')} Cr</span>
            </div>
            <div class="kpi-ai-match">
              <span>Evidence Match: ${proj.aiAnalysis.evidenceMatchPct}%</span>
            </div>
          </div>
        </div>

        <div class="card-action-bar">
          <span>Explore Project Transparency</span>
          <span style="display: flex; align-items: center;">${icons.arrowRight}</span>
        </div>
      `;

      card.addEventListener('click', () => {
        state.currentProjectId = proj.id;
        switchInterface('interface-3');
      });

      dom.cityProjectsGrid.appendChild(card);
    });
  }

  // ---------------------------------------------------------------------------
  // INTERFACE 3: Project Detail, Scroll-Blur & YouTube Comments
  // ---------------------------------------------------------------------------
  function getActiveProject() {
    const city = CIVIC_DATA.cities[state.currentCityId];
    if (!city) return null;
    return city.projects.find(p => p.id === state.currentProjectId) || city.projects[0];
  }

  function renderProjectDetail() {
    const proj = getActiveProject();
    if (!proj) return;

    dom.i3TypeTag.textContent = proj.typeLabel;
    dom.i3StatusPill.className = `project-status-pill ${proj.status}`;
    dom.i3StatusPill.textContent = proj.status === 'healthy' ? 'On Track' : proj.status === 'watch' ? 'Under Review' : 'Discrepancy';
    dom.i3SanctionCode.textContent = `Sanction ID: ${proj.sanctionCode}`;
    dom.i3ProjectTitle.textContent = proj.title;
    dom.i3ProjectOverview.textContent = proj.overview;
    dom.i3KpiAllocated.textContent = `₹${proj.budget.allocated.toLocaleString('en-IN')} Cr`;
    dom.i3KpiProgress.textContent = `${proj.budget.progress}% Completed`;
    dom.i3KpiMatch.textContent = `${proj.aiAnalysis.evidenceMatchPct}% Verified`;

    dom.i3ContractorName.textContent = proj.contractor.name;
    dom.i3ContractorExp.textContent = `${proj.contractor.experienceYears} Years`;
    dom.i3ContractorCompleted.textContent = `${proj.contractor.completedGovtProjects} Projects`;
    dom.i3ContractorOntime.textContent = proj.contractor.onTimeMilestoneRate;
    dom.i3ContractorRating.textContent = `${proj.contractor.rating} / 5.0`;

    dom.simulationAfterImg.src = proj.simulation.image;
    dom.simulationBeforeImg.src = proj.simulation.beforeImage;
    dom.simulationCaption.textContent = proj.simulation.caption;
    dom.specCommute.textContent = proj.simulation.metrics.commuteCut || 'Direct commute reduction';
    dom.specCarbon.textContent = proj.simulation.metrics.carbonReduction || 'Emissions offset';
    dom.specSpeed.textContent = proj.simulation.metrics.designSpeed || 'Standard design speed';
    dom.specLongevity.textContent = proj.simulation.metrics.longevity || '50+ years life';

    if (dom.sliderRangeInput && dom.sliderBeforeWrapper && dom.sliderHandle) {
      dom.sliderRangeInput.value = 50;
      dom.sliderBeforeWrapper.style.width = '50%';
      dom.sliderHandle.style.left = '50%';
    }

    dom.budgetKpiSanctioned.textContent = `₹${proj.budget.allocated.toLocaleString('en-IN')} Cr`;
    dom.budgetKpiSpent.textContent = `₹${proj.budget.spent.toLocaleString('en-IN')} Cr`;
    dom.budgetKpiEac.textContent = `₹${proj.budget.projectedFinal.toLocaleString('en-IN')} Cr`;
    dom.budgetKpiCpi.textContent = proj.budget.cpi.toFixed(2);

    dom.budgetBarsContainer.innerHTML = '';
    proj.budget.breakdown.forEach(item => {
      const row = document.createElement('div');
      row.className = 'budget-bar-row';
      row.innerHTML = `
        <div class="bar-meta">
          <span>${item.item}</span>
          <span><strong>₹${item.cost.toLocaleString('en-IN')} Cr</strong> (${item.pct}%)</span>
        </div>
        <div class="bar-track">
          <div class="bar-fill-cyan" style="width: ${item.pct}%;"></div>
        </div>
      `;
      dom.budgetBarsContainer.appendChild(row);
    });

    renderYouTubeComments(proj);
  }

  function setupScrollBlurListener() {
    window.addEventListener('scroll', () => {
      if (state.activeInterface !== 'interface-3') return;
      if (!dom.overviewBlock) return;

      const scrollY = window.scrollY || window.pageYOffset;
      if (scrollY > 130) {
        dom.overviewBlock.classList.add('scrolled-blurred');
      } else {
        dom.overviewBlock.classList.remove('scrolled-blurred');
      }
    }, { passive: true });
  }

  function setupSimulationSlider() {
    if (!dom.sliderRangeInput) return;

    dom.sliderRangeInput.addEventListener('input', (e) => {
      const val = e.target.value;
      if (dom.sliderBeforeWrapper) {
        dom.sliderBeforeWrapper.style.width = `${val}%`;
      }
      if (dom.sliderHandle) {
        dom.sliderHandle.style.left = `${val}%`;
      }
    });
  }

  function renderYouTubeComments(proj) {
    if (!dom.ytCommentsFeed) return;
    dom.ytCommentsFeed.innerHTML = '';
    dom.commentsCountHeader.textContent = proj.comments.length;

    proj.comments.forEach(comment => {
      const card = document.createElement('div');
      card.className = 'yt-comment-card';
      card.setAttribute('data-id', comment.id);

      const initials = escapeHTML(comment.user.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2));

      let repliesHtml = '';
      if (comment.replies && comment.replies.length > 0) {
        repliesHtml = `
          <div class="yt-nested-replies">
            ${comment.replies.map(rep => `
              <div class="yt-comment-card" style="margin-top: 0.5rem;">
                <div class="yt-user-avatar" style="width: 28px; height: 28px; font-size: 0.72rem;">OC</div>
                <div class="yt-comment-content">
                  <div class="yt-author-line">
                    <span class="yt-author-name">${escapeHTML(rep.user)}</span>
                    <span class="yt-time-stamp">${escapeHTML(rep.timeAgo)}</span>
                  </div>
                  <div class="yt-comment-body">${escapeHTML(rep.text)}</div>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      }

      card.innerHTML = `
        <div class="yt-user-avatar">${initials}</div>
        <div class="yt-comment-content">
          <div class="yt-author-line">
            <span class="yt-author-name">${escapeHTML(comment.user)}</span>
            <span class="yt-author-badge">${escapeHTML(comment.role)}</span>
            <span class="yt-time-stamp">${escapeHTML(comment.timeAgo)}</span>
          </div>
          <div class="yt-comment-body">${escapeHTML(comment.text)}</div>
          <div class="yt-interactive-controls">
            <button class="yt-vote-btn upvote-btn" data-id="${comment.id}">
              ${icons.thumbUp} <span class="like-count">${comment.likes}</span>
            </button>
            <button class="yt-vote-btn downvote-btn">
              ${icons.thumbDown}
            </button>
            <button class="yt-reply-btn" data-id="${comment.id}">Reply</button>
          </div>
          ${repliesHtml}
        </div>
      `;

      const upBtn = card.querySelector('.upvote-btn');
      if (upBtn) {
        upBtn.addEventListener('click', function () {
          comment.likes += 1;
          this.querySelector('.like-count').textContent = comment.likes;
          this.classList.add('voted-up');
        });
      }

      dom.ytCommentsFeed.appendChild(card);
    });
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[character]);
  }

  function handleAddYouTubeComment() {
    const text = dom.ytCommentInput.value.trim();
    if (!text) return;

    const proj = getActiveProject();
    if (!proj) return;

    const newComment = {
      id: `c_${Date.now()}`,
      user: state.currentUser.name,
      role: 'Verified Citizen Auditor',
      timeAgo: 'Just now',
      likes: 1,
      dislikes: 0,
      text: text,
      replies: []
    };

    proj.comments.unshift(newComment);
    dom.ytCommentInput.value = '';
    renderYouTubeComments(proj);
  }

  // ---------------------------------------------------------------------------
  // INTERFACE 4: Transparency & AI Budget Audit Hub
  // ---------------------------------------------------------------------------
  function renderTransparencyHub() {
    const proj = getActiveProject();
    if (!proj) return;

    dom.tenderTenderId.textContent = proj.tender.tenderId;
    dom.tenderTableBody.innerHTML = '';
    proj.tender.bidders.forEach(b => {
      const isWinner = b.status.includes('Selected');
      const tr = document.createElement('tr');
      if (isWinner) tr.className = 'selected-row';

      tr.innerHTML = `
        <td><strong>${b.company}</strong></td>
        <td><strong>${b.techScore} / 100</strong></td>
        <td>₹${b.bidAmount.toLocaleString('en-IN')} Cr</td>
        <td>${b.variance}</td>
        <td>
          <span class="tender-status-badge ${isWinner ? 'won' : 'outbid'}">
            ${isWinner ? 'Awarded (L1)' : 'Outbid'}
          </span>
        </td>
      `;
      dom.tenderTableBody.appendChild(tr);
    });

    dom.sec4ContractorTitle.textContent = proj.contractor.name;
    dom.sec4ContractorLead.textContent = `Lead Project Engineer: ${proj.contractor.leadEngineer}`;
    dom.sec4ContractorHq.textContent = `Corporate Headquarters: ${proj.contractor.headquarters}`;
    dom.sec4ContractorCompleted.textContent = proj.contractor.completedGovtProjects;
    dom.sec4ContractorIntegrity.textContent = `${proj.contractor.integrityScore} / 100`;

    dom.sec4ContractorPastProjects.innerHTML = '';
    proj.contractor.pastProjects.forEach(past => {
      const pDiv = document.createElement('div');
      pDiv.style.cssText = 'background: #fafafc; padding: 0.75rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: center; font-size: 0.84rem;';
      pDiv.innerHTML = `
        <div>
          <strong style="color: var(--text-primary);">${past.name}</strong>
          <span style="color: var(--text-secondary); font-size: 0.76rem; display: block;">Delivered: ${past.year}</span>
        </div>
        <span class="live-radar-badge">${past.status}</span>
      `;
      dom.sec4ContractorPastProjects.appendChild(pDiv);
    });

    renderPublicReportsDocket();

    dom.newsReportsGrid.innerHTML = '';
    proj.newsReports.forEach(news => {
      const card = document.createElement('div');
      card.className = 'news-article-card';
      card.innerHTML = `
        <div>
          <div class="news-channel-badge">
            <span class="news-source-tag">${news.outlet}</span>
            <span class="news-date">${news.date}</span>
          </div>
          <h4 class="news-headline-title">${news.headline}</h4>
          <p class="news-excerpt-text">“${news.excerpt}”</p>
        </div>
        <div class="news-byline">Byline: ${news.author} · Independent Press Bureau</div>
      `;
      dom.newsReportsGrid.appendChild(card);
    });

    const ai = proj.aiAnalysis;
    dom.aiMatchPercentage.textContent = `${ai.evidenceMatchPct}%`;

    dom.aiScoreMaterial.textContent = `${ai.breakdown.materialCostAlignment}%`;
    dom.aiBarMaterial.style.width = `${ai.breakdown.materialCostAlignment}%`;
    dom.aiScoreTender.textContent = `${ai.breakdown.tenderCompetitiveness}%`;
    dom.aiBarTender.style.width = `${ai.breakdown.tenderCompetitiveness}%`;
    dom.aiScoreProgress.textContent = `${ai.breakdown.progressVsSpendMatch}%`;
    dom.aiBarProgress.style.width = `${ai.breakdown.progressVsSpendMatch}%`;
    dom.aiScoreMedia.textContent = `${ai.breakdown.mediaSentimentScore}%`;
    dom.aiBarMedia.style.width = `${ai.breakdown.mediaSentimentScore}%`;

    dom.aiVerdictText.textContent = ai.verdict;
    dom.aiKeyNotesList.innerHTML = '';
    ai.keyNotes.forEach(note => {
      const li = document.createElement('li');
      li.textContent = note;
      dom.aiKeyNotesList.appendChild(li);
    });
  }

  function renderPublicReportsDocket() {
    if (!dom.publicReportsDocket) return;
    dom.publicReportsDocket.innerHTML = '';

    state.publicReports.forEach(rep => {
      const rBox = document.createElement('div');
      rBox.style.cssText = 'background: #fafafc; padding: 1.15rem; border-radius: var(--radius-sm); border: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem;';
      rBox.innerHTML = `
        <div style="flex: 1;">
          <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.35rem;">
            <span style="font-size: 0.72rem; color: var(--pastel-red-text); font-weight: 600; text-transform: uppercase;">${escapeHTML(rep.category)}</span>
            <span style="font-size: 0.74rem; color: var(--text-tertiary);">${escapeHTML(rep.date)} · File #${escapeHTML(rep.id)}</span>
          </div>
          <p style="font-size: 0.86rem; color: var(--text-secondary); line-height: 1.45; margin-bottom: 0.45rem;">${escapeHTML(rep.text)}</p>
          <div style="font-size: 0.76rem; color: var(--text-tertiary);">Filed by: <strong>${escapeHTML(rep.witness)}</strong></div>
        </div>
        <div style="text-align: right; flex-shrink: 0;">
          <button class="yt-vote-btn" style="background: rgba(0,0,0,0.04); padding: 0.3rem 0.65rem; border-radius: var(--radius-pill); margin-bottom: 0.35rem;" onclick="this.querySelector('.v-count').textContent = parseInt(this.querySelector('.v-count').textContent) + 1">
            ${icons.thumbUp} <span class="v-count" style="margin-left: 0.25rem;">${rep.upvotes}</span>
          </button>
          <div class="live-radar-badge" style="font-size: 0.7rem;">${escapeHTML(rep.status)}</div>
        </div>
      `;
      dom.publicReportsDocket.appendChild(rBox);
    });
  }

  // ---------------------------------------------------------------------------
  // Modals & Feedback Handlers
  // ---------------------------------------------------------------------------
  function openContractorModal() {
    const proj = getActiveProject();
    if (!proj) return;
    const c = proj.contractor;

    dom.modalContractorName.textContent = c.name;
    dom.modalContractorExp.textContent = `${c.experienceYears} Yrs`;
    dom.modalContractorCount.textContent = c.completedGovtProjects;
    dom.modalContractorRate.textContent = c.onTimeMilestoneRate;
    dom.modalContractorRating.textContent = `${c.rating} / 5.0`;

    dom.modalContractorProjectsList.innerHTML = '';
    c.pastProjects.forEach(p => {
      const div = document.createElement('div');
      div.style.cssText = 'background: #fafafc; padding: 0.75rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: center;';
      div.innerHTML = `
        <div>
          <strong style="color: var(--text-primary);">${p.name}</strong>
          <span style="font-size: 0.76rem; color: var(--text-secondary); display: block;">Year: ${p.year}</span>
        </div>
        <span class="live-radar-badge">${p.status}</span>
      `;
      dom.modalContractorProjectsList.appendChild(div);
    });

    dom.contractorModal.classList.add('active');
  }

  function closeContractorModal() {
    dom.contractorModal.classList.remove('active');
  }

  function openReportModal() {
    state.reportVerified = false;
    state.complaintPhotos = [];
    if (dom.whistleblowerForm) dom.whistleblowerForm.reset();
    if (dom.reportPhotosInput) dom.reportPhotosInput.value = '';
    if (dom.reportDetailsFields) dom.reportDetailsFields.disabled = true;
    if (dom.reportVerificationNotice) {
      dom.reportVerificationNotice.textContent = 'Complete demo verification to unlock the complaint form and add supporting photos.';
    }
    if (dom.btnReportAddPhoto) dom.btnReportAddPhoto.textContent = 'Add Photo';
    renderComplaintPhotoList();
    dom.reportModal.classList.add('active');
  }

  function closeReportModal() {
    dom.reportModal.classList.remove('active');
    state.reportVerified = false;
    state.complaintPhotos = [];
    if (dom.reportPhotosInput) dom.reportPhotosInput.value = '';
    if (dom.reportDetailsFields) dom.reportDetailsFields.disabled = true;
    renderComplaintPhotoList();
    closeVerificationModal();
  }

  function renderComplaintPhotoList() {
    if (!dom.reportPhotoList || !dom.reportPhotoCount) return;
    dom.reportPhotoList.replaceChildren();
    dom.reportPhotoCount.textContent = state.complaintPhotos.length
      ? `${state.complaintPhotos.length} project photo${state.complaintPhotos.length === 1 ? '' : 's'} attached`
      : 'No project photos attached';

    state.complaintPhotos.forEach((file, index) => {
      const item = document.createElement('div');
      item.className = 'report-photo-chip';
      const name = document.createElement('span');
      name.textContent = file.name;
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'report-photo-remove';
      remove.textContent = 'Remove';
      remove.setAttribute('aria-label', `Remove ${file.name}`);
      remove.addEventListener('click', () => {
        state.complaintPhotos.splice(index, 1);
        renderComplaintPhotoList();
      });
      item.append(name, remove);
      dom.reportPhotoList.appendChild(item);
    });
  }

  function openVerificationModal() {
    if (!dom.verificationModal) return;
    stopFaceCamera();
    state.faceCaptureComplete = false;
    dom.verificationSteps.hidden = false;
    dom.verificationSuccess.hidden = true;
    dom.aadhaarPhotoInput.value = '';
    dom.faceCameraPreview.hidden = true;
    dom.faceCapturePreview.hidden = true;
    dom.faceCapturePreview.width = 0;
    dom.faceCapturePreview.height = 0;
    dom.btnStartFaceCamera.disabled = true;
    dom.btnStartFaceCamera.hidden = false;
    dom.btnCaptureFacePhoto.disabled = true;
    dom.btnCaptureFacePhoto.hidden = true;
    dom.aadhaarFileStatus.textContent = 'No file selected';
    dom.faceFileStatus.textContent = 'Add your Aadhaar image first';
    dom.facePhotoStep.classList.add('is-locked');
    dom.btnCompleteVerification.disabled = true;
    dom.verificationModal.classList.add('active');
  }

  function closeVerificationModal() {
    if (!dom.verificationModal) return;
    stopFaceCamera();
    dom.verificationModal.classList.remove('active');
    dom.aadhaarPhotoInput.value = '';
    state.faceCaptureComplete = false;
    dom.faceCameraPreview.hidden = true;
    dom.faceCapturePreview.hidden = true;
    dom.faceCapturePreview.width = 0;
    dom.faceCapturePreview.height = 0;
  }

  function updateVerificationReadiness() {
    const aadhaar = dom.aadhaarPhotoInput.files[0];
    const hasAadhaarImage = Boolean(aadhaar && aadhaar.type.startsWith('image/'));

    dom.aadhaarFileStatus.textContent = hasAadhaarImage
      ? 'Image selected on this device'
      : aadhaar ? 'Choose an image file' : 'No file selected';
    dom.facePhotoStep.classList.toggle('is-locked', !hasAadhaarImage);
    dom.btnStartFaceCamera.disabled = !hasAadhaarImage || state.faceCaptureComplete;
    if (!hasAadhaarImage) {
      stopFaceCamera();
      state.faceCaptureComplete = false;
      dom.btnCaptureFacePhoto.hidden = true;
      dom.faceCameraPreview.hidden = true;
      dom.faceCapturePreview.hidden = true;
      dom.faceFileStatus.textContent = 'Add your Aadhaar image first';
    } else if (!state.faceCaptureComplete && !state.faceCameraStream) {
      dom.faceFileStatus.textContent = 'Start your camera to take a live face photo';
    }
    dom.btnCompleteVerification.disabled = !(hasAadhaarImage && state.faceCaptureComplete);
  }

  function handleAadhaarPhotoChange() {
    stopFaceCamera();
    state.faceCaptureComplete = false;
    dom.faceCameraPreview.hidden = true;
    dom.faceCapturePreview.hidden = true;
    dom.faceCapturePreview.width = 0;
    dom.faceCapturePreview.height = 0;
    dom.btnStartFaceCamera.hidden = false;
    dom.btnCaptureFacePhoto.hidden = true;
    updateVerificationReadiness();
  }

  function stopFaceCamera() {
    if (state.faceCameraStream) {
      state.faceCameraStream.getTracks().forEach(track => track.stop());
      state.faceCameraStream = null;
    }
    if (dom.faceCameraPreview) dom.faceCameraPreview.srcObject = null;
  }

  async function startFaceCamera() {
    if (!dom.aadhaarPhotoInput.files[0] || !dom.aadhaarPhotoInput.files[0].type.startsWith('image/')) return;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      dom.faceFileStatus.textContent = 'Camera access is unavailable. Open this page over HTTPS or localhost in a camera-capable browser.';
      return;
    }

    dom.btnStartFaceCamera.disabled = true;
    dom.faceFileStatus.textContent = 'Requesting camera permission…';
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: 'user' }
      });
      if (!dom.verificationModal.classList.contains('active') || !dom.aadhaarPhotoInput.files[0]) {
        stream.getTracks().forEach(track => track.stop());
        return;
      }
      state.faceCameraStream = stream;
      dom.faceCameraPreview.srcObject = stream;
      dom.faceCameraPreview.hidden = false;
      dom.btnStartFaceCamera.hidden = true;
      dom.btnCaptureFacePhoto.hidden = false;
      dom.btnCaptureFacePhoto.disabled = false;
      dom.faceFileStatus.textContent = 'Camera is live. Position your face, then capture.';
      await dom.faceCameraPreview.play();
    } catch (error) {
      stopFaceCamera();
      dom.faceCameraPreview.hidden = true;
      dom.btnCaptureFacePhoto.hidden = true;
      dom.btnStartFaceCamera.hidden = false;
      dom.btnStartFaceCamera.disabled = false;
      const message = error.name === 'NotAllowedError'
        ? 'Camera permission was denied. Allow camera access in your browser and try again.'
        : error.name === 'NotFoundError'
          ? 'No camera was found on this device.'
          : 'Could not start the camera. Check device availability and browser permissions, then try again.';
      dom.faceFileStatus.textContent = message;
    }
  }

  function captureFacePhoto() {
    const video = dom.faceCameraPreview;
    if (!state.faceCameraStream || !video.videoWidth || !video.videoHeight) {
      dom.faceFileStatus.textContent = 'The live camera is not ready yet. Please wait or restart the camera.';
      return;
    }
    const canvas = dom.faceCapturePreview;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) {
      dom.faceFileStatus.textContent = 'Could not capture a camera frame. Please try again.';
      return;
    }
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    state.faceCaptureComplete = true;
    stopFaceCamera();
    video.hidden = true;
    canvas.hidden = false;
    dom.btnCaptureFacePhoto.hidden = true;
    dom.btnStartFaceCamera.hidden = false;
    dom.btnStartFaceCamera.disabled = true;
    dom.faceFileStatus.textContent = 'Live face photo captured on this device.';
    dom.btnCompleteVerification.disabled = false;
  }

  function completeDemoVerification() {
    if (dom.btnCompleteVerification.disabled) return;

    state.reportVerified = true;
    stopFaceCamera();
    dom.aadhaarPhotoInput.value = '';
    state.faceCaptureComplete = false;
    dom.faceCapturePreview.width = 0;
    dom.faceCapturePreview.height = 0;
    dom.verificationSteps.hidden = true;
    dom.verificationSuccess.hidden = false;
    dom.reportDetailsFields.disabled = false;
    dom.reportVerificationNotice.textContent = 'Demo verification complete for this report. Identity files were discarded and were not uploaded.';
    dom.btnReportAddPhoto.textContent = 'Choose Project Photos';
  }

  function handleComplaintPhotoSelection() {
    if (!state.reportVerified) return;
    const selectedFiles = Array.from(dom.reportPhotosInput.files);
    const invalidFiles = selectedFiles.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length) {
      alert('Please select image files for project photos.');
    }
    selectedFiles
      .filter(file => file.type.startsWith('image/'))
      .forEach(file => {
        if (!state.complaintPhotos.some(existing => existing.name === file.name && existing.size === file.size)) {
          state.complaintPhotos.push(file);
        }
      });
    dom.reportPhotosInput.value = '';
    renderComplaintPhotoList();
  }

  function appendModerationItem(container, title, meta, body, actionLabel, action, photos = []) {
    const item = document.createElement('article');
    item.className = 'admin-moderation-item';
    const heading = document.createElement('strong');
    heading.textContent = title;
    const details = document.createElement('span');
    details.className = 'admin-moderation-meta';
    details.textContent = meta;
    const content = document.createElement('p');
    content.textContent = body;
    const previews = document.createElement('div');
    previews.className = 'admin-photo-preview-grid';
    photos.forEach(photo => {
      const image = document.createElement('img');
      image.src = URL.createObjectURL(photo);
      image.alt = `Attached project photo: ${photo.name}`;
      state.adminPhotoObjectUrls.push(image.src);
      previews.appendChild(image);
    });
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'admin-delete-btn';
    remove.textContent = actionLabel;
    remove.addEventListener('click', action);
    item.append(heading, details, content);
    if (photos.length) item.appendChild(previews);
    item.appendChild(remove);
    container.appendChild(item);
  }

  function findProjectTitle(projectId) {
    for (const city of Object.values(CIVIC_DATA.cities)) {
      const project = city.projects.find(candidate => candidate.id === projectId);
      if (project) return project.title;
    }
    return projectId || 'Project';
  }

  function clearAdminPhotoPreviews() {
    state.adminPhotoObjectUrls.forEach(url => URL.revokeObjectURL(url));
    state.adminPhotoObjectUrls = [];
  }

  function removeProjectCommentsForReport(reportId) {
    Object.values(CIVIC_DATA.cities).forEach(city => {
      city.projects.forEach(project => {
        project.comments = project.comments.filter(comment => comment.reportId !== reportId);
      });
    });
  }

  function renderAdminDashboard() {
    clearAdminPhotoPreviews();
    dom.adminComplaintsList.replaceChildren();
    dom.adminCommentsList.replaceChildren();

    state.publicReports.forEach(report => {
      const projectTitle = findProjectTitle(report.projectId);
      const photoNames = (report.photos || []).map(photo => photo.name).join(', ');
      appendModerationItem(
        dom.adminComplaintsList,
        report.category,
        `${projectTitle} · ${report.date} · ${report.witness}`,
        `${report.text}${photoNames ? `\nAttached photos: ${photoNames}` : ''}`,
        'Delete complaint',
        () => {
          state.publicReports = state.publicReports.filter(item => item.id !== report.id);
          removeProjectCommentsForReport(report.id);
          renderAdminDashboard();
          renderPublicReportsDocket();
          const activeProject = getActiveProject();
          if (activeProject) renderYouTubeComments(activeProject);
        },
        report.photos || []
      );
    });
    if (!state.publicReports.length) {
      dom.adminComplaintsList.textContent = 'No complaints have been submitted in this session.';
    }

    let commentCount = 0;
    Object.values(CIVIC_DATA.cities).forEach(city => {
      city.projects.forEach(project => {
        project.comments.forEach((comment, commentIndex) => {
          commentCount += 1 + (comment.replies || []).length;
          appendModerationItem(
            dom.adminCommentsList,
            comment.user,
            `${project.title} · ${comment.timeAgo}${comment.role ? ` · ${comment.role}` : ''}`,
            comment.text,
            'Delete comment',
            () => {
              project.comments.splice(commentIndex, 1);
              renderAdminDashboard();
              if (getActiveProject() === project) renderYouTubeComments(project);
            }
          );
          (comment.replies || []).forEach((reply, replyIndex) => {
            appendModerationItem(
              dom.adminCommentsList,
              reply.user,
              `${project.title} · reply to ${comment.user} · ${reply.timeAgo}`,
              reply.text,
              'Delete reply',
              () => {
                comment.replies.splice(replyIndex, 1);
                renderAdminDashboard();
                if (getActiveProject() === project) renderYouTubeComments(project);
              }
            );
          });
        });
      });
    });
    if (!commentCount) dom.adminCommentsList.textContent = 'No comments have been posted.';
    dom.adminComplaintCount.textContent = state.publicReports.length;
    dom.adminCommentCount.textContent = commentCount;
  }

  // ---------------------------------------------------------------------------
  // Event Bindings
  // ---------------------------------------------------------------------------
  function setupEventListeners() {
    // Nav Tabs
    dom.navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        switchInterface(target);
      });
    });

    if (dom.brandHomeBtn) {
      dom.brandHomeBtn.addEventListener('click', () => switchInterface('interface-1'));
    }

    if (dom.headerCityBtn) {
      dom.headerCityBtn.addEventListener('click', () => switchInterface('interface-1'));
    }

    // Global Header Back Button
    if (dom.globalHeaderBackBtn) {
      dom.globalHeaderBackBtn.addEventListener('click', handleNavigateBack);
    }

    // Header Logout Button
    if (dom.btnHeaderLogout) {
      dom.btnHeaderLogout.addEventListener('click', handleLogout);
    }

    if (dom.btnOpenAdmin) {
      dom.btnOpenAdmin.addEventListener('click', () => {
        dom.adminLoginError.hidden = true;
        dom.adminLoginModal.classList.add('active');
      });
    }
    if (dom.modalCloseAdminLogin) {
      dom.modalCloseAdminLogin.addEventListener('click', () => {
        dom.adminLoginModal.classList.remove('active');
        dom.adminLoginForm.reset();
      });
    }
    if (dom.adminLoginForm) {
      dom.adminLoginForm.addEventListener('submit', event => {
        event.preventDefault();
        const username = document.getElementById('admin-username').value.trim();
        const password = document.getElementById('admin-password').value;
        if (username !== 'admin' || password !== 'OurCityDemo!') {
          dom.adminLoginError.hidden = false;
          return;
        }
        dom.adminLoginForm.reset();
        dom.adminLoginError.hidden = true;
        dom.adminLoginModal.classList.remove('active');
        renderAdminDashboard();
        dom.adminDashboardModal.classList.add('active');
      });
    }
    if (dom.btnCloseAdminDashboard) {
      dom.btnCloseAdminDashboard.addEventListener('click', () => {
        dom.adminDashboardModal.classList.remove('active');
        clearAdminPhotoPreviews();
      });
    }

    // Left Back Arrow Buttons on Each Interface
    if (dom.i2BackBtn) {
      dom.i2BackBtn.addEventListener('click', () => switchInterface('interface-1'));
    }
    if (dom.i3BackBtn) {
      dom.i3BackBtn.addEventListener('click', () => switchInterface('interface-2'));
    }
    if (dom.i4BackBtn) {
      dom.i4BackBtn.addEventListener('click', () => switchInterface('interface-3'));
    }

    // Reset Map View Button
    if (dom.btnResetMapZoom) {
      dom.btnResetMapZoom.addEventListener('click', resetMapZoom);
    }

    // Map City Node Pins Click
    dom.cityNodes.forEach(node => {
      node.addEventListener('click', () => {
        const city = node.getAttribute('data-city');
        zoomMapToCity(city);
      });
    });

    // City Selection Cards Click
    dom.cityCards.forEach(card => {
      card.addEventListener('click', () => {
        const city = card.getAttribute('data-city');
        zoomMapToCity(city);
      });
    });

    // Get Started Button
    if (dom.btnGetStarted) {
      dom.btnGetStarted.addEventListener('click', () => {
        switchInterface('interface-2');
      });
    }

    // Simulated login accepts any required name, email, and password.
    if (dom.authForm) {
      dom.authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = dom.authNameInput.value.trim();
        const email = dom.authEmailInput.value.trim();
        triggerLoginSuccess(name, email);
      });
    }

    // Project Filter Pills
    dom.typeFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        dom.typeFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeFilters.type = btn.getAttribute('data-type');
        renderCityProjects();
      });
    });

    dom.statusFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        dom.statusFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeFilters.status = btn.getAttribute('data-status');
        renderCityProjects();
      });
    });

    if (dom.i2ChangeCityBtn) {
      dom.i2ChangeCityBtn.addEventListener('click', () => {
        switchInterface('interface-1');
      });
    }

    if (dom.btnBackToI2) {
      dom.btnBackToI2.addEventListener('click', () => {
        switchInterface('interface-2');
      });
    }

    if (dom.btnJumpToSec4) {
      dom.btnJumpToSec4.addEventListener('click', () => {
        switchInterface('interface-4');
      });
    }

    // Contractor Modal
    if (dom.btnViewContractorProfile) {
      dom.btnViewContractorProfile.addEventListener('click', openContractorModal);
    }
    if (dom.modalCloseContractor) {
      dom.modalCloseContractor.addEventListener('click', closeContractorModal);
    }

    // Comments Form
    if (dom.btnYtSubmit) {
      dom.btnYtSubmit.addEventListener('click', handleAddYouTubeComment);
    }
    if (dom.btnYtCancel) {
      dom.btnYtCancel.addEventListener('click', () => {
        dom.ytCommentInput.value = '';
      });
    }

    // Whistleblower Form
    if (dom.btnOpenWhistleblowerModal) {
      dom.btnOpenWhistleblowerModal.addEventListener('click', openReportModal);
    }
    if (dom.btnFilePublicReport) {
      dom.btnFilePublicReport.addEventListener('click', openReportModal);
    }
    if (dom.modalCloseReport) {
      dom.modalCloseReport.addEventListener('click', closeReportModal);
    }
    if (dom.btnReportAddPhoto) {
      dom.btnReportAddPhoto.addEventListener('click', () => {
        if (state.reportVerified) {
          dom.reportPhotosInput.click();
        } else {
          openVerificationModal();
        }
      });
    }
    if (dom.reportPhotosInput) {
      dom.reportPhotosInput.addEventListener('change', handleComplaintPhotoSelection);
    }
    if (dom.modalCloseVerification) {
      dom.modalCloseVerification.addEventListener('click', closeVerificationModal);
    }
    if (dom.aadhaarPhotoInput) {
      dom.aadhaarPhotoInput.addEventListener('change', handleAadhaarPhotoChange);
    }
    if (dom.btnAddAadhaarPhoto) {
      dom.btnAddAadhaarPhoto.addEventListener('click', () => dom.aadhaarPhotoInput.click());
    }
    if (dom.btnStartFaceCamera) {
      dom.btnStartFaceCamera.addEventListener('click', startFaceCamera);
    }
    if (dom.btnCaptureFacePhoto) {
      dom.btnCaptureFacePhoto.addEventListener('click', captureFacePhoto);
    }
    if (dom.btnCompleteVerification) {
      dom.btnCompleteVerification.addEventListener('click', completeDemoVerification);
    }
    if (dom.btnReturnToReport) {
      dom.btnReturnToReport.addEventListener('click', closeVerificationModal);
    }

    if (dom.whistleblowerForm) {
      dom.whistleblowerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!state.reportVerified || !dom.whistleblowerForm.reportValidity()) return;
        const cat = document.getElementById('report-category').value;
        const desc = document.getElementById('report-description').value;
        const witness = document.getElementById('report-witness').value || state.currentUser.name;
        const project = getActiveProject();
        const reportId = `REP-${Date.now()}`;

        const submittedReport = {
          id: reportId,
          city: state.currentCityId,
          projectId: state.currentProjectId,
          category: cat,
          text: desc,
          witness: witness,
          date: new Date().toLocaleString(),
          upvotes: 1,
          status: 'Filed to Docket',
          photos: state.complaintPhotos.slice()
        };
        state.publicReports.unshift(submittedReport);

        if (project) {
          project.comments.unshift({
            id: `c_${Date.now()}`,
            user: witness,
            role: 'Citizen Report',
            timeAgo: 'Just now',
            likes: 1,
            dislikes: 0,
            text: `[Grievance: ${cat}] ${desc}`,
            reportId: reportId,
            replies: []
          });
        }

        closeReportModal();
        dom.whistleblowerForm.reset();

        if (state.activeInterface === 'interface-3' && project) {
          renderYouTubeComments(project);
        } else if (state.activeInterface === 'interface-4') {
          renderPublicReportsDocket();
        }
      });
    }

    window.addEventListener('click', (e) => {
      if (e.target === dom.contractorModal) closeContractorModal();
      if (e.target === dom.reportModal) closeReportModal();
      if (e.target === dom.verificationModal) closeVerificationModal();
      if (e.target === dom.adminLoginModal) {
        dom.adminLoginModal.classList.remove('active');
        dom.adminLoginForm.reset();
      }
      if (e.target === dom.adminDashboardModal) {
        dom.adminDashboardModal.classList.remove('active');
        clearAdminPhotoPreviews();
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Initialization
  // ---------------------------------------------------------------------------
  function init() {
    setupEventListeners();
    setupScrollBlurListener();
    setupSimulationSlider();
    // Default zoom to Mumbai on load
    zoomMapToCity('mumbai');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
