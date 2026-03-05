const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_PATH = path.join(__dirname, '..', 'data', 'products.json');

const QUIZ_OPTIONS = {
  skinTypes: ['敏感肌', '痘痘肌', '乾肌', '油肌', '混合肌', '熟齡肌', '受損肌', '一般肌'],
  concerns: ['泛紅', '刺痛', '爆痘', '粉刺', '出油', '乾燥脫皮', '暗沉', '斑點', '細紋', '毛孔粗大', '屏障受損'],
  goals: ['去痘', '淡印', '保濕', '修復', '抗老', '美白提亮', '控油', '收毛孔', '防曬'],
  origins: ['全部', '日本', '韓國'],
  categories: ['洗面', '化妝水', '精華', '乳液', '面霜', '面膜', '防曬', '眼霜', '去角質', '痘痘護理', '安瓶'],
  usageModes: ['成套護膚流程', '單品推薦', '日間', '夜間', '急救']
};

function readProducts() {
  if (!fs.existsSync(DATA_PATH)) {
    return [];
  }

  const payload = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  return payload.products || [];
}

function uniqueStrings(values) {
  return [...new Set(values.filter(Boolean))];
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
    matches.skinTypes = profile.skinTypes.filter((item) => product.suitableSkinTypes.includes(item));
    score += matches.skinTypes.length * 4;
  }

  if (profile.concerns.length > 0) {
    matches.concerns = profile.concerns.filter((item) => product.concerns.includes(item));
    score += matches.concerns.length * 3;
  }

  if (profile.goals.length > 0) {
    matches.goals = profile.goals.filter((item) => product.goals.includes(item));
    score += matches.goals.length * 5;
  }

  if (profile.categories.length > 0 && profile.categories.includes(product.category)) {
    score += 2;
  }

  if (profile.usageMode === '日間' && product.routineSlot?.morning) {
    score += 2;
  }
  if (profile.usageMode === '夜間' && product.routineSlot?.night) {
    score += 2;
  }
  if (profile.usageMode === '急救' && (product.category === '面膜' || product.category === '安瓶' || product.category === '痘痘護理')) {
    score += 3;
  }

  if (product.stock > 0) score += 1;
  if (product.tag === '敏感肌友好' && profile.skinTypes.includes('敏感肌')) score += 2;

  return { score, matches };
}

function productMatchesBasicFilters(product, profile) {
  if (profile.brandOrigin !== '全部' && product.brandOrigin !== profile.brandOrigin) return false;

  if (profile.categories.length > 0 && !profile.categories.includes(product.category)) return false;

  if (profile.skinTypes.length > 0) {
    const hasSkinMatch = profile.skinTypes.some((item) => product.suitableSkinTypes.includes(item));
    if (!hasSkinMatch && !product.suitableSkinTypes.includes('一般肌')) return false;
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

function createReason(product, profile, matches) {
  const chunks = [];

  if (matches.goals.length > 0) {
    chunks.push(`可對應你想要的「${matches.goals.join('、')}」目標`);
  }
  if (matches.concerns.length > 0) {
    chunks.push(`對「${matches.concerns.join('、')}」有針對性`);
  }
  if (matches.skinTypes.length > 0) {
    chunks.push(`與「${matches.skinTypes.join('、')}」相容度高`);
  }
  if (profile.usageMode === '日間' || profile.usageMode === '夜間') {
    chunks.push(`適合${profile.usageMode}保養節奏`);
  }
  if (chunks.length === 0) {
    chunks.push('配方溫和、容易融入日常流程');
  }

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
  if (tips.length < 3) {
    tips.push('每次只調整一個新產品，連續觀察 7-10 天再判斷是否有效。');
  }
  if (tips.length < 4) {
    tips.push('保養順序保持由輕到厚，能降低打架與搓泥機率。');
  }
  if (tips.length < 5) {
    tips.push('記錄近期作息與飲食，能更快找出爆痘或敏感觸發點。');
  }

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

  return {
    morning,
    night
  };
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

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/options', (_req, res) => {
  res.json(QUIZ_OPTIONS);
});

app.get('/api/products', (req, res) => {
  const products = readProducts();
  const query = String(req.query.q || '').trim().toLowerCase();

  let result = products;

  if (query) {
    result = products.filter((item) => {
      return (
        item.name.toLowerCase().includes(query) ||
        item.brand.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.goals.join(' ').toLowerCase().includes(query)
      );
    });
  }

  res.json({
    total: result.length,
    items: result.slice(0, 30)
  });
});

app.get('/api/products/:id', (req, res) => {
  const products = readProducts();
  const item = products.find((product) => product.id === req.params.id);

  if (!item) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  const sameBrand = products
    .filter((product) => product.brand === item.brand && product.id !== item.id)
    .slice(0, 4)
    .map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category
    }));

  res.json({
    ...item,
    sameBrandSuggest: sameBrand
  });
});

app.post('/api/recommendations', (req, res) => {
  const products = readProducts();
  const profile = normalizeProfile(req.body || {});

  const filtered = products.filter((product) => productMatchesBasicFilters(product, profile));
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
    res.json(buildFallbackResponse(profile));
    return;
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
    reason: createReason(item.product, profile, item.matches),
    usageTip: item.product.usageTip,
    routineStep: item.product.routineStep,
    pairing: item.product.pairing
  }));

  res.json({
    careTips: buildCareTips(profile),
    avoidMistakes: buildAvoidMistakes(profile),
    routine: buildSimpleRoutine(profile),
    recommendations,
    note: ''
  });
});

app.use((_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Skincare app running at http://localhost:${PORT}`);
});
