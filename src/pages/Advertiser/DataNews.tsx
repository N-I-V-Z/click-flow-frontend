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
    title: 'Startup tham vọng xây dựng mạng blockchain Make in Việt Nam',
    content:
      'Startup 1Matrix cho biết sẽ phát triển các dịch vụ công, tài chính, xác thực, truy xuất nguồn gốc trên mạng blockchain của người Việt.',
    image:
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop',
    publishedAt: '2025-01-15',
    tag: 'other',
    url: 'https://example.com/blockchain-startup'
  },
  {
    id: 2,
    title: 'Hướng dẫn tối ưu hóa chiến dịch quảng cáo cho Advertiser',
    content:
      'Khám phá các chiến lược hiệu quả để tăng ROI và cải thiện hiệu suất quảng cáo trong mạng lưới affiliate marketing. Từ việc phân tích target audience đến tối ưu hóa creative, đây là bí quyết thành công.',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    publishedAt: '2025-01-14',
    tag: 'advertiser',
    url: 'https://example.com/advertiser-guide'
  },
  {
    id: 3,
    title: 'Top 10 chiến lược marketing affiliate cho Publisher',
    content:
      'Cẩm nang chi tiết về cách tối đa hóa thu nhập từ affiliate marketing dành cho các publisher chuyên nghiệp. Những phương pháp đã được chứng minh hiệu quả.',
    image:
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop',
    publishedAt: '2025-01-13',
    tag: 'publisher',
    url: 'https://example.com/publisher-strategies'
  },
  {
    id: 4,
    title: 'Xu hướng Affiliate Marketing 2025: Những thay đổi đáng chú ý',
    content:
      'Phân tích các xu hướng mới nhất trong ngành affiliate marketing và cách thích ứng với những thay đổi này để luôn dẫn đầu thị trường.',
    image:
      'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600&h=400&fit=crop',
    publishedAt: '2025-01-12',
    tag: 'other',
    url: 'https://example.com/trends-2025'
  },
  {
    id: 5,
    title: 'Cách tăng conversion rate cho Advertiser trong Q1 2025',
    content:
      'Bí quyết để cải thiện tỷ lệ chuyển đổi và tối ưu hóa ngân sách quảng cáo trong quý đầu năm. Các case study thực tế và metrics quan trọng.',
    image:
      'https://images.unsplash.com/photo-1590479773265-7464e5d48118?w=600&h=400&fit=crop',
    publishedAt: '2025-01-11',
    tag: 'advertiser',
    url: 'https://example.com/conversion-tips'
  },
  {
    id: 6,
    title: 'Publisher: Cách xây dựng audience chất lượng cao',
    content:
      'Hướng dẫn chi tiết về việc xây dựng và duy trì một cộng đồng người theo dõi chất lượng cao. Từ content strategy đến engagement tactics.',
    image:
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop',
    publishedAt: '2025-01-10',
    tag: 'publisher',
    url: 'https://example.com/audience-building'
  },
  {
    id: 7,
    title: 'AI và Machine Learning trong Affiliate Marketing',
    content:
      'Khám phá cách công nghệ AI đang thay đổi bối cảnh affiliate marketing và cơ hội mới cho các nhà tiếp thị trong kỷ nguyên số.',
    image:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop',
    publishedAt: '2025-01-09',
    tag: 'other',
    url: 'https://example.com/ai-affiliate'
  },
  {
    id: 8,
    title: 'Phân tích hiệu suất chiến dịch: Tools không thể thiếu',
    content:
      'Tổng hợp các công cụ phân tích hiệu suất tốt nhất cho cả advertiser và publisher trong năm 2025. From Google Analytics đến advanced tracking.',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    publishedAt: '2025-01-08',
    tag: 'advertiser',
    url: 'https://example.com/analytics-tools'
  },
  {
    id: 9,
    title: 'Mobile-first: Tối ưu hóa affiliate cho thiết bị di động',
    content:
      'Chiến lược tối ưu hóa affiliate marketing cho thiết bị di động trong thời đại mobile-first. Responsive design và UX optimization.',
    image:
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop',
    publishedAt: '2025-01-07',
    tag: 'publisher',
    url: 'https://example.com/mobile-optimization'
  },
  {
    id: 10,
    title: 'Compliance và quy định mới trong Affiliate Marketing',
    content:
      'Cập nhật những quy định mới nhất và cách đảm bảo tuân thủ trong hoạt động affiliate marketing. GDPR, CCPA và các luật bảo mật khác.',
    image:
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop',
    publishedAt: '2025-01-06',
    tag: 'other',
    url: 'https://example.com/compliance'
  },
  {
    id: 11,
    title: 'Email Marketing Integration với Affiliate Networks',
    content:
      'Cách tích hợp email marketing hiệu quả với affiliate networks để tăng conversion rate và xây dựng relationship dài hạn với customers.',
    image:
      'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=600&h=400&fit=crop',
    publishedAt: '2025-01-05',
    tag: 'advertiser',
    url: 'https://example.com/email-integration'
  },
  {
    id: 12,
    title: 'Social Media Strategies cho Publisher năm 2025',
    content:
      'Những chiến lược social media mới nhất giúp publisher tăng reach, engagement và ultimately commission từ affiliate programs.',
    image:
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop',
    publishedAt: '2025-01-04',
    tag: 'publisher',
    url: 'https://example.com/social-strategies'
  },
  {
    id: 13,
    title: 'Cross-border Affiliate Marketing: Cơ hội toàn cầu',
    content:
      'Khám phá tiềm năng của affiliate marketing xuyên biên giới và cách vượt qua những thách thức về văn hóa, ngôn ngữ và pháp lý.',
    image:
      'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&h=400&fit=crop',
    publishedAt: '2025-01-03',
    tag: 'other',
    url: 'https://example.com/cross-border'
  },
  {
    id: 14,
    title: 'Influencer Marketing meets Affiliate: Hybrid Strategy',
    content:
      'Sự kết hợp giữa influencer marketing và affiliate marketing tạo ra một chiến lược hybrid mạnh mẽ cho cả brand và creator.',
    image:
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop',
    publishedAt: '2025-01-02',
    tag: 'publisher',
    url: 'https://example.com/influencer-hybrid'
  },
  {
    id: 15,
    title: 'Blockchain Technology trong Affiliate Tracking',
    content:
      'Ứng dụng blockchain technology để tạo ra hệ thống tracking minh bạch, chống gian lận trong affiliate marketing ecosystem.',
    image:
      'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=600&h=400&fit=crop',
    publishedAt: '2025-01-01',
    tag: 'other',
    url: 'https://example.com/blockchain-tracking'
  },
  {
    id: 16,
    title: 'Performance Marketing Metrics: KPIs thời đại mới',
    content:
      'Các chỉ số đo lường performance marketing quan trọng nhất mà mọi advertiser cần theo dõi để optimize campaign hiệu quả.',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    publishedAt: '2024-12-31',
    tag: 'advertiser',
    url: 'https://example.com/performance-metrics'
  },
  {
    id: 17,
    title: 'Content Marketing cho Affiliate Success',
    content:
      'Chiến lược content marketing toàn diện giúp publisher xây dựng authority, trust và tăng affiliate revenue một cách bền vững.',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    publishedAt: '2024-12-30',
    tag: 'publisher',
    url: 'https://example.com/content-strategy'
  },
  {
    id: 18,
    title: 'Voice Search Optimization cho Affiliate Sites',
    content:
      'Tối ưu hóa cho voice search - xu hướng mới trong SEO và cách affiliate sites có thể leverage trend này để tăng traffic.',
    image:
      'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=600&h=400&fit=crop',
    publishedAt: '2024-12-29',
    tag: 'other',
    url: 'https://example.com/voice-search'
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
      return 'bg-gradient-to-r from-blue to-cyan-500';
    default:
      return 'bg-gradient-to-r from-gray-500 to-gray-600';
  }
};
