# TCGdex REST API Endpoints (v2)

## Base URL

- Base URL: `https://api.tcgdex.net/v2/{lang}`
- `{lang}` là mã ngôn ngữ. Ví dụ phổ biến: `en`, `fr`, `de`, `it`, `es`, `pt-br`.

Ví dụ đầy đủ:

- `https://api.tcgdex.net/v2/en/cards`
- `https://api.tcgdex.net/v2/fr/sets`

## Core Endpoints

### 1) `GET /cards`

- Mô tả: Lấy danh sách cards (hỗ trợ filter/sort/pagination).
- Ví dụ URL: `https://api.tcgdex.net/v2/en/cards`
- Response mẫu (`200`): Mảng card dạng brief.

```json
[
  {
    "id": "swsh3-136",
    "name": "Furret",
    "localId": "136",
    "image": "https://assets.tcgdex.net/en/swsh/swsh3/136"
  }
]
```

### 2) `GET /cards/{cardId}`

- Mô tả: Lấy chi tiết một card theo id toàn cục.
- Ví dụ URL: `https://api.tcgdex.net/v2/en/cards/swsh3-136`
- Response mẫu (`200`): Card object đầy đủ.

```json
{
  "id": "swsh3-136",
  "name": "Furret",
  "category": "Pokemon",
  "localId": "136",
  "hp": 110,
  "types": ["Colorless"],
  "set": {
    "id": "swsh3",
    "name": "Darkness Ablaze"
  }
}
```
```
- Response mẫu (`404`):

```json
{
  "error": "Endpoint or id not found"
}
```

### 3) `GET /sets`

- Mô tả: Lấy danh sách sets (hỗ trợ filter/sort/pagination).
- Ví dụ URL: `https://api.tcgdex.net/v2/en/sets`
- Response mẫu (`200`): Mảng set dạng brief.

```json
[
  {
    "id": "swsh3",
    "name": "Darkness Ablaze",
    "logo": "https://assets.tcgdex.net/en/swsh/swsh3/logo",
    "cardCount": {
      "total": 201,
      "official": 189
    }
  }
]
```

### 4) `GET /sets/{setId}`

- Mô tả: Lấy chi tiết một set.
- Ví dụ URL: `https://api.tcgdex.net/v2/en/sets/swsh3`
- Response mẫu (`200`): Set object đầy đủ.

```json
{
  "id": "swsh3",
  "name": "Darkness Ablaze",
  "releaseDate": "2020-08-14",
  "serie": {
    "id": "swsh",
    "name": "Sword & Shield"
  },
  "cards": [
    {
      "id": "swsh3-1",
      "localId": "1",
      "name": "Butterfree V",
      "image": "https://assets.tcgdex.net/en/swsh/swsh3/1"
    }
  ]
}
```

### 5) `GET /sets/{setId}/{localId}`

- Mô tả: Lấy card theo local id bên trong set.
- Ví dụ URL: `https://api.tcgdex.net/v2/en/sets/swsh3/136`
- Response mẫu (`200`): Card object đầy đủ (tương tự `/cards/{cardId}`).

```json
{
  "id": "swsh3-136",
  "name": "Furret",
  "category": "Pokemon",
  "localId": "136",
  "set": {
    "id": "swsh3",
    "name": "Darkness Ablaze"
  }
}
```

- Response mẫu (`404`):

```json
{
  "error": "Endpoint or id not found"
}
```

### 6) `GET /series`

- Mô tả: Lấy danh sách series (hỗ trợ filter/sort/pagination).
- Ví dụ URL: `https://api.tcgdex.net/v2/en/series`
- Response mẫu (`200`): Mảng series dạng brief.

```json
[
  {
    "id": "swsh",
    "name": "Sword & Shield",
    "logo": "https://assets.tcgdex.net/en/swsh/swshp/logo"
  }
]
```

### 7) `GET /series/{serieId}`

- Mô tả: Lấy chi tiết một series.
- Ví dụ URL: `https://api.tcgdex.net/v2/en/series/swsh`
- Response mẫu (`200`): Serie object đầy đủ.

```json
{
  "id": "swsh",
  "name": "Sword & Shield",
  "logo": "https://assets.tcgdex.net/en/swsh/swshp/logo",
  "sets": [
    {
      "id": "swsh3",
      "name": "Darkness Ablaze",
      "cardCount": {
        "official": 189,
        "total": 201
      }
    }
  ]
}
```

## Other Listing Endpoints

Các endpoint dưới đây đều trả về mảng (`200 OK`), chủ yếu là danh sách giá trị để filter/tìm kiếm.

### 1) `GET /categories`

- Ví dụ URL: `https://api.tcgdex.net/v2/en/categories`
- Response mẫu:

```json
["Pokemon", "Trainer", "Energy"]
```

### 2) `GET /hps`

- Ví dụ URL: `https://api.tcgdex.net/v2/en/hps`
- Response mẫu:

```json
[10, 30, 40, 50, 60]
```

### 3) `GET /illustrators`

- Ví dụ URL: `https://api.tcgdex.net/v2/en/illustrators`
- Response mẫu:

```json
["Ken Sugimori", "5ban Graphics", "tetsuya koizumi"]
```

### 4) `GET /rarities`

- Ví dụ URL: `https://api.tcgdex.net/v2/en/rarities`
- Response mẫu:

```json
["Common", "Uncommon", "Rare", "Ultra Rare"]
```

### 5) `GET /retreats`

- Ví dụ URL: `https://api.tcgdex.net/v2/en/retreats`
- Response mẫu:

```json
[0, 1, 2, 3, 4]
```

### 6) `GET /types`

- Ví dụ URL: `https://api.tcgdex.net/v2/en/types`
- Response mẫu:

```json
["Grass", "Fire", "Water", "Lightning", "Psychic", "Fighting", "Darkness", "Metal", "Dragon", "Colorless"]
```

### 7) `GET /dexids`

- Ví dụ URL: `https://api.tcgdex.net/v2/en/dexids`
- Response mẫu:

```json
[1, 2, 3, 4, 5, 6]
```

### 8) `GET /energytypes`

- Ví dụ URL: `https://api.tcgdex.net/v2/en/energytypes`
- Response mẫu:

```json
["Normal", "Special"]
```

### 9) `GET /regulationmarks`

- Ví dụ URL: `https://api.tcgdex.net/v2/en/regulationmarks`
- Response mẫu:

```json
["D", "E", "F", "G", "H"]
```

### 10) `GET /stages`

- Ví dụ URL: `https://api.tcgdex.net/v2/en/stages`
- Response mẫu:

```json
["Basic", "Stage1", "Stage2", "VMAX", "VSTAR"]
```

### 11) `GET /suffixes`

- Ví dụ URL: `https://api.tcgdex.net/v2/en/suffixes`
- Response mẫu:

```json
["EX", "GX", "V", "VMAX", "VSTAR"]
```

### 12) `GET /trainertypes`

- Ví dụ URL: `https://api.tcgdex.net/v2/en/trainertypes`
- Response mẫu:

```json
["Item", "Supporter", "Stadium", "Pokémon Tool"]
```

### 13) `GET /variants`

- Ví dụ URL: `https://api.tcgdex.net/v2/en/variants`
- Response mẫu:

```json
["normal", "reverse", "holo", "firstEdition", "wPromo"]
```

## Query Capabilities

Theo trang `Filtering, Sorting & Pagination`, các endpoint dạng list hỗ trợ query params như:

- Sắp xếp:
  - `sort:field`
  - `sort:order` (`ASC` hoặc `DESC`)
- Phân trang:
  - `pagination:page`
  - `pagination:itemsPerPage`
- Lọc theo field:
  - Dùng các toán tử filter theo tài liệu chính thức.

Ví dụ:

- `https://api.tcgdex.net/v2/en/sets?sort:field=name&sort:order=DESC`
- `https://api.tcgdex.net/v2/en/sets?pagination:page=3&pagination:itemsPerPage=2`

Tài liệu filter/sort/pagination:

- `https://tcgdex.dev/rest/filtering-sorting-pagination`

## Notes

- REST API chỉ hỗ trợ phương thức `GET`.
- Response trả về dạng `JSON`.
- API chỉ hoạt động qua `HTTPS`.

## Nguồn đối chiếu trong docs REST

Danh sách endpoint ở trên được đối chiếu từ các trang REST chính thức:

- `https://tcgdex.dev/rest/card`
- `https://tcgdex.dev/rest/cards`
- `https://tcgdex.dev/rest/set`
- `https://tcgdex.dev/rest/sets`
- `https://tcgdex.dev/rest/set-card`
- `https://tcgdex.dev/rest/serie`
- `https://tcgdex.dev/rest/series`
- `https://tcgdex.dev/rest/other-fields`
- `https://tcgdex.dev/rest/filtering-sorting-pagination`


