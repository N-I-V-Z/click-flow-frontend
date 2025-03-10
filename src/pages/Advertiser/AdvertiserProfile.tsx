import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { FaUser, FaEdit } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { useRouter } from '@/routes/hooks';

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
    <div className="mt-12 flex gap-6 p-8">
      {/* Sidebar */}
      <div className="flex w-1/4 flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
        <Avatar className="mb-4 h-28 w-28 rounded-full border-4 border-gray-300">
          <AvatarImage src="https://via.placeholder.com/150" alt={user.name} />
          <AvatarFallback>
            <FaUser className="h-14 w-14 text-gray-500" />
          </AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
        <p className="text-sm text-gray-500">{user.company}</p>
        <nav className="mt-6 w-full text-center">
          <ul className="space-y-4">
            <li className="text-blue-600 cursor-pointer font-semibold">
              Thông tin cá nhân
            </li>
            <li
              className="hover:text-blue-500 cursor-pointer text-gray-600"
              onClick={() => router.push('/advertiser/wallet')}
            >
              Ví cá nhân
            </li>
            <li
              className="hover:text-blue-500 cursor-pointer text-gray-600"
              onClick={() => router.push('/advertiser/change-password')}
            >
              Đổi mật khẩu
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Profile Content */}
      <Card className="flex-1 rounded-2xl border border-gray-200 bg-white p-8 shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            Thông tin cá nhân
          </h2>
          <Button className="bg-blue-500 hover:bg-blue-600 flex items-center gap-2 rounded-lg px-4 py-2 text-white">
            <FaEdit /> Chỉnh sửa
          </Button>
        </div>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="font-medium text-gray-600">
                  Tên đăng nhập
                </label>
                <input
                  className="rounded-lg border border-gray-300 bg-gray-100 p-2"
                  value={user.username}
                  readOnly
                />
              </div>
              <div className="flex flex-col">
                <label className="font-medium text-gray-600">Email</label>
                <input
                  className="rounded-lg border border-gray-300 bg-gray-100 p-2"
                  value={user.email}
                  readOnly
                />
              </div>
              <div className="flex flex-col">
                <label className="font-medium text-gray-600">Công ty</label>
                <input
                  className="rounded-lg border border-gray-300 bg-gray-100 p-2"
                  value={user.company}
                  readOnly
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="font-medium text-gray-600">Họ và Tên</label>
                <input
                  className="rounded-lg border border-gray-300 bg-gray-100 p-2"
                  value={user.name}
                  readOnly
                />
              </div>
              <div className="flex flex-col">
                <label className="font-medium text-gray-600">
                  Số điện thoại
                </label>
                <input
                  className="rounded-lg border border-gray-300 bg-gray-100 p-2"
                  value={user.phone}
                  readOnly
                />
              </div>
              <div className="flex flex-col">
                <label className="font-medium text-gray-600">Địa chỉ</label>
                <input
                  className="rounded-lg border border-gray-300 bg-gray-100 p-2"
                  value={user.address}
                  readOnly
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvertiserProfile;
