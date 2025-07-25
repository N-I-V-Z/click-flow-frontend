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
    id: 16,
    title:
      "Vietnam's 2025 Legal Overhaul: What E-Commerce & Advertising Businesses Must Know",
    content:
      'Việt Nam đang bước vào kỷ nguyên mới của luật thương mại điện tử và quy định quảng cáo kỹ thuật số, giới thiệu những thay đổi sâu rộng trong tiếp thị người ảnh hưởng, bán hàng livestream và thương mại xuyên biên giới. Hiểu rõ những thay đổi này là điều cần thiết để duy trì tuân thủ và cạnh tranh trong thị trường Việt Nam.',
    image:
      'https://cdn.prod.website-files.com/66398a128daf987056d4054a/687f0059bc11a3b9c3fe4960_Vietnam%E2%80%99s%202025%20Legal%20Overhaul%202%20-%20Article-01.jpg',
    publishedAt: '2025-07-22',
    tag: 'other',
    url: 'https://www.feedforce.vn/articles/what-e-commerce-advertising-businesses-must-know'
  },
  {
    id: 11,
    title: 'True value helps e-commerce sellers reach sustainability',
    content:
      'Bài viết từ Vietnam News này nhấn mạnh việc cạnh tranh dựa trên giá trị thay vì giá cả sẽ giúp người bán thương mại điện tử đạt được sự phát triển bền vững. Tại hội nghị TikTok Shop Vietnam Summit 2025, các chuyên gia đã thảo luận về những xu hướng mới, số liệu tăng trưởng ấn tượng của TikTok Shop và vai trò của affiliate marketing, livestream, short video trong việc thúc đẩy tăng trưởng.',
    image:
      'https://image.vietnamnews.vn/uploadvnnews/Article/2025/7/18/437888_IMG_3668.jpeg',
    publishedAt: '2025-07-18',
    tag: 'other',
    url: 'https://vietnamnews.vn/economy/1721661/true-value-helps-e-commerce-sellers-reach-sustainability.html'
  },
  {
    id: 9,
    title:
      '30+ SỐ LIỆU AFFILIATE MARKETING THỊ TRƯỜNG TOÀN CẦU VÀ VIỆT NAM NĂM 2025',
    content:
      'Bài viết tổng hợp hơn 30 số liệu quan trọng về thị trường affiliate marketing toàn cầu và Việt Nam trong năm 2025. Nội dung bao gồm các xu hướng nổi bật, thu nhập trung bình từ affiliate, thách thức và rủi ro, cùng với dự báo về tương lai của ngành, đặc biệt nhấn mạnh vai trò của video và các sàn thương mại điện tử lớn.',
    image:
      'https://rentracks.com.vn/wp-content/uploads/2025/06/30-SO-LIEU-930x620.jpg',
    publishedAt: '2025-07-08',
    tag: 'other',
    url: 'https://rentracks.com.vn/30-so-lieu-affiliate-marketing-quan-trong-2025/'
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
    id: 12,
    title:
      'Navee Media tổ chức thành công Họp báo công bố sự kiện Permate Affiliate Fest 2025',
    content:
      'Navee Media đã tổ chức thành công buổi họp báo công bố sự kiện Permate Affiliate Fest 2025, một lễ hội quy mô lớn với hơn 10.000 người tham dự, đánh dấu kỷ nguyên mới của affiliate marketing tại Việt Nam với sự định hình của hành vi người dùng, dữ liệu và công nghệ.',
    image:
      'https://www.navee.media/wp-content/uploads/2025/05/image-1-1392x927.jpeg',
    publishedAt: '2025-05-22',
    tag: 'other',
    url: 'https://www.navee.media/navee-media-to-chuc-thanh-cong-hop-bao-cong-bo-su-kien-permate-affiliate-fest-2025/'
  },
  {
    id: 10,
    title:
      'Dấu mốc mới cho ngành Tiếp thị liên kết tại Việt Nam: Permate Affiliate Fest 2025',
    content:
      'Ngày 31/5/2025, sự kiện Permate Affiliate Fest 2025 đã diễn ra tại The Global City, TP. Thủ Đức, TP. Hồ Chí Minh. Đây là lần đầu tiên một lễ hội ngoài trời quy mô lớn dành riêng cho lĩnh vực tiếp thị liên kết được tổ chức tại Việt Nam, đánh dấu một cột mốc quan trọng cho sự phát triển của ngành.',
    image:
      'https://media.tapchitaichinh.vn/w1480/images/upload//2025/05/20/img-9754.JPG',
    publishedAt: '2025-05-20',
    tag: 'other',
    url: 'https://tapchitaichinh.vn/dau-moc-moi-cho-nganh-tiep-thi-lien-ket-tai-viet-nam.html'
  },
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
    id: 13,
    title: 'XU HƯỚNG AFFILIATE TIKTOK VÀ NHỮNG THAY ĐỔI QUAN TRỌNG NĂM 2025',
    content:
      'Bài viết phân tích các xu hướng nổi bật của affiliate marketing trên TikTok trong năm 2025, bao gồm sự bùng nổ của TikTok Shop, nhu cầu cá nhân hóa, tầm ảnh hưởng của KOL/KOC, mua sắm qua livestream độc quyền và xuyên biên giới, cùng với tiềm năng phát triển của UGC và việc áp dụng AI.',
    image:
      'https://lh7-rt.googleusercontent.com/docsz/AD_4nXcK_GmpDnzqaDbsnj4eY1hUbE-RemX4P82hqviBXIg4a_s4ds-mF-1p-mycJNdUZPPNNrJlbeWfMzh1wlZ-t-7yDPPXXlIurXCjpZj_Gp3aH9jhEtXXwBon5NH5Q-rQVwN4iBsm2g?key=8fYmlQHX70tjK1v0JbRKuwP_',
    publishedAt: '2025-04-05',
    tag: 'other',
    url: 'https://rentracks.com.vn/en/xu-huong-affiliate-tiktok-va-nhung-thay-doi-2025/'
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
