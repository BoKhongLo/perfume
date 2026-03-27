# TÀI LIỆU PHÂN TÍCH NGHIỆP VỤ (BA)
# Dự án: Perfume E-commerce

# 1. TỔNG QUAN DỰ ÁN
  1.1. Thông tin dự án
    Tên dự án: Perfume E-commerce Platform Backend
    Nền tảng: NestJS (Core), GraphQL (API), TypeORM (Database ORM), FastAPI (Microservice).
    Hệ quản trị CSDL: MySQL.

  1.2. Mục tiêu dự án
    Cung cấp hệ thống API GraphQL mạnh mẽ, linh hoạt để phục vụ cho các nền tảng Frontend (Web, Mobile).
    Quản lý chuyên sâu các thuộc tính đặc thù của nước hoa (Nồng độ, Tầng hương, Độ lưu hương, Độ tỏa hương).
    Xây dựng hệ thống phân quyền chặt chẽ với các Role cụ thể: ADMIN, SALES, WEREHOUSEMANAGER, HUMMANRESOURCE.
    Tích hợp FastAPI để xử lý các tác vụ nặng như phân tích file và trích xuất báo cáo (Export Excel/PDF).

  1.3. Phạm vi dự án
  Trong phạm vi:

      I. Giao diện người dùng (Trang cửa hàng):
        - Thiết kế giao diện người dùng/trải nghiệm người dùng (UI/UX) đáp ứng cho cả máy tính để bàn và thiết bị di động.
        - Trang chủ giới thiệu các sản phẩm nổi bật và bộ sưu tập nước hoa.
        - Trang danh mục sản phẩm với các bộ lọc (theo thương hiệu, giá cả, mùi hương).
        - Trang chi tiết sản phẩm (hình ảnh, mô tả).

      II. Hệ thống quản trị (Module quản trị):
        - Quản lý danh mục sản phẩm và thông tin (chỉnh sửa, xóa).
        - Quản lý đơn hàng và thay đổi trạng thái.
        - Cơ sở dữ liệu thống kê bán hàng.

      III. Kỹ thuật & Tối ưu hóa:
        - Tối ưu hóa SEO trên trang để cải thiện khả năng hiển thị trên Google.
        - Triển khai các biện pháp bảo mật chống lại các cuộc tấn công DDoS và bảo vệ dữ liệu khách hàng.
        - Cấu hình cơ sở hạ tầng để giảm thiểu tải tải xuống, đảm bảo tối thiểu 1000 lượt truy cập đồng thời.

  Ngoài phạm vi:

      I. Nội dung & Phương tiện: Không bao gồm chụp ảnh sản phẩm chuyên nghiệp hoặc viết mô tả chi tiết cho toàn bộ kho hàng (Cửa hàng cung cấp dữ liệu).
      II. Tiếp thị: Không bao gồm chạy quảng cáo (Quảng cáo Facebook, Quảng cáo Google) hoặc quản lý Fanpage.
      III. Tích hợp các phương thức thanh toán 
      IV. Vận hành: Không bao gồm hỗ trợ khách hàng qua trò chuyện trực tuyến hoặc xử lý đơn hàng thực tế sau khi bàn giao hệ thống.

---

# 2. YÊU CẦU NGHIỆP VỤ CHỨC NĂNG
## 2.1. Module Xác thực (Auth)
- Mô tả: Quản lý việc định danh và cấp quyền truy cập vào hệ thống sử dụng JWT và Argon2.
- Đăng nhập (LoginService): Trả về access_token (hiệu lực 2 giờ) và refresh_token (hiệu lực 15 ngày).
- Đăng ký (SignupService): Tạo tài khoản với thông tin cơ bản. Mật khẩu được mã hóa bằng Argon2. Sinh tự động - secretKey (UUIDv5) và refreshToken (UUIDv4).
- Làm mới Token (RefreshService): Cấp lại access_token mới khi token cũ hết hạn để duy trì phiên làm việc.

## 2.2. Module Người dùng (User)
- Mô tả: Quản lý thông tin cá nhân và tài khoản. Thực hiện phân quyền chặt chẽ giữa các bộ phận.
- CRUD User: Chỉ ADMIN và HUMMANRESOURCE được phép xem danh sách, thêm (hỗ trợ thêm hàng loạt), sửa và xóa mềm (soft delete) người dùng.
- Tìm kiếm nâng cao: Bộ lọc đa năng theo email, username, họ tên, vai trò (role), ngày sinh, địa chỉ và giới tính.
- Phân trang & Sắp xếp: Hỗ trợ quản lý danh sách lớn thông qua phân trang và sắp xếp theo ngày tạo.
- Báo cáo: Xuất dữ liệu người dùng ra file thông qua việc tích hợp gọi endpoint sang FastAPI.

## 2.3. Module Sản phẩm & Kho hàng (Product & Warehouse)
- Mô tả: Quản lý danh mục sản phẩm nước hoa và kiểm soát biến động tồn kho.
- Phân quyền: Yêu cầu quyền ADMIN hoặc WEREHOUSEMANAGER để thao tác thay đổi dữ liệu sản phẩm.
- Quản lý Tags (Thuộc tính động): Tự động tìm hoặc tạo mới các tags chuyên sâu như Thương hiệu (Brand), Kích cỡ (Size), Tầng hương (FragranceNotes), Nồng độ (Concentration), Giới tính (Sex), Độ tỏa hương (Sillage), Độ lưu hương (Longevity).
- Tìm kiếm đa chiều (Filter): Khách hàng có thể tìm theo khoảng giá, các tags thuộc tính và sắp xếp theo giá hoặc độ mới.
- Sản phẩm Bán chạy (Hot Sales): Trích xuất danh sách dựa trên dữ liệu đơn hàng theo tuần, tháng, năm hoặc toàn thời gian.
- Quản lý Kho: Cập nhật số lượng tồn kho hàng loạt và xem dữ liệu tạm tính kho (Temp Warehouse).
- Báo cáo: Xuất báo cáo danh sách sản phẩm thông qua FastAPI.

## 2.4. Module Đơn hàng (Order)
- Mô tả: Xử lý luồng đặt hàng, quản lý giao dịch và vận chuyển.
- Phân quyền: ADMIN và SALES chịu trách nhiệm quản lý toàn bộ vòng đời đơn hàng.
- Tạo đơn hàng: - Lưu trữ thông tin khách hàng và thông tin giao hàng riêng biệt.
- Tự động trừ tồn kho và tăng lượt mua (buyCount) của sản phẩm khi chốt đơn.
- Tính toán tổng tiền dựa trên đơn giá thực tế và chiết khấu (discount).
- Quản lý trạng thái: Cập nhật tình trạng xử lý đơn và trạng thái thanh toán (isPaid).
- Báo cáo: Xuất báo cáo đơn hàng định kỳ thông qua FastAPI.

## 2.5. Module Thống kê (Analytics)
- Mô tả: Cung cấp các chỉ số đo lường hiệu quả kinh doanh trực quan cho Quản trị viên.
- Báo cáo Doanh thu: Tổng hợp doanh thu, lợi nhuận và số lượng sản phẩm đã bán theo các mốc thời gian: Tuần, Tháng, Toàn thời gian.
- Báo cáo Sở thích: Thống kê tỷ lệ giới tính khách mua, thương hiệu phổ biến và danh sách 10 sản phẩm được ưa chuộng nhất.
- Phân tích danh mục: Thống kê cơ cấu hàng hóa trong kho theo giới tính và thương hiệu.

## 2.6. Module Media & Tích hợp (Media Service)
- Mô tả: Xử lý lưu trữ tệp tin và giao tiếp giữa các dịch vụ trong hệ thống.
- Lưu trữ ảnh (Local): Tự động phân loại ảnh vào thư mục theo năm và tháng (uploads/YYYY/MM/).
- Phân tích tệp: Chuyển tiếp (forward) tệp tin từ Frontend sang FastAPI qua luồng dữ liệu (Stream) để xử lý logic nặng hoặc AI.

## 2.7. Module Blog
- Mô tả: Quản lý hệ thống bài viết và tin tức trên nền tảng.
- Quản trị Blog: Chỉ ADMIN có quyền tạo, cập nhật hoặc xóa bài viết (soft delete).
- Cơ chế hiển thị: Khách hàng chỉ xem được các bài viết có trạng thái isDisplay = true.
- Tìm kiếm: Lọc bài viết nhanh theo tiêu đề hoặc loại Blog.

---

## 3. KIẾN TRÚC KỸ THUẬT & API GRAPHQL
### 3.1. Kiến trúc hệ thống
- Hệ thống áp dụng kiến trúc Monolithic Module-based (NestJS) kết hợp với Microservice phụ trợ (FastAPI):
- API Layer: Sử dụng GraphQL (@nestjs/graphql) thay vì RESTful, giúp Frontend chủ động truy vấn dữ liệu theo nhu cầu, tránh over-fetching.
- Service Layer: Chứa toàn bộ Business Logic, giao tiếp với Database thông qua TypeORM Repository.
- Data Layer: MySQL Database.
- Cross-Service Communication: NestJS gọi nội bộ sang FastAPI qua @nestjs/axios để tận dụng thư viện Python cho việc Export File và Analyze File.

### 3.2. Bảo mật & Phân quyền
- Authentication: JWT token base (Access Token: 2h, Refresh Token: 15d).
- Password Hashing: Sử dụng thuật toán Argon2 (Bảo mật cao hơn Bcrypt).
- Authorization: Custom role check function bên trong Service (CheckRoleUser). Phân lập quyền hạn cứng theo mảng String roles.

### 3.3. GraphQL Schema 
- Queries (Read): SearchProductWithOptions, AnalyticRevenue, GetOrderById, SearchUserWithOption...
- Mutations (Write): CreateOrder, UpdateProduct, DeleteBlog, CreateUserByList...
- Input Types: Các Dto được define khắt khe bằng Input Type của GraphQL (CreateProductDto, SearchOrderDto).

========================================================================================================================================================