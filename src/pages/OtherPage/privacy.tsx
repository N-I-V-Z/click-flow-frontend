import React from 'react';
import Footer from '@/components/shared/footer-home';
const PrivacyPolicy: React.FC = () => {
  const lastUpdatedDate = new Date().toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <header className="from-blue-600 bg-gradient-to-r via-indigo-600 to-purple-600 py-16 text-black">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-extrabold drop-shadow-lg">
            Chính Sách Bảo Mật
          </h1>
          <p className="mt-4 text-lg">Cập nhật lần cuối: {lastUpdatedDate}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="space-y-12">
          {/* Giới thiệu */}
          <section className="transform rounded-lg bg-white p-8 shadow-md transition hover:-translate-y-1 hover:shadow-lg">
            <h2 className="mb-4 border-b pb-2 text-3xl font-bold text-gray-800">
              Giới thiệu
            </h2>
            <p className="mb-4 text-gray-600">
              Chào mừng bạn đến với Click Flow – mạng lưới affiliate marketing
              hàng đầu giúp kết nối các nhà quảng cáo và publisher. Chính sách
              Bảo mật này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ
              thông tin cá nhân của bạn.
            </p>
            <p className="text-gray-600">
              Khi sử dụng dịch vụ của chúng tôi, bạn đồng ý với việc thu thập và
              sử dụng thông tin theo chính sách này.
            </p>
          </section>

          {/* Thông tin chúng tôi thu thập */}
          <section className="transform rounded-lg bg-white p-8 shadow-md transition hover:-translate-y-1 hover:shadow-lg">
            <h2 className="mb-4 border-b pb-2 text-3xl font-bold text-gray-800">
              Thông tin chúng tôi thu thập
            </h2>
            <p className="mb-2 text-gray-600">
              Để cung cấp dịch vụ tốt nhất, Click Flow thu thập các loại thông
              tin sau:
            </p>
            <ul className="list-inside list-disc space-y-2 text-gray-600">
              <li>
                <strong>Thông tin cá nhân:</strong> Họ tên, email, số điện thoại
                và địa chỉ.
              </li>
              <li>
                <strong>Thông tin tài khoản affiliate:</strong> Lịch sử giao
                dịch, mã giới thiệu, số liệu chiến dịch quảng cáo và hiệu suất.
              </li>
              <li>
                <strong>Dữ liệu kỹ thuật:</strong> Địa chỉ IP, loại thiết bị,
                trình duyệt, cookie và dữ liệu theo dõi.
              </li>
              <li>
                <strong>Dữ liệu tương tác:</strong> Hành vi duyệt web, thời gian
                truy cập, các liên kết nhấp vào và dữ liệu phân tích khác.
              </li>
            </ul>
          </section>

          {/* Cách chúng tôi sử dụng thông tin */}
          <section className="transform rounded-lg bg-white p-8 shadow-md transition hover:-translate-y-1 hover:shadow-lg">
            <h2 className="mb-4 border-b pb-2 text-3xl font-bold text-gray-800">
              Cách chúng tôi sử dụng thông tin
            </h2>
            <p className="mb-2 text-gray-600">
              Thông tin thu thập được sẽ được sử dụng nhằm:
            </p>
            <ul className="list-inside list-disc space-y-2 text-gray-600">
              <li>
                Cung cấp và cải thiện dịch vụ affiliate marketing, giúp các
                chiến dịch quảng cáo hiệu quả hơn.
              </li>
              <li>
                Phân tích dữ liệu người dùng để cá nhân hóa trải nghiệm và tối
                ưu hóa hiệu suất chiến dịch.
              </li>
              <li>
                Gửi các thông báo, thông tin khuyến mãi, cập nhật dịch vụ (chỉ
                khi bạn đã đăng ký nhận thông tin).
              </li>
              <li>
                Bảo đảm an toàn thông tin và thực hiện các biện pháp phòng chống
                gian lận.
              </li>
            </ul>
          </section>

          {/* Cookie và công nghệ theo dõi */}
          <section className="transform rounded-lg bg-white p-8 shadow-md transition hover:-translate-y-1 hover:shadow-lg">
            <h2 className="mb-4 border-b pb-2 text-3xl font-bold text-gray-800">
              Cookie và Công nghệ Theo dõi
            </h2>
            <p className="mb-4 text-gray-600">
              Click Flow sử dụng cookies và các công nghệ theo dõi khác để:
            </p>
            <ul className="list-inside list-disc space-y-2 text-gray-600">
              <li>
                Ghi nhận các lượt nhấp và chuyển đổi từ các chiến dịch
                affiliate.
              </li>
              <li>
                Phân tích hành vi duyệt web để cải thiện trải nghiệm người dùng.
              </li>
              <li>
                Tùy chỉnh nội dung và quảng cáo dựa trên sở thích của người
                dùng.
              </li>
            </ul>
            <p className="mt-4 text-gray-600">
              Bạn có thể điều chỉnh cài đặt cookie của mình thông qua trình
              duyệt, tuy nhiên điều này có thể ảnh hưởng đến hiệu suất và trải
              nghiệm sử dụng dịch vụ.
            </p>
          </section>

          {/* Chia sẻ thông tin */}
          <section className="transform rounded-lg bg-white p-8 shadow-md transition hover:-translate-y-1 hover:shadow-lg">
            <h2 className="mb-4 border-b pb-2 text-3xl font-bold text-gray-800">
              Chia sẻ thông tin
            </h2>
            <p className="mb-4 text-gray-600">
              Chúng tôi cam kết không bán hoặc cho thuê thông tin cá nhân của
              bạn cho bên thứ ba. Tuy nhiên, trong một số trường hợp, thông tin
              có thể được chia sẻ:
            </p>
            <ul className="list-inside list-disc space-y-2 text-gray-600">
              <li>
                Với các đối tác chiến lược và nhà cung cấp dịch vụ nhằm hỗ trợ
                việc vận hành và tối ưu hóa các chiến dịch affiliate.
              </li>
              <li>
                Khi có yêu cầu từ cơ quan chức năng hoặc theo quy định của pháp
                luật.
              </li>
              <li>
                Để phân tích và nghiên cứu nhằm cải thiện chất lượng dịch vụ.
              </li>
            </ul>
          </section>

          {/* Bảo mật thông tin */}
          <section className="transform rounded-lg bg-white p-8 shadow-md transition hover:-translate-y-1 hover:shadow-lg">
            <h2 className="mb-4 border-b pb-2 text-3xl font-bold text-gray-800">
              Bảo mật thông tin
            </h2>
            <p className="mb-4 text-gray-600">
              Chúng tôi áp dụng các biện pháp bảo mật kỹ thuật và tổ chức nhằm
              bảo vệ dữ liệu của bạn khỏi truy cập, sử dụng hay tiết lộ trái
              phép. Điều này bao gồm việc mã hóa dữ liệu, sử dụng tường lửa và
              các quy trình kiểm soát truy cập.
            </p>
            <p className="text-gray-600">
              Mặc dù chúng tôi nỗ lực bảo mật thông tin, không có phương thức
              truyền tải qua Internet hay phương pháp lưu trữ nào là hoàn toàn
              an toàn.
            </p>
          </section>

          {/* Thay đổi chính sách và quyền của người dùng */}
          <section className="transform rounded-lg bg-white p-8 shadow-md transition hover:-translate-y-1 hover:shadow-lg">
            <h2 className="mb-4 border-b pb-2 text-3xl font-bold text-gray-800">
              Thay đổi chính sách và Quyền của người dùng
            </h2>
            <p className="mb-4 text-gray-600">
              Chính sách này có thể được cập nhật định kỳ. Chúng tôi khuyến nghị
              bạn thường xuyên kiểm tra để nắm bắt các thay đổi mới nhất.
            </p>
            <p className="text-gray-600">
              Bạn có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa dữ liệu cá nhân
              của mình. Để thực hiện các quyền này, vui lòng liên hệ với chúng
              tôi qua thông tin liên hệ bên dưới.
            </p>
          </section>

          {/* Liên hệ */}
          <section className="transform rounded-lg bg-white p-8 shadow-md transition hover:-translate-y-1 hover:shadow-lg">
            <h2 className="mb-4 border-b pb-2 text-3xl font-bold text-gray-800">
              Liên hệ
            </h2>
            <p className="text-gray-600">
              Nếu bạn có bất kỳ câu hỏi nào liên quan đến chính sách bảo mật
              hoặc muốn biết thêm thông tin về cách thức xử lý dữ liệu của bạn,
              hãy liên hệ với chúng tôi qua:
            </p>
            <ul className="mt-4 list-inside list-disc space-y-2 text-gray-600">
              <li>Email: support@clickflow.vn</li>
              <li>Điện thoại: 0123456789</li>
            </ul>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
