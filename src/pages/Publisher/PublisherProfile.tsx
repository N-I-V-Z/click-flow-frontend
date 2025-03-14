import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { FaEdit } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { useRouter } from '@/routes/hooks';
import { motion } from 'framer-motion';
import { useGetUserDetail } from '@/queries/user.query';

interface UserProfile {
  fullName: string;
  dateOfBirth: string; // hoặc Date, tùy format API
  gender: string;
  avatarURL: string;
  address: string;
}

const AdvertiserProfile: React.FC = () => {
  const router = useRouter();

  // Gọi API lấy thông tin người dùng
  const { data, isLoading, error } = useGetUserDetail(2);

  // user object (assuming `data?.result` is a single user, not an array)
  const user: UserProfile | undefined = data?.result;

  if (isLoading) {
    return <div>Loading user details...</div>;
  }

  if (error) {
    return <div>Error loading user details</div>;
  }

  if (!user) {
    return <div>No user data found.</div>;
  }

  return (
    <div className="flex flex-col items-center gap-6 p-8 pb-16">
      <div className="flex w-full max-w-6xl flex-col gap-6 md:flex-row">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col items-center rounded-3xl bg-gradient-to-r from-purple-500 to-indigo-500 p-6 text-white shadow-2xl md:w-1/4"
        >
          <Avatar className="mb-4 h-28 w-28 rounded-full border-4 border-white shadow-lg">
            <AvatarImage src={user.avatarURL} alt={user.fullName} />
            <AvatarFallback>{user.fullName?.charAt(0) ?? 'U'}</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold">{user.fullName}</h2>
          <nav className="mt-6 w-full">
            <ul className="space-y-4">
              <li
                className="cursor-pointer hover:underline"
                onClick={() => router.push('/advertiser/wallet')}
              >
                Ví cá nhân
              </li>
              <li
                className="cursor-pointer hover:underline"
                onClick={() => router.push('/advertiser/change-password')}
              >
                Đổi mật khẩu
              </li>
            </ul>
          </nav>
        </motion.div>

        {/* Main Profile Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1"
        >
          <Card className="overflow-hidden rounded-3xl border-0 bg-white shadow-2xl">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-6">
                  <div className="flex flex-col">
                    <label className="mb-1 font-medium text-gray-600">
                      Họ và Tên
                    </label>
                    <input
                      className="focus:ring-blue-300 rounded-xl border border-gray-300 bg-gray-100 p-3 focus:ring-2"
                      value={user.fullName}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 font-medium text-gray-600">
                      Ngày sinh
                    </label>
                    <input
                      className="focus:ring-blue-300 rounded-xl border border-gray-300 bg-gray-100 p-3 focus:ring-2"
                      value={new Date(user.dateOfBirth).toLocaleDateString()}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 font-medium text-gray-600">
                      Giới tính
                    </label>
                    <input
                      className="focus:ring-blue-300 rounded-xl border border-gray-300 bg-gray-100 p-3 focus:ring-2"
                      value={user.gender}
                      readOnly
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex flex-col">
                    <label className="mb-1 font-medium text-gray-600">
                      Địa chỉ
                    </label>
                    <input
                      className="focus:ring-blue-300 rounded-xl border border-gray-300 bg-gray-100 p-3 focus:ring-2"
                      value={user.address}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="relative h-20">
                <div className="absolute bottom-2 right-6">
                  <Button className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-3 text-white shadow-md transition duration-300 hover:opacity-90">
                    <FaEdit /> Chỉnh sửa
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdvertiserProfile;
