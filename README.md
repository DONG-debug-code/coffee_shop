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
 - cd qlquancf
 - npm install
 - npm run dev

## vấn đề cần giải quyết
khi order ở bàn A1 -> xác nhận order và quay về màn hình danh sách bàn -> OK. nhưng khi vào bàn A2 lại xuất hiện thông tin các món đã order ở bàn A1 trong giỏ hàng và order món mới ở bàn A2 thì thông tin vẫn lưu vào 1 giỏ hàng (cả 2 đều giống thông tin món order) và bàn A2 chưa thay đổi trạng thái thành đang phục vụ. -> vấn đề là tất cả các bàn đều sử dụng chung 1 giỏ hàng.