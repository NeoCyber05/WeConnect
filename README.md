# Hướng dẫn cài đặt và chạy dự án (Quick Start Guide)


## 1. Chạy Docker
Mở terminal tại thư mục gốc của dự án (`itss-nhat-1`) và chạy docker:
```bash
docker compose up --build -d
```

Sau khi các container khởi động thành công, truy cập các dịch vụ qua các cổng sau:
- **Frontend**: [http://localhost:8081](http://localhost:8081)
- **Backend (API Docs)**: [http://localhost:8001/docs](http://localhost:8001/docs)
- **Database (MySQL)**: `localhost:3308`

## 2. Tài khoản mẫu

Tất cả tài khoản dùng mật khẩu chung: **`Password@123`**

| Email | Vai trò | Trạng thái | Ghi chú |
|---|---|---|---|
| `nguyen.tuan@gmail.com` | USER | Đã xác thực | Học N3 |
| `tran.linh@gmail.com` | USER | Đã xác thực | Học N4 |
| `pham.anh@gmail.com` | USER | Đã xác thực | Level N2 |
| `le.mai@gmail.com` | USER | **Chưa xác thực** | Dùng để test OTP |
| `hoang.duc@gmail.com` | USER | Đã xác thực | Level N1 |
| `organizer.han@weconnect.vn` | ORGANIZER | Đã xác thực | Tổ chức sự kiện HN |
| `organizer.minh@weconnect.vn` | ORGANIZER | Đã xác thực | Tổ chức sự kiện HCM |

---

## 3. Danh sách chức năng (Feature Checklist)

Dưới đây là danh sách các tính năng được phát triển dựa trên [tài liệu đặc tả](dac_ta.md), sắp xếp theo đúng ID:

- [x] ID 1: **Thiết kế cơ sở dữ liệu**
- [x] ID 2: **Thiết lập môi trường phát triển**
- [x] ID 3: **Đăng ký tài khoản** ![Ảnh 1](<checklist/Đăng ký tài khoản 1.png>)![Ảnh 2](<checklist/Đăng ký tài khoản 2.png>)
- [x] ID 4: **Đăng nhập**![Ảnh 1](<checklist/Đăng nhập.png>)![Ảnh 2](<checklist/Đăng nhập 2.png>)
- [x] ID 5: **Quên mật khẩu**![Ảnh 1](<checklist/Quên mật khẩu 1.png>)![Ảnh 2](<checklist/Quên mật khẩu 2.png>)
- [x] ID 6: **Quản lý hồ sơ**![Ảnh 1](<checklist/Quản lí hồ sơ 2.png>)![Ảnh 2](<checklist/Quản lí hồ sơ 3.png>)
- [-] ID 7: **Quản lý & Thống kê sự kiện**
- [x] ID 9: **Tìm kiếm người dùng**![Ảnh](<checklist/Tìm kiếm người dùng.png>)
- [x] ID 10: **Gửi lời mời kết bạn**![Ảnh 1](<checklist/Gửi lời mời kết bạn 1.png>)![Ảnh 2](<checklist/Gửi lời mời kết bạn 2.png>)
- [x] ID 11: **Quản lý lời mời kết bạn** ![Ảnh](<checklist/Hủy kết bạn 1.png>)
- [x] ID 12: **Quản lý bạn bè & huỷ kết bạn**![Ảnh 1](<checklist/Hủy kết bạn 1.png>)![Ảnh 2](<checklist/Hủy kết bạn 2.png>)
- [x] ID 15: **Gợi ý kết bạn**![Ảnh](<checklist/Gửi lời mời kết bạn 2.png>)
- [x] ID 16: **Lọc kết quả tìm kiếm**![Ảnh 1](<checklist/Lọc kết quả tìm kiếm 1.png>)![Ảnh 2](<checklist/Lọc kết quả tìm kiếm 2.png>)![Ảnh 3](<checklist/Lọc kết quả tìm kiếm 3.png>)![Ảnh 4](<checklist/Lọc kết quả tìm kiếm 4.png>)
- [ ] ID 17: **Sự kiện & Trò chơi**
- [-] ID 18: **Thiết lập hạ tầng WebSocket**
- [-] ID 13: **Nhắn tin / Gọi điện / Dịch tin nhắn**
- [x] ID 8: **Tích hợp API bên thứ 3 (OTP & Dịch thuật)**
- [x] ID 14: **Chuyển đổi ngôn ngữ**