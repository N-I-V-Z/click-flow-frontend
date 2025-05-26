import { useState, FormEvent, useEffect, Fragment, useRef } from 'react';
import {
  FaRegHeart,
  FaComment,
  FaEye,
  FaExclamationCircle,
  FaLightbulb,
  FaPlus,
  FaSearch
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Reply {
  id: number;
  author: string;
  avatarUrl: string;
  content: string;
  date: string;
}
type PostType = 'article' | 'question';
interface Post {
  id: number;
  author: string;
  avatarUrl: string;
  type: PostType;
  title: string;
  content: string;
  date: string;
  tags: string[];
  views: number;
  replies: Reply[];
  reactions: Record<'like' | 'love' | 'insightful', number>;
  imageUrl?: string;
}

const initialPosts: Post[] = [
  {
    id: 1,
    author: 'Nguyen Van A',
    avatarUrl: 'https://i.pravatar.cc/40?img=1',
    type: 'question',
    title: 'Làm sao để tăng tỷ lệ chuyển đổi affiliate?',
    content:
      'Mọi người gợi ý chiến lược nào cho landing page ở niche tài chính?',
    date: '2025-05-25',
    tags: ['affiliate', 'landing-page', 'conversion'],
    views: 120,
    replies: [
      {
        id: 1,
        author: 'Tran Thi B',
        avatarUrl: 'https://i.pravatar.cc/40?img=2',
        content: 'Bạn thử tối ưu CTA và test A/B nhé!',
        date: '2025-05-25'
      }
    ],
    reactions: { like: 8, love: 2, insightful: 5 }
  },
  {
    id: 2,
    author: 'Tran Thi B',
    avatarUrl: 'https://i.pravatar.cc/40?img=2',
    type: 'article',
    title: 'Case Study: Blog affiliate tháng 5',
    content: 'Tháng trước mình đạt 200 leads từ bài blog hướng dẫn SEO...',
    date: '2025-05-24',
    tags: ['case-study', 'blog', 'SEO'],
    views: 95,
    replies: [],
    reactions: { like: 10, love: 4, insightful: 3 }
  },
  {
    id: 3,
    author: 'Le Thi C',
    avatarUrl: 'https://i.pravatar.cc/40?img=3',
    type: 'article',
    title: 'Hướng dẫn A/B Testing cho Landing Page',
    content: 'Chi tiết cách triển khai AB test để tối ưu tỷ lệ chuyển đổi...',
    date: '2025-05-22',
    tags: ['AB-testing', 'landing-page', 'optimization'],
    views: 80,
    replies: [
      {
        id: 1,
        author: 'Pham Van D',
        avatarUrl: 'https://i.pravatar.cc/40?img=4',
        content: 'Rất hữu ích, mình sẽ thử!',
        date: '2025-05-23'
      }
    ],
    reactions: { like: 12, love: 5, insightful: 7 }
  },
  {
    id: 4,
    author: 'Pham Van D',
    avatarUrl: 'https://i.pravatar.cc/40?img=4',
    type: 'question',
    title: 'Công cụ SEO miễn phí nào tốt?',
    content: 'Mọi người đang dùng tools nào để phân tích từ khóa miễn phí?',
    date: '2025-05-20',
    tags: ['SEO', 'tools', 'keyword'],
    views: 60,
    replies: [
      {
        id: 1,
        author: 'Nguyen Van A',
        avatarUrl: 'https://i.pravatar.cc/40?img=1',
        content: 'Mình đề xuất Ubersuggest',
        date: '2025-05-21'
      },
      {
        id: 2,
        author: 'Le Thi C',
        avatarUrl: 'https://i.pravatar.cc/40?img=3',
        content: 'Google Keyword Planner ổn lắm',
        date: '2025-05-21'
      }
    ],
    reactions: { like: 9, love: 3, insightful: 4 }
  },
  {
    id: 5,
    author: 'Tran Quang E',
    avatarUrl: 'https://i.pravatar.cc/40?img=5',
    type: 'article',
    title: 'Xây dựng Funnel hiệu quả cho Affiliate',
    content: 'Bài chia sẻ chi tiết từng giai đoạn của funnel marketing...',
    date: '2025-05-18',
    tags: ['funnel', 'affiliate', 'marketing'],
    views: 150,
    replies: [],
    reactions: { like: 15, love: 6, insightful: 8 }
  },
  {
    id: 6,
    author: 'Lê Thị C',
    avatarUrl: 'https://i.pravatar.cc/40?img=3',
    type: 'question',
    title: 'Làm cách nào để tối ưu hoá affiliate qua email marketing?',
    content:
      'Mình đang triển khai chuỗi email nuôi leads cho niche tài chính, nhưng tỷ lệ click vào link affiliate rất thấp. Mọi người có kinh nghiệm gì chia sẻ không?',
    date: '2025-05-23',
    tags: ['affiliate', 'email-marketing', 'conversion'],
    views: 85,
    replies: [
      {
        id: 1,
        author: 'Phạm Văn D',
        avatarUrl: 'https://i.pravatar.cc/40?img=4',
        content:
          'Bạn thử personalize tiêu đề email và A/B test định dạng CTA xem sao!',
        date: '2025-05-23'
      }
    ],
    reactions: { like: 6, love: 0, insightful: 3 }
  },
  {
    id: 7,
    author: 'Nguyễn Văn E',
    avatarUrl: 'https://i.pravatar.cc/40?img=5',
    type: 'article',
    title: 'Bí quyết chọn nền tảng quảng cáo cho affiliate tài chính',
    content:
      'So sánh Facebook Ads, Google Ads và LinkedIn Ads trong việc chạy traffic cho landing page tài chính.',
    date: '2025-05-22',
    tags: ['affiliate', 'ads', 'landing-page'],
    views: 110,
    replies: [],
    reactions: { like: 12, love: 2, insightful: 5 }
  },
  {
    id: 8,
    author: 'Trần Thị F',
    avatarUrl: 'https://i.pravatar.cc/40?img=6',
    type: 'question',
    title: 'Landing page đơn giản hay đa năng thì chuyển đổi tốt hơn?',
    content:
      'Mình băn khoăn giữa landing page đơn mục tiêu (single goal) và page có thêm thông tin chi tiết, các bước hướng dẫn. Ai có case study chia sẻ?',
    date: '2025-05-21',
    tags: ['landing-page', 'CRO', 'case-study'],
    views: 72,
    replies: [
      {
        id: 1,
        author: 'Lê Minh G',
        avatarUrl: 'https://i.pravatar.cc/40?img=7',
        content: 'Theo mình là single goal, ít distraction thì CR cao hơn.',
        date: '2025-05-21'
      },
      {
        id: 2,
        author: 'Hoàng Văn H',
        avatarUrl: 'https://i.pravatar.cc/40?img=8',
        content:
          'Cần tùy vào phân khúc traffic, nếu cold thì cần nhiều info hơn.',
        date: '2025-05-21'
      }
    ],
    reactions: { like: 8, love: 1, insightful: 4 }
  },
  {
    id: 9,
    author: 'Phạm Thị I',
    avatarUrl: 'https://i.pravatar.cc/40?img=9',
    type: 'article',
    title: 'A/B Testing: Tiêu đề hay Nội dung?',
    content:
      'Phân tích kết quả A/B test giữa việc thay đổi tiêu đề chính so với điều chỉnh nội dung mô tả sản phẩm.',
    date: '2025-05-20',
    tags: ['affiliate', 'A/B-test', 'CRO'],
    views: 130,
    replies: [],
    reactions: { like: 15, love: 3, insightful: 6 }
  },
  {
    id: 10,
    author: 'Võ Văn K',
    avatarUrl: 'https://i.pravatar.cc/40?img=10',
    type: 'question',
    title: 'Video trên landing page có cải thiện CR?',
    content:
      'Mình định chèn video demo ngắn 30s vào landing page, có ai thử chưa và hiệu quả thế nào?',
    date: '2025-05-19',
    tags: ['landing-page', 'video', 'conversion'],
    views: 60,
    replies: [
      {
        id: 1,
        author: 'Đỗ Thị L',
        avatarUrl: 'https://i.pravatar.cc/40?img=11',
        content:
          'Theo benchmark, video có thể tăng CR lên 5–7%, nhưng test với page bạn nhé.',
        date: '2025-05-19'
      }
    ],
    reactions: { like: 4, love: 1, insightful: 2 }
  },
  {
    id: 11,
    author: 'Trịnh Minh M',
    avatarUrl: 'https://i.pravatar.cc/40?img=12',
    type: 'article',
    title: 'Tối ưu tốc độ tải trang cho landing page affiliate',
    content:
      'Hướng dẫn cách nén ảnh, lazy-load và reduce HTTP requests để nâng cao tốc độ.',
    date: '2025-05-18',
    tags: ['SEO', 'landing-page', 'performance'],
    views: 102,
    replies: [],
    reactions: { like: 9, love: 2, insightful: 4 }
  },
  {
    id: 12,
    author: 'Ngô Thị N',
    avatarUrl: 'https://i.pravatar.cc/40?img=13',
    type: 'question',
    title: 'Nên sử dụng pop-up giảm giá cho affiliate không?',
    content:
      'Mình thấy nhiều site dùng pop-up code giảm giá, nhưng sợ làm phiền user. Mọi người nghĩ sao?',
    date: '2025-05-17',
    tags: ['CRO', 'UX', 'affiliate'],
    views: 54,
    replies: [
      {
        id: 1,
        author: 'Phan Văn O',
        avatarUrl: 'https://i.pravatar.cc/40?img=14',
        content:
          'Popup nên delay >10s và chỉ show 1 lần, tỉ lệ chuyển đổi khá ổn.',
        date: '2025-05-17'
      }
    ],
    reactions: { like: 3, love: 0, insightful: 1 }
  },
  {
    id: 13,
    author: 'Bùi Thị P',
    avatarUrl: 'https://i.pravatar.cc/40?img=15',
    type: 'article',
    title: 'Sử dụng social proof tăng trust cho landing page',
    content:
      'Cách đưa testimonial, review và logo đối tác vào page để nâng cao uy tín.',
    date: '2025-05-16',
    tags: ['social-proof', 'CRO', 'landing-page'],
    views: 125,
    replies: [],
    reactions: { like: 14, love: 5, insightful: 7 }
  },
  {
    id: 14,
    author: 'Đặng Văn Q',
    avatarUrl: 'https://i.pravatar.cc/40?img=16',
    type: 'question',
    title: 'Affiliate tracking: cookies hay server-side tốt hơn?',
    content:
      'Hiện mình dùng cookie-based tracking, nhưng ít nghĩ chuyển sang server-side. Ai có kinh nghiệm chia sẻ ưu nhược?',
    date: '2025-05-15',
    tags: ['affiliate', 'tracking', 'tech'],
    views: 68,
    replies: [
      {
        id: 1,
        author: 'Lê Thị R',
        avatarUrl: 'https://i.pravatar.cc/40?img=17',
        content:
          'Server-side tracking cho độ chính xác cao hơn, nhưng triển khai phức tạp.',
        date: '2025-05-15'
      }
    ],
    reactions: { like: 7, love: 1, insightful: 3 }
  }
];

export default function AffiliateForum() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'reactions'>('date');
  const [showModal, setShowModal] = useState(false);
  const loader = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && setPage((p) => p + 1),
      { threshold: 1 }
    );
    if (loader.current) obs.observe(loader.current);
    return () => obs.disconnect();
  }, []);

  const addPost = (
    type: PostType,
    title: string,
    content: string,
    tags: string[],
    imageFile?: File
  ) => {
    const imageUrl = imageFile ? URL.createObjectURL(imageFile) : undefined;
    setPosts([
      {
        id: Date.now(),
        author: 'Bạn',
        avatarUrl: 'https://i.pravatar.cc/40',
        type,
        title,
        content,
        date: new Date().toISOString().split('T')[0],
        tags,
        views: 0,
        replies: [],
        reactions: { like: 0, love: 0, insightful: 0 },
        imageUrl
      },
      ...posts
    ]);
    toast.success('Đã tạo bài viết mới');
    setShowModal(false);
  };
  const reactToPost = (postId: number, key: keyof Post['reactions']) => {
    setPosts(
      posts.map((p) =>
        p.id === postId
          ? { ...p, reactions: { ...p.reactions, [key]: p.reactions[key] + 1 } }
          : p
      )
    );
  };
  const addReply = (postId: number, content: string) => {
    setPosts(
      posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              replies: [
                ...p.replies,
                {
                  id: Date.now(),
                  author: 'Bạn',
                  avatarUrl: 'https://i.pravatar.cc/40',
                  content,
                  date: new Date().toISOString().split('T')[0]
                }
              ]
            }
          : p
      )
    );
  };
  const incrementView = (postId: number) => {
    setPosts(
      posts.map((p) => (p.id === postId ? { ...p, views: p.views } : p))
    );
  };

  const filtered = posts.filter(
    (p) =>
      (!filterTag || p.tags.includes(filterTag)) &&
      (p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'views') return b.views - a.views;
    if (sortBy === 'reactions')
      return (
        b.reactions.like +
        b.reactions.love +
        b.reactions.insightful -
        (a.reactions.like + a.reactions.love + a.reactions.insightful)
      );
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  const visible = sorted.slice(0, page * 5);

  return (
    <Fragment>
      <header className="flex items-center justify-between bg-gradient-to-br from-indigo-100 via-purple-50 p-6 shadow dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Forum Affiliate Marketing
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center rounded bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
          >
            <FaPlus className="mr-2" />
            Post
          </button>
        </div>
      </header>
      <div className="bg-gradient-to-br from-indigo-100 via-purple-50 p-6 dark:bg-gray-900">
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex flex-1 items-center rounded bg-white p-2 dark:bg-gray-800">
            <FaSearch className="mr-2 text-gray-400" />
            <input
              placeholder="Search..."
              className="w-full bg-transparent outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="rounded bg-white p-2 dark:bg-gray-800"
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
          >
            <option value="">All Tags</option>
            {[...new Set(posts.flatMap((p) => p.tags))].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            className="rounded bg-white p-2 dark:bg-gray-800"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as never)}
          >
            <option value="date">Newest</option>
            <option value="views">Views</option>
            <option value="reactions">Reactions</option>
          </select>
        </div>
        <ul className="space-y-6">
          {visible.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              onReact={reactToPost}
              onReply={addReply}
              onView={incrementView}
            />
          ))}
        </ul>
        <div ref={loader} className="h-8" />
      </div>
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-lg rounded-lg bg-white p-6 dark:bg-gray-800"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <NewPostForm onSubmit={addPost} />
              <button
                onClick={() => setShowModal(false)}
                className="mt-4 text-sm text-gray-500"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ToastContainer position="bottom-right" />
    </Fragment>
  );
}

function PostItem({
  post,
  onReact,
  onReply,
  onView
}: {
  post: Post;
  onReact: (id: number, reaction: keyof Post['reactions']) => void;
  onReply: (id: number, content: string) => void;
  onView: (id: number) => void;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  useEffect(() => {
    onView(post.id);
  }, [onView, post.id]);
  return (
    <motion.li
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded bg-white p-6 shadow transition hover:shadow-lg dark:bg-gray-800"
    >
      <div className="flex items-start justify-between">
        <div>
          <h2 className="flex items-center space-x-2 text-xl font-semibold">
            {post.type === 'question' && (
              <FaExclamationCircle className="text-blue-500" />
            )}
            <span>{post.title}</span>
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <img
              src={post.avatarUrl}
              className="h-6 w-6 rounded-full"
              loading="lazy"
            />
            <span>{post.author}</span>·<span>{post.date}</span>
          </div>
        </div>
        <div className="flex space-x-4 text-gray-500">
          <div className="flex items-center">
            <FaEye />
            <span className="ml-1">{post.views}</span>
          </div>
          <div className="flex items-center">
            <FaComment />
            <span className="ml-1">{post.replies.length}</span>
          </div>
        </div>
      </div>
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          className="mt-4 max-h-60 w-full rounded object-cover"
          loading="lazy"
          alt="post-img"
        />
      )}
      <p className="mt-4 whitespace-pre-line">{post.content}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs"
          >
            #{tag}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-6">
        <button
          onClick={() => onReact(post.id, 'like')}
          className="hover:text-red-500 flex items-center space-x-1"
        >
          <FaRegHeart />
          <span>{post.reactions.like}</span>
        </button>
        <button
          onClick={() => onReact(post.id, 'love')}
          className="flex items-center space-x-1 hover:text-pink-600"
        >
          ❤️<span>{post.reactions.love}</span>
        </button>
        <button
          onClick={() => onReact(post.id, 'insightful')}
          className="hover:text-yellow-500 flex items-center space-x-1"
        >
          <FaLightbulb />
          <span>{post.reactions.insightful}</span>
        </button>
        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="text-blue-500 ml-auto flex items-center space-x-1"
        >
          <FaComment />
          <span>Reply</span>
        </button>
      </div>
      {showReplyForm && (
        <NewReplyForm onSubmit={(content) => onReply(post.id, content)} />
      )}
      {post.replies.length > 0 && (
        <ul className="mt-6 space-y-4">
          {post.replies.map((r) => (
            <li key={r.id} className="flex items-start space-x-3">
              <img
                src={r.avatarUrl}
                className="h-8 w-8 rounded-full"
                loading="lazy"
                alt="reply-avatar"
              />
              <div>
                <p className="text-sm font-medium dark:text-gray-200">
                  {r.author}{' '}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    · {r.date}
                  </span>
                </p>
                <p className="text-gray-700 dark:text-gray-300">{r.content}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </motion.li>
  );
}

function NewPostForm({
  onSubmit
}: {
  onSubmit: (
    type: PostType,
    title: string,
    content: string,
    tags: string[],
    imageFile?: File
  ) => void;
}) {
  const [type, setType] = useState<PostType>('article');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [file, setFile] = useState<File>();
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    onSubmit(
      type,
      title,
      content,
      tagsInput.split(',').map((t) => t.trim()),
      file
    );
    setTitle('');
    setContent('');
    setTagsInput('');
    setFile(undefined);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex space-x-4">
        <label className="flex items-center space-x-1">
          <input
            type="radio"
            checked={type === 'article'}
            onChange={() => setType('article')}
          />
          <span>Article</span>
        </label>
        <label className="flex items-center space-x-1">
          <input
            type="radio"
            checked={type === 'question'}
            onChange={() => setType('question')}
          />
          <span>Question</span>
        </label>
      </div>
      <input
        className="w-full rounded border p-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="h-40 w-full rounded border p-2"
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files![0])}
      />
      <input
        className="w-full rounded border p-2"
        placeholder="Tags comma-separated"
        value={tagsInput}
        onChange={(e) => setTagsInput(e.target.value)}
      />
      <button type="submit" className="bg-bl w-full rounded p-2 text-white">
        Submit
      </button>
    </form>
  );
}

function NewReplyForm({ onSubmit }: { onSubmit: (content: string) => void }) {
  const [content, setContent] = useState('');
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content.trim());
    setContent('');
  };
  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2">
      <textarea
        className="h-24 w-full rounded border p-2"
        placeholder="Write a reply..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        type="submit"
        className="rounded bg-green-600 px-5 py-2 text-white transition hover:bg-green-700"
      >
        Send Reply
      </button>
    </form>
  );
}
