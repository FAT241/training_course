# TASK LIST — DACS3 Training System

**Mô hình phát triển:** Waterfall (Thác nước)
**Người thực hiện:** 1 người
**Deadline nộp:** 16/08/2026

> **Quy ước trạng thái:**
> - `[ ]` Chưa làm
> - `[/]` Đang làm
> - `[x]` Hoàn thành

---

## PHASE 1 — REQUIREMENTS (Phân tích yêu cầu) ✅

- [x] Xác định đề tài, lý do chọn đề tài
- [x] Xác định actor và use case (Admin + Employee)
- [x] Viết tài liệu phân tích hệ thống (system_analysis.md)
- [x] Khởi tạo project (server Express + client React/Vite)
- [x] Kết nối PostgreSQL thành công

---

## PHASE 2 — DESIGN (Thiết kế)

### 2.1 Database
- [x] Thiết kế ERD (sơ đồ quan hệ các bảng)
- [x] Viết file SQL tạo schema — các bảng:
  - `department` (phòng ban)
  - `users` (nhân viên + admin, có role)
  - `employee` (kế thừa users — Class Table Inheritance)
  - `course` (khóa học)
  - `course_permission` (phân quyền khóa học theo phòng ban)
  - `chapter` (chương)
  - `lesson` (bài học: video/PDF/slide)
  - `quiz` (bài kiểm tra cuối chương — 1 chương 1 quiz)
  - `question` (câu hỏi)
  - `answer` (đáp án, có đánh dấu đúng/sai)
  - `quiz_result` (kết quả làm quiz của nhân viên)
  - `learning_progress` (tiến độ học theo khóa học)
  - `certificate` (chứng chỉ — chỉ cấp khi pass tất cả quiz)

  > **Cách tính completion_percentage:** số chương đã pass quiz / tổng số chương × 100
  > *(Không dùng bảng lesson_completion — đủ cho phạm vi đề tài)*

- [x] Seed dữ liệu mẫu:
  - 3 phòng ban
  - 5–10 nhân viên (1 admin, còn lại employee)
  - 2 khóa học mẫu (1 công khai, 1 hạn chế theo phòng ban)
  - Câu hỏi quiz mẫu cho từng chương

### 2.2 UI/UX (Wireframe sơ bộ)
- [ ] Phác thảo trang Login
- [ ] Phác thảo layout Admin (sidebar + các trang)
- [ ] Phác thảo layout Employee (sidebar + các trang)

---

## PHASE 3 — IMPLEMENTATION (Lập trình)

### 3.1 Backend — Cấu trúc & Middleware
- [ ] Tạo cấu trúc thư mục routes/, controllers/, middleware/
- [ ] Middleware xác thực JWT (`authMiddleware`)
- [ ] Middleware kiểm tra role (`requireAdmin`, `requireEmployee`)

### 3.2 Backend — Auth
- [ ] `POST /api/auth/login` — đăng nhập, trả JWT + thông tin user

### 3.3 Backend — Admin APIs
- [x] `GET/POST/PUT/DELETE /api/employees` — CRUD nhân viên
- [x] `GET /api/departments` — lấy danh sách phòng ban
- [x] `GET/POST/PUT/DELETE /api/courses` — CRUD khóa học
- [x] `GET/POST/PUT/DELETE /api/courses/:id/chapters` — CRUD chương
- [x] `GET/POST/PUT/DELETE /api/chapters/:id/lessons` — CRUD bài học
- [x] `GET/POST/PUT/DELETE /api/chapters/:id/quiz` — CRUD quiz + câu hỏi + đáp án
- [x] `POST /api/courses/:id/permissions` — phân quyền khóa học theo phòng ban
- [ ] `GET /api/statistics` — thống kê tiến độ học tập toàn hệ thống
- [ ] `POST /api/upload` — upload file video/PDF lên local storage

### 3.4 Backend — Employee APIs
- [ ] `GET /api/my-courses` — danh sách khóa học được phân quyền + tiến độ
- [ ] `GET /api/courses/:id` — chi tiết khóa học (danh sách chương, bài học)
- [ ] `POST /api/lessons/:id/complete` — đánh dấu đã xem bài học, cập nhật tiến độ
- [ ] `GET /api/quizzes/:id` — lấy câu hỏi quiz (ẩn đáp án đúng)
- [ ] `POST /api/quizzes/:id/submit` — nộp bài, tính điểm, lưu kết quả
- [ ] `GET /api/my-certificates` — danh sách chứng chỉ của nhân viên
- [ ] `GET /api/certificates/:id/download` — xuất chứng chỉ dạng PDF
- [ ] `GET /api/my-progress` — tiến độ + điểm quiz cá nhân

### 3.5 Backend — Logic nghiệp vụ quan trọng
- [ ] Tự động sinh chứng chỉ khi nhân viên pass **tất cả quiz** của khóa học
  - Điều kiện: `quiz_result.score >= quiz.passing_score` cho **mọi chương**
- [ ] Tính `completion_percentage` trong `learning_progress` sau mỗi lần hoàn thành bài học/quiz

### 3.6 Frontend — Cấu trúc chung
- [ ] Setup React Router v6 (cấu trúc routing)
- [ ] Setup Axios + interceptor tự động đính JWT vào header
- [ ] Component `PrivateRoute` — bảo vệ trang theo role
- [ ] Trang Login (form + gọi API + lưu JWT vào localStorage)
- [ ] Trang 403 Forbidden / 404 Not Found

### 3.7 Frontend — Admin
- [ ] Layout Admin (sidebar điều hướng + header)
- [ ] Trang quản lý nhân viên (bảng danh sách + modal thêm/sửa/xóa)
- [ ] Trang quản lý khóa học:
  - [ ] Danh sách khóa học
  - [ ] Form tạo/sửa khóa học
  - [ ] Quản lý chương trong khóa học
  - [ ] Quản lý bài học trong chương (upload video/PDF)
  - [ ] Quản lý quiz + câu hỏi + đáp án trong chương
- [ ] Trang phân quyền khóa học (chọn phòng ban)
- [ ] Trang thống kê (bảng/biểu đồ tiến độ nhân viên theo khóa học)

### 3.8 Frontend — Employee
- [ ] Layout Employee (sidebar điều hướng + header)
- [ ] Trang danh sách khóa học (card khóa học + thanh tiến độ)
- [ ] Trang học bài:
  - [ ] Video player (HTML5 `<video>`)
  - [ ] PDF viewer (nhúng PDF.js)
  - [ ] Tự động ghi nhận hoàn thành khi xem xong
- [ ] Trang Quiz:
  - [ ] Hiển thị lần lượt câu hỏi trắc nghiệm
  - [ ] Nộp bài + hiển thị điểm + thông báo pass/fail
- [ ] Trang chứng chỉ (danh sách + nút tải PDF)
- [ ] Trang tiến độ cá nhân (% hoàn thành + điểm từng quiz)

---

## PHASE 4 — TESTING (Kiểm thử)

### Luồng Admin
- [ ] Đăng nhập Admin → tạo khóa học → thêm chương → upload bài học → tạo quiz
- [ ] Phân quyền khóa học cho phòng ban → kiểm tra Employee đúng phòng ban mới thấy

### Luồng Employee
- [ ] Đăng nhập Employee → xem danh sách khóa học → học bài → làm quiz → nhận cert
- [ ] Làm quiz không đủ điểm → không được cấp chứng chỉ ✓
- [ ] Hoàn thành tất cả quiz đủ điểm → tự động sinh + tải được chứng chỉ ✓

### Kiểm tra bảo mật phân quyền
- [ ] Employee không truy cập được API/trang của Admin
- [ ] Employee chỉ thấy khóa học đúng phòng ban của mình
- [ ] Không có JWT → bị chặn, redirect về trang Login

### Edge cases
- [ ] Đăng nhập sai mật khẩu → thông báo lỗi
- [ ] Upload file sai định dạng → báo lỗi rõ ràng
- [ ] Chưa có dữ liệu → UI hiển thị trạng thái trống (empty state)

---

## PHASE 5 — DOCUMENTATION & DEPLOYMENT (Hoàn thiện & Nộp bài)

- [ ] Hoàn thiện báo cáo thực tập (MS Word): đặc tả yêu cầu, use case diagram, class diagram, ERD
- [ ] Chuẩn bị slide báo cáo tiếng Anh
- [ ] Nộp kết quả lên hệ thống đào tạo theo quy định nhà trường

---

## GHI CHÚ KỸ THUẬT

| Hạng mục | Quyết định |
|---|---|
| Điều kiện cấp chứng chỉ | Pass **tất cả** quiz trong khóa học (score >= passing_score) |
| Lưu trữ file | Local storage trên máy server (không dùng cloud) |
| Xác thực | JWT — lưu ở localStorage phía client |
| Phân quyền | Role-Based: ADMIN / EMPLOYEE |
| Xem PDF | PDF.js nhúng trực tiếp trong trình duyệt (không cho tải thẳng) |
| DB | PostgreSQL (không có bảng access_log) |
