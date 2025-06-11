import { useState, useEffect } from 'react';
import {
  Camera,
  Award,
  Gift,
  Bell,
  Target,
  Users,
  TrendingUp,
  ChevronRight,
  Calendar,
  Clock,
  Check,
  Star
} from 'lucide-react';
import BasePages from '@/components/shared/base-pages';

const MissionPage = () => {
  const [activeTab, setActiveTab] = useState('missions');
  const [checkInStatus, setCheckInStatus] = useState([
    true,
    true,
    false,
    false,
    false,
    false,
    false
  ]);
  const [points, setPoints] = useState(265);
  const [streak, setStreak] = useState(2);
  const [coinAnimation, setCoinAnimation] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [currentLevel] = useState(2);
  const [progressToNextLevel] = useState(65);
  const [showOnboardingTip, setShowOnboardingTip] = useState(false);
  const [isLeaderboardVisible, setIsLeaderboardVisible] = useState(false);
  const [completedMissions, setCompletedMissions] = useState([0, 1]);
  const [showConfetti, setShowConfetti] = useState(false);

  const missions = [
    {
      icon: <Users size={24} />,
      title: 'Mời bạn bè tham gia',
      description: 'Chia sẻ link giới thiệu đến bạn bè để nhận hoa hồng.',
      points: 10,
      category: 'newbie',
      progress: 2,
      total: 5,
      completed: completedMissions.includes(0)
    },
    {
      icon: <Target size={24} />,
      title: 'Tham gia chiến dịch đầu tiên',
      description: 'Đăng ký một chiến dịch bất kỳ và tạo link tiếp thị.',
      points: 10,
      category: 'newbie',
      completed: completedMissions.includes(1)
    },
    {
      icon: <Gift size={24} />,
      title: 'Nhận hoa hồng đầu tiên',
      description: 'Có ít nhất 1 người dùng đăng ký qua link bạn tạo.',
      points: 20,
      category: 'newbie',
      completed: completedMissions.includes(2)
    },
    {
      icon: <Camera size={24} />,
      title: 'Chia sẻ trên mạng xã hội',
      description: 'Đăng link trên Facebook, TikTok và Instagram.',
      points: 15,
      category: 'advanced',
      progress: 1,
      total: 3,
      completed: completedMissions.includes(3)
    },
    {
      icon: <Award size={24} />,
      title: 'Tạo 5 chiến dịch khác nhau',
      description: 'Thử nghiệm đa dạng sản phẩm/chiến dịch.',
      points: 25,
      category: 'advanced',
      progress: 2,
      total: 5,
      completed: completedMissions.includes(4)
    },
    {
      icon: <TrendingUp size={24} />,
      title: 'Đạt 100 lượt click trong 7 ngày',
      description: 'Tăng traffic vào link giới thiệu của bạn.',
      points: 40,
      category: 'advanced',
      progress: 37,
      total: 100,
      completed: completedMissions.includes(5)
    }
  ];

  const leaderboard = [
    { avatar: '👨‍💼', name: 'Nguyễn Văn A', points: 520 },
    { avatar: '👩‍💻', name: 'Trần Thị B', points: 485 },
    { avatar: '👨‍🎓', name: 'Lê Văn C', points: 430 },
    { avatar: '👩‍🔬', name: 'Phạm Thị D', points: 385 },
    { avatar: '👨‍🚀', name: 'Võ Văn E', points: 320 },
    { avatar: '👩‍🏫', name: 'Hoàng Thị F', points: 310 },
    { avatar: '🧑‍💻', name: 'Bạn', points: 265 }
  ];

  const challenges = [
    {
      icon: <Star size={18} />,
      title: 'Review 5 sao ứng dụng',
      description: 'Đánh giá 5 sao trên App Store hoặc Google Play.',
      period: '01/05 - 31/05',
      points: 50,
      isLimited: true
    },
    {
      icon: <Award size={18} />,
      title: 'Top 10 Publisher trong tuần',
      description: 'Lọt top 10 người có thu nhập cao nhất tuần.',
      period: '06/05 - 12/05',
      points: 100,
      isLimited: true
    }
  ];

  const activityHistory = [
    {
      icon: <Check size={16} className="text-green-500" />,
      title: 'Đã hoàn thành nhiệm vụ Check-in',
      points: 10,
      date: '12/05/2025'
    },
    {
      icon: <Target size={16} className="text-blue-500" />,
      title: 'Đã hoàn thành nhiệm vụ Tham gia chiến dịch đầu tiên',
      points: 10,
      date: '11/05/2025'
    },
    {
      icon: <Users size={16} className="text-purple-500" />,
      title: 'Đã mời được 2 bạn tham gia',
      points: 10,
      date: '10/05/2025'
    },
    {
      icon: <Check size={16} className="text-green-500" />,
      title: 'Đã hoàn thành nhiệm vụ Check-in',
      points: 10,
      date: '10/05/2025'
    }
  ];

  useEffect(() => {
    // Hiển thị tip hướng dẫn sau 2 giây
    const timer = setTimeout(() => {
      setShowOnboardingTip(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleCheckIn = () => {
    const nextIndex = checkInStatus.findIndex((s) => !s);
    if (nextIndex !== -1) {
      // Cập nhật trạng thái check-in
      const newStatus = [...checkInStatus];
      newStatus[nextIndex] = true;
      setCheckInStatus(newStatus);

      // Tăng streak nếu check-in liên tục
      setStreak((prev) => prev + 1);

      // Cập nhật điểm và hiển thị animation
      setPoints((prevPoints) => prevPoints + 10);
      setCoinAnimation(true);
      setTimeout(() => setCoinAnimation(false), 1000);

      // Hiển thị thông báo
      setNotificationMessage('🎉 Check-in thành công! +10 điểm');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);

      // Hiệu ứng confetti
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  const handleCompleteMission = (index) => {
    if (!completedMissions.includes(index)) {
      // Cập nhật trạng thái nhiệm vụ
      setCompletedMissions([...completedMissions, index]);

      // Thêm điểm
      setPoints((prevPoints) => prevPoints + missions[index].points);

      // Hiển thị thông báo
      setNotificationMessage(
        `🎯 Hoàn thành nhiệm vụ! +${missions[index].points} điểm`
      );
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);

      // Hiệu ứng confetti
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  const toggleLeaderboard = () => {
    setIsLeaderboardVisible(!isLeaderboardVisible);
  };

  // Component hiệu ứng Confetti
  const Confetti = () => {
    return (
      <div className="pointer-events-none fixed inset-0 z-50">
        {Array.from({ length: 50 }).map((_, i) => {
          const size = Math.random() * 10 + 5;
          const left = Math.random() * 100;
          const animDuration = Math.random() * 3 + 2;
          const delay = Math.random() * 0.5;

          return (
            <div
              key={i}
              className="absolute top-0 rounded-full"
              style={{
                left: `${left}%`,
                width: size + 'px',
                height: size + 'px',
                backgroundColor: `hsl(${Math.random() * 360}, 80%, 60%)`,
                animation: `fall ${animDuration}s linear ${delay}s forwards`
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <BasePages pageHead="ClickFlow - Nhiệm vụ">
      <div className="to-blue-100 min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 px-4 pb-12 pt-6">
        <style>{`
          @keyframes fall {
            0% {
              transform: translateY(-20px) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(360deg);
              opacity: 0;
            }
          }
          @keyframes pulse {
            0%,
            100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }
          @keyframes slideIn {
            0% {
              transform: translateY(-20px);
              opacity: 0;
            }
            100% {
              transform: translateY(0);
              opacity: 1;
            }
          }
          @keyframes fadeIn {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }
        `}</style>

        {showConfetti && <Confetti />}

        {/* Thông báo */}
        {showNotification && (
          <div
            className="fixed left-1/2 top-6 z-50 -translate-x-1/2 transform rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-white shadow-lg"
            style={{ animation: 'fadeIn 0.3s ease-out' }}
          >
            {notificationMessage}
          </div>
        )}

        {/* Tip hướng dẫn */}
        {showOnboardingTip && (
          <div
            className="fixed bottom-6 right-6 z-40 max-w-xs rounded-xl border-l-4 border-indigo-500 bg-white p-4 shadow-lg"
            style={{ animation: 'slideIn 0.5s ease-out' }}
          >
            <div className="flex items-start">
              <div className="mr-3 text-xl">💡</div>
              <div>
                <h4 className="font-semibold text-gray-800">
                  Mẹo cho người mới
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  Hoàn thành các nhiệm vụ newbie để nhận điểm thưởng và mở khóa
                  nhiệm vụ nâng cao!
                </p>
                <button
                  onClick={() => setShowOnboardingTip(false)}
                  className="mt-2 rounded-full bg-indigo-100 px-3 py-1 text-xs text-indigo-600 transition-colors hover:bg-indigo-200"
                >
                  Đã hiểu
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-6 flex flex-col items-center justify-between md:mb-8 md:flex-row">
            <div className="mb-4 md:mb-0">
              <h1 className="flex items-center text-3xl font-bold text-indigo-700">
                🎯 Trang Nhiệm Vụ
                <span className="ml-3 rounded-full bg-indigo-600 px-2 py-1 text-xs text-white">
                  Cấp {currentLevel}
                </span>
              </h1>
              <p className="mt-1 text-gray-600">
                Hoàn thành nhiệm vụ và nhận điểm ATSP
              </p>

              {/* Progress bar to next level */}
              <div className="relative mt-2 h-2.5 w-64 rounded-full bg-gray-200">
                <div
                  className="h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  style={{ width: `${progressToNextLevel}%` }}
                ></div>
                <span className="absolute -right-6 -top-0 text-xs text-gray-600">
                  {progressToNextLevel}%
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="relative rounded-xl bg-white px-6 py-3 text-center shadow-lg">
                <p className="text-sm text-gray-500">Điểm hiện tại</p>
                <div className="relative">
                  <div
                    className={`text-2xl font-bold text-indigo-600 ${coinAnimation ? 'animate-pulse' : ''}`}
                    style={{
                      animation: coinAnimation
                        ? 'pulse 0.5s ease-in-out'
                        : 'none'
                    }}
                  >
                    {points}🪙
                  </div>
                  {coinAnimation && (
                    <div
                      className="absolute -top-4 left-1/2 -translate-x-1/2 transform text-sm font-bold text-green-500"
                      style={{ animation: 'fadeIn 0.3s ease-out' }}
                    >
                      +10
                    </div>
                  )}
                </div>
                <button
                  onClick={toggleLeaderboard}
                  className="mt-1 flex items-center justify-center gap-1 text-xs text-indigo-600 hover:text-indigo-800"
                >
                  Xếp hạng <ChevronRight size={12} />
                </button>
              </div>

              <div className="rounded-xl bg-white px-6 py-3 text-center shadow-lg">
                <p className="text-sm text-gray-500">Check-in streak</p>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-orange-500 text-2xl font-bold">
                    {streak}
                  </span>
                  <span className="text-orange-500">🔥</span>
                </div>
                <p className="text-orange-600 mt-1 text-xs">
                  Liên tục {streak} ngày
                </p>
              </div>
            </div>
          </div>

          {/* Leaderboard overlay */}
          {isLeaderboardVisible && (
            <div
              className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50"
              onClick={toggleLeaderboard}
            >
              <div
                className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-indigo-700">
                    🏆 Bảng xếp hạng
                  </h3>
                  <button
                    onClick={toggleLeaderboard}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <div className="max-h-80 space-y-3 overflow-y-auto">
                  {leaderboard.map((user, i) => (
                    <div
                      key={i}
                      className={`flex items-center rounded-lg p-3 ${user.name === 'Bạn' ? 'border border-indigo-200 bg-indigo-50' : 'hover:bg-gray-50'}`}
                    >
                      <div className="w-8 text-center font-bold text-gray-700">
                        #{i + 1}
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-xl">
                        {user.avatar}
                      </div>
                      <div className="ml-3 flex-1">
                        <span
                          className={`font-medium ${user.name === 'Bạn' ? 'text-indigo-600' : 'text-gray-800'}`}
                        >
                          {user.name}
                        </span>
                      </div>
                      <div className="font-bold text-indigo-600">
                        {user.points}🪙
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center text-sm text-gray-500">
                  Bạn đang đứng hạng #7
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="to-blue-100 sticky top-0 z-10 mb-6 flex space-x-4 bg-gradient-to-r from-indigo-100 via-purple-50 py-2">
            <button
              onClick={() => setActiveTab('missions')}
              className={`rounded-lg px-6 py-2 font-semibold transition-all ${
                activeTab === 'missions'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'border border-indigo-300 bg-white text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              Nhiệm vụ
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`rounded-lg px-6 py-2 font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'border border-indigo-300 bg-white text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              Lịch sử
            </button>
            <button
              onClick={() => setActiveTab('rewards')}
              className={`rounded-lg px-6 py-2 font-semibold transition-all ${
                activeTab === 'rewards'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'border border-indigo-300 bg-white text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              Đổi thưởng
            </button>
          </div>

          {activeTab === 'missions' && (
            <div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Missions */}
              <div className="space-y-8 md:col-span-2">
                {/* Newbie Missions */}
                <div>
                  <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-700">
                    🌱 Nhiệm vụ cho người mới
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-600">
                      Dễ hoàn thành
                    </span>
                  </h2>
                  <div className="space-y-4">
                    {missions
                      .filter((m) => m.category === 'newbie')
                      .map((mission, i) => (
                        <div
                          key={i}
                          className={`rounded-xl bg-white p-5 shadow-md transition-shadow hover:shadow-lg ${
                            mission.completed
                              ? 'border-l-4 border-green-500'
                              : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex gap-4">
                              <div
                                className={`h-12 w-12 ${mission.completed ? 'bg-green-100' : 'bg-indigo-100'} flex items-center justify-center rounded-full`}
                              >
                                {mission.completed ? (
                                  <Check className="text-green-600" size={24} />
                                ) : (
                                  mission.icon
                                )}
                              </div>
                              <div>
                                <h3 className="flex items-center font-semibold text-gray-800">
                                  {mission.title}
                                  {mission.completed && (
                                    <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-600">
                                      Hoàn thành
                                    </span>
                                  )}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {mission.description}
                                </p>

                                {/* Progress bar if applicable */}
                                {mission.progress !== undefined && (
                                  <div className="mt-2">
                                    <div className="mb-1 flex justify-between text-xs text-gray-500">
                                      <span>
                                        Tiến độ: {mission.progress}/
                                        {mission.total}
                                      </span>
                                      <span>
                                        {Math.round(
                                          (mission.progress / mission.total) *
                                            100
                                        )}
                                        %
                                      </span>
                                    </div>
                                    <div className="h-1.5 w-full rounded-full bg-gray-200">
                                      <div
                                        className="h-1.5 rounded-full bg-indigo-500"
                                        style={{
                                          width: `${(mission.progress / mission.total) * 100}%`
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="block text-lg font-bold text-indigo-600">
                                +{mission.points}
                              </span>
                              <button
                                onClick={() => handleCompleteMission(i)}
                                disabled={mission.completed}
                                className={`mt-1 rounded-full px-3 py-1 text-xs transition-colors ${
                                  mission.completed
                                    ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                                    : 'bg-indigo-500 text-white hover:bg-indigo-600'
                                }`}
                              >
                                {mission.completed
                                  ? 'Đã hoàn thành'
                                  : 'Làm ngay'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Advanced Missions */}
                <div>
                  <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-700">
                    🚀 Nhiệm vụ nâng cao
                    <span className="bg-orange-100 text-orange-600 rounded-full px-2 py-0.5 text-xs">
                      Cao cấp
                    </span>
                  </h2>
                  <div className="space-y-4">
                    {missions
                      .filter((m) => m.category === 'advanced')
                      .map((mission, i) => (
                        <div
                          key={i + 3} // Adding offset for correct indexing
                          className={`rounded-xl bg-white p-5 shadow-md transition-shadow hover:shadow-lg ${
                            mission.completed
                              ? 'border-l-4 border-green-500'
                              : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex gap-4">
                              <div
                                className={`h-12 w-12 ${mission.completed ? 'bg-green-100' : 'bg-purple-100'} flex items-center justify-center rounded-full`}
                              >
                                {mission.completed ? (
                                  <Check className="text-green-600" size={24} />
                                ) : (
                                  mission.icon
                                )}
                              </div>
                              <div>
                                <h3 className="flex items-center font-semibold text-gray-800">
                                  {mission.title}
                                  {mission.completed && (
                                    <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-600">
                                      Hoàn thành
                                    </span>
                                  )}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {mission.description}
                                </p>

                                {/* Progress bar if applicable */}
                                {mission.progress !== undefined && (
                                  <div className="mt-2">
                                    <div className="mb-1 flex justify-between text-xs text-gray-500">
                                      <span>
                                        Tiến độ: {mission.progress}/
                                        {mission.total}
                                      </span>
                                      <span>
                                        {Math.round(
                                          (mission.progress / mission.total) *
                                            100
                                        )}
                                        %
                                      </span>
                                    </div>
                                    <div className="h-1.5 w-full rounded-full bg-gray-200">
                                      <div
                                        className="h-1.5 rounded-full bg-purple-500"
                                        style={{
                                          width: `${(mission.progress / mission.total) * 100}%`
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="block text-lg font-bold text-indigo-600">
                                +{mission.points}
                              </span>
                              <button
                                onClick={() => handleCompleteMission(i + 3)} // Adding offset for correct indexing
                                disabled={mission.completed}
                                className={`mt-1 rounded-full px-3 py-1 text-xs transition-colors ${
                                  mission.completed
                                    ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                                    : 'bg-indigo-500 text-white hover:bg-indigo-600'
                                }`}
                              >
                                {mission.completed
                                  ? 'Đã hoàn thành'
                                  : 'Làm ngay'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Sidebar: Check-in + Challenges */}
              <div className="space-y-8">
                {/* Check-in */}
                <div className="overflow-hidden rounded-xl bg-white shadow-md">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
                    <h2 className="flex items-center gap-2 font-bold text-white">
                      <Calendar size={16} />
                      Check-in hàng ngày
                    </h2>
                  </div>
                  <div className="p-5">
                    <div className="mb-5 grid grid-cols-7 gap-2">
                      {checkInStatus.map((checked, i) => (
                        <div
                          key={i}
                          className={`flex aspect-square w-full items-center justify-center rounded-lg text-sm font-semibold transition-all ${
                            checked
                              ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md'
                              : 'border border-gray-200 bg-gray-100 text-gray-400'
                          }`}
                        >
                          {checked ? <Check size={16} /> : i + 1}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleCheckIn}
                      disabled={checkInStatus.every((status) => status)}
                      className={`flex w-full items-center justify-center gap-2 rounded-lg py-2.5 font-medium shadow transition-all ${
                        checkInStatus.every((status) => status)
                          ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:translate-y-px hover:shadow-lg active:translate-y-0'
                      }`}
                    >
                      <Clock size={16} />
                      {checkInStatus.every((status) => status)
                        ? 'Đã check-in đủ tuần này'
                        : 'Check in ngay +10 điểm'}
                    </button>

                    {!checkInStatus.every((status) => status) && (
                      <div className="mt-3 flex items-center justify-center gap-1 text-center text-xs text-gray-500">
                        <Bell size={12} />
                        Lần check-in tiếp theo: 23:59:59
                      </div>
                    )}
                  </div>

                  {/* Weekly rewards */}
                  {checkInStatus.filter((status) => status).length >= 3 && (
                    <div className="px-5 pb-5">
                      <div className="mt-2 border-t border-gray-100 pt-4 text-center">
                        <h3 className="mb-2 text-sm font-medium text-gray-700">
                          Phần thưởng tuần này
                        </h3>
                        <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 p-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                              <Gift size={16} className="text-purple-600" />
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-medium text-gray-800">
                                Check-in đủ 7 ngày
                              </p>
                              <p className="text-xs text-gray-500">
                                Nhận thêm 30 điểm thưởng
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="block font-bold text-indigo-600">
                              +30
                            </span>
                            <span className="text-xs text-gray-500">
                              {checkInStatus.filter((status) => status).length}
                              /7
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Challenges */}
                <div className="overflow-hidden rounded-xl bg-white shadow-md">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
                    <h2 className="flex items-center gap-2 font-bold text-white">
                      <Award size={16} />
                      Thử thách đặc biệt
                    </h2>
                  </div>
                  <div className="space-y-4 p-5">
                    {challenges.map((challenge, i) => (
                      <div
                        key={i}
                        className="rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 p-4 shadow-sm transition-shadow hover:shadow"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-200">
                            {challenge.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center">
                              <h3 className="font-semibold text-gray-800">
                                {challenge.title}
                              </h3>
                              {challenge.isLimited && (
                                <span className="bg-red-100 text-red-600 ml-2 rounded-full px-2 py-0.5 text-xs">
                                  Giới hạn
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-sm text-gray-600">
                              {challenge.description}
                            </p>
                            <div className="mt-2 flex items-center">
                              <Clock
                                size={14}
                                className="mr-1 text-indigo-600"
                              />
                              <p className="text-xs text-indigo-600">
                                {challenge.period}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="block text-lg font-bold text-indigo-600">
                              +{challenge.points}
                            </span>
                            <button className="mt-1 rounded-full bg-indigo-500 px-3 py-1 text-xs text-white transition-colors hover:bg-indigo-600">
                              Tham gia
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Badge Collection */}
                <div className="overflow-hidden rounded-xl bg-white shadow-md">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
                    <h2 className="flex items-center gap-2 font-bold text-white">
                      <Star size={16} />
                      Bộ sưu tập huy hiệu
                    </h2>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col items-center">
                        <div className="from-yellow-400 to-yellow-600 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br shadow-md">
                          <Users size={24} className="text-white" />
                        </div>
                        <p className="mt-2 text-center text-xs font-medium">
                          Người mời
                        </p>
                      </div>
                      <div className="flex flex-col items-center opacity-50">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-300">
                          <Target size={24} className="text-white" />
                        </div>
                        <p className="mt-2 text-center text-xs font-medium">
                          Chuyên gia
                        </p>
                      </div>
                      <div className="flex flex-col items-center opacity-50">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-300">
                          <TrendingUp size={24} className="text-white" />
                        </div>
                        <p className="mt-2 text-center text-xs font-medium">
                          Top 10
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <button className="mx-auto flex items-center justify-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800">
                        Xem tất cả huy hiệu <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="mb-20 rounded-xl bg-white p-6 shadow-md md:p-8">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-700">
                  <Clock size={20} />
                  Lịch sử hoạt động
                </h3>
                <div className="flex gap-2">
                  <select className="rounded-lg border border-gray-200 bg-gray-50 p-2.5 text-sm text-gray-700 focus:border-indigo-500 focus:ring-indigo-500">
                    <option value="">Tất cả hoạt động</option>
                    <option value="mission">Nhiệm vụ</option>
                    <option value="checkin">Check-in</option>
                    <option value="challenge">Thử thách</option>
                  </select>
                  <button className="rounded-lg bg-indigo-100 p-2.5 text-indigo-600 transition-colors hover:bg-indigo-200">
                    <Calendar size={20} />
                  </button>
                </div>
              </div>

              {activityHistory.length > 0 ? (
                <div className="space-y-4">
                  {activityHistory.map((activity, i) => (
                    <div key={i} className="border-b border-gray-100 pb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                          {activity.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">
                            {activity.title}
                          </h4>
                          <div className="mt-1 flex items-center text-xs text-gray-500">
                            <Clock size={12} className="mr-1" />
                            {activity.date}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-green-600">
                            +{activity.points}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                    <Clock size={32} className="text-gray-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-700">
                    Chưa có hoạt động nào
                  </h3>
                  <p className="mb-4 text-gray-500">
                    Bạn chưa có lịch sử hoạt động nào
                  </p>
                  <button
                    onClick={() => setActiveTab('missions')}
                    className="rounded-lg bg-indigo-50 px-4 py-2 font-medium text-indigo-600 transition-colors hover:bg-indigo-100"
                  >
                    Quay lại nhiệm vụ
                  </button>
                </div>
              )}

              {activityHistory.length > 0 && (
                <div className="mt-6 text-center">
                  <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                    Xem thêm hoạt động
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="mb-20 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-700">
                  🎁 Đổi điểm lấy quà
                </h2>
                <div className="flex items-center rounded-lg bg-white px-4 py-2 shadow">
                  <span className="mr-2 text-sm text-gray-500">
                    Điểm hiện có:
                  </span>
                  <span className="font-bold text-indigo-600">{points}🪙</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Reward cards */}
                <div className="overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg">
                  <div className="from-blue-500 flex h-40 items-center justify-center bg-gradient-to-r to-indigo-600">
                    <img
                      src="https://www.gamecardsvn.com/img/1678907"
                      alt="Reward 1"
                      className="h-56 w-56 object-contain"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="mb-2 font-semibold text-gray-800">
                      Thẻ nạp điện thoại 50K
                    </h3>
                    <p className="mb-4 text-sm text-gray-600">
                      Đổi điểm lấy thẻ nạp điện thoại trị giá 50.000 VNĐ
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-600">
                        500 điểm
                      </span>
                      <button
                        className={`rounded-lg px-4 py-1.5 text-sm transition-colors ${points >= 500 ? 'bg-indigo-500 text-white hover:bg-indigo-600' : 'cursor-not-allowed bg-gray-200 text-gray-400'}`}
                        disabled={points < 500}
                      >
                        {points >= 500 ? 'Đổi ngay' : 'Chưa đủ điểm'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg">
                  <div className="flex h-40 items-center justify-center bg-gradient-to-r from-green-500 to-teal-600">
                    <img
                      src="https://img.giftpop.vn/brand/GRABTRANSPORTATION/MP2102010013_BASIC_origin.jpg"
                      alt="Reward 2"
                      className="h-56 w-56 object-contain"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="mb-2 font-semibold text-gray-800">
                      Thẻ Grab 100K
                    </h3>
                    <p className="mb-4 text-sm text-gray-600">
                      Đổi điểm lấy thẻ quà tặng Grab trị giá 100.000 VNĐ
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-600">
                        1000 điểm
                      </span>
                      <button
                        className="cursor-not-allowed rounded-lg bg-gray-200 px-4 py-1.5 text-sm text-gray-400"
                        disabled
                      >
                        Chưa đủ điểm
                      </button>
                    </div>
                  </div>
                </div>

                <div className="overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg">
                  <div className="flex h-40 items-center justify-center bg-gradient-to-r from-purple-500 to-pink-600">
                    <img
                      src="https://live.staticflickr.com/65535/51564843759_682689849c_w.jpg"
                      alt="Reward 3"
                      className="h-56 w-56 object-contain"
                    />
                  </div>
                  <div className="p-5">
                    <div className="mb-2 flex items-center">
                      <h3 className="font-semibold text-gray-800">
                        Thẻ Shopee 200K
                      </h3>
                      <span className="bg-red-100 text-red-600 ml-2 rounded-full px-2 py-0.5 text-xs">
                        Hot
                      </span>
                    </div>
                    <p className="mb-4 text-sm text-gray-600">
                      Đổi điểm lấy thẻ quà tặng Shopee trị giá 200.000 VNĐ
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-600">
                        2000 điểm
                      </span>
                      <button
                        className="cursor-not-allowed rounded-lg bg-gray-200 px-4 py-1.5 text-sm text-gray-400"
                        disabled
                      >
                        Chưa đủ điểm
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-xl bg-white p-6 shadow-md">
                <h3 className="mb-4 font-semibold text-gray-800">
                  Lịch sử đổi thưởng
                </h3>
                <div className="py-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <Gift size={24} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500">
                    Bạn chưa có lịch sử đổi thưởng nào
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </BasePages>
  );
};

export default MissionPage;
