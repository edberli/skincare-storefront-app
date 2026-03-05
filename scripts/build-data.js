#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const INPUT_PATH = process.env.SOURCE_XLSX || '/Volumes/Ultra Touch/下載/all (1).xlsx';
const OUTPUT_PATH = path.join(__dirname, '..', 'data', 'products.json');

const CATEGORY_RULES = [
  {
    id: 'cleanser',
    name: '洗面',
    routineStep: 'STEP 1 清潔',
    keywords: ['洗面', '潔面', '潔顏', '洗顏', '潔淨', '潔膚', '潔顏乳', '潔面乳', '洗面乳'],
    defaultGoals: ['控油', '收毛孔']
  },
  {
    id: 'toner',
    name: '化妝水',
    routineStep: 'STEP 2 調理',
    keywords: ['化妝水', '爽膚水', '柔膚水', '收斂水', '精華水', '保濕水', '化粧水'],
    defaultGoals: ['保濕', '修復']
  },
  {
    id: 'serum',
    name: '精華',
    routineStep: 'STEP 3 精準修護',
    keywords: ['精華', '原液', '導入液', '肌底液', '修護液'],
    defaultGoals: ['修復', '美白提亮', '抗老']
  },
  {
    id: 'ampoule',
    name: '安瓶',
    routineStep: 'STEP 3 精準修護',
    keywords: ['安瓶', '濃縮液', '高濃度'],
    defaultGoals: ['修復', '去痘', '淡印']
  },
  {
    id: 'emulsion',
    name: '乳液',
    routineStep: 'STEP 4 鎖水',
    keywords: ['乳液', '潤膚乳', '凝乳'],
    defaultGoals: ['保濕', '修復']
  },
  {
    id: 'cream',
    name: '面霜',
    routineStep: 'STEP 4 鎖水',
    keywords: ['面霜', '乳霜', '凝霜', '修護霜', '保濕霜'],
    defaultGoals: ['保濕', '修復', '抗老']
  },
  {
    id: 'mask',
    name: '面膜',
    routineStep: '加強保養',
    keywords: ['面膜', '凍膜', '泥膜', '睡眠膜'],
    defaultGoals: ['保濕', '修復', '美白提亮']
  },
  {
    id: 'sunscreen',
    name: '防曬',
    routineStep: '日間最後一步',
    keywords: ['防曬', '防晒', '隔離霜', 'SPF', 'PA+'],
    defaultGoals: ['防曬', '美白提亮']
  },
  {
    id: 'eyecream',
    name: '眼霜',
    routineStep: '眼周加護',
    keywords: ['眼霜', '眼部精華', '眼膜', '眼周'],
    defaultGoals: ['抗老', '淡印']
  },
  {
    id: 'exfoliation',
    name: '去角質',
    routineStep: '每週 1-2 次',
    keywords: ['去角質', '煥膚', '磨砂', '酸類'],
    defaultGoals: ['收毛孔', '美白提亮', '控油']
  },
  {
    id: 'acnecare',
    name: '痘痘護理',
    routineStep: '局部加強',
    keywords: ['痘', '暗瘡', '痘痘貼', '祛痘', '袪痘', '粉刺'],
    defaultGoals: ['去痘', '淡印', '控油']
  }
];

const EXCLUDE_KEYWORDS = [
  '洗髮',
  '護髮',
  '沐浴',
  '牙膏',
  '益生菌',
  '香氛',
  '香水',
  '洗衣',
  '隱形眼鏡',
  '椅背',
  '唇',
  '眼影',
  '粉底',
  '腮紅',
  '睫毛',
  '指甲',
  '牙刷',
  '衛生棉'
];

const GOAL_HINTS = [
  { keyword: '痘', goals: ['去痘', '淡印', '控油'] },
  { keyword: '暗瘡', goals: ['去痘', '淡印', '控油'] },
  { keyword: '粉刺', goals: ['去痘', '收毛孔'] },
  { keyword: '毛孔', goals: ['收毛孔', '控油'] },
  { keyword: '保濕', goals: ['保濕', '修復'] },
  { keyword: '補水', goals: ['保濕'] },
  { keyword: '舒緩', goals: ['修復', '保濕'] },
  { keyword: '鎮靜', goals: ['修復'] },
  { keyword: '修護', goals: ['修復'] },
  { keyword: '抗老', goals: ['抗老'] },
  { keyword: '緊緻', goals: ['抗老'] },
  { keyword: '淡紋', goals: ['抗老', '淡印'] },
  { keyword: '淡斑', goals: ['淡印', '美白提亮'] },
  { keyword: '美白', goals: ['美白提亮'] },
  { keyword: '提亮', goals: ['美白提亮'] },
  { keyword: '控油', goals: ['控油', '收毛孔'] },
  { keyword: '防曬', goals: ['防曬'] },
  { keyword: 'SPF', goals: ['防曬'] }
];

const SKIN_HINTS = [
  { keyword: '敏感', types: ['敏感肌', '受損肌'] },
  { keyword: '舒緩', types: ['敏感肌'] },
  { keyword: '修護', types: ['受損肌', '乾肌'] },
  { keyword: '保濕', types: ['乾肌', '敏感肌'] },
  { keyword: '補水', types: ['乾肌'] },
  { keyword: '控油', types: ['油肌', '混合肌'] },
  { keyword: '毛孔', types: ['油肌', '混合肌'] },
  { keyword: '痘', types: ['痘痘肌', '油肌'] },
  { keyword: '暗瘡', types: ['痘痘肌', '油肌'] },
  { keyword: '抗老', types: ['熟齡肌'] },
  { keyword: '緊緻', types: ['熟齡肌'] }
];

const CONCERN_HINTS = [
  { keyword: '泛紅', concerns: ['泛紅', '刺痛'] },
  { keyword: '刺痛', concerns: ['刺痛', '屏障受損'] },
  { keyword: '痘', concerns: ['爆痘', '粉刺'] },
  { keyword: '暗瘡', concerns: ['爆痘', '粉刺'] },
  { keyword: '控油', concerns: ['出油', '毛孔粗大'] },
  { keyword: '保濕', concerns: ['乾燥脫皮'] },
  { keyword: '提亮', concerns: ['暗沉'] },
  { keyword: '美白', concerns: ['斑點', '暗沉'] },
  { keyword: '淡斑', concerns: ['斑點'] },
  { keyword: '抗老', concerns: ['細紋'] },
  { keyword: '毛孔', concerns: ['毛孔粗大'] },
  { keyword: '修護', concerns: ['屏障受損'] }
];

const TAG_HINTS = [
  { keyword: '得獎', tag: '得獎' },
  { keyword: 'award', tag: '得獎' },
  { keyword: '熱賣', tag: '熱賣' },
  { keyword: '人氣', tag: '熱賣' },
  { keyword: '明星', tag: '明星推薦' },
  { keyword: '聯名', tag: '明星推薦' },
  { keyword: '敏感', tag: '敏感肌友好' },
  { keyword: '舒緩', tag: '敏感肌友好' },
  { keyword: '積雪草', tag: '敏感肌友好' }
];

const ORIGIN_PREFIXES = [
  { prefix: '日本', value: '日本' },
  { prefix: '韓國', value: '韓國' }
];

const BRAND_ALIASES = [
  { pattern: /some\\s*by\\s*mi|somebymi/i, brand: 'SOME BY MI' },
  { pattern: /skin\\s*1004/i, brand: 'SKIN1004' },
  { pattern: /round\\s*lab|1025/i, brand: 'ROUND LAB' },
  { pattern: /torriden/i, brand: 'Torriden' },
  { pattern: /tocobo/i, brand: 'TOCOBO' },
  { pattern: /mediheal/i, brand: 'Mediheal' },
  { pattern: /beplain/i, brand: 'beplain' },
  { pattern: /abib/i, brand: 'Abib' },
  { pattern: /cosrx/i, brand: 'COSRX' },
  { pattern: /anua/i, brand: 'Anua' },
  { pattern: /goodal/i, brand: 'Goodal' },
  { pattern: /mixsoon/i, brand: 'mixsoon' },
  { pattern: /bring\\s*green/i, brand: 'Bring Green' },
  { pattern: /dr\\s*\\.?jart/i, brand: 'Dr.Jart+' },
  { pattern: /ahc/i, brand: 'AHC' },
  { pattern: /aprilskin/i, brand: 'APRILSKIN' },
  { pattern: /numbuzin/i, brand: 'Numbuzin' },
  { pattern: /manyo|ma:nyo/i, brand: 'manyo' },
  { pattern: /needly/i, brand: 'NEEDLY' },
  { pattern: /purito/i, brand: 'PURITO' },
  { pattern: /frudia/i, brand: 'FRUDIA' },
  { pattern: /derma\\s*b|dermab/i, brand: 'Derma:B' },
  { pattern: /boh/i, brand: 'BOH' },
  { pattern: /ootd/i, brand: 'OOTD' },
  { pattern: /tirtir/i, brand: 'TIRTIR' },
  { pattern: /vt/i, brand: 'VT' },
  { pattern: /dr\\s*melaxin/i, brand: 'Dr.Melaxin' },
  { pattern: /dr\\s*althea/i, brand: 'Dr.Althea' },
  { pattern: /axis\\s*-?\\s*y/i, brand: 'AXIS-Y' },
  { pattern: /pyunkang/i, brand: 'Pyunkang Yul' },
  { pattern: /farmstay/i, brand: 'Farmstay' },
  { pattern: /haruharu/i, brand: 'Haruharu Wonder' },
  { pattern: /nacific/i, brand: 'Nacific' },
  { pattern: /snp/i, brand: 'SNP' },
  { pattern: /ksecret/i, brand: 'KSECRET' },
  { pattern: /kwailnara/i, brand: 'Kwailnara' },
  { pattern: /dhc/i, brand: 'DHC' },
  { pattern: /fancl/i, brand: 'FANCL' },
  { pattern: /acnes/i, brand: 'Acnes' },
  { pattern: /lulu\\s*lun/i, brand: 'LuLuLun' },
  { pattern: /biore|碧柔/i, brand: 'BIORE' },
  { pattern: /kao/i, brand: 'Kao' },
  { pattern: /mandom/i, brand: 'Mandom' },
  { pattern: /utena/i, brand: 'Utena' },
  { pattern: /loshi/i, brand: 'Loshi' },
  { pattern: /quality\\s*first/i, brand: 'QUALITY FIRST' },
  { pattern: /kose|高絲/i, brand: 'KOSE' },
  { pattern: /shiseido|資生堂/i, brand: 'SHISEIDO' }
];

const BRAND_ORIGIN_MAP = {
  'SOME BY MI': '韓國',
  SKIN1004: '韓國',
  'ROUND LAB': '韓國',
  Torriden: '韓國',
  TOCOBO: '韓國',
  Mediheal: '韓國',
  beplain: '韓國',
  Abib: '韓國',
  COSRX: '韓國',
  Anua: '韓國',
  Goodal: '韓國',
  mixsoon: '韓國',
  'Bring Green': '韓國',
  'Dr.Jart+': '韓國',
  AHC: '韓國',
  APRILSKIN: '韓國',
  Numbuzin: '韓國',
  manyo: '韓國',
  NEEDLY: '韓國',
  PURITO: '韓國',
  FRUDIA: '韓國',
  'Derma:B': '韓國',
  BOH: '韓國',
  OOTD: '韓國',
  TIRTIR: '韓國',
  VT: '韓國',
  'Dr.Melaxin': '韓國',
  'Dr.Althea': '韓國',
  'AXIS-Y': '韓國',
  'Pyunkang Yul': '韓國',
  Farmstay: '韓國',
  'Haruharu Wonder': '韓國',
  Nacific: '韓國',
  SNP: '韓國',
  KSECRET: '韓國',
  Kwailnara: '韓國',
  DHC: '日本',
  FANCL: '日本',
  Acnes: '日本',
  LuLuLun: '日本',
  BIORE: '日本',
  Kao: '日本',
  Mandom: '日本',
  Utena: '日本',
  Loshi: '日本',
  'QUALITY FIRST': '日本',
  KOSE: '日本',
  SHISEIDO: '日本'
};

function normalize(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function detectOrigin(name, brand) {
  for (const item of ORIGIN_PREFIXES) {
    if (name.startsWith(item.prefix)) {
      return item.value;
    }
  }
  if (BRAND_ORIGIN_MAP[brand]) {
    return BRAND_ORIGIN_MAP[brand];
  }
  return '其他';
}

function stripOrigin(name) {
  return name.replace(/^(日本|韓國|台灣|美國|法國|英國|德國)/, '').trim();
}

function detectCategory(name) {
  const lowered = name.toLowerCase();
  let match = null;

  for (const category of CATEGORY_RULES) {
    if (category.keywords.some((keyword) => lowered.includes(keyword.toLowerCase()))) {
      // Prefer specific categories over generic "面霜" rule.
      if (!match || category.keywords[0].length > match.keywords[0].length) {
        match = category;
      }
    }
  }
  return match;
}

function hasExcludeKeyword(name) {
  const lowered = name.toLowerCase();
  return EXCLUDE_KEYWORDS.some((keyword) => lowered.includes(keyword.toLowerCase()));
}

function detectBrand(strippedName) {
  const cleaned = strippedName
    .replace(/[【】\[\]()]/g, ' ')
    .replace(/[–—]/g, '-')
    .trim();

  for (const alias of BRAND_ALIASES) {
    if (alias.pattern.test(cleaned)) {
      return alias.brand;
    }
  }

  const tokens = cleaned.split(/\s+|\/|-/).filter(Boolean);
  const firstChunk = tokens.slice(0, 2).join(' ') || cleaned;
  const brand = firstChunk.replace(/[^\u4e00-\u9fffA-Za-z0-9&\-\s]/g, '').trim();

  if (!brand) {
    return 'Unknown Brand';
  }
  return brand.slice(0, 24);
}

function collectHints(name, hintList, fieldName) {
  const lowered = name.toLowerCase();
  const values = [];

  hintList.forEach((hint) => {
    if (lowered.includes(hint.keyword.toLowerCase())) {
      hint[fieldName].forEach((value) => {
        if (!values.includes(value)) {
          values.push(value);
        }
      });
    }
  });

  return values;
}

function pickSpecialTag(name, index) {
  const lowered = name.toLowerCase();
  for (const hint of TAG_HINTS) {
    if (lowered.includes(hint.keyword.toLowerCase())) {
      return hint.tag;
    }
  }

  const fallbackTags = ['熱賣', '敏感肌友好', '明星推薦', '得獎'];
  return fallbackTags[index % fallbackTags.length];
}

function inferIntro(productName, categoryName, goals) {
  const goalText = goals.slice(0, 2).join('、') || '日常穩定保養';
  return `主打 ${goalText}，質地貼膚易吸收，適合作為${categoryName}步驟中的安心選擇。`;
}

function inferUsageTips(categoryName) {
  const map = {
    洗面: '早晚以溫水輕柔清潔，避免過度搓揉。',
    化妝水: '清潔後立即使用，先補水再進入修護。',
    精華: '按壓 1-2 泵，集中於主要困擾區域。',
    安瓶: '夜間加強使用，連續 7 天觀察膚況。',
    乳液: '薄塗全臉鎖水，T 區可減量。',
    面霜: '夜間可加厚於乾燥區域，提升修護感。',
    面膜: '每週 2-3 次，敷後記得乳霜封存水分。',
    防曬: '日間最後一步，外出前 15 分鐘塗抹。',
    眼霜: '以無名指輕點眼周，不要拉扯肌膚。',
    去角質: '每週 1-2 次即可，敏感時先暫停。',
    痘痘護理: '局部點塗，避免與刺激性產品疊加。'
  };

  return map[categoryName] || '按照標準護膚步驟，由清潔到鎖水循序使用。';
}

function buildRoutineSlot(categoryName) {
  const morningOrder = ['洗面', '化妝水', '精華', '乳液', '面霜', '防曬'];
  const nightOrder = ['洗面', '化妝水', '精華', '安瓶', '乳液', '面霜', '眼霜'];

  return {
    morning: morningOrder.includes(categoryName),
    night: nightOrder.includes(categoryName)
  };
}

function complementaryCategories(categoryName) {
  const map = {
    洗面: ['化妝水', '精華'],
    化妝水: ['精華', '乳液', '面霜'],
    精華: ['乳液', '面霜', '防曬'],
    安瓶: ['面霜', '面膜'],
    乳液: ['面霜', '防曬'],
    面霜: ['防曬', '面膜'],
    面膜: ['精華', '面霜'],
    防曬: ['洗面', '化妝水'],
    眼霜: ['精華', '面霜'],
    去角質: ['面膜', '精華'],
    痘痘護理: ['洗面', '精華']
  };

  return map[categoryName] || [];
}

function scoreProduct(product) {
  let score = 0;
  if (product.brandOrigin === '韓國' || product.brandOrigin === '日本') score += 3;
  if (product.stock > 0) score += 2;
  if (product.tag === '熱賣') score += 1;
  return score;
}

function main() {
  if (!fs.existsSync(INPUT_PATH)) {
    console.error(`Excel file not found: ${INPUT_PATH}`);
    process.exit(1);
  }

  const workbook = xlsx.readFile(INPUT_PATH);
  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];
  const rows = xlsx.utils.sheet_to_json(sheet, { defval: '' });

  const seen = new Set();
  const products = [];

  rows.forEach((row, index) => {
    const rawName = normalize(row['產品說明C']);
    if (!rawName) return;

    const category = detectCategory(rawName);
    if (!category) return;

    if (hasExcludeKeyword(rawName)) {
      // If it is clearly in excluded family and not obvious skincare category, skip.
      const hasStrongSkincareKeyword = ['面膜', '防曬', '精華', '化妝水', '乳液', '面霜', '痘', '潔面', '洗面'].some((k) => rawName.includes(k));
      if (!hasStrongSkincareKeyword) return;
    }

    const dedupeKey = rawName.replace(/\s+/g, '').toLowerCase();
    if (seen.has(dedupeKey)) {
      return;
    }
    seen.add(dedupeKey);

    const stripped = stripOrigin(rawName);
    const brand = detectBrand(stripped);
    const brandOrigin = detectOrigin(rawName, brand);

    const goals = collectHints(rawName, GOAL_HINTS, 'goals');
    category.defaultGoals.forEach((goal) => {
      if (!goals.includes(goal)) goals.push(goal);
    });

    const suitableSkinTypes = collectHints(rawName, SKIN_HINTS, 'types');
    if (goals.includes('保濕') && !suitableSkinTypes.includes('乾肌')) {
      suitableSkinTypes.push('乾肌');
    }
    if (goals.includes('控油') && !suitableSkinTypes.includes('油肌')) {
      suitableSkinTypes.push('油肌');
    }
    if (goals.includes('抗老') && !suitableSkinTypes.includes('熟齡肌')) {
      suitableSkinTypes.push('熟齡肌');
    }
    if (suitableSkinTypes.length === 0) suitableSkinTypes.push('一般肌');

    const concerns = collectHints(rawName, CONCERN_HINTS, 'concerns');
    if (concerns.length === 0) {
      concerns.push('暗沉');
    }

    const tag = pickSpecialTag(rawName, index);

    const product = {
      id: `p-${String(products.length + 1).padStart(4, '0')}`,
      sourceCode: normalize(row['產品編號1']),
      barcode: normalize(row['產品編號2']),
      name: rawName,
      brand,
      brandOrigin,
      category: category.name,
      series: `${brand} ${category.name}系列`,
      suitableSkinTypes,
      concerns,
      goals,
      intro: inferIntro(rawName, category.name, goals),
      recommendedReasonTemplate: `${category.name}定位清晰，針對${goals.slice(0, 2).join(' / ')}需求表現穩定。`,
      tag,
      usageTip: inferUsageTips(category.name),
      routineStep: category.routineStep,
      routineSlot: buildRoutineSlot(category.name),
      stock: Number(row['存量'] || 0),
      price: Number(row['售價'] || 0),
      cost: Number(row['成本'] || 0),
      unit: normalize(row['單位']) || '件',
      notes: normalize(row['產品說明E'])
    };

    products.push(product);
  });

  const byBrand = new Map();
  products.forEach((product) => {
    if (!byBrand.has(product.brand)) {
      byBrand.set(product.brand, []);
    }
    byBrand.get(product.brand).push(product);
  });

  products.forEach((product) => {
    const desiredCategories = complementaryCategories(product.category);
    const sameBrandItems = byBrand.get(product.brand) || [];

    const match = sameBrandItems
      .filter((candidate) => candidate.id !== product.id && desiredCategories.includes(candidate.category))
      .slice(0, 2)
      .map((candidate) => ({
        id: candidate.id,
        name: candidate.name,
        category: candidate.category
      }));

    product.pairing = match;
  });

  const finalProducts = products
    .sort((a, b) => scoreProduct(b) - scoreProduct(a) || a.name.localeCompare(b.name))
    .slice(0, 1400);

  const payload = {
    meta: {
      generatedAt: new Date().toISOString(),
      sourcePath: INPUT_PATH,
      totalRows: rows.length,
      skincareProducts: finalProducts.length,
      categories: [...new Set(finalProducts.map((item) => item.category))],
      origins: [...new Set(finalProducts.map((item) => item.brandOrigin))]
    },
    products: finalProducts
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(payload, null, 2));
  console.log(`Generated ${finalProducts.length} skincare products to ${OUTPUT_PATH}`);
  console.log('Origin distribution:',
    finalProducts.reduce((acc, item) => {
      acc[item.brandOrigin] = (acc[item.brandOrigin] || 0) + 1;
      return acc;
    }, {})
  );
}

main();
