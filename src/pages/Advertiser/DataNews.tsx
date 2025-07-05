// DataNews.tsx
export interface NewsItem {
  id: number;
  title: string;
  content: string;
  image: string;
  publishedAt: string;
  tag: 'advertiser' | 'publisher' | 'other';
  url: string;
}

export const newsData: NewsItem[] = [
  {
    id: 1,
    title:
      'AnyMind Group thâu tóm Vibula – Đẩy mạnh affiliate marketing tại Việt Nam',
    content:
      'AnyMind Group công bố mua lại Vibula, agency social & live commerce tại Việt Nam, mở rộng mạng lưới affiliate với hơn 100 creators và tích hợp AI cho livestream thương mại. Đây là một động thái chiến lược nhằm củng cố vị thế của AnyMind trong thị trường affiliate marketing đang phát triển mạnh mẽ tại Việt Nam.',
    image:
      'https://anymindgroup.com/wp-content/uploads/2025/04/VIBULA_en-2.jpg',
    publishedAt: '2025-04-25',
    tag: 'other',
    url: 'https://anymindgroup.com/news/press-release/vibula-agreement-0425'
  },
  {
    id: 2,
    title:
      'Bức tranh Affiliate Marketing Việt Nam 2025: Xu hướng, thách thức và cơ hội bứt phá',
    content:
      'Báo cáo chuyên sâu về ngành affiliate marketing tại Việt Nam, phân tích các xu hướng mới như Social Commerce & Livestream Affiliate, sự lên ngôi của KOC & UGC, cùng với những thách thức về khung pháp lý và cạnh tranh. Bài viết cũng dự báo tiềm năng tăng trưởng đáng kể của ngành trong 3-5 năm tới.',
    image:
      'https://shortlink.vn/wp-content/uploads/2025/03/shortlink-vn-597-1140x570.jpg',
    publishedAt: '2025-03-13',
    tag: 'other',
    url: 'https://shortlink.vn/affiliate-marketing-viet-nam-2025-xu-huong-thach-thuc-va-co-hoi-but-pha-14907/'
  },
  {
    id: 3,
    title: 'Digital sellers embrace affiliate marketing in Vietnam',
    content:
      'Bài viết này phân tích sự phát triển mạnh mẽ của affiliate marketing tại Việt Nam như một động lực thúc đẩy tăng trưởng thương mại điện tử. Báo cáo từ Business Research Insight và AccessTrade cũng được đề cập, cho thấy thị trường Việt Nam đạt 700 triệu đến 1 tỷ USD vào năm 2024 và dự kiến sẽ tiếp tục bùng nổ.',
    image:
      'https://vir.com.vn/stores/news_dataimages/2025/052025/30/09/digital-sellers-embrace-affiliate-marketing-20250530093620.jpg?rt=20250530093622',
    publishedAt: '2025-05-30',
    tag: 'other',
    url: 'https://vir.com.vn/digital-sellers-embrace-affiliate-marketing-129494.html'
  },
  {
    id: 4,
    title:
      'Thị trường Affiliate Marketing tăng trưởng “nóng” trên các sàn thương mại điện tử Shopee, TikTok Shop',
    content:
      'Bài phân tích về sự bùng nổ của affiliate marketing trên các sàn thương mại điện tử lớn tại Việt Nam như Shopee và TikTok Shop. Nội dung nhấn mạnh vai trò của KOL/KOC, livestream và short video trong việc thúc đẩy doanh số và tạo ra hệ sinh thái affiliate marketing đa dạng, năng động.',
    image:
      'https://media.vneconomy.vn/w800/images/upload/2025/02/21/tiktok1.jpg',
    publishedAt: '2025-02-21',
    tag: 'publisher',
    url: 'https://vneconomy.vn/techconnect/thi-truong-affiliate-marketing-tang-truong-nong-tren-cac-san-thuong-mai-dien-tu-shopee-tiktok-shop.htm'
  },
  {
    id: 5,
    title:
      'Báo cáo Affiliate Marketing 2025: Toàn cảnh thị trường tiếp thị liên kết',
    content:
      'Accesstrade Việt Nam đã chính thức phát hành báo cáo Affiliate Marketing 2025, cung cấp cái nhìn tổng quan sâu sắc về thị trường tiếp thị liên kết tại Việt Nam cùng với các xu hướng toàn cầu nổi bật. Báo cáo này là tài liệu quý giá cho cộng đồng doanh nghiệp để tối đa hóa tiềm năng của affiliate marketing.',
    image:
      'https://vstatic.vietnam.vn/vietnam/resource/IMAGE/2025/1/18/46ec9fa62bf6435b8bb601d62940abc6',
    publishedAt: '2025-01-15',
    tag: 'other',
    url: 'https://www.vietnam.vn/en/bao-cao-affiliate-marketing-toan-canh-thi-truong-tiep-thi-lien-ket'
  },
  {
    id: 6,
    title:
      "Bức tranh toàn cảnh Affiliate 2024 và dự báo xu hướng 2025: Cú 'đánh úp' của Temu vào thị trường Việt Nam",
    content:
      'Bài viết điểm lại các sự kiện nổi bật của affiliate marketing năm 2024 và dự đoán xu hướng quan trọng năm 2025, đặc biệt nhấn mạnh tác động của sự gia nhập thị trường Việt Nam của Temu với các chương trình khuyến mãi và hoa hồng hấp dẫn, gây xôn xao thị trường.',
    image:
      'https://cdn.brvn.vn/editor/2025/01/U67332_xu-huong-affiliate-viet-nam-20_1735792097.png',
    publishedAt: '2025-01-02',
    tag: 'other',
    url: 'https://www.brandsvietnam.com/congdong/topic/345451-buc-tranh-toan-canh-affiliate-2024-va-du-bao-xu-huong-2025'
  },
  {
    id: 8,
    title:
      'Quy định pháp lý mới về quảng cáo và Affiliate Marketing tại Việt Nam',
    content:
      'Cập nhật về các thay đổi trong quy định pháp luật liên quan đến quảng cáo trực tuyến và hoạt động affiliate marketing tại Việt Nam, bao gồm các yêu cầu về minh bạch thông tin, bảo vệ dữ liệu người dùng và trách nhiệm của các bên liên quan.',
    image:
      'https://image.luatvietnam.vn/uploaded//665twebp/images/original/2021/10/06/ha-noi-ban-hanh-moi-33-thu-tuc-linh-vuc-doanh-nghiep_0610120200.jpg',
    publishedAt: '2025-03-20',
    tag: 'other',
    url: 'https://luatvietnam.vn/thuong-mai/quy-dinh-quang-cao-online-2025-567-33333-article.html'
  }
];

export const getTagLabel = (tag: NewsItem['tag']): string => {
  switch (tag) {
    case 'advertiser':
      return 'Dành cho Advertiser';
    case 'publisher':
      return 'Dành cho Publisher';
    case 'other':
      return 'Tin khác';
    default:
      return 'Tin khác';
  }
};

export const getTagColor = (tag: NewsItem['tag']): string => {
  switch (tag) {
    case 'advertiser':
      return 'bg-gradient-to-r from-pink-500 to-rose-500';
    case 'publisher':
      return 'bg-gradient-to-r from-purple-500 to-indigo-500';
    case 'other':
      return 'bg-gradient-to-r from-[#3B82F6] to-[#06B6D4]';
  }
};
