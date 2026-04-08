### Coffee Shop Management System
# Hệ thống quản lý quán cafe gồm Admin Dashboard + POS bán hàng xây dựng bằng ReactJS.

## Giới thiệu

# Đây là web app mô phỏng phần mềm quản lý quán cafe thực tế:
 - Quản lý nhân viên
 - Quản lý menu
 - Quản lý đơn hàng
 - POS bán hàng tại quầy

## Tính năng chính
# Admin Dashboard
* Quản trị toàn bộ hệ thống:
 - Dashboard thống kê
 - Quản lý nhân viên
 - Quản lý user
 - Quản lý menu
 - Quản lý đơn hàng
 - Quản lý bàn
 - Báo cáo doanh thu
* Sidebar navigation + Admin layout riêng.

# POS (Point of Sale)
* Dành cho nhân viên bán hàng:
 - Giao diện POS riêng
 - Phân quyền Staff
 - Luồng bán hàng tại quầy
# Authentication & Authorization
 - Login hệ thống
 - Context API quản lý auth
 - ProtectedRoute:
   + AdminRoute
   + StaffRoute

# Công nghệ sử dụng
 - React (Vite)
 - React Router DOM
 - Context API
 - TailwindCSS
 - React Icons
# Điểm mạnh kỹ thuật
 - Role-based routing
 - Tách layout theo role (Admin / Staff)
 - Dashboard structure chuẩn SaaS
 - Sidebar navigation chuyên nghiệp
 - Kiến trúc dễ mở rộng backend
# Cài đặt
 - git clone https://github.com/DONG-debug-code/coffee_shop.git
 - cd coffee_shop
 - npm install
 - npm run dev

 ## vấn đề luồng hoạt động cần làm(Quy trình order)
1️⃣ Khách vào quán
TablePage → click bàn → tạo order (status = open) → mở POS
2️⃣ Order món
Thêm món → update order
3️⃣ Khách gọi thêm
Mở lại bàn → thêm món → update order
4️⃣ In tạm tính (optional)
Click "In tạm tính"
5️⃣ Thanh toán
status = paid
tableStatus = dirty
6️⃣ Nhân viên dọn bàn
Click "Dọn bàn"
tableStatus = empty