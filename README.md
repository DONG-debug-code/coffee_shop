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

## logic cần sửa
1. xác nhận order sẽ lưu thông tin vào orders và khi thanh toán thành công sẽ xóa dữ liệu order đó(giảm dữ liệu cho database) -> lưu vào doanh thu trước khi xóa

## chức năng cần làm
2. thêm trạng thái booking
3. trang quản lý order trong ngày cho POS(xem danh sách/chi tiết order trong ngày, xuất lại hóa đơn)
4. trang quản lý order cho admin (xem, tra cứu, xuất file excel)
5. dashboard có biểu đồ doanh thu theo ngày
6. quản lý nhân viên(ca làm, lương)

chức năng 3:
1. cả 2 sẽ nằm trong 1 nút menu và phân trang riêng dùng route(chỉ quản lý order là trang riêng)
2. tất cả các đơn đã order trong ngày(mã đơn, ngày/giờ, món, tổng tiền, bàn, nhân viên order)
3. dùng Receipt 
chức năng 4:
1. ngày, bàn
2. theo bọ lọc
3. chưa có gì


