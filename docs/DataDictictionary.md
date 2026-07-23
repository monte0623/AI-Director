# AI Director V10

# Data Dictionary

Version

V10 Build001-A

Status

Frozen

---

# 說明

本文件定義 AI Director 所有核心資料結構。

目的：

- 唯一資料來源（Single Source of Truth）
- 避免重複輸入
- 所有工作區引用同一份資料

---

# 製作案（Project）

| 欄位 | 型別 | 必填 | 備註 |
|------|------|------|------|
| id | UUID | 系統 | 唯一識別碼 |
| name | String | ✓ | 製作案名稱 |
| client | String | | 客戶 |
| brand | String | | 品牌 |
| description | Text | | 製作說明 |
| createdAt | DateTime | 系統 | 建立時間 |
| updatedAt | DateTime | 系統 | 更新時間 |

---

# 製作素材（Materials）

## 商品（Product）

| 欄位 | 型別 | 修改位置 |
|------|------|----------|
| 名稱 | String | 製作素材 |
| 照片 | Image[] | 製作素材 |
| 品牌 | String | 製作素材 |
| 商品特色 | Text | 製作素材 |
| 注意事項 | Text | 製作素材 |

引用位置：

- 前期企劃
- 劇本
- 場景
- 鏡位
- 鏡位資訊
- 分鏡
- 拍攝

不得於引用處修改。

---

## 品牌（Brand）

| 欄位 | 型別 | 修改位置 |
|------|------|----------|
| 品牌名稱 | String | 製作素材 |
| Logo | Image | 製作素材 |
| 品牌定位 | Text | 製作素材 |
| 品牌規範 | Text | 製作素材 |

引用位置：

全工作區。

---

# 製作文件（Documents）

| 欄位 | 型別 |
|------|------|
| PDF | File |
| Word | File |
| Excel | File |
| PowerPoint | File |
| 圖片 | File |
| 影片 | File |

---

# 前期企劃（Pre-Production）

| 欄位 | 型別 |
|------|------|
| 核心訊息 | Text |
| 目標客群 | Text |
| 拍攝風格 | Text |
| 影片節奏 | Text |
| 參考影片 | URL / Text |
| 投放需求 | Text |
| 備忘錄 | Text |

引用：

商品

品牌

Logo

注意事項

---

# 製作內容（Production）

一個製作案

可建立多個製作內容。

| 欄位 | 型別 |
|------|------|
| id | UUID |
| 名稱 | String |
| 建立日期 | DateTime |
| 更新日期 | DateTime |

---

# 劇本（Script）

第一版保留。

Build001-B 開始定義。

---

# 場景（Scene）

第一版保留。

Build001-B 開始定義。

---

# 鏡位（Shot）

第一版保留。

Build001-B 開始定義。

---

# 分鏡（Storyboard）

第一版保留。

Build001-B 開始定義。

---

# 拍攝（Shooting）

第一版保留。

Build001-B 開始定義。

---

# 資料原則

所有商品、品牌資料：

只能建立一次。

所有工作區：

引用。

不得建立副本。

不得重複輸入。

---

End
