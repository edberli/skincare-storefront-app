# 門市客戶導向護膚品推薦 App

以「小測驗 -> 關心式建議 -> 產品推薦 -> 反向搜尋」為核心流程的全端 Web App。

## 功能

- 客戶導向測驗流程（膚質 / 肌膚狀況 / 功效目標 / 品牌來源 / 類別 / 使用方式）
- AI 關心式輸出（護膚技巧、常見誤區、早晚 routine）
- 3-5 款產品推薦卡（推薦原因、標籤、搭配建議）
- 反向搜尋（輸入產品名可反查適合膚質、功效、步驟）
- 成套護膚步驟可視化

## 啟動

1. 安裝依賴

```bash
npm install
```

2. 從 Excel 生成資料（預設來源路徑：`/Volumes/Ultra Touch/下載/all (1).xlsx`）

```bash
npm run build:data
```

也可以自定來源路徑：

```bash
SOURCE_XLSX="/your/path/all (1).xlsx" npm run build:data
```

3. 啟動 App

```bash
npm run dev
```

4. 打開瀏覽器進入：

- `http://localhost:3000`

## 專案結構

- `scripts/build-data.js`：Excel -> 護膚資料 JSON 清洗與推斷
- `data/products.json`：整理後產品資料
- `src/server.js`：推薦 / 搜尋 API + 靜態頁服務
- `public/index.html`：8 個流程畫面
- `public/styles.css`：視覺風格與響應式排版
- `public/app.js`：前端互動流程
