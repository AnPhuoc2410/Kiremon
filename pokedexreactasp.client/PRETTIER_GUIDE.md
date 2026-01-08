# Hướng Dẫn Sử Dụng Prettier

## 📋 Tổng Quan

Prettier đã được cài đặt và cấu hình sẵn trong dự án. File cấu hình: [`.prettierrc.json`](.prettierrc.json)

## ⚙️ Cấu Hình Hiện Tại

```json
{
  "printWidth": 80,           // Độ dài tối đa mỗi dòng
  "tabWidth": 2,              // Kích thước tab = 2 spaces
  "trailingComma": "all",     // Thêm dấu phẩy ở cuối mảng/object
  "arrowParens": "always",    // Luôn có dấu ngoặc cho arrow function
  "endOfLine": "auto",        // Tự động xử lý line endings
  "useTabs": false,           // Dùng spaces thay vì tabs
  "semi": true,               // Thêm dấu chấm phẩy ở cuối câu lệnh
  "singleQuote": false,       // Dùng double quotes
  "jsxSingleQuote": false     // Dùng double quotes trong JSX
}
```

## 🚀 Cách Chạy Prettier

### 1. Chạy Thủ Công (Command Line)

#### Format tất cả files:
```bash
npm run format
```

#### Chỉ kiểm tra (không format):
```bash
npm run format:check
```

#### Format một file cụ thể:
```bash
npx prettier --write src/pages/Market/index.tsx
```

#### Format một thư mục:
```bash
npx prettier --write "src/pages/Market/**/*.{ts,tsx}"
```

### 2. Tự Động Format trong VS Code

#### Cài Đặt Extension:
1. Mở VS Code Extensions (`Ctrl+Shift+X`)
2. Tìm kiếm "Prettier - Code formatter"
3. Cài đặt extension của Prettier

#### Cấu Hình VS Code (User Settings):

Nhấn `Ctrl+Shift+P` → Gõ "Open User Settings (JSON)" → Thêm:

```json
{
  // Format khi save file
  "editor.formatOnSave": true,

  // Chọn Prettier làm formatter mặc định
  "editor.defaultFormatter": "esbenp.prettier-vscode",

  // Cấu hình cho từng loại file
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  }
}
```

#### Hoặc Cấu Hình Workspace (chỉ dự án này):

Tạo file `.vscode/settings.json` trong thư mục dự án:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

### 3. Keyboard Shortcuts trong VS Code

- **Format Document**: `Shift+Alt+F` (Windows) hoặc `Shift+Option+F` (Mac)
- **Format Selection**: `Ctrl+K Ctrl+F` (Windows) hoặc `Cmd+K Cmd+F` (Mac)

### 4. Pre-commit Hook (Tự động format trước khi commit)

#### Cài đặt Husky và lint-staged:

```bash
npm install --save-dev husky lint-staged
npx husky install
```

#### Thêm vào `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": [
      "prettier --write",
      "eslint --fix"
    ],
    "*.{json,css,scss,md}": [
      "prettier --write"
    ]
  }
}
```

#### Tạo pre-commit hook:

```bash
npx husky add .husky/pre-commit "npx lint-staged"
```

## 📝 Ví Dụ Sử Dụng

### Trước khi format:
```typescript
const MyComponent = ({name,age}:Props) => {
const [state,setState]=useState(0)
return <div style={{padding:10,margin:20}}><h1>{name}</h1></div>
}
```

### Sau khi format:
```typescript
const MyComponent = ({ name, age }: Props) => {
  const [state, setState] = useState(0);
  return (
    <div style={{ padding: 10, margin: 20 }}>
      <h1>{name}</h1>
    </div>
  );
};
```

## 🎯 Best Practices

1. **Luôn format trước khi commit** để giữ code nhất quán
2. **Bật format on save** trong VS Code để tự động format
3. **Chạy `npm run format:check`** trong CI/CD pipeline
4. **Không thay đổi cấu hình Prettier** giữa chừng dự án
5. **Commit file `.prettierrc.json`** vào Git

## 🔧 Tùy Chỉnh Cấu Hình

Nếu muốn thay đổi cấu hình, chỉnh sửa file `.prettierrc.json`:

```json
{
  "printWidth": 100,          // Tăng độ dài dòng lên 100
  "singleQuote": true,        // Đổi sang single quotes
  "semi": false,              // Bỏ dấu chấm phẩy
  "trailingComma": "es5"      // Chỉ thêm dấu phẩy ở ES5
}
```

## 🚫 Bỏ Qua Files Không Cần Format

Chỉnh sửa `.prettierignore`:

```
node_modules/
dist/
build/
*.min.js
*.min.css
```

## 🐛 Troubleshooting

### Prettier không hoạt động trong VS Code:
1. Kiểm tra extension đã cài đặt chưa
2. Reload VS Code (`Ctrl+Shift+P` → "Reload Window")
3. Kiểm tra Output panel (`Ctrl+Shift+U` → chọn "Prettier")

### Xung đột giữa ESLint và Prettier:
```bash
npm install --save-dev eslint-config-prettier eslint-plugin-prettier
```

Thêm vào `.eslintrc`:
```json
{
  "extends": [
    "prettier"
  ],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error"
  }
}
```

## 📚 Tài Liệu Tham Khảo

- [Prettier Documentation](https://prettier.io/docs/en/)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [VS Code Prettier Extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
