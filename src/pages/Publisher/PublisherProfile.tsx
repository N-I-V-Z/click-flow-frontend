import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useRouter } from '@/routes/hooks';
import { useGetUserDetail } from '@/queries/user.query';
import { ApiResponse, UserDetailApiResponse } from '@/types';
import { PencilLine, Wallet, KeySquare } from 'lucide-react';

const PublisherProfile = () => {
  const router = useRouter();

  // Fetch user data
  const { data, isLoading, error } = useGetUserDetail(2);
  const user = (data as ApiResponse<UserDetailApiResponse>)?.result;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="border-blue-300 border-t-blue-600 h-20 w-20 animate-pulse rounded-full border-4"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-white text-gray-800">
        <div className="text-center">
          <h3 className="text-2xl font-bold">Data not available</h3>
          <Button
            className="hover:bg-blue-50 mt-4 rounded-md border border-blue bg-white text-blue"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 text-black">
      <div className="container mx-auto px-4 pt-12">
        <div className="mx-auto max-w-6xl space-y-12">
          {/* Profile Header */}
          <div className="flex flex-col items-center space-y-6 md:flex-row md:justify-between md:space-y-0">
            <div className="flex items-center space-x-6">
              <Avatar className="ring-blue-500 h-24 w-24 rounded-full ring-2">
                <AvatarImage src={user.avatarURL} alt={user.fullName} />
                <AvatarFallback className="bg-gradient-to-br from-blue to-purple-400 text-2xl font-bold text-white">
                  {user.fullName?.charAt(0) ?? 'U'}
                </AvatarFallback>
              </Avatar>

              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  {user.fullName}
                </h2>
                <p className="text-blue-600 mt-1">Publisher</p>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                className="hover:bg-blue-700 flex items-center space-x-2 rounded-md bg-blue px-6 py-6 text-black"
                onClick={() => router.push('/publisher/wallet-publisher')}
              >
                <Wallet className="h-5 w-5" />
                <span>Ví cá nhân</span>
              </Button>

              <Button
                className="hover:bg-blue-50 flex items-center space-x-2 rounded-md border border-blue bg-white px-6 py-6 text-blue"
                onClick={() => router.push('/publisher/change-password')}
              >
                <KeySquare className="h-5 w-5" />
                <span>Đổi mật khẩu</span>
              </Button>
            </div>
          </div>

          {/* Content Area */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card className="rounded-lg border border-gray-200 bg-white p-8 shadow-md">
              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-800">
                    Thông tin cá nhân
                  </h3>
                  <Button
                    variant="ghost"
                    className="hover:bg-blue-100 hover:text-blue-600 h-10 w-10 rounded-full p-0"
                  >
                    <PencilLine className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="mt-8 grid gap-y-8">
                <div className="group">
                  <p className="text-sm text-gray-500">Họ và Tên</p>
                  <p className="group-hover:text-blue-600 mt-2 text-lg font-medium text-gray-800">
                    {user.fullName}
                  </p>
                </div>

                <div className="group">
                  <p className="text-sm text-gray-500">Ngày sinh</p>
                  <p className="group-hover:text-blue-600 mt-2 text-lg font-medium text-gray-800">
                    {new Date(user.dateOfBirth).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="rounded-lg border border-gray-200 bg-white p-8 shadow-md">
              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-800">
                    Thông tin khác
                  </h3>
                  <Button
                    variant="ghost"
                    className="hover:bg-blue-100 hover:text-blue-600 h-10 w-10 rounded-full p-0"
                  >
                    <PencilLine className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="mt-8 grid gap-y-8">
                <div className="group">
                  <p className="text-sm text-gray-500">Giới tính</p>
                  <p className="group-hover:text-blue-600 mt-2 text-lg font-medium text-gray-800">
                    {user.gender}
                  </p>
                </div>

                <div className="group">
                  <p className="text-sm text-gray-500">Địa chỉ</p>
                  <p className="group-hover:text-blue-600 mt-2 text-lg font-medium text-gray-800">
                    {user.address}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublisherProfile;
