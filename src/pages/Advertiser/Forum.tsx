// import { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FaPlus, FaComment, FaSearch, FaEllipsisH } from 'react-icons/fa';
// import { useQueryClient } from '@tanstack/react-query';
// import ForumDetail from './ForumDetail';
// import BasePages from '@/components/shared/base-pages';
// import LikeButton from '@/components/ui/LikeButton';
// import ConfirmModal from '@/components/ui/ConfirmModal';
// import CreatePostModal from '@/components/ui/CreatePostModal';
// import RichTextEditor from '@/components/ui/RichTextEditor';
// import {
//   getTotalCommentCount,
//   formatCommentCount,
//   formatTimeAgo
// } from '@/utils/commentUtils';
// import {
//   useGetAllPosts,
//   useCreatePost,
//   useUpdatePost,
//   useDeletePost,
//   useIncrementPostView
// } from '@/queries/forum.query';
// import { ForumPost } from '@/types';

// // ----------------------------------------------
// // Kiểu dữ liệu Comment (giữ nguyên để tương thích)
// // ----------------------------------------------
// interface Comment {
//   id: string;
//   author: string;
//   avatarUrl: string;
//   content: string;
//   likes: number;
//   liked: boolean;
//   createdAt: number;
//   replies?: Comment[];
// }

// // Extend ForumPost để thêm trường cần thiết cho UI
// interface ExtendedForumPost extends ForumPost {
//   likes: number;
//   liked: boolean;
//   comments: Comment[];
//   // Helper để tương thích với ForumDetail
//   avatarUrl?: string;
// }

// export default function Forum() {
//   // --------------------------------------------
//   // State & refs
//   // --------------------------------------------
//   const [posts, setPosts] = useState<ExtendedForumPost[]>([]);
//   const [filteredPosts, setFilteredPosts] = useState<ExtendedForumPost[]>([]);
//   const [selectedPost, setSelectedPost] = useState<ExtendedForumPost | null>(null);
//   const [showCreate, setShowCreate] = useState(false);
//   const [searchText, setSearchText] = useState<string>('');
//   const searchRef = useRef<HTMLInputElement>(null);

//   // State cho edit post
//   const [editingPostId, setEditingPostId] = useState<string | null>(null);
//   const [editingPostText, setEditingPostText] = useState('');

//   // State cho menu 3 chấm
//   const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

//   // Modal xác nhận xóa
//   const [deleteModal, setDeleteModal] = useState<{
//     isOpen: boolean;
//     postId: string;
//   }>({
//     isOpen: false,
//     postId: ''
//   });

//   const queryClient = useQueryClient();

//   // --------------------------------------------
//   // API Hooks
//   // --------------------------------------------
//   const {
//     data: postsResponse,
//     isLoading,
//     error,
//     refetch
//   } = useGetAllPosts(1, 20); // Lấy 20 bài đầu tiên

//   // Fallback data for testing
//   const fallbackPosts: ExtendedForumPost[] = [
//     {
//       id: 1,
//       title: "Test Post",
//       content: "This is a test post content",
//       topic: "Other",
//       createdAt: new Date().toISOString(),
//       view: 10,
//       feedbackNumber: 2,
//       author: {
//         id: 1,
//         fullName: "Test User",
//         role: "Admin",
//         isDeleted: false,
//         email: "test@example.com",
//         userDetail: {
//           id: 1,
//           dateOfBirth: new Date().toISOString(),
//           gender: "Nam",
//           avatarURL: "https://i.pravatar.cc/40?u=test",
//           address: "Test Address",
//           applicationUserId: 1,
//           fullName: "Test User"
//         }
//       },
//       likes: 5,
//       liked: false,
//       comments: []
//     }
//   ];

//   const createPostMutation = useCreatePost();
//   const updatePostMutation = useUpdatePost();
//   const deletePostMutation = useDeletePost();
//   const incrementViewMutation = useIncrementPostView();

//   // --------------------------------------------
//   // 1) Load dữ liệu từ API
//   // --------------------------------------------
//   useEffect(() => {
//     if (postsResponse?.result) {
//       // Transform API data thành format phù hợp với UI
//       const transformedPosts: ExtendedForumPost[] = postsResponse.result.map(post => ({
//         ...post,
//         likes: Math.floor(Math.random() * 10), // Fake likes cho demo
//         liked: false,
//         comments: [], // Fake comments cho demo - có thể thêm API riêng cho comments
//         avatarUrl: post.author.userDetail.avatarURL // Thêm avatarUrl để tương thích với ForumDetail
//       }));

//       setPosts(transformedPosts);
//       setFilteredPosts(transformedPosts);
//     }
//   }, [postsResponse]);

//   // --------------------------------------------
//   // 2) Tìm kiếm (filter)
//   // --------------------------------------------
//   useEffect(() => {
//     if (!searchText.trim()) {
//       setFilteredPosts(posts);
//       return;
//     }
//     const txt = searchText.trim().toLowerCase();
//     const filtered = posts.filter(
//       (p) =>
//         p.title.toLowerCase().includes(txt) ||
//         p.content.toLowerCase().includes(txt) ||
//         p.topic.toLowerCase().includes(txt)
//     );
//     setFilteredPosts(filtered);
//   }, [searchText, posts]);

//   // --------------------------------------------
//   // 3) Tạo bài mới
//   // --------------------------------------------
//   const handleCreatePost = async (data: { content: string }) => {
//     try {
//       // Extract title from content hoặc để trống
//       const tempDiv = document.createElement('div');
//       tempDiv.innerHTML = data.content;
//       const textContent = tempDiv.textContent || '';
//       const title = textContent.substring(0, 100) || 'Bài viết mới';

//       await createPostMutation.mutateAsync({
//         title,
//         content: data.content,
//         topic: 'Other' // Default topic
//       });

//       // Refresh data
//       refetch();
//       setShowCreate(false);

//       // Show success message
//       alert('Tạo bài viết thành công!');
//     } catch (error) {
//       console.error('Error creating post:', error);
//       alert('Có lỗi xảy ra khi tạo bài viết');
//     }
//   };

//   // --------------------------------------------
//   // 4) Toggle like cho post (fake - cần API thật)
//   // --------------------------------------------
//   const toggleLikePost = (p: ExtendedForumPost) => {
//     const updated = {
//       ...p,
//       liked: !p.liked,
//       likes: p.likes + (p.liked ? -1 : 1)
//     };
//     setPosts((prev) => prev.map((x) => (x.id === p.id ? updated : x)));
//     setFilteredPosts((prev) => prev.map((x) => (x.id === p.id ? updated : x)));
//     if (selectedPost && selectedPost.id === p.id) {
//       setSelectedPost(updated);
//     }
//   };

//   // --------------------------------------------
//   // 5) Edit post
//   // --------------------------------------------
//   const handleEditPost = (postId: number) => {
//     const post = posts.find((p) => p.id === postId);
//     if (post) {
//       setEditingPostId(postId.toString());
//       setEditingPostText(post.content);
//       setMenuOpenId(null);
//     }
//   };

//   const saveEditedPost = async (postId: string) => {
//     try {
//       await updatePostMutation.mutateAsync({
//         id: parseInt(postId),
//         data: {
//           content: editingPostText
//         }
//       });

//       // Refresh data
//       refetch();
//       setEditingPostId(null);
//       setEditingPostText('');

//       alert('Cập nhật bài viết thành công!');
//     } catch (error) {
//       console.error('Error updating post:', error);
//       alert('Có lỗi xảy ra khi cập nhật bài viết');
//     }
//   };

//   // --------------------------------------------
//   // 6) Delete post
//   // --------------------------------------------
//   const handleDeletePost = async (postId: string) => {
//     try {
//       await deletePostMutation.mutateAsync(parseInt(postId));

//       // Refresh data
//       refetch();

//       // If deleted post is currently selected, go back to list
//       if (selectedPost && selectedPost.id.toString() === postId) {
//         setSelectedPost(null);
//       }

//       alert('Xóa bài viết thành công!');
//     } catch (error) {
//       console.error('Error deleting post:', error);
//       alert('Có lỗi xảy ra khi xóa bài viết');
//     }
//   };

//   // --------------------------------------------
//   // Handle delete modal
//   // --------------------------------------------
//   const handleDeleteClick = (postId: number) => {
//     setDeleteModal({ isOpen: true, postId: postId.toString() });
//     setMenuOpenId(null);
//   };

//   const handleDeleteConfirm = () => {
//     handleDeletePost(deleteModal.postId);
//     setDeleteModal({ isOpen: false, postId: '' });
//   };

//   // --------------------------------------------
//   // Handle post click (tăng view)
//   // --------------------------------------------
//   const handlePostClick = (post: ExtendedForumPost) => {
//     // Tăng view count
//     incrementViewMutation.mutate(post.id);
//     setSelectedPost(post);
//   };

//   // --------------------------------------------
//   // Giao diện Home (danh sách bài + search + modal)
//   // --------------------------------------------
//   const renderHome = () => {
//     if (isLoading) {
//       return (
//         <div
//           className="relative flex min-h-screen items-center justify-center overflow-x-hidden"
//           style={{
//             backgroundImage:
//               'url(https://24hstore.vn/upload_images/images/hinh-nen-mau-tim/Hinh-nen-mau-tim-dam-1.jpg)',
//             backgroundSize: 'cover',
//             backgroundPosition: 'center',
//             backgroundAttachment: 'fixed'
//           }}
//         >
//           <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
//           <div className="relative z-10">
//             <span className="text-xl font-medium text-white">
//               Đang tải bài viết…
//             </span>
//           </div>
//         </div>
//       );
//     }

//     if (error) {
//       return (
//         <div
//           className="relative flex min-h-screen items-center justify-center overflow-x-hidden"
//           style={{
//             backgroundImage:
//               'url(https://24hstore.vn/upload_images/images/hinh-nen-mau-tim/Hinh-nen-mau-tim-dam-1.jpg)',
//             backgroundSize: 'cover',
//             backgroundPosition: 'center',
//             backgroundAttachment: 'fixed'
//           }}
//         >
//           <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
//           <div className="relative z-10 text-center">
//             <span className="text-xl font-medium text-white mb-4 block">
//               Có lỗi xảy ra khi tải dữ liệu
//             </span>
//             <button
//               onClick={() => refetch()}
//               className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg"
//             >
//               Thử lại
//             </button>
//           </div>
//         </div>
//       );
//     }

//     return (
//       <BasePages pageHead="ClickFlow - Diễn đàn ">
//         <div
//           className="relative min-h-screen"
//           style={{
//             backgroundImage:
//               'url(https://24hstore.vn/upload_images/images/hinh-nen-mau-tim/Hinh-nen-mau-tim-dam-1.jpg)',
//             backgroundSize: 'cover',
//             backgroundPosition: 'center',
//             backgroundAttachment: 'fixed'
//           }}
//         >
//           <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />

//           <div className="relative z-10 space-y-6 px-4 py-6 pb-40">
//             {/* Header với Search + nút tạo bài */}
//             <motion.div
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
//             >
//               <h1 className="text-4xl font-bold text-white drop-shadow-lg">
//                 Diễn đàn
//               </h1>

//               <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
//                 <div className="relative w-full sm:w-64">
//                   <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 transform text-purple-400" />
//                   <input
//                     ref={searchRef}
//                     type="text"
//                     value={searchText}
//                     onChange={(e) => setSearchText(e.target.value)}
//                     placeholder="Tìm kiếm..."
//                     className="w-full rounded-xl border border-purple-200 bg-white/90 py-3 pl-10 pr-4 text-sm placeholder-purple-400 shadow-lg backdrop-blur-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
//                   />
//                 </div>

//                 <motion.button
//                   onClick={() => setShowCreate(true)}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:from-purple-600 hover:to-pink-600 hover:shadow-xl"
//                 >
//                   <FaPlus className="text-base" />
//                   <span>Tạo bài</span>
//                 </motion.button>
//               </div>
//             </motion.div>

//             {/* Modal tạo bài */}
//             <CreatePostModal
//               isOpen={showCreate}
//               onClose={() => setShowCreate(false)}
//               onSubmit={handleCreatePost}
//             />

//             {/* Danh sách bài viết */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.2 }}
//               className="grid grid-cols-1 gap-6"
//             >
//               {filteredPosts.length === 0 ? (
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   className="rounded-3xl border border-white/50 bg-white/90 py-16 text-center shadow-xl backdrop-blur-sm"
//                 >
//                   <div className="mb-4 text-6xl">📝</div>
//                   <h3 className="mb-2 text-xl font-semibold text-gray-700">
//                     Không tìm thấy bài viết
//                   </h3>
//                   <p className="text-gray-500">
//                     Hãy thử tìm kiếm với từ khóa khác hoặc tạo bài viết mới!
//                   </p>
//                 </motion.div>
//               ) : (
//                 filteredPosts.map((p, index) => {
//                   // Truncate HTML content for preview
//                   const preview =
//                     p.content.length > 300
//                       ? p.content.substring(0, 300) + '...'
//                       : p.content;

//                   return (
//                     <motion.div
//                       key={p.id}
//                       initial={{ opacity: 0, y: 30 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: index * 0.1, duration: 0.4 }}
//                       whileHover={{ scale: 1.01, y: -2 }}
//                       className="transform cursor-pointer rounded-3xl border border-white/50 bg-white/95 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl"
//                     >
//                       <div className="mb-4 flex items-center">
//                         <motion.img
//                           whileHover={{ scale: 1.1, rotate: 5 }}
//                           src={p.author.userDetail.avatarURL}
//                           alt={p.author.fullName}
//                           className="border-3 mr-3 h-12 w-12 rounded-full border-purple-400 object-cover shadow-lg"
//                         />
//                         <div
//                           onClick={() => handlePostClick(p)}
//                           className="flex-1"
//                         >
//                           <div className="text-base font-bold text-gray-900">
//                             {p.author.fullName}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             {formatTimeAgo(new Date(p.createdAt).getTime())}
//                           </div>
//                         </div>

//                         {/* Menu cho bài của user hiện tại */}
//                         {p.author.email === 'admin@email.com' && ( // Thay bằng email user hiện tại
//                           <div
//                             className="relative"
//                             onClick={(e) => e.stopPropagation()}
//                           >
//                             <motion.button
//                               whileHover={{ scale: 1.1 }}
//                               whileTap={{ scale: 0.9 }}
//                               onClick={() =>
//                                 setMenuOpenId((prev) =>
//                                   prev === p.id.toString() ? null : p.id.toString()
//                                 )
//                               }
//                               className="rounded-full p-2 transition-colors hover:bg-purple-100/50"
//                             >
//                               <FaEllipsisH className="text-gray-500" />
//                             </motion.button>
//                             <AnimatePresence>
//                               {menuOpenId === p.id.toString() && (
//                                 <motion.div
//                                   initial={{ opacity: 0, scale: 0.9, y: -10 }}
//                                   animate={{ opacity: 1, scale: 1, y: 0 }}
//                                   exit={{ opacity: 0, scale: 0.9, y: -10 }}
//                                   className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-xl border border-purple-200 bg-white/95 shadow-xl backdrop-blur-sm"
//                                 >
//                                   <div className="py-2">
//                                     <div
//                                       onClick={() => handleEditPost(p.id)}
//                                       className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
//                                     >
//                                       Chỉnh sửa
//                                     </div>
//                                     <div
//                                       onClick={() => handleDeleteClick(p.id)}
//                                       className="text-red-600 hover:bg-red-50 cursor-pointer px-4 py-2 text-sm"
//                                     >
//                                       Xóa
//                                     </div>
//                                   </div>
//                                 </motion.div>
//                               )}
//                             </AnimatePresence>
//                           </div>
//                         )}
//                       </div>

//                       {/* Content hoặc RichTextEditor nếu đang edit */}
//                       {editingPostId === p.id.toString() ? (
//                         <div
//                           className="mb-4"
//                           onClick={(e) => e.stopPropagation()}
//                         >
//                           <RichTextEditor
//                             value={editingPostText}
//                             onChange={setEditingPostText}
//                             placeholder="Chỉnh sửa nội dung..."
//                             height={200}
//                             className="mb-3"
//                           />
//                           <div className="flex justify-end space-x-2">
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 setEditingPostId(null);
//                                 setEditingPostText('');
//                               }}
//                               className="rounded-lg border border-gray-300 px-3 py-1 text-xs text-gray-700 transition hover:bg-gray-100"
//                             >
//                               Hủy
//                             </button>
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 saveEditedPost(p.id.toString());
//                               }}
//                               className="transform rounded-lg bg-purple-500 px-3 py-1 text-xs text-white transition hover:scale-105 hover:bg-purple-600"
//                             >
//                               Lưu
//                             </button>
//                           </div>
//                         </div>
//                       ) : (
//                         <div onClick={() => handlePostClick(p)}>
//                           {/* Title */}
//                           {p.title && (
//                             <h3 className="text-lg font-semibold text-gray-800 mb-2">
//                               {p.title}
//                             </h3>
//                           )}

//                           {/* Content */}
//                           <div
//                             className="prose prose-purple mb-4 max-w-none leading-relaxed text-gray-700 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
//                             dangerouslySetInnerHTML={{ __html: preview }}
//                           />

//                           {/* Topic tag */}
//                           <div className="mb-3">
//                             <span className="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
//                               {p.topic}
//                             </span>
//                           </div>
//                         </div>
//                       )}

//                       <div className="flex items-center justify-between text-gray-600">
//                         <div className="flex items-center space-x-6">
//                           <LikeButton
//                             liked={p.liked}
//                             likes={p.likes}
//                             onToggle={() => toggleLikePost(p)}
//                             size="md"
//                           />

//                           <div
//                             className="flex cursor-pointer items-center space-x-2 transition-colors hover:text-purple-500"
//                             onClick={() => handlePostClick(p)}
//                           >
//                             <FaComment className="text-lg" />
//                             <span className="font-medium">
//                               {formatCommentCount(p.feedbackNumber)}
//                             </span>
//                           </div>

//                           <div className="flex items-center space-x-2 text-sm text-gray-500">
//                             <span>👁️</span>
//                             <span>{p.view} lượt xem</span>
//                           </div>
//                         </div>
//                       </div>
//                     </motion.div>
//                   );
//                 })
//               )}
//             </motion.div>

//             {/* Modal xác nhận xóa */}
//             <ConfirmModal
//               isOpen={deleteModal.isOpen}
//               onClose={() => setDeleteModal({ isOpen: false, postId: '' })}
//               onConfirm={handleDeleteConfirm}
//               title="Xóa bài viết"
//               message="Bạn có chắc chắn muốn xóa bài viết này? Tất cả bình luận cũng sẽ bị xóa."
//               confirmText="Xóa"
//               cancelText="Hủy"
//               type="danger"
//             />
//           </div>
//         </div>
//       </BasePages>
//     );
//   };

//   // --------------------------------------------
//   // Nếu đã chọn 1 post → show ForumDetail, ngược lại render Home
//   // --------------------------------------------
//   return selectedPost ? (
//     <ForumDetail
//       post={selectedPost}
//       onBack={() => setSelectedPost(null)}
//       toggleLikePost={toggleLikePost}
//       updatePost={(updated: ExtendedForumPost) => {
//         setPosts((prev) =>
//           prev.map((x) => (x.id === updated.id ? updated : x))
//         );
//         setFilteredPosts((prev) =>
//           prev.map((x) => (x.id === updated.id ? updated : x))
//         );
//         setSelectedPost(updated);
//       }}
//     />
//   ) : (
//     renderHome()
//   );
// }
