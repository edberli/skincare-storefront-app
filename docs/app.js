const QUIZ_OPTIONS = {
  skinTypes: ['敏感肌', '痘痘肌', '乾肌', '油肌', '混合肌', '熟齡肌', '受損肌', '一般肌'],
  concerns: ['泛紅', '刺痛', '爆痘', '粉刺', '出油', '乾燥脫皮', '暗沉', '斑點', '細紋', '毛孔粗大', '屏障受損'],
  origins: ['全部', '日本', '韓國'],
  categories: ['洗面', '化妝水', '精華', '乳液', '面霜', '面膜', '防曬', '眼霜', '去角質', '痘痘護理', '安瓶'],
  usageModes: ['成套護膚流程', '單品推薦', '日間', '夜間', '急救']
};

const OPTION_META = {
  '敏感肌': { motif: 'feather', hint: '容易泛紅、刺痛，需要穩定同舒緩。' },
  '痘痘肌': { motif: 'dots', hint: '暗瘡、粉刺反覆出現，想先穩定代謝。' },
  '乾肌': { motif: 'drop', hint: '洗後繃緊、缺水感明顯，想提升柔軟度。' },
  '油肌': { motif: 'ripple', hint: '油光較明顯，容易覺得悶焗同厚重。' },
  '混合肌': { motif: 'halo', hint: 'T 區易出油，面頰位置又會偏乾。' },
  '熟齡肌': { motif: 'leaf', hint: '在意細紋、鬆弛、彈性同光澤感。' },
  '受損肌': { motif: 'plus', hint: '屏障不穩、易乾癢，想先修護再進階。' },
  '一般肌': { motif: 'spark', hint: '整體穩定，想維持好狀態再微調。' },
  泛紅: { motif: 'feather', hint: '肌膚容易受刺激，先減低不適感。' },
  刺痛: { motif: 'feather', hint: '代表肌膚正在求救，先以溫和為主。' },
  爆痘: { motif: 'dots', hint: '近期狀態不穩，想先集中處理痘痘。' },
  粉刺: { motif: 'dots', hint: '需要兼顧代謝、清潔同日常穩定。' },
  出油: { motif: 'ripple', hint: '想令膚感更清爽，減少油膩感。' },
  乾燥脫皮: { motif: 'drop', hint: '需要快速補水同加強鎖水保護。' },
  暗沉: { motif: 'halo', hint: '想提升光澤感，令膚色睇落更精神。' },
  斑點: { motif: 'spark', hint: '想針對膚色不均同印痕位置加強。' },
  細紋: { motif: 'leaf', hint: '想加強滋養感同彈潤度。' },
  毛孔粗大: { motif: 'ripple', hint: '想改善肌理觀感，同時避免太刺激。' },
  屏障受損: { motif: 'plus', hint: '要先穩定膚況，再加入功效型產品。' },
  去痘: { motif: 'dots', hint: '優先減少新痘出現，同時照顧穩定度。' },
  淡印: { motif: 'spark', hint: '希望舊痘印或色沉慢慢變淡。' },
  保濕: { motif: 'drop', hint: '重點提升飽滿水潤感，令膚感更舒服。' },
  修復: { motif: 'leaf', hint: '想先把肌膚穩定落嚟，再慢慢進階。' },
  抗老: { motif: 'leaf', hint: '集中照顧細紋、彈性同滋養感。' },
  美白提亮: { motif: 'halo', hint: '想令膚色感覺更透亮、更有精神。' },
  控油: { motif: 'ripple', hint: '想令日間膚感更爽，同時保持水分。' },
  收毛孔: { motif: 'ripple', hint: '改善肌理觀感，同時兼顧溫和度。' },
  防曬: { motif: 'sun', hint: '日間最後一步，保護之前所有保養。' },
  全部: { motif: 'halo', hint: '先打開全部選擇，再由匹配度幫你排序。' },
  日本: { motif: 'sun', hint: '偏向細緻、舒服、講求日常使用感。' },
  韓國: { motif: 'ripple', hint: '修護、補水、亮膚選擇通常較豐富。' },
  洗面: { motif: 'drop', hint: '作為第一步，把多餘油脂同污垢帶走。' },
  化妝水: { motif: 'ripple', hint: '補水調理，幫後續產品更易吸收。' },
  精華: { motif: 'bottle', hint: '集中處理你最在意嘅護膚目標。' },
  乳液: { motif: 'leaf', hint: '柔潤鎖水，膚感通常會較輕盈。' },
  面霜: { motif: 'leaf', hint: '加強封存水分，同時提升穩定感。' },
  面膜: { motif: 'halo', hint: '適合加強保養或急救補水時使用。' },
  眼霜: { motif: 'spark', hint: '針對眼周乾紋同細緻護理位置。' },
  去角質: { motif: 'spark', hint: '幫助代謝，但需要控制頻率同刺激度。' },
  '痘痘護理': { motif: 'dots', hint: '適合局部針對使用，唔建議厚敷全臉。' },
  安瓶: { motif: 'bottle', hint: '高濃度集中修護，適合特定時期加入。' },
  '成套護膚流程': { motif: 'halo', hint: '想一次拎到完整 steps 同配搭思路。' },
  '單品推薦': { motif: 'bottle', hint: '先鎖定最值得先試的一件主力產品。' },
  日間: { motif: 'sun', hint: '偏向清爽、穩定、防護感較高的組合。' },
  夜間: { motif: 'moon', hint: '適合加強修護、滋養同重點護理。' },
  急救: { motif: 'plus', hint: '當膚況不穩時，先集中舒緩同修護。' }
};

const screenIds = {
  home: 'screen-home',
  'quiz-1': 'screen-quiz-1',
  'quiz-2': 'screen-quiz-2',
  'quiz-3': 'screen-quiz-3',
  results: 'screen-results',
  search: 'screen-search',
  routine: 'screen-routine'
};

function createInitialSelection() {
  return {
    skinTypes: [],
    concerns: [],
    brandOrigin: '全部',
    categories: [],
    usageMode: '成套護膚流程'
  };
}

const state = {
  options: QUIZ_OPTIONS,
  products: [],
  selection: createInitialSelection(),
  recommendation: null,
  searchResults: [],
  searchDetail: null,
  searchTotal: 0
};

function $(selector) {
  return document.querySelector(selector);
}

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function uniqueStrings(values) {
  return [...new Set(toArray(values).filter(Boolean))];
}

function summarizeList(values, limit = 3) {
  const list = toArray(values);
  if (list.length === 0) return '';
  if (list.length <= limit) return list.join('、');
  return `${list.slice(0, limit).join('、')} +${list.length - limit}`;
}

function resolveAssetUrl(relativePath) {
  return new URL(relativePath, document.baseURI).toString();
}

function toggleValue(array, value) {
  if (array.includes(value)) {
    return array.filter((item) => item !== value);
  }
  return [...array, value];
}

function getOptionMeta(label) {
  return OPTION_META[label] || {
    motif: 'halo',
    hint: '按你目前最想優先處理嘅方向去揀就可以。'
  };
}

function showScreen(name) {
  Object.entries(screenIds).forEach(([key, id]) => {
    const node = document.getElementById(id);
    if (node) {
      node.classList.toggle('active', key === name);
    }
  });

  document.querySelectorAll('.nav-btn[data-nav], .nav-pill[data-nav]').forEach((button) => {
    button.classList.toggle('active', button.getAttribute('data-nav') === name);
  });

  if (name === 'routine') {
    renderRoutineVisual();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function buildSummaryItems() {
  const items = [];
  if (state.selection.skinTypes.length) items.push(`膚質 · ${summarizeList(state.selection.skinTypes, 2)}`);
  if (state.selection.concerns.length) items.push(`狀況 · ${summarizeList(state.selection.concerns, 3)}`);
  if (state.selection.categories.length) items.push(`類別 · ${summarizeList(state.selection.categories, 3)}`);
  items.push(`品牌來源 · ${state.selection.brandOrigin}`);
  items.push(`使用方式 · ${state.selection.usageMode}`);
  return items;
}

function makeProfileSummaryText() {
  return buildSummaryItems().join(' ｜ ');
}

function renderSummaryCloud(targetId) {
  const root = document.getElementById(targetId);
  if (!root) return;

  const items = buildSummaryItems();
  root.innerHTML = '';

  items.forEach((item) => {
    const chip = document.createElement('span');
    chip.className = 'summary-chip';
    chip.textContent = item;
    root.appendChild(chip);
  });
}

function renderChoiceCards(containerId, options, selectedValue, onChange, config = {}) {
  const { single = false } = config;
  const root = document.getElementById(containerId);
  if (!root) return;

  root.innerHTML = '';

  options.forEach((option) => {
    const meta = getOptionMeta(option);
    const isSelected = single ? selectedValue === option : toArray(selectedValue).includes(option);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = `chip ${isSelected ? 'selected' : ''}`;
    button.textContent = option;
    button.title = meta.hint;

    button.addEventListener('click', () => onChange(option));
    root.appendChild(button);
  });
}

function renderQuiz() {
  renderChoiceCards('skin-type-options', state.options.skinTypes, state.selection.skinTypes, (value) => {
    state.selection.skinTypes = toggleValue(state.selection.skinTypes, value);
    renderQuiz();
  });

  renderChoiceCards('concern-options', state.options.concerns, state.selection.concerns, (value) => {
    state.selection.concerns = toggleValue(state.selection.concerns, value);
    renderQuiz();
  });

  renderChoiceCards('category-options', state.options.categories, state.selection.categories, (value) => {
    state.selection.categories = toggleValue(state.selection.categories, value);
    renderQuiz();
  });

  renderChoiceCards('origin-options', state.options.origins, state.selection.brandOrigin, (value) => {
    state.selection.brandOrigin = value;
    renderQuiz();
  }, { single: true });

  renderChoiceCards('usage-options', state.options.usageModes, state.selection.usageMode, (value) => {
    state.selection.usageMode = value;
    renderQuiz();
  }, { single: true });
}

function renderList(targetId, items) {
  const root = document.getElementById(targetId);
  if (!root) return;
  root.innerHTML = '';

  toArray(items).forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    root.appendChild(li);
  });
}

function normalizeProfile(input = {}) {
  return {
    skinTypes: toArray(input.skinTypes),
    concerns: toArray(input.concerns),
    brandOrigin: input.brandOrigin || '全部',
    categories: toArray(input.categories),
    usageMode: input.usageMode || '單品推薦'
  };
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

function scoreProduct(product, profile) {
  let score = 0;
  const matches = {
    skinTypes: [],
    concerns: []
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

  if (profile.categories.length > 0 && profile.categories.includes(product.category)) {
    score += 2;
  }

  if (profile.usageMode === '日間' && product.routineSlot?.morning) score += 2;
  if (profile.usageMode === '夜間' && product.routineSlot?.night) score += 2;
  if (profile.usageMode === '急救' && ['面膜', '安瓶', '痘痘護理'].includes(product.category)) score += 3;
  if (product.tag === '敏感肌友好' && profile.skinTypes.includes('敏感肌')) score += 2;
  if (product.stock > 0) score += 1;

  return { score, matches };
}

function buildBundleRecommendations(rankedProducts, usageMode) {
  if (usageMode !== '成套護膚流程') {
    return rankedProducts.slice(0, 6);
  }

  const steps = ['洗面', '化妝水', '精華', '面霜', '防曬'];
  const selected = [];
  const used = new Set();

  steps.forEach((category) => {
    const found = rankedProducts.find((item) => {
      if (used.has(item.product.id)) return false;
      if (category === '面霜') {
        return ['面霜', '乳液'].includes(item.product.category);
      }
      return item.product.category === category;
    });

    if (found) {
      selected.push(found);
      used.add(found.product.id);
    }
  });

  rankedProducts.forEach((item) => {
    if (selected.length >= 6) return;
    if (!used.has(item.product.id)) {
      selected.push(item);
      used.add(item.product.id);
    }
  });

  return selected;
}

function createReason(profile, matches, product) {
  const chunks = [];
  if (matches.concerns.length > 0) {
    chunks.push(`對目前「${matches.concerns.join('、')}」較有針對性`);
  }
  if (matches.skinTypes.length > 0) {
    chunks.push(`同「${matches.skinTypes.join('、')}」膚質相容度較高`);
  }
  if (profile.usageMode === '急救') {
    chunks.push('適合狀態不穩時先作局部或短期修護');
  }
  if (profile.usageMode === '日間' || profile.usageMode === '夜間') {
    chunks.push(`適合放入${profile.usageMode}護膚節奏`);
  }

  if (chunks.length === 0 && product.recommendedReasonTemplate) {
    chunks.push(product.recommendedReasonTemplate.replace(/\s+/g, ' ').trim());
  }

  if (chunks.length === 0) {
    chunks.push('質地同定位容易融入日常護膚流程');
  }

  return `${chunks.slice(0, 2).join('，')}。`;
}

function buildCareTips(profile) {
  const tips = [];

  if (profile.skinTypes.includes('敏感肌') || profile.concerns.includes('刺痛') || profile.concerns.includes('屏障受損')) {
    tips.push('先由溫和潔面、補水同修護打底，新增產品前建議先做局部測試。');
  }
  if (profile.concerns.includes('乾燥脫皮') || profile.skinTypes.includes('乾肌')) {
    tips.push('洗面後盡快補水，之後用乳液或面霜封住水分，保濕效果會更穩。');
  }
  if (profile.concerns.includes('爆痘') || profile.concerns.includes('粉刺')) {
    tips.push('痘痘護理以薄塗、局部為主，同時維持早晚一次穩定清潔，避免過度處理。');
  }
  if (profile.concerns.includes('細紋') || profile.skinTypes.includes('熟齡肌')) {
    tips.push('夜間可把精華同面霜配合使用，集中加強眼周同容易乾紋的位置。');
  }
  if (profile.concerns.includes('暗沉') || profile.concerns.includes('斑點')) {
    tips.push('日間最後一步記得足量防曬，戶外活動較久時要補擦，先可以穩定亮膚效果。');
  }

  if (tips.length < 3) {
    tips.push('每次只調整一件新產品，連續觀察 7 至 10 日，較容易判斷是否適合。');
  }
  if (tips.length < 4) {
    tips.push('保養順序由質地較輕開始，慢慢疊到較滋潤，可減少打架同搓泥機會。');
  }
  if (tips.length < 5) {
    tips.push('如果近期作息、飲食或壓力有變，記低變化會更容易理解肌膚起伏原因。');
  }

  return tips.slice(0, 5);
}

function buildAvoidMistakes(profile) {
  const mistakes = [
    '同一晚疊加多種高刺激酸類或去角質，容易令皮膚更紅、更乾，甚至更不穩定。',
    '只追求美白提亮而忽略防曬，膚色不均同暗沉通常會好快反覆出現。',
    '肌膚不穩時一次過換整套產品，會令真正不適來源變得更難判斷。'
  ];

  if (profile.concerns.includes('爆痘') || profile.concerns.includes('粉刺')) {
    mistakes.push('因為想快啲清走痘痘而過度清潔，反而會令油脂分泌更失衡。');
  }
  if (profile.skinTypes.includes('乾肌') || profile.concerns.includes('乾燥脫皮')) {
    mistakes.push('只補水唔鎖水，朝早覺得夠，但下午仍然可能再次繃緊脫皮。');
  }
  if (profile.skinTypes.includes('敏感肌') || profile.concerns.includes('刺痛')) {
    mistakes.push('刺痛期間仍持續用高功能活性配方，通常會拖慢屏障修護速度。');
  }

  return uniqueStrings(mistakes).slice(0, 5);
}

function buildSimpleRoutine(profile) {
  const morning = ['洗面', '化妝水', '精華', '乳液 / 面霜', '防曬'];
  const night = ['洗面', '化妝水', '精華 / 安瓶', '面霜'];

  if (profile.concerns.includes('爆痘') || profile.concerns.includes('粉刺')) {
    night.splice(3, 0, '痘痘護理');
  }

  if (profile.usageMode === '急救') {
    night.splice(3, 0, '急救面膜（每週 2 至 3 次）');
  }

  return { morning, night };
}

function buildFallbackResponse(profile) {
  return {
    careTips: buildCareTips(profile),
    avoidMistakes: buildAvoidMistakes(profile),
    routine: buildSimpleRoutine(profile),
    recommendations: [],
    note: '暫時未搵到完全貼合目前條件嘅結果，可以放寬一個篩選方向再試。'
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
    reason: createReason(profile, item.matches, item.product),
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
      const haystack = [
        item.name,
        item.brand,
        item.brandOrigin,
        item.category,
        item.series,
        item.intro,
        toArray(item.goals).join(' '),
        toArray(item.concerns).join(' '),
        toArray(item.suitableSkinTypes).join(' ')
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
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

function updateCatalogStats() {
  const formatter = new Intl.NumberFormat('zh-HK');
  const total = state.products.length;
  const japan = state.products.filter((item) => item.brandOrigin === '日本').length;
  const korea = state.products.filter((item) => item.brandOrigin === '韓國').length;

  const catalogCount = $('#catalog-count');
  const japanCount = $('#japan-count');
  const koreaCount = $('#korea-count');

  if (catalogCount) catalogCount.textContent = `${formatter.format(total)}+`;
  if (japanCount) japanCount.textContent = formatter.format(japan);
  if (koreaCount) koreaCount.textContent = formatter.format(korea);
}

function makePairingText(product) {
  const pairings = toArray(product.pairing);
  if (pairings.length === 0) {
    return '可先與同系列化妝水或面霜搭配，令使用感更完整。';
  }
  return pairings.slice(0, 2).map((item) => `${item.category}：${item.name}`).join(' / ');
}

function renderEmptyState(targetId, title, body) {
  const root = document.getElementById(targetId);
  if (!root) return;
  root.innerHTML = `
    <article class="empty-state">
      <strong>${title}</strong>
      <p>${body}</p>
    </article>
  `;
}

function createProductCard(product, compact = false) {
  const card = document.createElement('article');
  card.className = 'product-card';

  const tag = product.tag || '精選推薦';
  const usageTip = product.usageTip || '可按日夜 routine 靈活加入。';
  const pairingText = makePairingText(product);

  card.innerHTML = `
    <div class="product-top">
      <div>
        <p class="product-brand">${product.brand}</p>
        <h3>${product.name}</h3>
      </div>
      <div class="pill-row">
        <span class="tag-pill">${tag}</span>
        <span class="origin-pill">${product.brandOrigin}</span>
      </div>
    </div>
    <div class="pill-row">
      <span class="meta-pill">${product.category}</span>
      <span class="meta-pill">${product.routineStep || '護膚步驟建議'}</span>
    </div>
    <p>${product.intro}</p>
    <div class="product-reason">
      <span>推薦原因</span>
      <p>${product.reason}</p>
    </div>
    ${compact ? '' : `
      <div class="product-support">
        <span>使用與搭配</span>
        <p>使用提示：${usageTip}</p>
        <p>建議搭配：${pairingText}</p>
      </div>
    `}
  `;

  return card;
}

function renderProductCards(targetId, products, config = {}) {
  const { limit = null, compact = false } = config;
  const root = document.getElementById(targetId);
  if (!root) return;

  root.innerHTML = '';

  const list = limit ? toArray(products).slice(0, limit) : toArray(products);
  if (list.length === 0) {
    renderEmptyState(targetId, '暫時未有匹配產品', '你可以放寬品牌來源、類別或者肌膚狀況，再重新生成建議。');
    return;
  }

  list.forEach((product) => {
    root.appendChild(createProductCard(product, compact));
  });
}

function renderRecommendationViews() {
  const recommendation = state.recommendation;
  const resultNote = $('#result-note');
  const resultCount = $('#result-count');

  if (!recommendation) {
    if (resultNote) resultNote.textContent = '完成測驗後，呢度會顯示完整產品推薦。';
    if (resultCount) resultCount.textContent = '0';
    renderEmptyState('recommendation-cards', '未生成結果', '完成測驗後，呢度會顯示完整產品卡片同推薦原因。');
    renderRoutineVisual();
    return;
  }

  const products = toArray(recommendation.recommendations);
  if (resultNote) resultNote.textContent = `目前條件：${makeProfileSummaryText()}`;
  if (resultCount) resultCount.textContent = String(products.length);
  renderProductCards('recommendation-cards', products, { compact: false });
  renderRoutineVisual();
}

function renderRoutineVisual() {
  const root = $('#routine-visual');
  if (!root) return;

  const products = toArray(state.recommendation?.recommendations);
  const steps = [
    {
      title: 'Step 1 溫和清潔',
      categories: ['洗面'],
      fallback: '先清走多餘油脂同污垢，避免後續護膚太厚重。'
    },
    {
      title: 'Step 2 補水調理',
      categories: ['化妝水'],
      fallback: '用化妝水先補水，令後續精華更容易貼膚。'
    },
    {
      title: 'Step 3 重點精華',
      categories: ['精華', '安瓶'],
      fallback: '按你目前肌膚狀況，加入重點修護。'
    },
    {
      title: 'Step 4 鎖水修護',
      categories: ['面霜', '乳液'],
      fallback: '用乳液或面霜把水分封住，穩定膚感。'
    },
    {
      title: 'Step 5 日間防護',
      categories: ['防曬'],
      fallback: '日間最後一步做好保護，令整體保養更完整。'
    }
  ];

  root.innerHTML = '';

  steps.forEach((step, index) => {
    const product = products.find((item) => step.categories.includes(item.category));
    const card = document.createElement('article');
    card.className = 'flow-step';
    card.innerHTML = `
      <span class="step-index">${index + 1}</span>
      <h4>${step.title}</h4>
      <p>${product ? product.name : step.fallback}</p>
      <p class="detail-meta">${product ? `${product.brand} ・ ${product.category} ・ ${product.tag}` : '完成測驗後可帶入對應產品。'}</p>
    `;
    root.appendChild(card);
  });
}

function renderSearchResults() {
  const root = $('#search-results');
  const searchTotal = $('#search-total');
  if (!root) return;

  root.innerHTML = '';
  if (searchTotal) searchTotal.textContent = `${state.searchTotal} 項`;

  if (state.searchResults.length === 0) {
    const empty = document.createElement('article');
    empty.className = 'empty-state';
    empty.innerHTML = '<strong>未找到對應產品</strong><p>可以試更短關鍵字，或者改搜品牌、功效、類別。</p>';
    root.appendChild(empty);
    return;
  }

  state.searchResults.forEach((item) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `search-item ${state.searchDetail?.id === item.id ? 'active' : ''}`;
    button.innerHTML = `
      <strong>${item.name}</strong>
      <p>${item.brand} ・ ${item.brandOrigin} ・ ${item.category}</p>
      <div class="pill-row">
        <span class="tag-pill">${item.tag || '精選'}</span>
      </div>
    `;
    button.addEventListener('click', () => {
      state.searchDetail = getProductDetailLocal(item.id);
      renderSearchResults();
      renderSearchDetail();
    });
    root.appendChild(button);
  });
}

function renderSearchDetail() {
  const root = $('#search-detail');
  if (!root) return;

  const item = state.searchDetail;
  if (!item) {
    root.className = 'search-detail empty';
    root.textContent = '搜尋後點選產品，即可查看適合膚質、功效、搭配建議同護膚步驟位置。';
    return;
  }

  root.className = 'search-detail';

  const sameBrand = toArray(item.sameBrandSuggest);
  const sameBrandHtml = sameBrand.length > 0
    ? `
      <div class="detail-suggest">
        <p class="detail-suggest-title">同品牌延伸選擇</p>
        <div class="summary-cloud">
          ${sameBrand.map((product) => `<span class="summary-chip">${product.category} · ${product.name}</span>`).join('')}
        </div>
      </div>
    `
    : '';

  root.innerHTML = `
    <p class="product-brand">${item.brand}</p>
    <h3>${item.name}</h3>
    <p class="detail-meta">${item.brandOrigin} ・ ${item.category} ・ ${item.series || '系列資料整理中'}</p>
    <p>${item.intro}</p>
    <ul class="detail-list">
      <li><strong>適合膚質：</strong>${toArray(item.suitableSkinTypes).join('、') || '未標註'}</li>
      <li><strong>主要功效：</strong>${toArray(item.goals).join('、') || '未標註'}</li>
      <li><strong>肌膚狀況對應：</strong>${toArray(item.concerns).join('、') || '未標註'}</li>
      <li><strong>標籤：</strong>${item.tag || '精選推薦'}</li>
      <li><strong>搭配建議：</strong>${makePairingText(item)}</li>
      <li><strong>護膚步驟位置：</strong>${item.routineStep || '可按實際 routine 靈活安排'}</li>
    </ul>
    ${sameBrandHtml}
  `;
}

async function loadCatalog() {
  const response = await fetch(resolveAssetUrl('data/products.json'));
  if (!response.ok) throw new Error('catalog_load_failed');

  const payload = await response.json();
  state.products = toArray(payload.products);
  state.options = {
    ...QUIZ_OPTIONS,
    ...(payload.options || {})
  };
}

async function runRecommendation() {
  state.recommendation = recommendLocal(state.selection);
  renderRecommendationViews();
}

async function searchProducts() {
  const input = $('#search-input');
  if (!input) return;

  const keyword = input.value.trim();
  const payload = searchProductsLocal(keyword);
  state.searchResults = toArray(payload.items);
  state.searchTotal = payload.total || 0;
  state.searchDetail = state.searchResults.length > 0 ? getProductDetailLocal(state.searchResults[0].id) : null;
  renderSearchResults();
  renderSearchDetail();
}

function resetSelection() {
  state.selection = createInitialSelection();
  state.recommendation = null;
  renderQuiz();
  renderRecommendationViews();
}

function bindFlowEvents() {
  const bindClick = (selector, handler) => {
    const node = $(selector);
    if (node) {
      node.addEventListener('click', handler);
    }
  };

  document.querySelectorAll('[data-nav]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.getAttribute('data-nav');
      if (target) {
        showScreen(target);
      }
    });
  });

  bindClick('#start-quiz-btn', () => showScreen('quiz-1'));

  bindClick('#to-step-2-btn', () => {
    if (state.selection.skinTypes.length === 0) {
      window.alert('請先選擇至少 1 個膚質。');
      return;
    }
    showScreen('quiz-2');
  });

  bindClick('#to-step-3-btn', () => {
    if (state.selection.concerns.length === 0) {
      window.alert('請先選擇至少 1 個肌膚狀況。');
      return;
    }
    showScreen('quiz-3');
  });

  bindClick('#back-step-1-btn', () => showScreen('quiz-1'));
  bindClick('#back-step-2-btn', () => showScreen('quiz-2'));

  bindClick('#submit-quiz-btn', async () => {
    if (state.selection.concerns.length === 0) {
      window.alert('請先選擇至少 1 個肌膚狀況。');
      return;
    }

    const button = $('#submit-quiz-btn');
    const original = button.textContent;
    button.disabled = true;
    button.textContent = '整理建議中...';

    try {
      await runRecommendation();
      showScreen('results');
    } catch (_error) {
      window.alert('整理建議失敗，請稍後再試。');
    } finally {
      button.disabled = false;
      button.textContent = original;
    }
  });

  bindClick('#to-routine-flow-btn', () => showScreen('routine'));
  bindClick('#rebuild-plan-btn', () => {
    resetSelection();
    showScreen('quiz-1');
  });
}

function bindSearchEvents() {
  const input = $('#search-input');
  const searchButton = $('#search-btn');
  if (!input || !searchButton) return;

  searchButton.addEventListener('click', async () => {
    try {
      await searchProducts();
    } catch (_error) {
      window.alert('搜尋失敗，請稍後再試。');
    }
  });

  input.addEventListener('keydown', async (event) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    try {
      await searchProducts();
    } catch (_error) {
      window.alert('搜尋失敗，請稍後再試。');
    }
  });

  document.querySelectorAll('.keyword-chip[data-keyword], .quick-chip[data-keyword]').forEach((button) => {
    button.addEventListener('click', async () => {
      input.value = button.getAttribute('data-keyword') || '';
      await searchProducts();
    });
  });
}

async function bootstrap() {
  bindFlowEvents();
  bindSearchEvents();

  try {
    await loadCatalog();
    renderQuiz();
    updateCatalogStats();
    renderRecommendationViews();
    await searchProducts();
  } catch (_error) {
    window.alert('初始化資料失敗，請重整頁面。');
  }

  showScreen('home');
}

bootstrap();
