import { useState, useEffect, useRef } from 'react';
import { Bell, Check, CheckCheck, ExternalLink, Trash2 } from 'lucide-react';

interface Notification {
  id: number;
  title: string;
  content: string;
  time: string;
  isRead: boolean;
  type: 'news' | 'alert' | 'update' | 'message';
  link?: string;
}

interface NotificationBellProps {
  initialNotifications?: Notification[];
  showBadge?: boolean;
  position?: 'left' | 'right';
  theme?: 'light' | 'dark';
  maxHeight?: number;
  onViewAll?: () => void;
}

export default function EnhancedNotificationBell({
  initialNotifications = [],
  showBadge = true,
  position = 'right',
  theme = 'light',
  maxHeight = 400,
  onViewAll
}: NotificationBellProps) {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [animateNotification, setAnimateNotification] = useState<number | null>(
    null
  );
  const notificationRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  // Lọc thông báo dựa theo loại
  const filteredNotifications =
    filterType === 'all'
      ? notifications
      : notifications.filter(
          (notification) => notification.type === filterType
        );

  // Demo data
  useEffect(() => {
    if (initialNotifications.length === 0) {
      setIsLoading(true);
      // Giả lập API call
      setTimeout(() => {
        const demoNotifications: Notification[] = [
          {
            id: 1,
            title: 'Tính năng mới: A/B Testing',
            content:
              'Chúng tôi vừa ra mắt tính năng A/B Testing để tối ưu hóa chiến dịch của bạn.',
            time: '10 phút trước',
            isRead: false,
            type: 'news',
            link: '/features/ab-testing'
          },
          {
            id: 2,
            title: 'Giảm giá 20% cho gói Premium',
            content:
              'Chương trình giảm giá đặc biệt cho người dùng nâng cấp lên gói Premium trong tháng này.',
            time: '2 giờ trước',
            isRead: false,
            type: 'alert'
          },
          {
            id: 3,
            title: 'Bảo trì hệ thống',
            content:
              'Hệ thống sẽ bảo trì vào ngày 22/05/2025 từ 2h-4h sáng. Xin lỗi vì sự bất tiện này.',
            time: '1 ngày trước',
            isRead: true,
            type: 'update'
          },
          {
            id: 4,
            title: 'Báo cáo hiệu suất tháng 4',
            content:
              'Báo cáo hiệu suất chiến dịch của bạn trong tháng 4 đã sẵn sàng để xem.',
            time: '3 ngày trước',
            isRead: true,
            type: 'news',
            link: '/reports/april-2025'
          },
          {
            id: 5,
            title: 'Tin nhắn mới từ Hỗ trợ',
            content:
              'Bạn có tin nhắn mới từ đội ngũ hỗ trợ về vấn đề bạn đã báo cáo gần đây.',
            time: '5 ngày trước',
            isRead: false,
            type: 'message',
            link: '/messages/support'
          }
        ];
        setNotifications(demoNotifications);
        setIsLoading(false);
      }, 1000);
    }
  }, [initialNotifications]);

  // Hook để đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node) &&
        bellRef.current &&
        !bellRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notificationRef]);

  // Đánh dấu tất cả là đã đọc
  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isRead: true
      }))
    );
  };

  // Đánh dấu một thông báo là đã đọc
  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  // Xoá một thông báo
  const removeNotification = (id: number) => {
    setAnimateNotification(id);

    // Chờ hiệu ứng kết thúc rồi mới xóa
    setTimeout(() => {
      setNotifications(
        notifications.filter((notification) => notification.id !== id)
      );
      setAnimateNotification(null);
    }, 300);
  };

  // Xử lý sự kiện click vào thông báo
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    // Xử lý link nếu có
    if (notification.link) {
      // Trong thực tế, bạn sẽ dùng router để chuyển trang
      // navigate(notification.link);
    }
  };

  // Icon màu cho từng loại thông báo
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'news':
        return (
          <div className="bg-blue-100 flex h-9 w-9 items-center justify-center rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="text-blue-500 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
        );
      case 'alert':
        return (
          <div className="bg-red-100 flex h-9 w-9 items-center justify-center rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="text-red-500 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
      case 'update':
        return (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
        );
      case 'message':
        return (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-purple-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
    }
  };

  const addNewNotification = () => {
    const newId = Math.max(0, ...notifications.map((n) => n.id)) + 1;
    const newNotification: Notification = {
      id: newId,
      title: 'Thông báo mới',
      content: 'Đây là một thông báo mới được thêm vào.',
      time: 'Vừa xong',
      isRead: false,
      type: 'news'
    };

    setNotifications([newNotification, ...notifications]);
  };

  // Xác định theme cho component
  const themeClasses =
    theme === 'dark'
      ? 'bg-gray-800 text-white border-gray-700'
      : 'bg-white text-gray-900 border-gray-200';

  const buttonTheme =
    theme === 'dark'
      ? 'bg-gray-700 text-white hover:bg-gray-600'
      : 'bg-purple-800 text-white hover:bg-purple-700';

  return (
    <div className="relative" ref={notificationRef}>
      {/* Nút chuông thông báo */}
      <button
        ref={bellRef}
        onClick={() => setShowNotifications(!showNotifications)}
        className={`relative rounded-full p-2 focus:outline-none ${buttonTheme}`}
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6" />

        {/* Hiển thị số thông báo chưa đọc */}
        {showBadge && unreadCount > 0 && (
          <span className="bg-red-500 absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white ring-2 ring-white dark:ring-gray-800">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown hiển thị thông báo */}
      {showNotifications && (
        <div
          className={`absolute ${position === 'right' ? 'right-0' : 'left-0'} mt-2 w-80 overflow-hidden rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 md:w-96 ${themeClasses} z-50`}
          style={{ maxHeight: `${maxHeight}px` }}
        >
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h3
              className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
            >
              Thông báo
            </h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className={`text-sm font-medium ${theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-800'}`}
                >
                  <CheckCheck className="h-5 w-5" />
                </button>
              )}
              <button
                onClick={addNewNotification}
                className={`text-sm font-medium ${theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-800'}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Filter bar */}
          <div
            className={`flex border-b px-2 py-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <button
              onClick={() => setFilterType('all')}
              className={`flex-1 rounded-md px-2 py-1 text-xs font-medium ${
                filterType === 'all'
                  ? theme === 'dark'
                    ? 'bg-gray-700 text-white'
                    : 'bg-purple-100 text-purple-800'
                  : theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterType('news')}
              className={`flex-1 rounded-md px-2 py-1 text-xs font-medium ${
                filterType === 'news'
                  ? theme === 'dark'
                    ? 'bg-gray-700 text-white'
                    : 'bg-blue-100 text-blue-800'
                  : theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              Tin tức
            </button>
            <button
              onClick={() => setFilterType('alert')}
              className={`flex-1 rounded-md px-2 py-1 text-xs font-medium ${
                filterType === 'alert'
                  ? theme === 'dark'
                    ? 'bg-gray-700 text-white'
                    : 'bg-red-100 text-red-800'
                  : theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              Cảnh báo
            </button>
            <button
              onClick={() => setFilterType('update')}
              className={`flex-1 rounded-md px-2 py-1 text-xs font-medium ${
                filterType === 'update'
                  ? theme === 'dark'
                    ? 'bg-gray-700 text-white'
                    : 'bg-green-100 text-green-800'
                  : theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              Cập nhật
            </button>
            <button
              onClick={() => setFilterType('message')}
              className={`flex-1 rounded-md px-2 py-1 text-xs font-medium ${
                filterType === 'message'
                  ? theme === 'dark'
                    ? 'bg-gray-700 text-white'
                    : 'bg-purple-100 text-purple-800'
                  : theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              Tin nhắn
            </button>
          </div>

          <div
            className="max-h-80 overflow-y-auto"
            style={{ maxHeight: `${maxHeight - 120}px` }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-purple-600"></div>
              </div>
            ) : filteredNotifications.length > 0 ? (
              <div className="divide-y">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start space-x-3 px-4 py-3 transition-all duration-300 ${
                      animateNotification === notification.id
                        ? 'translate-x-full transform opacity-0'
                        : 'opacity-100'
                    } ${
                      notification.isRead
                        ? theme === 'dark'
                          ? 'bg-gray-800'
                          : 'bg-white'
                        : theme === 'dark'
                          ? 'bg-gray-900'
                          : 'bg-purple-50'
                    } ${
                      notification.link
                        ? 'cursor-pointer hover:bg-purple-50 dark:hover:bg-gray-700'
                        : ''
                    }`}
                    onClick={() =>
                      notification.link && handleNotificationClick(notification)
                    }
                  >
                    {getTypeIcon(notification.type)}

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-sm font-medium ${
                            notification.isRead
                              ? theme === 'dark'
                                ? 'text-gray-200'
                                : 'text-gray-900'
                              : theme === 'dark'
                                ? 'font-semibold text-white'
                                : 'text-purple-900'
                          }`}
                        >
                          {notification.title}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                          className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p
                        className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                      >
                        {notification.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}
                        >
                          {notification.time}
                        </span>
                        <div className="flex space-x-1">
                          {!notification.isRead && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className={`flex items-center text-xs font-medium ${
                                theme === 'dark'
                                  ? 'text-purple-400 hover:text-purple-300'
                                  : 'text-purple-600 hover:text-purple-800'
                              }`}
                            >
                              <Check className="mr-1 h-3 w-3" />
                              <span>Đã đọc</span>
                            </button>
                          )}
                          {notification.link && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // navigate(notification.link);
                              }}
                              className={`ml-2 flex items-center text-xs font-medium ${
                                theme === 'dark'
                                  ? 'text-blue-400 hover:text-blue-300'
                                  : 'text-blue-600 hover:text-blue-800'
                              }`}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={`py-12 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`mx-auto h-12 w-12 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h3
                  className={`mt-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}
                >
                  {filterType === 'all'
                    ? 'Không có thông báo'
                    : `Không có thông báo ${
                        filterType === 'news'
                          ? 'tin tức'
                          : filterType === 'alert'
                            ? 'cảnh báo'
                            : filterType === 'update'
                              ? 'cập nhật'
                              : 'tin nhắn'
                      }`}
                </h3>
                <p
                  className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                >
                  {filterType === 'all'
                    ? 'Các thông báo mới sẽ xuất hiện ở đây.'
                    : 'Hãy chọn loại thông báo khác để xem.'}
                </p>
              </div>
            )}
          </div>

          {filteredNotifications.length > 0 && (
            <div
              className={`border-t px-4 py-3 text-center ${theme === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}
            >
              <button
                onClick={onViewAll}
                className={`text-sm font-medium ${theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-800'}`}
              >
                Xem tất cả thông báo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
