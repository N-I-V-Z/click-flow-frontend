import React from 'react';
import PageHead from '@/components/shared/page-head';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Footer from '@/components/shared/footer-home';
const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHead title="Điều khoản sử dụng - ClickFlow" />

      {/* Main Content */}
      <div className="py-8 pb-16">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">
              Điều khoản sử dụng
            </h1>
            <p className="text-lg text-gray-600">
              Có hiệu lực từ ngày 15 tháng 06 năm 2025
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600">
                1. Điều khoản chung
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed text-gray-700">
                Chào mừng bạn đến với <strong>ClickFlow</strong> - nền tảng
                affiliate marketing hàng đầu Việt Nam. Bằng việc truy cập và sử
                dụng website <strong>clickflow.space</strong> và các dịch vụ
                liên quan, bạn đồng ý tuân thủ và bị ràng buộc bởi các điều
                khoản và điều kiện sử dụng sau đây.
              </p>
              <p className="leading-relaxed text-gray-700">
                ClickFlow được vận hành bởi Công ty TNHH Công nghệ ClickFlow,
                được thành lập và hoạt động theo pháp luật Việt Nam. Chúng tôi
                cam kết tuân thủ đầy đủ các quy định của pháp luật Việt Nam về
                thương mại điện tử, bảo vệ người tiêu dùng và bảo mật thông tin
                cá nhân.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600">
                2. Định nghĩa các thuật ngữ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <strong className="text-gray-900">- ClickFlow:</strong>
                  <span className="ml-2 text-gray-700">
                    Nền tảng affiliate marketing trực tuyến, bao gồm website,
                    ứng dụng di động và các dịch vụ liên quan.
                  </span>
                </div>
                <div>
                  <strong className="text-gray-900">
                    - Advertiser (Nhà quảng cáo):
                  </strong>
                  <span className="ml-2 text-gray-700">
                    Cá nhân hoặc tổ chức đăng ký tài khoản để quảng bá sản phẩm,
                    dịch vụ thông qua nền tảng.
                  </span>
                </div>
                <div>
                  <strong className="text-gray-900">
                    - Publisher (Nhà xuất bản):
                  </strong>
                  <span className="ml-2 text-gray-700">
                    Cá nhân hoặc tổ chức đăng ký tài khoản để quảng bá các
                    campaign của Advertiser và nhận hoa hồng.
                  </span>
                </div>
                <div>
                  <strong className="text-gray-900">- Campaign:</strong>
                  <span className="ml-2 text-gray-700">
                    Chương trình quảng cáo được tạo bởi Advertiser để quảng bá
                    sản phẩm, dịch vụ.
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600">
                3. Đăng ký tài khoản và xác thực
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed text-gray-700">
                Để sử dụng các dịch vụ của ClickFlow, bạn cần đăng ký tài khoản
                và cung cấp thông tin chính xác, đầy đủ. Bạn cam kết:
              </p>
              <ul className="ml-4 list-inside list-disc space-y-2 text-gray-700">
                <li>
                  Cung cấp thông tin cá nhân chính xác, trung thực và cập nhật
                </li>
                <li>
                  Bảo mật thông tin đăng nhập và chịu trách nhiệm về mọi hoạt
                  động trên tài khoản
                </li>
                <li>
                  Thông báo ngay cho ClickFlow khi phát hiện tài khoản bị truy
                  cập trái phép
                </li>
                <li>
                  Tuân thủ các quy định về độ tuổi tối thiểu (18 tuổi trở lên)
                  theo pháp luật Việt Nam
                </li>
                <li>
                  Cung cấp các giấy tờ xác thực danh tính khi được yêu cầu
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600">
                4. Quyền và nghĩa vụ của người dùng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">
                4.1. Quyền của người dùng:
              </h4>
              <ul className="ml-4 list-inside list-disc space-y-2 text-gray-700">
                <li>
                  Sử dụng các dịch vụ của ClickFlow theo đúng mục đích được cung
                  cấp
                </li>
                <li>
                  Được bảo vệ thông tin cá nhân theo Luật Bảo vệ dữ liệu cá nhân
                  2023
                </li>
                <li>
                  Được hỗ trợ kỹ thuật và giải đáp thắc mắc trong giờ hành chính
                </li>
                <li>
                  Rút tiền hoa hồng theo quy trình và điều kiện đã thỏa thuận
                </li>
              </ul>

              <h4 className="mt-6 text-lg font-semibold text-gray-900">
                4.2. Nghĩa vụ của người dùng:
              </h4>
              <ul className="ml-4 list-inside list-disc space-y-2 text-gray-700">
                <li>
                  Tuân thủ đầy đủ các điều khoản sử dụng và chính sách của
                  ClickFlow
                </li>
                <li>
                  Không sử dụng nền tảng cho các mục đích bất hợp pháp hoặc vi
                  phạm đạo đức
                </li>
                <li>Không spam, gửi thông tin rác hoặc nội dung có hại</li>
                <li>
                  Bảo mật thông tin tài khoản và không chia sẻ cho bên thứ ba
                </li>
                <li>
                  Thanh toán đầy đủ các khoản phí dịch vụ (nếu có) đúng hạn
                </li>
                <li>
                  Kê khai thuế thu nhập cá nhân theo quy định của pháp luật Việt
                  Nam
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600">
                5. Quy định về nội dung và quảng cáo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed text-gray-700">
                Mọi nội dung quảng cáo trên ClickFlow phải tuân thủ pháp luật
                Việt Nam và không được chứa:
              </p>
              <ul className="ml-4 list-inside list-disc space-y-2 text-gray-700">
                <li>
                  Thông tin sai lệch, gian dối hoặc lừa đảo người tiêu dùng
                </li>
                <li>Nội dung khiêu dâm, bạo lực hoặc phản cảm</li>
                <li>
                  Sản phẩm, dịch vụ bị cấm hoặc hạn chế lưu thông theo pháp luật
                </li>
                <li>Vi phạm quyền sở hữu trí tuệ của bên thứ ba</li>
                <li>Thông tin chống phá nhà nước hoặc gây chia rẽ xã hội</li>
                <li>Quảng cáo thuốc lá, rượu bia không có giấy phép</li>
                <li>
                  Dịch vụ tài chính không được cấp phép hoạt động tại Việt Nam
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600">
                6. Hoa hồng và thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">
                6.1. Cơ chế tính hoa hồng:
              </h4>
              <p className="leading-relaxed text-gray-700">
                Hoa hồng được tính dựa trên các mô hình: CPC (Cost Per Click),
                CPA (Cost Per Action), CPS (Cost Per Sale) theo thỏa thuận cụ
                thể trong từng campaign.
              </p>

              <h4 className="mt-4 text-lg font-semibold text-gray-900">
                6.2. Chu kỳ thanh toán:
              </h4>
              <ul className="ml-4 list-inside list-disc space-y-2 text-gray-700">
                <li>Thanh toán hàng tháng vào ngày 15 của tháng sau</li>
                <li>Số tiền tối thiểu để rút: 100,000 VND</li>
                <li>Thời gian xử lý: 3-5 ngày làm việc</li>
                <li>Phí giao dịch được quy định rõ ràng và minh bạch</li>
              </ul>

              <h4 className="mt-4 text-lg font-semibold text-gray-900">
                6.3. Thuế và pháp lý:
              </h4>
              <p className="leading-relaxed text-gray-700">
                Publisher có trách nhiệm kê khai và nộp thuế thu nhập cá nhân
                theo Luật Thuế thu nhập cá nhân 2007 và các văn bản hướng dẫn
                của Bộ Tài chính. ClickFlow sẽ cung cấp chứng từ hỗ trợ kê khai
                thuế.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600">
                7. Bảo mật thông tin và quyền riêng tư
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed text-gray-700">
                ClickFlow cam kết bảo vệ thông tin cá nhân của người dùng theo
                Luật Bảo vệ dữ liệu cá nhân 2023 và Nghị định số 13/2023/NĐ-CP.
                Chúng tôi thực hiện:
              </p>
              <ul className="ml-4 list-inside list-disc space-y-2 text-gray-700">
                <li>Mã hóa dữ liệu nhạy cảm bằng các tiêu chuẩn quốc tế</li>
                <li>Kiểm soát truy cập nghiêm ngặt với hệ thống phân quyền</li>
                <li>Sao lưu dữ liệu định kỳ và có kế hoạch khôi phục</li>
                <li>
                  Không chia sẻ thông tin cá nhân cho bên thứ ba khi chưa có sự
                  đồng ý
                </li>
                <li>Thông báo kịp thời khi xảy ra sự cố bảo mật</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600">
                8. Chấm dứt dịch vụ và xử lý vi phạm
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">
                8.1. Các hành vi vi phạm:
              </h4>
              <ul className="ml-4 list-inside list-disc space-y-2 text-gray-700">
                <li>
                  Sử dụng bot, script hoặc công cụ tự động để tạo traffic giả
                </li>
                <li>Click fraud hoặc các hành vi gian lận khác</li>
                <li>Vi phạm quyền sở hữu trí tuệ</li>
                <li>Cung cấp thông tin sai lệch trong quá trình đăng ký</li>
                <li>Không tuân thủ các quy định về nội dung quảng cáo</li>
              </ul>

              <h4 className="mt-4 text-lg font-semibold text-gray-900">
                8.2. Biện pháp xử lý:
              </h4>
              <ul className="ml-4 list-inside list-disc space-y-2 text-gray-700">
                <li>Cảnh báo và yêu cầu khắc phục</li>
                <li>Tạm khóa tài khoản có thời hạn</li>
                <li>Khóa vĩnh viễn tài khoản vi phạm nghiêm trọng</li>
                <li>
                  Tạm giữ hoặc không thanh toán hoa hồng phát sinh từ hành vi vi
                  phạm
                </li>
                <li>Yêu cầu bồi thường thiệt hại (nếu có)</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600">
                9. Giới hạn trách nhiệm
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed text-gray-700">
                ClickFlow không chịu trách nhiệm đối với:
              </p>
              <ul className="ml-4 list-inside list-disc space-y-2 text-gray-700">
                <li>Thiệt hại gián tiếp phát sinh từ việc sử dụng dịch vụ</li>
                <li>Mất mát dữ liệu do lỗi từ phía người dùng</li>
                <li>
                  Gián đoạn dịch vụ do bảo trì hệ thống hoặc sự cố kỹ thuật bất
                  khả kháng
                </li>
                <li>Nội dung của bên thứ ba được chia sẻ trên nền tảng</li>
                <li>Tranh chấp giữa Advertiser và Publisher</li>
              </ul>
              <p className="mt-4 leading-relaxed text-gray-700">
                Trách nhiệm bồi thường tối đa của ClickFlow không vượt quá tổng
                số tiền mà người dùng đã thanh toán cho dịch vụ trong 6 tháng
                gần nhất.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600">
                10. Giải quyết tranh chấp
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed text-gray-700">
                Mọi tranh chấp phát sinh sẽ được giải quyết theo thứ tự ưu tiên:
              </p>
              <ol className="ml-4 list-inside list-decimal space-y-2 text-gray-700">
                <li>Thương lượng, hòa giải trực tiếp giữa các bên</li>
                <li>Trung tâm Trọng tài Quốc tế Việt Nam (VIAC)</li>
                <li>Tòa án có thẩm quyền tại Thành phố Hồ Chí Minh</li>
              </ol>
              <p className="mt-4 leading-relaxed text-gray-700">
                Luật áp dụng: Pháp luật nước Cộng hòa Xã hội Chủ nghĩa Việt Nam.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600">
                11. Điều khoản khác
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">
                11.1. Sửa đổi điều khoản:
              </h4>
              <p className="leading-relaxed text-gray-700">
                ClickFlow có quyền sửa đổi các điều khoản này và sẽ thông báo
                trước ít nhất 15 ngày qua email hoặc thông báo trên website.
                Việc tiếp tục sử dụng dịch vụ sau khi có thông báo được coi là
                chấp nhận các điều khoản mới.
              </p>

              <h4 className="mt-4 text-lg font-semibold text-gray-900">
                11.2. Tính hiệu lực:
              </h4>
              <p className="leading-relaxed text-gray-700">
                Các điều khoản này có hiệu lực kể từ ngày người dùng đăng ký tài
                khoản hoặc sử dụng dịch vụ lần đầu tiên, tùy theo thời điểm nào
                sớm hơn.
              </p>

              <h4 className="mt-4 text-lg font-semibold text-gray-900">
                11.3. Ngôn ngữ:
              </h4>
              <p className="leading-relaxed text-gray-700">
                Bản điều khoản tiếng Việt là bản chính thức. Các bản dịch khác
                chỉ mang tính chất tham khảo.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600">
                12. Thông tin liên hệ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-blue-50 p-6">
                <h4 className="mb-4 text-lg font-semibold text-gray-900">
                  Công ty TNHH Công nghệ ClickFlow
                </h4>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>Địa chỉ:</strong> Lô E2a-7, Đường D1, Khu Công nghệ
                    cao, Phường Long Thạnh Mỹ, Thành Phố Thủ Đức, Thành phố Hồ
                    Chí Minh
                  </p>
                  <p>
                    <strong>Mã số thuế:</strong> 0852793879
                  </p>
                  <p>
                    <strong>Email hỗ trợ:</strong> clickflow.connect@gmail.com
                  </p>
                  <p>
                    <strong>Hotline:</strong> 0393892623 (8:00 - 17:30, Thứ 2 -
                    Thứ 6)
                  </p>
                  <p>
                    <strong>Website:</strong> https://clickflow.space
                  </p>
                </div>

                <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Lưu ý:</strong> Để được hỗ trợ nhanh nhất, vui lòng
                    liên hệ qua email hoặc chat trực tuyến trên website. Chúng
                    tôi cam kết phản hồi trong vòng 24 giờ làm việc.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Back to Home Section */}
      <div className="border-t border-gray-200 bg-gray-100 py-8">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h3 className="mb-4 text-xl font-semibold text-gray-800">
            Có câu hỏi về điều khoản sử dụng?
          </h3>
          <p className="mb-6 text-gray-600">
            Liên hệ với chúng tôi hoặc quay về trang chủ để khám phá thêm
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="/"
              className="rounded-lg bg-purple-600 px-6 py-3 font-medium text-white transition-colors hover:bg-purple-700"
            >
              Về trang chủ
            </a>
            <a
              href="mailto:clickflow.connect@gmail.com"
              className="rounded-lg bg-gray-200 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-300"
            >
              Liên hệ hỗ trợ
            </a>
          </div>
        </div>
      </div>

      {/* Footer - Full Width */}
      <Footer />
    </div>
  );
};

export default TermsOfService;
