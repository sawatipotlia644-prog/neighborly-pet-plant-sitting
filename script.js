// Neighborly app logic
// Keeps the request board, filter state, modal flow, and saved demo data in localStorage.

const STORAGE_KEY = 'neighborly-demo-state';

const sampleRequests = [
  {
    id: 'sample-1',
    title: 'Feed Miso & Say Hello',
    description: 'Miso is happiest with a quick dinner check and a little company before bedtime. A kind neighbor would be a big comfort for a short evening visit.',
    category: 'PET CARE',
    duration: '3 days • Jul 11–14',
    neighbor: 'Ava',
    icon: '🐾'
  },
  {
    id: 'sample-2',
    title: 'Give My Jungle a Drink',
    description: 'I am away for the weekend and my plants need a careful watering and a quick look for any droopy leaves. A friendly check-in would be amazing.',
    category: 'PLANT CARE',
    duration: '2 days • Jul 18–20',
    neighbor: 'Noah',
    icon: '🌿'
  },
  {
    id: 'sample-3',
    title: 'Porch & Parcel Check',
    description: 'I am out of town for a few days and would appreciate a neighbor to bring in a parcel, check the front porch, and make sure everything looks normal.',
    category: 'HOME CHECK-IN',
    duration: '4 days • Jul 24–28',
    neighbor: 'Mila',
    icon: '🏡'
  }
];

const state = loadState();

const requestList = document.querySelector('#request-list');
const filterButtons = document.querySelectorAll('.filter-button');
const modal = document.querySelector('#request-modal');
const form = document.querySelector('#request-form');
const successToast = document.querySelector('#success-toast');
const openButtons = document.querySelectorAll('[data-open-modal]');
const closeButtons = document.querySelectorAll('[data-close-modal]');

const titleInput = document.querySelector('#request-title');
const descriptionInput = document.querySelector('#request-description');
const categoryInput = document.querySelector('#request-category');
const durationInput = document.querySelector('#request-duration');
const nameInput = document.querySelector('#request-name');

function getDefaultState() {
  return {
    filter: 'ALL REQUESTS',
    requests: [...sampleRequests],
    activeFormRef: null
  };
}

function loadState() {
  const fallback = getDefaultState();

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return fallback;
    }

    const parsed = JSON.parse(saved);
    const requestArray = Array.isArray(parsed?.requests) ? parsed.requests : [...sampleRequests];

    return {
      filter: parsed?.filter || 'ALL REQUESTS',
      requests: requestArray.length ? requestArray : [...sampleRequests],
      activeFormRef: parsed?.activeFormRef || null
    };
  } catch (error) {
    console.warn('Could not parse saved Neighborly state:', error);
    return fallback;
  }
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function sanitizeText(value) {
  const temp = document.createElement('div');
  temp.textContent = value;
  return temp.innerHTML;
}

function setFormPreset(selectedRequestTitle = '') {
  if (selectedRequestTitle) {
    titleInput.value = `Re: ${selectedRequestTitle}`;
  } else {
    titleInput.value = '';
  }

  descriptionInput.value = '';
  categoryInput.value = '';
  durationInput.value = '';
  nameInput.value = '';
  clearErrors();
}

function clearErrors() {
  const allFields = form.querySelectorAll('input, select, textarea');
  allFields.forEach((field) => field.classList.remove('input-error'));

  document.querySelectorAll('.error-message').forEach((message) => {
    message.textContent = '';
  });
}

function showFormError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorTarget = document.getElementById(`error-${fieldId.split('-').pop()}`);

  if (field) field.classList.add('input-error');
  if (errorTarget) errorTarget.textContent = message;
}

function validateForm() {
  clearErrors();
  let valid = true;

  const title = titleInput.value.trim();
  if (!title) {
    showFormError('request-title', 'Please add a request title.');
    valid = false;
  }

  const description = descriptionInput.value.trim();
  if (!description) {
    showFormError('request-description', 'Tell neighbors a little about what you need.');
    valid = false;
  }

  const category = categoryInput.value.trim();
  if (!category) {
    showFormError('request-category', 'Choose a category.');
    valid = false;
  }

  const duration = durationInput.value.trim();
  if (!duration) {
    showFormError('request-duration', 'Add a duration or dates.');
    valid = false;
  }

  const firstName = nameInput.value.trim();
  if (!firstName) {
    showFormError('request-name', 'Please share your first name.');
    valid = false;
  }

  return valid;
}

function openModal(prefillTitle = '') {
  state.activeFormRef = prefillTitle || null;
  persistState();
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
  setFormPreset(prefillTitle);
  titleInput.focus();
}

function closeModal() {
  state.activeFormRef = null;
  persistState();
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  form.reset();
  clearErrors();
}

function showToast() {
  successToast.classList.add('visible');
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    successToast.classList.remove('visible');
  }, 2200);
}

function renderRequests() {
  requestList.innerHTML = '';

  const visible = state.requests.filter((request) => {
    return state.filter === 'ALL REQUESTS' || request.category === state.filter;
  });

  if (!visible.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.innerHTML = `
      <div>
        <h3>No requests in this category yet.</h3>
        <p>Choose another filter or post a new request to help your neighbors.</p>
      </div>
    `;
    requestList.appendChild(empty);
    return;
  }

  visible.forEach((request) => {
    const card = document.createElement('article');
    card.className = 'request-card';

    const top = document.createElement('div');
    top.className = 'request-top';

    const tag = document.createElement('span');
    tag.className = 'request-tag';
    tag.innerHTML = `<span class="request-icon">${sanitizeText(request.icon || '✨')}</span> ${sanitizeText(request.category)}`;

    const title = document.createElement('h3');
    title.textContent = request.title;

    const description = document.createElement('p');
    description.className = 'request-description';
    description.textContent = request.description;

    const footer = document.createElement('div');
    footer.className = 'request-footer';

    const meta = document.createElement('div');
    meta.className = 'request-meta';
    meta.innerHTML = `
      <span><strong>${sanitizeText(request.neighbor)}</strong> is nearby</span>
      <span>${sanitizeText(request.duration)}</span>
    `;

    const responseButton = document.createElement('button');
    responseButton.type = 'button';
    responseButton.className = 'request-action';
    responseButton.textContent = 'RESPOND';
    responseButton.setAttribute('aria-label', `Respond to ${request.title}`);
    responseButton.addEventListener('click', () => {
      state.activeFormRef = request.title;
      persistState();
      openModal(request.title);
    });

    top.appendChild(tag);
    footer.appendChild(meta);
    footer.appendChild(responseButton);

    card.appendChild(top);
    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(footer);
    requestList.appendChild(card);
  });
}

function updateFilterButtons() {
  filterButtons.forEach((button) => {
    const selected = button.dataset.filter === state.filter;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
}

function handleFilterClick(event) {
  const button = event.currentTarget;
  state.filter = button.dataset.filter;
  persistState();
  updateFilterButtons();
  renderRequests();
}

function handleSubmit(event) {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  const newRequest = {
    id: `custom-${Date.now()}`,
    title: titleInput.value.trim(),
    description: descriptionInput.value.trim(),
    category: categoryInput.value.trim(),
    duration: durationInput.value.trim(),
    neighbor: nameInput.value.trim(),
    icon: categoryInput.value.trim() === 'PET CARE' ? '🐾' : categoryInput.value.trim() === 'PLANT CARE' ? '🌿' : '🏡'
  };

  state.requests = [newRequest, ...state.requests];
  state.filter = 'ALL REQUESTS';
  state.activeFormRef = null;
  persistState();

  renderRequests();
  updateFilterButtons();
  closeModal();
  showToast();
}

function bindEvents() {
  filterButtons.forEach((button) => {
    button.addEventListener('click', handleFilterClick);
  });

  openButtons.forEach((button) => {
    button.addEventListener('click', () => {
      state.activeFormRef = null;
      persistState();
      openModal();
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener('click', closeModal);
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  form.addEventListener('submit', handleSubmit);
}

bindEvents();
updateFilterButtons();
renderRequests();

if (state.activeFormRef) {
  openModal(state.activeFormRef);
}
