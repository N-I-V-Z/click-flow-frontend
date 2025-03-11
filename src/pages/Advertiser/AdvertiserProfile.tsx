import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { FaEdit } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { useRouter } from '@/routes/hooks';
import { motion } from 'framer-motion';

const AdvertiserProfile: React.FC = () => {
  const router = useRouter();

  const user = {
    username: 'nguyenvana',
    name: 'Nguyễn Văn A',
    phone: '0987 654 321',
    email: 'nguyenvana@example.com',
    createdAt: '01/03/2025',
    company: 'Công ty TNHH ABC',
    industry: 'Công nghệ thông tin',
    gender: 'Nam',
    dob: '01-01-1990',
    address: 'Hồ Chí Minh, Việt Nam'
  };

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
            <AvatarImage src="" alt={user.name} />
            <AvatarFallback>
              <img src="data:image/jpeg;base64,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 " />
            </AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-sm opacity-80">{user.company}</p>
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
            {/* Content */}
            <CardContent className="p-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-6">
                  <div className="flex flex-col">
                    <label className="mb-1 font-medium text-gray-600">
                      Tên đăng nhập
                    </label>
                    <input
                      className="focus:ring-blue-300 rounded-xl border border-gray-300 bg-gray-100 p-3 focus:outline-none focus:ring-2"
                      value={user.username}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 font-medium text-gray-600">
                      Email
                    </label>
                    <input
                      className="focus:ring-blue-300 rounded-xl border border-gray-300 bg-gray-100 p-3 focus:outline-none focus:ring-2"
                      value={user.email}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 font-medium text-gray-600">
                      Công ty
                    </label>
                    <input
                      className="focus:ring-blue-300 rounded-xl border border-gray-300 bg-gray-100 p-3 focus:outline-none focus:ring-2"
                      value={user.company}
                      readOnly
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex flex-col">
                    <label className="mb-1 font-medium text-gray-600">
                      Họ và Tên
                    </label>
                    <input
                      className="focus:ring-blue-300 rounded-xl border border-gray-300 bg-gray-100 p-3 focus:outline-none focus:ring-2"
                      value={user.name}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 font-medium text-gray-600">
                      Số điện thoại
                    </label>
                    <input
                      className="focus:ring-blue-300 rounded-xl border border-gray-300 bg-gray-100 p-3 focus:outline-none focus:ring-2"
                      value={user.phone}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 font-medium text-gray-600">
                      Địa chỉ
                    </label>
                    <input
                      className="focus:ring-blue-300 rounded-xl border border-gray-300 bg-gray-100 p-3 focus:outline-none focus:ring-2"
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
