# 🐶 Husky Git Hooks

## ✅ Đã Cài Đặt & Cấu Hình

Husky đã được cấu hình để tự động format và kiểm tra code trước khi commit.

## 🔧 Cấu Hình Hiện Tại

### Pre-commit Hook
**File:** `.husky/pre-commit`

Tự động chạy trước mỗi commit:
```bash
npx lint-staged
```

### Lint-staged Configuration
**File:** `package.json`

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

## 🚀 Cách Hoạt Động

### Workflow Tự Động:

```
1. git add <files>
        ↓
2. git commit -m "message"
        ↓
3. Husky pre-commit hook chạy
        ↓
4. lint-staged format các file staged
        ↓
5. Prettier format code
        ↓
6. ESLint fix lỗi tự động
        ↓
7. ✅ Commit thành công hoặc ❌ Hiển thị lỗi
```

## 📋 Ví Dụ Thực Tế

### Trường Hợp 1: Format Thành Công

```bash
# Code ban đầu (không format)
const test={a:1,b:2}

# Add và commit
git add .
git commit -m "add test"

# Husky tự động format thành:
const test = { a: 1, b: 2 };

# Output:
✔ Preparing lint-staged...
✔ Running tasks for staged files...
✔ Applying modifications from tasks...
✔ Cleaning up temporary files...
[main abc1234] add test
 1 file changed, 1 insertion(+)
```

### Trường Hợp 2: Có Lỗi ESLint

```bash
# Code có lỗi
const unused = 123;

git add .
git commit -m "test"

# Output:
✖ Running tasks for staged files...
  error  'unused' is assigned a value but never used
  
# Commit bị hủy - bạn cần fix lỗi trước
```

## 🛠️ Commands Hữu Ích

### Chạy lint-staged thủ công:
```bash
npx lint-staged
```

### Bỏ qua pre-commit hook (khẩn cấp):
```bash
git commit -m "message" --no-verify
# hoặc
git commit -m "message" -n
```

### Kiểm tra Husky hoạt động:
```bash
# Tạo file test
echo "const x={a:1}" > test.ts

# Add và commit
git add test.ts
git commit -m "test husky"

# Kiểm tra file đã được format
cat test.ts
# Kết quả: const x = { a: 1 };
```

## 🎯 Best Practices

### ✅ Nên Làm:
- Luôn để Husky chạy tự động
- Commit thường xuyên với các thay đổi nhỏ
- Fix các lỗi ESLint khi hook báo lỗi
- Kiểm tra file sau khi commit để đảm bảo format đúng

### ❌ Không Nên:
- Dùng `--no-verify` thường xuyên
- Commit quá nhiều file cùng lúc (chậm)
- Ignore các lỗi ESLint mà không fix
- Disable Husky trong dự án team

## 🔍 Troubleshooting

### Hook không chạy:

```bash
# Kiểm tra Husky được cài đặt
ls .husky

# Reinstall hooks
npm run prepare

# hoặc
npx husky install
```

### lint-staged chậm:

```bash
# Chỉ format file thay đổi thay vì toàn bộ
# Đã được cấu hình mặc định với lint-staged
```

### Lỗi permission trên Linux/Mac:

```bash
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

### Windows: Hook không chạy:

```bash
# Kiểm tra Git Bash được cài đặt
git --version

# Đảm bảo sử dụng Git Bash, không phải CMD
```

## 📊 Thống Kê & Monitor

### Xem logs của lint-staged:

```bash
# Set debug mode
DEBUG=lint-staged* git commit -m "message"
```

### Xem thời gian chạy:

```bash
# Add vào package.json scripts:
"lint-staged:debug": "lint-staged --verbose"
```

## 🔧 Tùy Chỉnh

### Thêm hook mới:

```bash
# Tạo pre-push hook
echo "npm run test" > .husky/pre-push
chmod +x .husky/pre-push
```

### Chỉ format một số file types:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "prettier --write"
    ],
    "*.ts": [
      "eslint --fix"
    ]
  }
}
```

### Thêm commit message validation:

```bash
# Cài commitlint
npm install --save-dev @commitlint/{config-conventional,cli}

# Tạo config
echo "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js

# Uncomment dòng trong .husky/commit-msg
```

## 📚 Tài Liệu

- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged Documentation](https://github.com/okonet/lint-staged)
- [Conventional Commits](https://www.conventionalcommits.org/)

## ✨ Tips

1. **Speed up commits:** Chỉ add những file cần commit
2. **VS Code:** Format on save để giảm tải cho hook
3. **Team:** Đảm bảo tất cả dev có cùng cấu hình
4. **CI/CD:** Chạy `npm run format:check` trong pipeline
