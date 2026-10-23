# 🎓 MindX Scratch Creator — Web Dashboard Dạy Bù & Tự Học

Dashboard học tập trực quan dành cho học sinh MindX học bù hoặc tự luyện tập tại nhà:
- **Cột trái (65%):** Nhúng trực tiếp Scratch Editor (scratch.mit.edu).
- **Cột phải (35%):** Đồng hồ đếm ngược 60 phút, Checklist nhiệm vụ, Gợi ý khối lệnh (Hint Code), Nút nộp bài (bắn pháo hoa 🎉) và Bảng ôn tập kiến thức cốt lõi.
- **Lưu trạng thái (LocalStorage):** Học sinh reload (F5) trang không bị mất tiến độ làm bài, đồng hồ tiếp tục đếm.

---

## 📂 Cấu trúc thư mục

```
MindX_Scratch_Creator/
│
├── index.html            # Giao diện chính của Dashboard
├── style.css             # Thiết kế giao diện hiện đại (Dark theme, Animation)
├── script.js             # Logic đồng hồ, lưu LocalStorage, nộp bài, pháo hoa
│
├── lessons/              # Thư mục chứa nội dung từng bài học
│   └── bai3-phan2.json   # Dữ liệu Bài 3 - Hành Trình Bí Ngô (Phần 2)
│
└── README.md             # Hướng dẫn sử dụng & triển khai
```

---

## 🚀 Cách chạy thử trên máy tính

### Cách 1: Mở trực tiếp (Không cần cài đặt)
Chỉ cần nhấp đúp chuột vào file `index.html` trong thư mục trên máy tính để mở trên Chrome, Edge hoặc Cốc Cốc. Hệ thống đã tích hợp sẵn cơ chế dự phòng tự động nhận bài học mà không bị lỗi trình duyệt.

### Cách 2: Dùng Live Server (Khuyên dùng khi lập trình)
1. Mở thư mục này bằng **VS Code**.
2. Nhấp chuột phải vào `index.html` chọn **Open with Live Server**.

---

## ➕ Cách thêm Bài học mới (Ví dụ Bài 4, Bài 5...)

Hệ thống được thiết kế theo kiến trúc module cực kỳ linh hoạt. Bạn không cần sửa lại code giao diện:

1. Vào thư mục `lessons/`, nhân bản file `bai3-phan2.json` thành `bai4.json`.
2. Chỉnh sửa nội dung các trường:
   - `id`: Mã bài học (ví dụ: `"bai4"`)
   - `title`: Tên bài học (ví dụ: `"Bài 4 - Boss Bí Ngô Tấn Công"`)
   - `tasks`: Danh sách nhiệm vụ và gợi ý code
   - `knowledge`: Bảng kiến thức ôn tập tổng kết
3. Truy cập bài học mới bằng cách thêm tham số URL:
   ```
   index.html?lesson=bai4
   ```

---

## 🌐 Cách đưa lên GitHub Pages (Miễn phí vĩnh viễn)

Chỉ cần làm 1 lần để có đường link online gửi cho phụ huynh và học sinh:

1. Tạo một tài khoản trên [GitHub](https://github.com/).
2. Tạo repository mới (ví dụ đặt tên: `mindx-scratch-dashboard`).
3. Kéo toàn bộ các file trong thư mục này tải lên repository.
4. Vào **Settings** của repository -> Chọn mục **Pages** ở menu bên trái.
5. Tại phần **Branch**, chọn nhánh `main` (hoặc `master`) và bấm **Save**.
6. Sau khoảng 1-2 phút, bạn sẽ nhận được đường link:
   ```
   https://<username>.github.io/mindx-scratch-dashboard/
   ```
   Khi gửi bài cụ thể cho học sinh:
   ```
   https://<username>.github.io/mindx-scratch-dashboard/?lesson=bai3-phan2
   ```
