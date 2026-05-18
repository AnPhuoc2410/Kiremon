# TCGdex REST API Endpoints (v2)

## Base URL

- Base URL: `https://api.tcgdex.net/v2/{lang}`
- `{lang}` là mã ngôn ngữ. Ví dụ phổ biến: `en`, `fr`, `de`, `it`, `es`, `pt-br`.

Ví dụ đầy đủ:

- `https://api.tcgdex.net/v2/en/cards`
- `https://api.tcgdex.net/v2/fr/sets`

## Core Endpoints

Các endpoint cốt lõi được tài liệu REST chính thức mô tả:

- `GET /cards`: Lấy danh sách cards (hỗ trợ filter/sort/pagination).
  - Ví dụ: `https://api.tcgdex.net/v2/en/cards`
- `GET /cards/{cardId}`: Lấy chi tiết một card theo id toàn cục.
  - Ví dụ: `https://api.tcgdex.net/v2/en/cards/swsh3-136`
- `GET /sets`: Lấy danh sách sets (hỗ trợ filter/sort/pagination).
  - Ví dụ: `https://api.tcgdex.net/v2/en/sets`
- `GET /sets/{setId}`: Lấy chi tiết một set.
  - Ví dụ: `https://api.tcgdex.net/v2/en/sets/swsh3`
- `GET /sets/{setId}/{localId}`: Lấy card theo local id bên trong set.
  - Ví dụ: `https://api.tcgdex.net/v2/en/sets/swsh3/136`
- `GET /series`: Lấy danh sách series (hỗ trợ filter/sort/pagination).
  - Ví dụ: `https://api.tcgdex.net/v2/en/series`
- `GET /series/{serieId}`: Lấy chi tiết một series.
  - Ví dụ: `https://api.tcgdex.net/v2/en/series/swsh`

## Other Listing Endpoints

Các endpoint liệt kê dữ liệu phụ từ trang `Other endpoints`:

- `GET /categories`
- `GET /hps`
- `GET /illustrators`
- `GET /rarities`
- `GET /retreats`
- `GET /types`
- `GET /dexids`
- `GET /energytypes`
- `GET /regulationmarks`
- `GET /stages`
- `GET /suffixes`
- `GET /trainertypes`
- `GET /variants`

Ví dụ:

- `https://api.tcgdex.net/v2/en/types`
- `https://api.tcgdex.net/v2/en/rarities`
- `https://api.tcgdex.net/v2/en/regulationmarks`

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
