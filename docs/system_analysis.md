# TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN VÀ TRUYỀN THÔNG VIỆT - HÀN
## KHOA KHOA HỌC MÁY TÍNH
## PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG

**Đề tài:** Xây dựng hệ thống đào tạo nội bộ trực tuyến theo mô hình khóa học (Dành cho FPT Software)

---

## 1. TỔNG QUAN ĐỀ TÀI

### 1.1. Lý do chọn đề tài:
- FPT hiện đầu tư rất lớn cho hoạt động đào tạo nội bộ: riêng năm 2024, tập đoàn đã chi khoảng 184,7 tỷ đồng cho đào tạo với hơn 1,15 triệu lượt cán bộ nhân viên tham gia, và 100% nhân viên mới đều phải qua khóa đào tạo định hướng. Ở mảng phần mềm, FPT Software Academy cũng đã đào tạo nội bộ cho hơn 15.000 nhân viên trong hơn 10 năm.
- Đáng chú ý, FPT từng công bố hợp tác với Udemy Business — một nền tảng học trực tuyến của bên thứ ba — để triển khai một phần chương trình đào tạo, phát triển kỹ năng cho nhân viên. Điều này cho thấy một phần nội dung đào tạo của công ty đang phụ thuộc vào hạ tầng cloud bên ngoài, tiềm ẩn rủi ro khi cần đào tạo các nội dung mang tính đặc thù, nội bộ hoặc có yếu tố bảo mật cao (quy trình dự án, tài liệu kỹ thuật, quy định riêng của khách hàng...) mà không phù hợp để đưa lên nền tảng của bên thứ ba.
- Bên cạnh đó, việc chia sẻ tài liệu đào tạo nội bộ qua các công cụ phổ biến như Google Drive, OneDrive, Confluence cũng thường thiếu cơ chế kiểm soát chặt việc tải xuống, sao chép hay chia sẻ ra ngoài phạm vi công ty.
- Từ vấn đề quan sát được nói trên, em quyết định tự xây dựng một hệ thống đào tạo nội bộ có trải nghiệm học tập theo mô hình khóa học tương tự các nền tảng MOOC (Coursera, Udemy...), nhằm minh họa một giải pháp mà doanh nghiệp có thể tự quản lý toàn bộ hạ tầng và dữ liệu, thay vì phụ thuộc vào nền tảng bên thứ ba đối với các nội dung đào tạo mang tính bảo mật.

### 1.2. Mục tiêu:
- Tìm hiểu, nghiên cứu quy trình đào tạo nội bộ nói chung tại doanh nghiệp phần mềm (cách lưu trữ, chia sẻ tài liệu, các nền tảng đang sử dụng, quy định bảo mật thông tin thường gặp) thông qua tài liệu, thông tin công khai và trao đổi với GVHD, từ đó xác định rõ vấn đề cụ thể cần giải quyết.
- Phân tích, thiết kế và xây dựng hệ thống web đào tạo nội bộ hoàn chỉnh theo mô hình khóa học (course – chương – bài học – quiz – chứng chỉ), minh họa đầy đủ luồng: đăng nhập nhân viên – phân quyền khóa học theo phòng ban/cấp bậc – học và làm bài kiểm tra – nhận chứng chỉ – theo dõi tiến độ.
- Thiết kế hệ thống theo hướng self-hosted: xây dựng và triển khai thử nghiệm trên máy tính cá nhân của em, mô phỏng mô hình mà server và cơ sở dữ liệu có thể do doanh nghiệp trực tiếp quản lý, không phụ thuộc vào nền tảng SaaS/cloud công cộng của bên thứ ba.
- Vận dụng kiến thức lập trình web, thiết kế cơ sở dữ liệu quan hệ và xây dựng dịch vụ backend, qua đó rèn luyện năng lực phân tích – thiết kế hệ thống và triển khai một sản phẩm phần mềm hoàn chỉnh.

### 1.3. Phạm vi thực hiện:
- **Actor:** 2 actor gồm Quản trị viên (quản lý tài khoản nhân viên theo phòng ban, xây dựng cấu trúc khóa học, phân quyền truy cập, xem thống kê truy cập) và Nhân viên (học khóa học được phân quyền, làm bài kiểm tra, nhận chứng chỉ, xem tiến độ học tập cá nhân).
- **Cấu trúc khóa học theo mô hình MOOC:** mỗi khóa học gồm nhiều chương (chapter), mỗi chương gồm nhiều bài học (bài giảng dạng video/tài liệu) và một bài kiểm tra (quiz) cuối chương; hoàn thành toàn bộ khóa học sẽ được cấp chứng chỉ nội bộ.
- **Nhóm tài liệu thí điểm:** 2 loại khóa học — khóa học công khai nội bộ (toàn công ty) và khóa học hạn chế (theo phòng ban/dự án cụ thể).
- **Hạ tầng triển khai:** hệ thống được triển khai thử nghiệm trên máy tính cá nhân của em, mô phỏng mô hình on-premise/private server mà doanh nghiệp có thể tự quản lý; không sử dụng dịch vụ cloud/SaaS công cộng của bên thứ ba để lưu trữ dữ liệu đào tạo.
- **Dữ liệu:** Dữ liệu nhân viên, tài liệu, khóa học trong phạm vi đề tài thực tập là dữ liệu mô phỏng/thử nghiệm, độc lập với hệ thống chính thức của công ty.

### 1.4. Nền tảng và công nghệ sử dụng:
- **Kiến trúc hệ thống:** mô hình client - server, self-hosted. Phía client là ứng dụng web (Single Page Application) trải nghiệm học tương tự các nền tảng MOOC (Coursera, Udemy); phía server cung cấp REST API xử lý nghiệp vụ, phân quyền, thay vì dùng dịch vụ cloud/SaaS công cộng.
- **Frontend:** ReactJS, xây dựng giao diện học tập theo khóa học/chương/bài học, trình xem tài liệu nhúng (PDF.js), trình phát video nội bộ.
- **Backend:** Node.js (Express), xây dựng RESTful API, xác thực bằng JWT, phân quyền theo vai trò (Role-Based Access Control), chạy trực tiếp trên máy tính cá nhân (localhost) trong suốt quá trình xây dựng và kiểm thử, mô phỏng việc triển khai trên máy chủ nội bộ của doanh nghiệp.
- **Cơ sở dữ liệu:** PostgreSQL lưu tài khoản nhân viên, phòng ban, cấu trúc khóa học (chương/bài học/quiz), tiến độ học, chứng chỉ, log truy cập.
- **Lưu trữ tài liệu/video:** lưu trực tiếp trên ổ đĩa/hệ thống lưu trữ cục bộ (local storage) của máy chủ, không đẩy lên các dịch vụ lưu trữ đám mây công cộng (Google Drive, S3 public...).

### 1.5. Kết quả dự kiến đạt được:
- Một hệ thống web đào tạo nội bộ hoàn chỉnh (frontend + backend + cơ sở dữ liệu), giao diện trực quan theo mô hình khóa học, có cơ chế phân quyền theo phòng ban/cấp bậc và cấp chứng chỉ hoàn thành khóa học.
- Báo cáo phân tích và thiết kế hệ thống chi tiết (trên MS Word): đặc tả yêu cầu, use case diagram, class diagram, ERD.
- Slide trình chiếu tóm tắt kết quả báo cáo bằng tiếng Anh.

### 1.6. Kế hoạch thực hiện:
| Thời gian | Nội dung thực hiện |
|---|---|
| Ngày 23/04/2026 | Đi thực tế tìm hiểu doanh nghiệp, môi trường làm việc, lĩnh vực công ty đang phát triển là gì và xác định đề tài thực tập thực tế |
| Từ 13/07/2026 đến 19/07/2026 | Nộp đề cương thực tập theo quy định. |
| Từ 20/07/2026 đến 26/07/2026 | Phân tích yêu cầu, thiết kế cơ sở dữ liệu, thiết kế giao diện và xây dựng các chức năng cốt lõi của hệ thống (quản lý tài khoản nhân viên theo phòng ban, xây dựng cấu trúc khóa học, phân quyền truy cập). |
| Từ 27/07/2026 đến 02/08/2026 | Xây dựng module học tập (xem bài học trực tuyến, làm bài kiểm tra, cấp chứng chỉ hoàn thành), hoàn thiện hệ thống, kiểm thử và viết báo cáo thực tập thực tế. |
| Từ 03/08/2026 đến 16/08/2026 | Hoàn thiện báo cáo thực tập, chuẩn bị slide báo cáo bằng tiếng Anh và nộp kết quả lên hệ thống đào tạo theo quy định. |

---

## 2. ĐẶC TẢ YÊU CẦU VÀ USE CASE

### 2.1. Use case chi tiết:
**Actor Quản trị viên:**
1. Đăng nhập
2. Quản lý tài khoản nhân viên (theo phòng ban)
3. Quản lý khóa học (thêm/sửa/xóa chương, bài học, video/tài liệu, quiz)
4. Phân quyền truy cập khóa học theo phòng ban/cấp bậc.
5. Xem thống kê truy cập và tiến độ học tập của nhân viên

**Actor Nhân viên:**
1. Đăng nhập
2. Xem danh sách khóa học được phân quyền
3. Học bài (xem tài liệu/video trực tuyến)
4. Làm bài kiểm tra (quiz) cuối mỗi chương
5. Xem/Tải chứng chỉ hoàn thành khóa học
6. Xem tiến độ/kết quả học tập cá nhân

### 2.2. Đặc tả các Use Case chính:
*(Chi tiết từng kịch bản)*

**1) Quản lý tài khoản nhân viên (Employee Account Management):**
* **Actor:** Admin
* **Mục đích:** Thêm, sửa, xóa và tra cứu tài khoản nhân viên, gắn với phòng ban cụ thể.
* **Kịch bản:**
  1. Admin chọn chức năng quản lý tài khoản nhân viên.
  2. Hệ thống hiển thị danh sách nhân viên theo phòng ban.
  3. Admin thêm mới / chỉnh sửa thông tin / xóa (vô hiệu hóa) tài khoản.
  4. Hệ thống lưu thay đổi vào cơ sở dữ liệu.
* **Exception:** Trùng email khi tạo mới: hệ thống từ chối và thông báo tài khoản đã tồn tại.

**2) Quản lý khóa học (Course Management):**
* **Actor:** Admin
* **Mục đích:** Xây dựng và duy trì cấu trúc khóa học: chương, bài học (video/tài liệu) và bài kiểm tra cuối chương.
* **Kịch bản:**
  1. Admin tạo khóa học mới (tên, mô tả, loại khóa học).
  2. Thêm các chương cho khóa học.
  3. Với mỗi chương, thêm bài học (video/tài liệu) và một bài kiểm tra (quiz) cuối chương.
  4. Có thể chỉnh sửa hoặc xóa chương/bài học/quiz đã tạo.
  5. Hệ thống lưu cấu trúc khóa học vào cơ sở dữ liệu.
* **Exception:** Xóa chương đã có nhân viên học dở: hệ thống cảnh báo trước khi xác nhận xóa.

**3) Phân quyền truy cập khóa học (Course Access Authorization):**
* **Actor:** Admin
* **Mục đích:** Quy định khóa học nào được xem bởi phòng ban/cấp bậc nào, hoặc công khai toàn công ty.
* **Kịch bản:**
  1. Admin chọn khóa học cần phân quyền.
  2. Chọn phạm vi: công khai nội bộ (toàn công ty) hoặc hạn chế theo phòng ban/cấp bậc cụ thể.
  3. Hệ thống lưu thiết lập phân quyền.
* **Exception:** Không chọn phạm vi nào: hệ thống mặc định khóa học ở trạng thái nháp (chưa công bố).

**4) Xem thống kê truy cập và tiến độ học tập của nhân viên:**
* **Actor:** Admin
* **Mục đích:** Theo dõi mức độ tham gia và tiến độ hoàn thành khóa học của nhân viên.
* **Kịch bản:**
  1. Admin chọn khóa học hoặc phòng ban cần xem thống kê.
  2. Hệ thống tổng hợp dữ liệu truy cập, tiến độ và điểm số từ cơ sở dữ liệu.
  3. Hiển thị báo cáo dạng bảng/biểu đồ.
* **Exception:** Chưa có dữ liệu học tập: hệ thống hiển thị thông báo trống.

**5) Xem danh sách khóa học được phân quyền:**
* **Actor:** Employee
* **Kịch bản:**
  1. Employee đăng nhập vào hệ thống.
  2. Hệ thống truy vấn các khóa học được phân quyền cho phòng ban/cấp bậc của nhân viên.
  3. Hiển thị danh sách khóa học kèm tiến độ hiện tại.

**6) Học bài (Study Lesson):**
* **Actor:** Employee
* **Mục đích:** Xem nội dung bài học (video/tài liệu) trong một chương của khóa học.
* **Kịch bản:**
  1. Employee chọn khóa học, sau đó chọn chương và bài học.
  2. Hệ thống hiển thị nội dung bài học (phát video hoặc hiển thị tài liệu bằng PDF.js).
  3. Hệ thống ghi nhận tiến độ đã xem bài học đó.
* **Exception:** Mất kết nối khi đang phát video: hệ thống tạm dừng và cho phép tiếp tục khi có mạng trở lại.

**7) Làm Quiz (Take Quiz):**
* **Actor:** Employee
* **Mục đích:** Kiểm tra kiến thức sau khi hoàn thành các bài học trong một chương.
* **Kịch bản:**
  1. Employee chọn "Làm bài kiểm tra" ở cuối chương.
  2. Hệ thống hiển thị lần lượt các câu hỏi trắc nghiệm.
  3. Employee chọn đáp án và nộp bài.
  4. Hệ thống tính điểm, lưu kết quả và cập nhật tiến độ hoàn thành chương.

**8) Xem/Tải chứng chỉ hoàn thành khóa học:**
* **Actor:** Employee
* **Kịch bản:**
  1. Hệ thống tự động sinh chứng chỉ khi Employee hoàn thành tất cả chương của khóa học.
  2. Employee vào mục "Chứng chỉ của tôi" để xem.
  3. Employee chọn một chứng chỉ và thao tác tải về dưới dạng file PDF.
  4. Hệ thống xuất file PDF và kích hoạt luồng tải xuống.

**9) Xem tiến độ/kết quả học tập cá nhân:**
* **Actor:** Employee
* **Kịch bản:**
  1. Employee chọn mục "Tiến độ của tôi".
  2. Hệ thống hiển thị danh sách khóa học kèm phần trăm hoàn thành và điểm các bài kiểm tra.

---

## 3. PHÂN TÍCH HỆ THỐNG (SYSTEM ANALYSIS)

### 3.1. Class Analysis
Hệ thống được thiết kế theo mô hình hướng đối tượng:

**a) Nhóm Lớp Người dùng (Users)**
* **Lớp User:** id, email, password, fullName, role (ADMIN, EMPLOYEE).
* **Lớp Admin:** kế thừa User; manageEmployeeAccounts(), manageCourses(), authorizeCourseAccess(), viewStatistics().
* **Lớp Employee:** kế thừa User; departmentId, rank; viewCourseList(), studyLesson(), takeQuiz(), viewCertificate(), viewProgress().
* **Lớp Department:** id, departmentName.

**b) Nhóm Lớp Nội dung Khóa học (Course Content)**
* **Lớp Course:** id, courseName, description, courseType (MANDATORY, OPTIONAL, PUBLIC).
* **Lớp Chapter:** id, chapterName, order, courseId.
* **Lớp Lesson:** id, lessonName, contentType (VIDEO, PDF, SLIDE), filePath (local path), chapterId.
* **Lớp CoursePermission:** id, courseId, departmentId, accessLevel.

**c) Nhóm Lớp Kiểm tra & Đánh giá (Assessment)**
* **Lớp Quiz:** id, questionCount, passingScore, chapterId.
* **Lớp Question:** id, questionContent, quizId.
* **Lớp Answer:** id, answerContent, isCorrect, questionId.
* **Lớp QuizResult:** id, score, timeTaken, employeeId, quizId.

**d) Nhóm Lớp Tiến độ & Chứng chỉ (Progress & Certificate)**
* **Lớp LearningProgress:** id, completionPercentage, status (NOT_STARTED, IN_PROGRESS, COMPLETED), employeeId, courseId.
* **Lớp Certificate:** id, issueDate, certificateCode, employeeId, courseId; exportPDF().

### 3.2. Class Relationship Table

| Lớp A | Lớp B | Quan hệ | Mô tả |
|---|---|---|---|
| Admin | Employee | Association | 1 Admin quản lý nhiều Employee. |
| Employee | Department | Association | Nhiều Employee thuộc 1 Department. |
| Admin | Course | Association | 1 Admin quản lý nhiều Course. |
| Course | Chapter | Composition | 1 Course gồm nhiều Chapter (Cascade Delete). |
| Chapter | Lesson | Composition | 1 Chapter chứa nhiều Lesson (Cascade Delete). |
| Chapter | Quiz | Association | 1 Chapter có 1 Quiz cuối chương. |
| Course | Department | Association | Khóa học cấp quyền cho nhiều phòng ban (bảng trung gian CoursePermission). |
| Quiz | Question | Composition | 1 Quiz gồm nhiều Question. |
| Question | Answer | Composition | 1 Question có nhiều Answer. |
| Employee | Quiz | Association | Employee làm Quiz (bảng trung gian QuizResult). |
| Employee | LearningProgress | Association | Theo dõi tiến độ cho từng khóa học. |
| Course | LearningProgress | Association | Khóa học có nhiều tiến độ của nhiều Employee. |
| Employee | Certificate | Association | Employee sở hữu nhiều Certificate. |
| Course | Certificate | Association | Khóa học cấp Certificate cho Employee hoàn thành. |

---

## 4. BEHAVIOR MODELING
*(Phần này tham chiếu đến các sơ đồ Activity Diagram và Sequence Diagram đã được cung cấp)*

* **Activity Diagram:** Luồng học bài và làm bài kiểm tra (Study Lesson and Take Quiz Flow).
* **Sequence Diagram:** Luồng làm bài kiểm tra và lưu kết quả (Take Quiz and Save Result Flow).
