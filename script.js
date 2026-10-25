const STORAGE_KEY = 'neighborly-demo-state-v2';

const sampleRequests = [
  {
    id: 'sample-1',
    icon: '🐾',
    title: 'Feed Miso & Say Hello',
    category: 'Pet Sitting',
    startDate: '2026-10-30',
    endDate: '2026-11-02',
    location: 'Old Mill Neighborhood',
    description: 'Miso needs a quick dinner check, fresh water, and a short evening visit while we are away for the weekend.',
    instructions: 'Feed 1 scoop morning and evening, refill the water dish, and spend 15 minutes with Miso each visit. Please keep the windows closed and avoid feeding treats.',
    notes: 'Miso is shy with new people, so a quiet voice and gentle approach is best.',
    requester: 'Ava',
    status: 'Open'
  },
  {
    id: 'sample-2',
    icon: '🌿',
    title: 'Water the Balcony Plants',
    category: 'Plant Watering',
    startDate: '2026-10-28',
    endDate: '2026-10-31',
    location: 'Brookside Heights',
    description: 'My balcony and indoor herbs need a watering check while we are away for a long weekend.',
    instructions: 'Water the herb planters until the soil is evenly moist, skip the cactus, and check for any drooping or yellow leaves.',
    notes: 'The front door lock code is 4821. Please leave the plants in the sunlight area and avoid moving the larger pots.',
    requester: 'Noah',
    status: 'Open'
  },
  {
    id: 'sample-3',
    icon: '🏡',
    title: 'Check in on the House',
    category: 'Home Check-ins',
    startDate: '2026-11-05',
    endDate: '2026-11-09',
    location: 'Maple Lane',
    description: 'I am away for a few days and would appreciate a quick neighbor check for mail, lights, and general peace of mind.',
    instructions: 'Walk the main floor, check the front porch, bring in any packages, and confirm that doors and windows are closed and secure.',
    notes: 'Please text me if anything looks unusual or if there is a delivery issue.',
    requester: 'Mila',
    status: 'Open'
  }
];

const state = loadState();

const requestList = document.querySelector('#request-list');
const filterButtons = document.querySelectorAll('.filter-button');
const searchInput = document.querySelector('#request-search');
const detailModal = document.querySelector('#details-modal');
const formModal = document.querySelector('#request-form-modal');
const form = document.querySelector('#request-form');
const formConfirmation = document.querySelector('#form-confirmation');
const detailsContent = document.querySelector('#details-content');
const successToast = document.querySelector('#success-toast');
const openButtons = document.querySelectorAll('[data-open-form]');
const closeFormButtons = document.querySelectorAll('[data-close-form]');

const titleInput = document.querySelector('#request-title');
const categoryInput = document.querySelector('#request-category');
const startDateInput = document.querySelector('#request-start-date');
const endDateInput = document.querySelector('#request-end-date');
const locationInput = document.querySelector('#request-location');
const descriptionInput = document.querySelector('#request-description');
const instructionsInput = document.querySelector('#request-instructions');
const notesInput = document.querySelector('#request-notes');

function getDefaultState() {
  return {
    filter: 'All',
    search: '',
    requests: sampleRequests.map((request) => ({ ...request }))
  };
}

function normalizeRequest(request) {
  if (!request || typeof request !== 'object') return null;

  const title = typeof request.title === 'string' ? request.title.trim() : '';
  const category = ['Pet Sitting', 'Plant Watering', 'Home Check-ins'].includes(request.category) ? request.category : 'Pet Sitting';
  const description = typeof request.description === 'string' ? request.description.trim() : '';

  if (!title || !description) {
    return null;
  }

  return {
    id: request.id || `request-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    icon: request.icon || '✨',
    title,
    category,
    startDate: request.startDate || '',
    endDate: request.endDate || '',
    location: request.location || 'Neighborhood',
    description,
    instructions: request.instructions || 'Please follow the listed care instructions and keep the requester updated.',
    notes: request.notes || '',
    requester: request.requester || 'Neighbor',
    status: request.status || 'Open'
  };
}

function loadState() {
  const fallback = getDefaultState();

  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      const seededState = {
        filter: 'All',
        search: '',
        requests: fallback.requests.map((request) => ({ ...request }))
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seededState));
      return seededState;
    }

    const parsed = JSON.parse(saved);
    const storedRequests = Array.isArray(parsed?.requests)
      ? parsed.requests
          .map((request) => normalizeRequest(request))
          .filter(Boolean)
      : [];

    return {
      filter: typeof parsed?.filter === 'string' ? parsed.filter : 'All',
      search: typeof parsed?.search === 'string' ? parsed.search : '',
      requests: storedRequests.length ? storedRequests : fallback.requests.map((request) => ({ ...request }))
    };
  } catch (error) {
    console.warn('Could not read stored Neighborly data. Falling back to sample requests.', error);
    return fallback;
  }
}

function persistState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      filter: state.filter,
      search: state.search,
      requests: state.requests
    })
  );
}

function sanitizeText(value) {
  const temp = document.createElement('div');
  temp.textContent = value;
  return temp.innerHTML;
}

function clearFormErrors() {
  form.querySelectorAll('input, select, textarea').forEach((field) => field.classList.remove('input-error'));
  document.querySelectorAll('.error-message').forEach((message) => {
    message.textContent = '';
  });
}

function showFormError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorNode = document.getElementById(`error-${fieldId.replace('request-', '')}`);

  if (field) field.classList.add('input-error');
  if (errorNode) errorNode.textContent = message;
}

function showToast(message) {
  successToast.textContent = message;
  successToast.classList.add('visible');
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    successToast.classList.remove('visible');
  }, 2600);
}

function formatDate(dateString) {
  if (!dateString) return 'Flexible dates';

  const date = new Date(`${dateString}T12:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

function updateFilterButtons() {
  filterButtons.forEach((button) => {
    const selected = button.dataset.filter === state.filter;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
}

function renderRequests() {
  requestList.innerHTML = '';

  const searchTerm = state.search.trim().toLowerCase();
  const visibleRequests = state.requests.filter((request) => {
    const matchesFilter = state.filter === 'All' || request.category === state.filter;
    const matchesSearch = !searchTerm || `${request.title} ${request.description}`.toLowerCase().includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  if (!visibleRequests.length) {
    requestList.innerHTML = `
      <div class="empty-state">
        <div>
          <h3>No requests match your search.</h3>
          <p>Try another category or post a new request for your neighborhood.</p>
        </div>
      </div>
    `;
    return;
  }

  visibleRequests.forEach((request) => {
    const card = document.createElement('article');
    card.className = 'request-card';
    card.innerHTML = `
      <div class="request-top">
        <span class="request-tag"><span class="request-icon" aria-hidden="true">${sanitizeText(request.icon)}</span> ${sanitizeText(request.category)}</span>
      </div>
      <h3>${sanitizeText(request.title)}</h3>
      <div class="request-card-details">
        <div><strong>Dates:</strong> ${sanitizeText(formatDate(request.startDate))} - ${sanitizeText(formatDate(request.endDate))}</div>
        <div><strong>Location:</strong> ${sanitizeText(request.location)}</div>
      </div>
      <p class="request-description">${sanitizeText(request.description)}</p>
      <div class="request-footer">
        <div class="request-meta">
          <span><strong>${sanitizeText(request.requester)}</strong> is nearby</span>
          <span>${sanitizeText(request.status)}</span>
        </div>
        <button type="button" class="request-action view-details" data-request-id="${request.id}">View Details</button>
      </div>
    `;
    requestList.appendChild(card);
  });
}

function openDetailsModal(requestId) {
  const request = state.requests.find((item) => item.id === requestId);
  if (!request) return;

  const detailsHTML = `
    <div class="details-summary">
      <div class="details-header">
        <span class="detail-badge">${sanitizeText(request.category)}</span>
        <h3 id="details-title">${sanitizeText(request.title)}</h3>
      </div>

      <div class="details-section">
        <h3>Overview</h3>
        <p>${sanitizeText(request.description)}</p>
      </div>

      <div class="details-section">
        <h3>Care details</h3>
        <ul class="details-list">
          <li><strong>Dates:</strong> ${sanitizeText(formatDate(request.startDate))} - ${sanitizeText(formatDate(request.endDate))}</li>
          <li><strong>Location:</strong> ${sanitizeText(request.location)}</li>
          <li><strong>Requester:</strong> ${sanitizeText(request.requester)}</li>
          <li><strong>Status:</strong> ${sanitizeText(request.status)}</li>
        </ul>
      </div>

      <div class="details-section">
        <h3>Instructions</h3>
        <p>${sanitizeText(request.instructions)}</p>
      </div>

      ${request.notes ? `
        <div class="details-section">
          <h3>Additional notes</h3>
          <p>${sanitizeText(request.notes)}</p>
        </div>
      ` : ''}

      <div class="detail-actions">
        <button type="button" class="button button-secondary" data-close-details>Close</button>
        <button type="button" class="button button-primary" id="offer-help-button">I Can Help</button>
      </div>
    </div>
  `;

  detailsContent.innerHTML = detailsHTML;
  detailModal.classList.remove('hidden');
  detailModal.setAttribute('aria-hidden', 'false');

  const responderButton = document.querySelector('#offer-help-button');
  responderButton.addEventListener('click', () => {
    showToast('Thanks! You can connect with the requester through your own preferred contact method.');
    closeDetailsModal();
  });
}

function closeDetailsModal() {
  detailModal.classList.add('hidden');
  detailModal.setAttribute('aria-hidden', 'true');
}

function openRequestForm(prefill = null) {
  clearFormErrors();
  formConfirmation.hidden = true;
  formConfirmation.textContent = '';
  form.reset();

  if (prefill && typeof prefill === 'object') {
    titleInput.value = prefill.title || '';
    categoryInput.value = prefill.category || '';
    startDateInput.value = prefill.startDate || '';
    endDateInput.value = prefill.endDate || '';
    locationInput.value = prefill.location || '';
    descriptionInput.value = prefill.description || '';
    instructionsInput.value = prefill.instructions || '';
    notesInput.value = prefill.notes || '';
  }

  formModal.classList.remove('hidden');
  formModal.setAttribute('aria-hidden', 'false');
  titleInput.focus();
}

function closeRequestForm() {
  clearFormErrors();
  formConfirmation.hidden = true;
  formConfirmation.textContent = '';
  form.reset();
  formModal.classList.add('hidden');
  formModal.setAttribute('aria-hidden', 'true');
}

function validateRequestForm() {
  clearFormErrors();
  let valid = true;

  const title = titleInput.value.trim();
  if (!title) {
    showFormError('request-title', 'Please add a request title.');
    valid = false;
  }

  const category = categoryInput.value.trim();
  if (!category) {
    showFormError('request-category', 'Choose a care category.');
    valid = false;
  }

  const startDate = startDateInput.value;
  const endDate = endDateInput.value;

  if (!startDate) {
    showFormError('request-start-date', 'Add a start date.');
    valid = false;
  }

  if (!endDate) {
    showFormError('request-end-date', 'Add an end date.');
    valid = false;
  }

  if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    showFormError('request-end-date', 'End date must be on or after the start date.');
    valid = false;
  }

  const location = locationInput.value.trim();
  if (!location) {
    showFormError('request-location', 'Please share the location or neighborhood.');
    valid = false;
  }

  const description = descriptionInput.value.trim();
  if (!description) {
    showFormError('request-description', 'Tell neighbors a little about the task.');
    valid = false;
  }

  const instructions = instructionsInput.value.trim();
  if (!instructions) {
    showFormError('request-instructions', 'Add care instructions for the helper.');
    valid = false;
  }

  return valid;
}

function handleFormSubmit(event) {
  event.preventDefault();

  if (!validateRequestForm()) {
    return;
  }

  const newRequest = normalizeRequest({
    id: `custom-${Date.now()}`,
    icon: categoryInput.value === 'Pet Sitting' ? '🐾' : categoryInput.value === 'Plant Watering' ? '🌿' : '🏡',
    title: titleInput.value.trim(),
    category: categoryInput.value,
    startDate: startDateInput.value,
    endDate: endDateInput.value,
    location: locationInput.value.trim(),
    description: descriptionInput.value.trim(),
    instructions: instructionsInput.value.trim(),
    notes: notesInput.value.trim(),
    requester: 'You',
    status: 'Open'
  });

  if (!newRequest) {
    showToast('Please review the form and try again.');
    return;
  }

  state.requests = [newRequest, ...state.requests];
  state.filter = 'All';
  state.search = '';
  searchInput.value = '';
  persistState();

  renderRequests();
  updateFilterButtons();

  formConfirmation.hidden = false;
  formConfirmation.innerHTML = `Request preview saved: <strong>${sanitizeText(newRequest.title)}</strong> for ${sanitizeText(newRequest.category)} from ${sanitizeText(formatDate(newRequest.startDate))} to ${sanitizeText(formatDate(newRequest.endDate))}.`;
  form.reset();
  showToast('Your request was saved in this browser demo.');
}

function bindEvents() {
  filterButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const target = event.currentTarget;
      state.filter = target.dataset.filter;
      persistState();
      updateFilterButtons();
      renderRequests();
    });
  });

  searchInput.addEventListener('input', (event) => {
    state.search = event.target.value;
    persistState();
    renderRequests();
  });

  requestList.addEventListener('click', (event) => {
    const button = event.target.closest('.view-details');
    if (!button) return;
    openDetailsModal(button.dataset.requestId);
  });

  openButtons.forEach((button) => {
    button.addEventListener('click', () => openRequestForm());
  });

  closeFormButtons.forEach((button) => {
    button.addEventListener('click', closeRequestForm);
  });

  detailModal.addEventListener('click', (event) => {
    if (event.target.closest('[data-close-details]')) {
      closeDetailsModal();
      return;
    }

    if (event.target === detailModal) closeDetailsModal();
  });

  formModal.addEventListener('click', (event) => {
    if (event.target === formModal) closeRequestForm();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (!detailModal.classList.contains('hidden')) closeDetailsModal();
      if (!formModal.classList.contains('hidden')) closeRequestForm();
    }
  });

  form.addEventListener('submit', handleFormSubmit);
}

bindEvents();
updateFilterButtons();
renderRequests();
