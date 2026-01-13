# Giải thích về Số lượng Contributors trên GitHub

## Vấn đề

Mặc dù trên nhánh hiện tại không còn commit nào của "lcaohoanq" (đã được rebase và thay đổi user commit), nhưng GitHub vẫn hiển thị 4 contributors.

## Nguyên nhân

GitHub tính toán số lượng contributors dựa trên nhiều yếu tố, không chỉ dựa vào git history:

### 1. **Pull Request Authorship (Tác giả PR)**
- Khi một người tạo Pull Request, GitHub ghi nhận họ là contributor
- Thông tin này được lưu vĩnh viễn trong metadata của GitHub
- **Ngay cả khi commits được rebase hoặc viết lại, GitHub vẫn giữ thông tin tác giả PR**

### 2. **Comments & Reviews (Bình luận & Đánh giá)**
- Người comment trên Issues
- Người comment trên Pull Requests
- Người review code
- Tất cả đều được tính là contributors

### 3. **GitHub Metadata Cache**
- GitHub cache (lưu trữ tạm) thông tin contributors
- Cache này cập nhật theo lịch trình của GitHub, không phải ngay lập tức
- Có thể mất vài ngày để cache được cập nhật

## Giải pháp đã thực hiện

### 1. File `.mailmap`
- Tạo file `.mailmap` để map (ánh xạ) identity của lcaohoanq về An Phuoc Dao
- File này hoạt động ở mức git command line
- Khi chạy `git shortlog` hoặc `git log`, lcaohoanq sẽ hiển thị là An Phuoc Dao

```bash
# Kiểm tra kết quả
git shortlog -sn --all
```

### 2. File `CONTRIBUTORS.md`
- Tài liệu giải thích về contributor attribution
- Giải thích sự khác biệt giữa git history và GitHub contributors
- Ghi nhận rằng repository hiện tại do An Phuoc Dao duy trì hoàn toàn

### 3. Cập nhật README.md
- Thêm link đến CONTRIBUTORS.md
- Người đọc có thể hiểu rõ về contributor attribution

## Lưu ý quan trọng

### ✅ Những gì đã được giải quyết:
- Git history sạch sẽ (chỉ có commits của An Phuoc Dao)
- Git command line hiển thị đúng attribution nhờ `.mailmap`
- Documentation rõ ràng về contributor situation

### ⚠️ Những gì KHÔNG thể thay đổi ngay lập tức:
- **Số lượng contributors trên GitHub web interface**: Do GitHub cache metadata
- **Pull Request history**: GitHub giữ lịch sử PR permanently
- **Comment/Review history**: Metadata này không thể xóa

## GitHub sẽ tự động cập nhật

Contributor count trên GitHub web interface sẽ tự động cập nhật khi:
- GitHub refresh cache (thường mất vài ngày đến vài tuần)
- Có nhiều hoạt động mới trên repository
- GitHub chạy background jobs để cập nhật statistics

## Kết luận

Đây là hành vi bình thường của GitHub và không phải là lỗi. Nhiều open-source projects lớn cũng gặp tình huống tương tự khi rebase history.

**Điều quan trọng:**
- Git history của bạn đã sạch ✅
- Attribution đúng trong git commands ✅
- Documentation rõ ràng ✅
- GitHub contributor count sẽ tự cập nhật theo thời gian ⏳

## Tham khảo

- [GitHub Docs: Why are my contributions not showing up?](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile/why-are-my-contributions-not-showing-up-on-my-profile)
- [Git Documentation: git-shortlog - .mailmap](https://git-scm.com/docs/git-shortlog#_mapping_authors)
