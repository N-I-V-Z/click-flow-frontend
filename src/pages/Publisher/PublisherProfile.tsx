import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useRouter } from '@/routes/hooks';
import { useGetUserDetail } from '@/queries/user.query';
import { Wallet, KeySquare } from 'lucide-react';
import BasePages from '@/components/shared/base-pages';
import helpers from '@/helpers';
import __helpers from '@/helpers';
import { TokenDecoded } from '@/types';

const decodedToken: TokenDecoded | null = helpers.decodeTokens(
  __helpers.cookie_get('AT')
);
const publisherId =
  decodedToken?.Id !== undefined ? parseInt(decodedToken.Id) : 0;

const PublisherProfile = () => {
  const router = useRouter();

  // Fetch user data
  const { data, isLoading, error } = useGetUserDetail(publisherId);
  const user = data?.result;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="h-20 w-20 animate-pulse rounded-full border-4 border-blue-300 border-t-blue-600"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-white text-gray-800">
        <div className="text-center">
          <h3 className="text-2xl font-bold">Data not available</h3>
          <Button
            className="border-blue text-blue mt-4 rounded-md border bg-white hover:bg-blue-50"
            onClick={() => router.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <BasePages pageHead="ClickFlow - Hồ sơ">
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 text-black">
        <div className="container mx-auto px-4 pt-12">
          <div className="mx-auto max-w-6xl space-y-12">
            {/* Profile Header */}
            <div className="flex flex-col items-center space-y-6 md:flex-row md:justify-between md:space-y-0">
              <div className="flex items-center space-x-6">
                <Avatar className="h-24 w-24 rounded-full ring-2 ring-blue-500">
                  <AvatarImage src={user.avatarURL} alt={user.fullName} />
                  <AvatarFallback className="from-blue bg-gradient-to-br to-purple-400 text-2xl font-bold text-white">
                    {user.fullName?.charAt(0) ?? 'U'}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    {user.fullName}
                  </h2>
                  <p className="mt-1 text-blue-600">{user?.user.fullName}</p>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  className="flex items-center space-x-2 rounded-md bg-blue-400 px-6 py-6 text-white hover:bg-blue-50"
                  onClick={() => router.push('/publisher/wallet-publisher')}
                >
                  <Wallet className="h-5 w-5" />
                  <span>Ví cá nhân</span>
                </Button>

                <Button
                  className="border-blue flex items-center space-x-2 rounded-md border bg-violet-400 px-6 py-6 text-white hover:bg-blue-50"
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
                  </div>
                </div>

                <div className="mt-8 grid gap-y-8">
                  <div className="group">
                    <p className="text-sm text-gray-500">Họ và Tên</p>
                    <p className="mt-2 text-lg font-medium text-gray-800 group-hover:text-blue-600">
                      {user?.user.fullName}
                    </p>
                  </div>

                  <div className="group">
                    <p className="text-sm text-gray-500">Ngày sinh</p>
                    <p className="mt-2 text-lg font-medium text-gray-800 group-hover:text-blue-600">
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
                  </div>
                </div>

                <div className="mt-8 grid gap-y-8">
                  <div className="group">
                    <p className="text-sm text-gray-500">Giới tính</p>
                    <p className="mt-2 text-lg font-medium text-gray-800 group-hover:text-blue-600">
                      {user.gender}
                    </p>
                  </div>

                  <div className="group">
                    <p className="text-sm text-gray-500">Địa chỉ</p>
                    <p className="mt-2 text-lg font-medium text-gray-800 group-hover:text-blue-600">
                      {user.address}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </BasePages>
  );
};

export default PublisherProfile;
