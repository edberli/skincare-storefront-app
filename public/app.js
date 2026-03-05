const QUIZ_OPTIONS = {
  skinTypes: ['敏感肌', '痘痘肌', '乾肌', '油肌', '混合肌', '熟齡肌', '受損肌', '一般肌'],
  concerns: ['泛紅', '刺痛', '爆痘', '粉刺', '出油', '乾燥脫皮', '暗沉', '斑點', '細紋', '毛孔粗大', '屏障受損'],
  goals: ['去痘', '淡印', '保濕', '修復', '抗老', '美白提亮', '控油', '收毛孔', '防曬'],
  origins: ['全部', '日本', '韓國'],
  categories: ['洗面', '化妝水', '精華', '乳液', '面霜', '面膜', '防曬', '眼霜', '去角質', '痘痘護理', '安瓶'],
  usageModes: ['成套護膚流程', '單品推薦', '日間', '夜間', '急救']
};

const state = {
  runtimeMode: 'api',
  options: null,
  products: [],
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

function uniqueStrings(values) {
  return [...new Set(values.filter(Boolean))];
}

function resolveAssetUrl(relativePath) {
  return new URL(relativePath, document.baseURI).toString();
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

function makeProfileSummary() {
  const picks = [];
  if (state.selection.skinTypes.length) picks.push(`膚質：${state.selection.skinTypes.join('、')}`);
  if (state.selection.concerns.length) picks.push(`狀況：${state.selection.concerns.join('、')}`);
  if (state.selection.goals.length) picks.push(`目標：${state.selection.goals.join('、')}`);
  picks.push(`來源：${state.selection.brandOrigin}`);
  picks.push(`方式：${state.selection.usageMode}`);
  return picks.join(' ｜ ');
}

function renderRecommendations() {
  const response = state.recommendation;
  if (!response) return;

  renderList('care-tips-list', toArray(response.careTips));
  renderList('mistake-list', toArray(response.avoidMistakes));
  renderRoutineList('morning-routine', toArray(response.routine?.morning));
  renderRoutineList('night-routine', toArray(response.routine?.night));

  const note = $('#result-note');
  const baseText = response.note || '以下為綜合你選擇條件後最匹配的 3-5 款建議。';
  note.textContent = `${baseText}（${makeProfileSummary()}）`;

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

function normalizeProfile(input = {}) {
  return {
    skinTypes: Array.isArray(input.skinTypes) ? input.skinTypes : [],
    concerns: Array.isArray(input.concerns) ? input.concerns : [],
    goals: Array.isArray(input.goals) ? input.goals : [],
    brandOrigin: input.brandOrigin || '全部',
    categories: Array.isArray(input.categories) ? input.categories : [],
    usageMode: input.usageMode || '單品推薦'
  };
}

function scoreProduct(product, profile) {
  let score = 0;
  const matches = {
    skinTypes: [],
    concerns: [],
    goals: []
  };

  if (profile.brandOrigin !== '全部' && product.brandOrigin === profile.brandOrigin) {
    score += 3;
  }

  if (profile.skinTypes.length > 0) {
    matches.skinTypes = profile.skinTypes.filter((item) => toArray(product.suitableSkinTypes).includes(item));
    score += matches.skinTypes.length * 4;
  }

  if (profile.concerns.length > 0) {
    matches.concerns = profile.concerns.filter((item) => toArray(product.concerns).includes(item));
    score += matches.concerns.length * 3;
  }

  if (profile.goals.length > 0) {
    matches.goals = profile.goals.filter((item) => toArray(product.goals).includes(item));
    score += matches.goals.length * 5;
  }

  if (profile.categories.length > 0 && profile.categories.includes(product.category)) {
    score += 2;
  }

  if (profile.usageMode === '日間' && product.routineSlot?.morning) score += 2;
  if (profile.usageMode === '夜間' && product.routineSlot?.night) score += 2;
  if (profile.usageMode === '急救' && ['面膜', '安瓶', '痘痘護理'].includes(product.category)) score += 3;
  if (product.stock > 0) score += 1;
  if (product.tag === '敏感肌友好' && profile.skinTypes.includes('敏感肌')) score += 2;

  return { score, matches };
}

function productMatchesBasicFilters(product, profile) {
  if (profile.brandOrigin !== '全部' && product.brandOrigin !== profile.brandOrigin) return false;
  if (profile.categories.length > 0 && !profile.categories.includes(product.category)) return false;

  if (profile.skinTypes.length > 0) {
    const hasSkinMatch = profile.skinTypes.some((item) => toArray(product.suitableSkinTypes).includes(item));
    if (!hasSkinMatch && !toArray(product.suitableSkinTypes).includes('一般肌')) return false;
  }

  return true;
}

function buildBundleRecommendations(rankedProducts, usageMode) {
  if (usageMode !== '成套護膚流程') {
    return rankedProducts.slice(0, 5);
  }

  const requiredCategories = ['洗面', '化妝水', '精華', '面霜', '防曬'];
  const selected = [];
  const used = new Set();

  requiredCategories.forEach((category) => {
    const found = rankedProducts.find((item) => !used.has(item.product.id) && item.product.category === category);
    if (found) {
      selected.push(found);
      used.add(found.product.id);
    }
  });

  if (selected.length < 4) {
    rankedProducts.forEach((item) => {
      if (selected.length >= 5) return;
      if (!used.has(item.product.id)) {
        selected.push(item);
        used.add(item.product.id);
      }
    });
  }

  return selected;
}

function createReason(profile, matches) {
  const chunks = [];
  if (matches.goals.length > 0) chunks.push(`可對應你想要的「${matches.goals.join('、')}」目標`);
  if (matches.concerns.length > 0) chunks.push(`對「${matches.concerns.join('、')}」有針對性`);
  if (matches.skinTypes.length > 0) chunks.push(`與「${matches.skinTypes.join('、')}」相容度高`);
  if (profile.usageMode === '日間' || profile.usageMode === '夜間') chunks.push(`適合${profile.usageMode}保養節奏`);
  if (chunks.length === 0) chunks.push('配方溫和、容易融入日常流程');
  return `${chunks.slice(0, 2).join('，')}。`;
}

function buildCareTips(profile) {
  const tips = [];
  if (profile.skinTypes.includes('敏感肌') || profile.concerns.includes('刺痛')) {
    tips.push('先做局部測試，再逐步加入新產品，避免一次疊加太多活性成分。');
  }
  if (profile.goals.includes('保濕') || profile.concerns.includes('乾燥脫皮')) {
    tips.push('洗面後 1 分鐘內先補水，再用乳液或面霜封住水分。');
  }
  if (profile.goals.includes('去痘') || profile.concerns.includes('爆痘')) {
    tips.push('局部痘痘護理請薄塗，並把清潔頻率固定在早晚各一次。');
  }
  if (profile.goals.includes('抗老') || profile.concerns.includes('細紋')) {
    tips.push('夜間可把精華與面霜搭配，重點加強眼周和法令紋位置。');
  }
  if (profile.goals.includes('防曬')) {
    tips.push('日間最後一步記得足量防曬，戶外每 2-3 小時補擦一次。');
  }
  if (tips.length < 3) tips.push('每次只調整一個新產品，連續觀察 7-10 天再判斷是否有效。');
  if (tips.length < 4) tips.push('保養順序保持由輕到厚，能降低打架與搓泥機率。');
  if (tips.length < 5) tips.push('記錄近期作息與飲食，能更快找出爆痘或敏感觸發點。');

  return tips.slice(0, 5);
}

function buildAvoidMistakes(profile) {
  const mistakes = [
    '同一晚同時疊加多種高濃度酸類與去角質，容易引發泛紅刺痛。',
    '忽略防曬只做美白提亮，色素與暗沉會反覆出現。',
    '肌膚不穩定時頻繁更換整套產品，導致難以定位過敏來源。'
  ];

  if (profile.goals.includes('去痘') || profile.concerns.includes('粉刺')) {
    mistakes.push('過度清潔或頻繁刷酸，反而令皮脂分泌更失衡。');
  }
  if (profile.skinTypes.includes('乾肌')) {
    mistakes.push('只補水不鎖水，會令乾燥脫皮感在下午加劇。');
  }
  if (profile.skinTypes.includes('敏感肌')) {
    mistakes.push('刺痛期仍持續使用高刺激功效品，會拖慢屏障修復速度。');
  }

  return uniqueStrings(mistakes).slice(0, 5);
}

function buildSimpleRoutine(profile) {
  const morning = ['洗面', '化妝水', '精華', '乳液/面霜', '防曬'];
  const night = ['洗面', '化妝水', '精華/安瓶', '面霜'];

  if (profile.goals.includes('去痘') || profile.concerns.includes('爆痘')) {
    night.splice(3, 0, '痘痘護理');
  }
  if (profile.usageMode === '急救') {
    night.splice(3, 0, '急救面膜（每週 2-3 次）');
  }

  return { morning, night };
}

function buildFallbackResponse(profile) {
  return {
    careTips: buildCareTips(profile),
    avoidMistakes: buildAvoidMistakes(profile),
    routine: buildSimpleRoutine(profile),
    recommendations: [],
    note: '暫時未搵到完全匹配嘅產品，建議放寬一個篩選條件再試。'
  };
}

function recommendLocal(profileInput) {
  const profile = normalizeProfile(profileInput);

  const filtered = state.products.filter((product) => productMatchesBasicFilters(product, profile));
  const ranked = filtered
    .map((product) => {
      const result = scoreProduct(product, profile);
      return {
        product,
        score: result.score,
        matches: result.matches
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (ranked.length === 0) {
    return buildFallbackResponse(profile);
  }

  const selected = buildBundleRecommendations(ranked, profile.usageMode);
  const recommendations = selected.map((item) => ({
    id: item.product.id,
    name: item.product.name,
    brand: item.product.brand,
    brandOrigin: item.product.brandOrigin,
    category: item.product.category,
    intro: item.product.intro,
    tag: item.product.tag,
    reason: createReason(profile, item.matches),
    usageTip: item.product.usageTip,
    routineStep: item.product.routineStep,
    pairing: item.product.pairing
  }));

  return {
    careTips: buildCareTips(profile),
    avoidMistakes: buildAvoidMistakes(profile),
    routine: buildSimpleRoutine(profile),
    recommendations,
    note: ''
  };
}

function searchProductsLocal(keyword) {
  const query = String(keyword || '').trim().toLowerCase();
  let result = state.products;

  if (query) {
    result = state.products.filter((item) => {
      return (
        String(item.name || '').toLowerCase().includes(query) ||
        String(item.brand || '').toLowerCase().includes(query) ||
        String(item.category || '').toLowerCase().includes(query) ||
        toArray(item.goals).join(' ').toLowerCase().includes(query)
      );
    });
  }

  return {
    total: result.length,
    items: result.slice(0, 30)
  };
}

function getProductDetailLocal(productId) {
  const item = state.products.find((product) => product.id === productId);
  if (!item) return null;

  const sameBrand = state.products
    .filter((product) => product.brand === item.brand && product.id !== item.id)
    .slice(0, 4)
    .map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category
    }));

  return {
    ...item,
    sameBrandSuggest: sameBrand
  };
}

async function ensureLocalProductsLoaded() {
  if (state.products.length > 0) return;

  const response = await fetch(resolveAssetUrl('data/products.json'));
  if (!response.ok) {
    throw new Error('local_products_load_failed');
  }

  const payload = await response.json();
  state.products = toArray(payload.products);
}

async function fetchOptions() {
  if (state.runtimeMode === 'api') {
    try {
      const response = await fetch(resolveAssetUrl('api/options'));
      if (!response.ok) throw new Error('options_failed');
      return response.json();
    } catch (_error) {
      state.runtimeMode = 'local';
      await ensureLocalProductsLoaded();
      return QUIZ_OPTIONS;
    }
  }

  await ensureLocalProductsLoaded();
  return QUIZ_OPTIONS;
}

async function requestRecommendations(profile) {
  if (state.runtimeMode === 'api') {
    try {
      const response = await fetch(resolveAssetUrl('api/recommendations'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      if (!response.ok) throw new Error('recommendation_failed');
      return response.json();
    } catch (_error) {
      state.runtimeMode = 'local';
      await ensureLocalProductsLoaded();
    }
  }

  return recommendLocal(profile);
}

async function requestSearch(keyword) {
  if (state.runtimeMode === 'api') {
    try {
      const response = await fetch(`${resolveAssetUrl('api/products')}?q=${encodeURIComponent(keyword)}`);
      if (!response.ok) throw new Error('search_failed');
      return response.json();
    } catch (_error) {
      state.runtimeMode = 'local';
      await ensureLocalProductsLoaded();
    }
  }

  return searchProductsLocal(keyword);
}

async function requestProductDetail(productId) {
  if (state.runtimeMode === 'api') {
    try {
      const response = await fetch(resolveAssetUrl(`api/products/${productId}`));
      if (!response.ok) throw new Error('detail_failed');
      return response.json();
    } catch (_error) {
      state.runtimeMode = 'local';
      await ensureLocalProductsLoaded();
    }
  }

  return getProductDetailLocal(productId);
}

async function runRecommendation() {
  state.recommendation = await requestRecommendations(state.selection);
  renderRecommendations();
}

async function searchProducts() {
  const keyword = $('#search-input').value.trim();
  const payload = await requestSearch(keyword);
  state.searchResults = toArray(payload.items);
  state.searchDetail = null;
  renderSearchResults();
  renderSearchDetail();
}

async function fetchProductDetail(productId) {
  const detail = await requestProductDetail(productId);
  if (!detail) return;
  state.searchDetail = detail;
  renderSearchResults();
  renderSearchDetail();
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
    } catch (_error) {
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

function bindSearchEvents() {
  $('#search-btn').addEventListener('click', async () => {
    try {
      await searchProducts();
    } catch (_error) {
      window.alert('搜尋失敗，請稍後再試。');
    }
  });

  $('#search-input').addEventListener('keydown', async (event) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    try {
      await searchProducts();
    } catch (_error) {
      window.alert('搜尋失敗，請稍後再試。');
    }
  });
}

async function bootstrap() {
  bindFlowEvents();
  bindSearchEvents();

  try {
    state.options = await fetchOptions();
    renderQuiz();
    await searchProducts();
  } catch (_error) {
    window.alert('初始化資料失敗，請重整頁面。');
  }

  showScreen('home');
  $('#result-note').textContent = `目前條件：${makeProfileSummary()}`;
}

bootstrap();
