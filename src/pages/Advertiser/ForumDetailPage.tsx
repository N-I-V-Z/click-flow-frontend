import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ForumDetail from './ForumDetail';
import { useGetPostById } from '@/queries/forum.query';
import { ForumPost } from '@/types';

interface ExtendedForumPost extends ForumPost {
  likes: number;
  liked: boolean;
  comments: any[];
  avatarUrl?: string;
  view?: number;
}

export default function ForumDetailPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [post, setPost] = useState<ExtendedForumPost | null>(
    location.state?.post || null
  );

  // Scroll lên đầu khi vào trang
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Nếu không có post từ state, fetch từ API
  const { data } = useGetPostById(post ? undefined : Number(id));
  useEffect(() => {
    if (!post && data?.result) {
      // Map API post về ExtendedForumPost
      setPost({
        ...data.result,
        likes: data.result.likeCount || 0,
        liked: data.result.isLikedByCurrentUser || false,
        comments: [],
        avatarUrl: data.result.author?.userDetail?.avatarURL,
        view: 0
      });
    }
  }, [data, post]);

  if (!post)
    return <div className="py-10 text-center">Đang tải bài viết...</div>;

  return (
    <ForumDetail post={post} onBack={() => navigate(-1)} updatePost={setPost} />
  );
}
