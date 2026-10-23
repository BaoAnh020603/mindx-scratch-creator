# 🐱 MindX Scratch Creator — Nền Tảng Học Tập & Luyện Tập Scratch Trực Tuyến

Nền tảng hỗ trợ học viên tự học, luyện tập và làm bài tập lập trình Scratch trực quan, thân thiện:
- **Khu vực thực hành (Cột trái):** Tích hợp trình soạn thảo Scratch / TurboWarp với đầy đủ bộ tài nguyên nhân vật & phông nền có sẵn.
- **Bảng hướng dẫn & Nhiệm vụ (Cột phải):** Theo dõi nhiệm vụ chi tiết, hệ thống gợi ý tư duy logic, đồng hồ kiểm soát thời gian làm bài.
- **Cơ chế kiểm tra tự động:** Tự động đối chiếu mã nguồn khối lệnh của bài làm để đánh giá mức độ hoàn thành và khuyến khích sáng tạo.
- **Lưu trữ tiến độ (LocalStorage):** Tự động ghi nhớ trạng thái làm bài, học viên có thể tiếp tục bất cứ lúc nào.

---

## 🚀 Trải Nghiệm Trực Tuyến

Học viên và giáo viên có thể truy cập trực tiếp qua liên kết GitHub Pages:
- 🏠 **Trang chọn khóa học & bài học:** `https://BaoAnh020603.github.io/mindx-scratch-creator/portal.html`
- 📚 **Trang thực hành:** `https://BaoAnh020603.github.io/mindx-scratch-creator/index.html`

---

## 📂 Cấu Trúc Dự Án

```text
mindx-scratch-creator/
├── portal.html          # Cổng chọn khóa học và bài học
├── index.html           # Giao diện chính của màn hình làm bài
├── style.css            # Hệ thống phong cách giao diện và hiệu ứng
├── script.js            # Xử lý logic làm bài, kiểm tra khối lệnh và đếm giờ
├── courses.json         # Danh mục các khóa học Scratch
├── lessons/             # Dữ liệu nội dung các bài học (.json)
└── projects/            # Tài nguyên file dự án mẫu (.sb3)
```

---

## 🛠️ Cập Nhật & Mở Rộng Bài Học

1. **Thêm bài học mới:**
   - Tạo file cấu hình bài học mới trong thư mục `lessons/` (ví dụ: `bai4.json`).
   - Cập nhật danh sách bài học vào `courses.json`.
2. **Cập nhật lên hệ thống:**
   - Đẩy thay đổi lên nhánh `main` của kho lưu trữ GitHub, hệ thống GitHub Pages sẽ tự động cập nhật phiên bản mới nhất.
