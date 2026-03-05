const state = {
  options: null,
  selection: {
    skinTypes: [],
    concerns: [],
    goals: [],
    brandOrigin: '全部',
    categories: [],
    usageMode: '成套護膚流程'
  },
  recommendation: null,
  searchResults: [],
  searchDetail: null
};

const screenIds = {
  home: 'screen-home',
  'quiz-1': 'screen-quiz-1',
  'quiz-2': 'screen-quiz-2',
  'quiz-3': 'screen-quiz-3',
  advice: 'screen-advice',
  results: 'screen-results',
  search: 'screen-search',
  routine: 'screen-routine'
};

function $(selector) {
  return document.querySelector(selector);
}

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function showScreen(name) {
  Object.entries(screenIds).forEach(([key, id]) => {
    const node = document.getElementById(id);
    if (!node) return;
    node.classList.toggle('active', key === name);
  });

  if (name === 'routine') {
    renderRoutineVisual();
  }
}

function renderChipOptions(containerId, options, selectedValues, onToggle) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  options.forEach((option) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip';
    chip.textContent = option;

    if (selectedValues.includes(option)) {
      chip.classList.add('selected');
    }

    chip.addEventListener('click', () => onToggle(option));
    container.appendChild(chip);
  });
}

function renderSingleChoice(containerId, options, selectedValue, onSelect) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  options.forEach((option) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip';
    chip.textContent = option;

    if (selectedValue === option) {
      chip.classList.add('selected');
    }

    chip.addEventListener('click', () => onSelect(option));
    container.appendChild(chip);
  });
}

function toggleValue(array, value) {
  if (array.includes(value)) {
    return array.filter((item) => item !== value);
  }
  return [...array, value];
}

function renderQuiz() {
  if (!state.options) return;

  renderChipOptions('skin-type-options', state.options.skinTypes, state.selection.skinTypes, (value) => {
    state.selection.skinTypes = toggleValue(state.selection.skinTypes, value);
    renderQuiz();
  });

  renderChipOptions('concern-options', state.options.concerns, state.selection.concerns, (value) => {
    state.selection.concerns = toggleValue(state.selection.concerns, value);
    renderQuiz();
  });

  renderChipOptions('goal-options', state.options.goals, state.selection.goals, (value) => {
    state.selection.goals = toggleValue(state.selection.goals, value);
    renderQuiz();
  });

  renderChipOptions('category-options', state.options.categories, state.selection.categories, (value) => {
    state.selection.categories = toggleValue(state.selection.categories, value);
    renderQuiz();
  });

  renderSingleChoice('origin-options', state.options.origins, state.selection.brandOrigin, (value) => {
    state.selection.brandOrigin = value;
    renderQuiz();
  });

  renderSingleChoice('usage-options', state.options.usageModes, state.selection.usageMode, (value) => {
    state.selection.usageMode = value;
    renderQuiz();
  });
}

function renderList(targetId, items) {
  const list = document.getElementById(targetId);
  if (!list) return;
  list.innerHTML = '';

  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    list.appendChild(li);
  });
}

function renderRoutineList(targetId, items) {
  const list = document.getElementById(targetId);
  if (!list) return;
  list.innerHTML = '';

  items.forEach((step) => {
    const li = document.createElement('li');
    li.textContent = step;
    list.appendChild(li);
  });
}

function renderRecommendations() {
  const response = state.recommendation;
  if (!response) return;

  renderList('care-tips-list', toArray(response.careTips));
  renderList('mistake-list', toArray(response.avoidMistakes));
  renderRoutineList('morning-routine', toArray(response.routine?.morning));
  renderRoutineList('night-routine', toArray(response.routine?.night));

  const note = $('#result-note');
  note.textContent = response.note || '以下為綜合你選擇條件後最匹配的 3-5 款建議。';

  const cards = document.getElementById('recommendation-cards');
  cards.innerHTML = '';

  const recommendations = toArray(response.recommendations);
  if (recommendations.length === 0) {
    const empty = document.createElement('article');
    empty.className = 'product-card';
    empty.innerHTML = '<h3>暫時未有匹配結果</h3><p>建議放寬品牌來源或類別，再重新生成建議。</p>';
    cards.appendChild(empty);
    return;
  }

  recommendations.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'product-card';

    const pairingText = product.pairing && product.pairing.length > 0
      ? product.pairing.map((item) => `${item.category}: ${item.name}`).join(' / ')
      : '可與同品牌化妝水或面霜搭配使用';

    card.innerHTML = `
      <div class="product-head">
        <h3>${product.name}</h3>
        <span class="badge">${product.tag}</span>
      </div>
      <p class="meta-row">${product.brand} ・ ${product.brandOrigin} ・ ${product.category}</p>
      <p>${product.intro}</p>
      <p><strong>推薦原因：</strong>${product.reason}</p>
      <p class="small-label">建議搭配：${pairingText}</p>
      <p class="small-label">步驟位置：${product.routineStep}</p>
    `;

    cards.appendChild(card);
  });
}

function makeProfileSummary() {
  const picks = [];
  if (state.selection.skinTypes.length) picks.push(`膚質：${state.selection.skinTypes.join('、')}`);
  if (state.selection.concerns.length) picks.push(`狀況：${state.selection.concerns.join('、')}`);
  if (state.selection.goals.length) picks.push(`目標：${state.selection.goals.join('、')}`);
  picks.push(`來源：${state.selection.brandOrigin}`);
  picks.push(`方式：${state.selection.usageMode}`);
  return picks.join(' ｜ ');
}

function renderRoutineVisual() {
  const root = $('#routine-visual');
  if (!root) return;

  const recs = toArray(state.recommendation?.recommendations);
  const byCategory = new Map(recs.map((item) => [item.category, item]));

  const steps = [
    { key: '洗面', title: 'Step 1 溫和清潔', fallback: '洗面產品，清除多餘油脂與污垢。' },
    { key: '化妝水', title: 'Step 2 補水調理', fallback: '化妝水幫助後續吸收。' },
    { key: '精華', title: 'Step 3 重點修護', fallback: '針對目標功效集中修護。' },
    { key: '面霜', title: 'Step 4 鎖水修護', fallback: '用面霜或乳液封住水分。' },
    { key: '防曬', title: 'Step 5 日間防護', fallback: '白天最後一步防曬。' }
  ];

  root.innerHTML = '';

  steps.forEach((step, index) => {
    const product = byCategory.get(step.key);
    const node = document.createElement('article');
    node.className = 'flow-step';
    node.innerHTML = `
      <span class="step-index">${index + 1}</span>
      <h4>${step.title}</h4>
      <p>${product ? product.name : step.fallback}</p>
      <p class="small-label">${product ? `${product.brand} ・ ${product.tag}` : '可於推薦頁補齊'}</p>
    `;
    root.appendChild(node);
  });
}

async function runRecommendation() {
  const response = await fetch('/api/recommendations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state.selection)
  });

  if (!response.ok) {
    throw new Error('recommendation_failed');
  }

  state.recommendation = await response.json();
  renderRecommendations();
}

function bindFlowEvents() {
  document.querySelectorAll('[data-nav]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.getAttribute('data-nav');
      if (target) showScreen(target);
    });
  });

  $('#start-quiz-btn').addEventListener('click', () => showScreen('quiz-1'));

  $('#to-step-2-btn').addEventListener('click', () => {
    if (state.selection.skinTypes.length === 0) {
      window.alert('請先選擇至少 1 個膚質選項。');
      return;
    }
    showScreen('quiz-2');
  });

  $('#to-step-3-btn').addEventListener('click', () => {
    if (state.selection.concerns.length === 0) {
      window.alert('請先選擇至少 1 個肌膚狀況。');
      return;
    }
    showScreen('quiz-3');
  });

  $('#back-step-1-btn').addEventListener('click', () => showScreen('quiz-1'));
  $('#back-step-2-btn').addEventListener('click', () => showScreen('quiz-2'));

  $('#submit-quiz-btn').addEventListener('click', async () => {
    if (state.selection.goals.length === 0) {
      window.alert('建議至少選擇 1 個功效目標。');
      return;
    }

    const button = $('#submit-quiz-btn');
    button.disabled = true;
    const previousText = button.textContent;
    button.textContent = '生成中...';

    try {
      await runRecommendation();
      showScreen('advice');
    } catch (error) {
      window.alert('生成建議失敗，請稍後再試。');
    } finally {
      button.disabled = false;
      button.textContent = previousText;
    }
  });

  $('#to-results-btn').addEventListener('click', () => {
    renderRecommendations();
    showScreen('results');
  });

  $('#rebuild-plan-btn').addEventListener('click', () => {
    state.selection.skinTypes = [];
    state.selection.concerns = [];
    state.selection.goals = [];
    state.selection.categories = [];
    state.selection.brandOrigin = '全部';
    state.selection.usageMode = '成套護膚流程';
    state.recommendation = null;
    renderQuiz();
    showScreen('quiz-1');
  });

  $('#to-routine-flow-btn').addEventListener('click', () => showScreen('routine'));
}

function renderSearchResults() {
  const root = $('#search-results');
  root.innerHTML = '';

  if (state.searchResults.length === 0) {
    root.innerHTML = '<article class="search-item">未找到對應產品，請試更短關鍵字。</article>';
    return;
  }

  state.searchResults.forEach((item) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'search-item';
    if (state.searchDetail?.id === item.id) {
      button.classList.add('active');
    }

    button.innerHTML = `
      <strong>${item.name}</strong>
      <p>${item.brand} ・ ${item.brandOrigin} ・ ${item.category}</p>
    `;

    button.addEventListener('click', () => {
      fetchProductDetail(item.id);
    });

    root.appendChild(button);
  });
}

function renderSearchDetail() {
  const detail = $('#search-detail');
  if (!state.searchDetail) {
    detail.className = 'search-detail empty';
    detail.textContent = '搜尋後點選產品查看詳細資訊。';
    return;
  }

  const item = state.searchDetail;
  detail.className = 'search-detail';

  const pairingText = toArray(item.pairing).length
    ? item.pairing.map((pair) => `${pair.category}：${pair.name}`).join(' / ')
    : '同品牌精華或面霜皆可搭配';

  detail.innerHTML = `
    <h3>${item.name}</h3>
    <p class="detail-meta">${item.brand} ・ ${item.brandOrigin} ・ ${item.category}</p>
    <p>${item.intro}</p>
    <ul>
      <li><strong>適合膚質：</strong>${toArray(item.suitableSkinTypes).join('、')}</li>
      <li><strong>主要功效：</strong>${toArray(item.goals).join('、')}</li>
      <li><strong>系列：</strong>${item.series || '-'}</li>
      <li><strong>標籤：</strong>${item.tag}</li>
      <li><strong>搭配建議：</strong>${pairingText}</li>
      <li><strong>護膚步驟位置：</strong>${item.routineStep}</li>
    </ul>
  `;
}

async function searchProducts() {
  const keyword = $('#search-input').value.trim();
  const response = await fetch(`/api/products?q=${encodeURIComponent(keyword)}`);
  if (!response.ok) throw new Error('search_failed');
  const payload = await response.json();
  state.searchResults = toArray(payload.items);
  state.searchDetail = null;
  renderSearchResults();
  renderSearchDetail();
}

async function fetchProductDetail(productId) {
  const response = await fetch(`/api/products/${productId}`);
  if (!response.ok) return;
  state.searchDetail = await response.json();
  renderSearchResults();
  renderSearchDetail();
}

function bindSearchEvents() {
  $('#search-btn').addEventListener('click', async () => {
    try {
      await searchProducts();
    } catch (error) {
      window.alert('搜尋失敗，請稍後再試。');
    }
  });

  $('#search-input').addEventListener('keydown', async (event) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    try {
      await searchProducts();
    } catch (error) {
      window.alert('搜尋失敗，請稍後再試。');
    }
  });
}

async function loadOptions() {
  const response = await fetch('/api/options');
  if (!response.ok) throw new Error('options_failed');
  state.options = await response.json();
  renderQuiz();
}

async function bootstrap() {
  bindFlowEvents();
  bindSearchEvents();

  try {
    await loadOptions();
    await searchProducts();
  } catch (error) {
    window.alert('初始化資料失敗，請重整頁面。');
  }

  showScreen('home');
  $('#result-note').textContent = `目前條件：${makeProfileSummary()}`;
}

bootstrap();
