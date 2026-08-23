const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

async function testUpload() {
  try {
    // 1. Đăng nhập quyền Admin
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@fpt.com',
      password: 'Admin@123'
    });
    const token = loginRes.data.token;
    console.log('✅ 1. Đăng nhập Admin thành công');

    // 2. Tạo một file mẫu
    const dummyFilePath = './dummy_test.pdf';
    fs.writeFileSync(dummyFilePath, 'Đây là nội dung file PDF mẫu dùng để test upload local.');
    console.log('✅ 2. Đã tạo file mẫu: dummy_test.pdf');

    // 3. Upload file lên API tạo bài học (Gắn vào Course 1, Chapter 1 có sẵn từ seed)
    const formData = new FormData();
    formData.append('lesson_name', 'Bài học Test Upload Local');
    formData.append('content_type', 'PDF');
    formData.append('file', fs.createReadStream(dummyFilePath));

    const uploadRes = await axios.post('http://localhost:5000/api/courses/1/chapters/1/lessons', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        ...formData.getHeaders()
      }
    });

    console.log('✅ 3. Upload file thành công, thông tin file lưu trữ:');
    console.log(uploadRes.data.lesson.file_path);

    // Dọn dẹp file mẫu tạm
    fs.unlinkSync(dummyFilePath);
    
    // 4. Kiểm tra trực tiếp trong thư mục uploads của server
    const uploadsDir = './server/uploads/pdfs';
    const files = fs.readdirSync(uploadsDir);
    console.log('\n📁 4. Danh sách các file đang lưu ở local server (server/uploads/pdfs):');
    files.forEach(file => console.log(' - ' + file));

  } catch (error) {
    console.error('❌ Lỗi:', error.response ? error.response.data : error.message);
  }
}

testUpload();
