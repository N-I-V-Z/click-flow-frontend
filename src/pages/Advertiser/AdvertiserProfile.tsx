import { useState } from 'react';
import { useRouter } from '@/routes/hooks';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Wallet, KeySquare, MapPin, Calendar, User } from 'lucide-react';
import ChangePassword from '@/components/shared/change-password';
import { useGetUserDetail } from '@/queries/user.query';
import BasePages from '@/components/shared/base-pages';
import Loading from '@/components/ui/loading';
import { TokenDecoded } from '@/types';
import helpers from '@/helpers';
import __helpers from '@/helpers';

const decodedToken: TokenDecoded | null = helpers.decodeTokens(
  __helpers.cookie_get('AT')
);
const advertiserId =
  decodedToken?.Id !== undefined ? parseInt(decodedToken.Id) : 0;

const AdvertiserProfile = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<
    'personal' | 'changePassword'
  >('personal');
  const { data, isLoading, error } = useGetUserDetail(advertiserId);
  const user = data?.result;
  if (isLoading) {
    return (
      <BasePages pageHead="ClickFlow - Hồ sơ">
        <div className="flex h-screen items-center justify-center">
          <Loading />
        </div>
      </BasePages>
    );
  }

  if (error || !user) {
    return (
      <div className="to-blue flex h-screen items-center justify-center bg-gradient-to-br from-slate-50">
        <Card className="p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <span className="text-2xl">😕</span>
          </div>
          <h3 className="mb-2 text-xl font-bold text-gray-800">
            Không thể tải dữ liệu
          </h3>
          <p className="mb-4 text-gray-600">Vui lòng thử lại sau</p>
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => router.reload()}
          >
            Thử lại
          </Button>
        </Card>
      </div>
    );
  }

  const quickActions = [
    {
      label: 'Ví cá nhân',
      icon: Wallet,
      color: 'from-blue-500 to-blue-600',
      action: () => router.push('/advertiser/wallet')
    },
    {
      label: 'Đổi mật khẩu',
      icon: KeySquare,
      color: 'from-purple-500 to-purple-600',
      action: () => setActiveSection('changePassword')
    }
  ];

  return (
    <BasePages pageHead="ClickFlow - Hồ sơ">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-700">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600/90"></div>
            <div className='bg-[url(&apos;data:image/svg+xml,%3Csvg width="60" height="60" viewPort="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&apos;)] absolute inset-0 opacity-20'></div>
          </div>

          <div className="relative mx-auto max-w-7xl px-6 py-16">
            <div className="flex flex-col items-center space-y-8 md:flex-row md:space-x-10 md:space-y-0">
              <div className="group relative">
                <div className="animate-tilt to-blue absolute -inset-1 rounded-full bg-gradient-to-r from-pink-300 opacity-75 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200"></div>
                <Avatar className="relative h-36 w-36 border-4 border-white shadow-2xl">
                  <AvatarImage
                    src={user.avatarURL}
                    alt={user.user.fullName}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-4xl font-bold text-white">
                    {user.fullName?.charAt(0) ?? 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col items-center md:items-start">
                  <div className="mb-2 flex items-center space-x-3">
                    <h1 className="text-4xl font-bold text-white">
                      {user.user.fullName}
                    </h1>
                  </div>
                  <div className="grid w-full max-w-2xl grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-white/30 bg-white/20 p-4 backdrop-blur-sm">
                      <div className="mb-2 flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-white" />
                        <span className="text-sm text-white">Ngày sinh</span>
                      </div>
                      <p className="font-semibold text-white">
                        {new Date(user.dateOfBirth).toLocaleDateString('vi-VN')}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/30 bg-white/20 p-4 backdrop-blur-sm">
                      <div className="mb-2 flex items-center space-x-2">
                        <User className="h-5 w-5 text-white" />
                        <span className="text-sm text-white">Giới tính</span>
                      </div>
                      <p className="font-semibold text-white">{user.gender}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto -mt-8 max-w-7xl px-6">
          <div className="mb-12 grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="group cursor-pointer border-0 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                onClick={action.action}
              >
                <div className="p-6 text-center">
                  <div
                    className={`mx-auto mb-4 h-14 w-14 rounded-2xl bg-gradient-to-r ${action.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                  >
                    <action.icon className="h-7 w-7 text-white" />
                  </div>
                  <p className="font-semibold text-gray-800 transition-colors group-hover:text-blue-600">
                    {action.label}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="mx-auto mb-6 max-w-7xl px-6">
          <div className="flex border-b border-gray-200">
            <button
              className={`-mb-px px-4 py-2 font-medium ${
                activeSection === 'personal'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveSection('personal')}
            >
              Thông tin cá nhân
            </button>
            <button
              className={`-mb-px px-4 py-2 font-medium ${
                activeSection === 'changePassword'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveSection('changePassword')}
            >
              Đổi mật khẩu
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 pb-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {activeSection === 'personal' ? (
              <>
                <div className="mb-10 lg:col-span-2">
                  <Card className="overflow-hidden border-0 shadow-xl">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white">
                          Thông tin cá nhân
                        </h2>
                      </div>
                    </div>

                    <div className="space-y-8 p-8">
                      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div className="space-y-6">
                          <div className="group">
                            <label className="text-sm font-medium uppercase tracking-wider text-gray-500">
                              Họ và Tên
                            </label>
                            <div className="mt-2 rounded-xl bg-gray-50 p-4 transition-colors group-hover:bg-blue-50">
                              <p className="text-lg font-semibold text-gray-800 group-hover:text-blue-600">
                                {user.user.fullName}
                              </p>
                            </div>
                          </div>

                          <div className="group">
                            <label className="text-sm font-medium uppercase tracking-wider text-gray-500">
                              Giới tính
                            </label>
                            <div className="mt-2 rounded-xl bg-gray-50 p-4 transition-colors group-hover:bg-blue-50">
                              <p className="text-lg font-semibold text-gray-800 group-hover:text-blue-600">
                                {user.gender}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="group">
                            <label className="text-sm font-medium uppercase tracking-wider text-gray-500">
                              Ngày sinh
                            </label>
                            <div className="mt-2 rounded-xl bg-gray-50 p-4 transition-colors group-hover:bg-blue-50">
                              <p className="text-lg font-semibold text-gray-800 group-hover:text-blue-600">
                                {new Date(user.dateOfBirth).toLocaleDateString(
                                  'vi-VN',
                                  {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="group">
                        <label className="text-sm font-medium uppercase tracking-wider text-gray-500">
                          Địa chỉ
                        </label>
                        <div className="mt-2 rounded-xl bg-gray-50 p-4 transition-colors group-hover:bg-blue-50">
                          <div className="flex items-start space-x-3">
                            <MapPin className="mt-1 h-6 w-6 text-gray-400 group-hover:text-blue-500" />
                            <p className="text-lg font-semibold leading-relaxed text-gray-800 group-hover:text-blue-600">
                              {user.address}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </>
            ) : (
              <>
                <div className="lg:col-span-4">
                  <ChangePassword />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </BasePages>
  );
};

export default AdvertiserProfile;
