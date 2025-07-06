import { useState } from 'react';
import { useRouter } from '@/routes/hooks';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Wallet,
  KeySquare,
  MapPin,
  Calendar,
  User,
  Edit3,
  Camera
} from 'lucide-react';
import ChangePassword from '@/components/shared/change-password';
import {
  useGetUserDetail,
  useCreateUpdateUserDetail
} from '@/queries/user.query';
import { useUploadImage } from '@/queries/campaign.query';
import BasePages from '@/components/shared/base-pages';
import Loading from '@/components/ui/loading';
import { TokenDecoded, ApiResponse, UploadImageResponse } from '@/types';
import helpers from '@/helpers';
import __helpers from '@/helpers';
import { Form, Input, Select, Button as AntButton, Modal } from 'antd';
import { toast } from 'react-toastify';

const decodedToken: TokenDecoded | null = helpers.decodeTokens(
  __helpers.cookie_get('AT')
);
const advertiserId =
  decodedToken?.Id !== undefined ? parseInt(decodedToken.Id) : 0;

const AdvertiserProfile = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [activeSection, setActiveSection] = useState<
    'personal' | 'changePassword'
  >('personal');

  // Fetch user data
  const { data, isLoading, error, refetch } = useGetUserDetail(advertiserId);
  const user = data?.result;

  // Upload image mutation
  const { mutate: uploadImageMutation } = useUploadImage();

  // Create/Update user detail mutation
  const { mutate: createUpdateUserDetail, isPending: isCreating } =
    useCreateUpdateUserDetail();

  // Check if we need to show the form
  // Show form when: not loading AND (has error OR no user data)
  const needsUserDetailForm = !isLoading && (error || !user);

  // Convert Vietnamese gender to English
  const convertGenderToEnglish = (gender: string) => {
    switch (gender) {
      case 'Nam':
        return 'Male';
      case 'Nữ':
        return 'Female';
      case 'Khác':
        return 'Other';
      default:
        return gender; // Return as-is if already in English
    }
  };

  // Handle form submission
  const handleFormSubmit = (values: {
    dateOfBirth: string;
    gender: string;
    address?: string;
  }) => {
    // Generate avatar URL from user's name
    const userName = decodedToken?.Name || 'User';
    const avatarURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=7C3AED&color=ffffff&size=200`;

    // Convert date string to ISO format
    const dateOfBirthISO = new Date(values.dateOfBirth).toISOString();

    const payload = {
      dateOfBirth: dateOfBirthISO,
      gender: convertGenderToEnglish(values.gender),
      avatarURL: avatarURL,
      address: values.address?.trim() || 'Trống'
    };

    createUpdateUserDetail(payload, {
      onSuccess: () => {
        toast.success('Thông tin đã được cập nhật thành công!', {
          autoClose: 3000
        });
        form.resetFields();
        // Refetch user data
        window.location.reload();
      },
      onError: () => {
        toast.error('Có lỗi xảy ra khi cập nhật thông tin!', {
          autoClose: 3000
        });
      }
    });
  };

  // Handle direct avatar upload without modal
  const handleAvatarChange = (file: File) => {
    setIsUploadingAvatar(true);

    uploadImageMutation(file, {
      onSuccess: (uploadRes: ApiResponse<UploadImageResponse>) => {
        const avatarURL = uploadRes?.result?.url || '';

        if (!avatarURL) {
          toast.error('Upload ảnh thất bại!');
          setIsUploadingAvatar(false);
          return;
        }

        // Automatically update profile with new avatar using existing user data
        const payload = {
          dateOfBirth: user?.dateOfBirth
            ? new Date(user.dateOfBirth).toISOString()
            : new Date().toISOString(),
          gender: convertGenderToEnglish(user?.gender || 'Male'), // Convert to English if needed
          avatarURL: avatarURL, // Only change the avatar URL
          address: user?.address || 'Trống'
        };

        createUpdateUserDetail(payload, {
          onSuccess: () => {
            toast.success('Cập nhật avatar thành công!');
            setIsUploadingAvatar(false);
            refetch(); // Refresh user data
          },
          onError: () => {
            toast.error('Có lỗi xảy ra khi cập nhật avatar!');
            setIsUploadingAvatar(false);
          }
        });
      },
      onError: (err) => {
        console.error('Lỗi khi upload ảnh:', err);
        toast.error('Lỗi khi upload ảnh!');
        setIsUploadingAvatar(false);
      }
    });
  };

  // Handle file input change
  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn file ảnh!');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File ảnh không được vượt quá 5MB!');
        return;
      }

      handleAvatarChange(file);
    }
    // Reset input value to allow selecting the same file again
    event.target.value = '';
  };

  // Convert English gender to Vietnamese for display
  const convertGenderToVietnamese = (gender: string) => {
    switch (gender) {
      case 'Male':
        return 'Nam';
      case 'Female':
        return 'Nữ';
      case 'Other':
        return 'Khác';
      default:
        return gender;
    }
  };

  // Handle edit modal
  const handleEditClick = () => {
    if (!user) return;

    setIsEditModalOpen(true);
    // Pre-fill form with current user data
    // Convert date to YYYY-MM-DD format for HTML date input, avoiding timezone issues
    let userDate = '';
    if (user.dateOfBirth) {
      const date = new Date(user.dateOfBirth);
      // Use local date components to avoid timezone offset issues
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      userDate = `${year}-${month}-${day}`;
    }

    editForm.setFieldsValue({
      dateOfBirth: userDate,
      gender: convertGenderToVietnamese(user.gender),
      address: user.address === 'Trống' ? '' : user.address
    });
  };

  const handleEditSubmit = (values: {
    dateOfBirth: string;
    gender: string;
    address?: string;
  }) => {
    // Generate avatar URL from user's name
    const userName = decodedToken?.Name || 'User';
    const avatarURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=7C3AED&color=ffffff&size=200`;

    // Convert date string to ISO format
    let dateOfBirthISO: string;
    try {
      if (values.dateOfBirth) {
        dateOfBirthISO = new Date(values.dateOfBirth).toISOString();
      } else {
        throw new Error('Invalid date');
      }
    } catch (error) {
      toast.error('Ngày sinh không hợp lệ!', {
        autoClose: 3000
      });
      return;
    }

    // Use existing avatar URL instead of generating new one
    const payload = {
      dateOfBirth: dateOfBirthISO,
      gender: convertGenderToEnglish(values.gender),
      avatarURL: user?.avatarURL || avatarURL, // Keep existing avatar or use generated one
      address: values.address?.trim() || 'Trống'
    };

    createUpdateUserDetail(payload, {
      onSuccess: () => {
        toast.success('Thông tin đã được cập nhật thành công!', {
          autoClose: 3000
        });
        setIsEditModalOpen(false);
        editForm.resetFields();
        refetch(); // Refetch user data
      },
      onError: () => {
        toast.error('Có lỗi xảy ra khi cập nhật thông tin!', {
          autoClose: 3000
        });
      }
    });
  };

  const getGenderDisplay = (gender: string) => {
    switch (gender) {
      case 'Male':
        return 'Nam';
      case 'Female':
        return 'Nữ';
      case 'Other':
        return 'Khác';
      default:
        return gender;
    }
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    editForm.resetFields();
  };

  if (isLoading) {
    return (
      <BasePages pageHead="ClickFlow - Hồ sơ">
        <div className="flex h-screen items-center justify-center">
          <Loading />
        </div>
      </BasePages>
    );
  }

  // Show form modal if user detail doesn't exist or has specific error
  if (needsUserDetailForm && !isLoading) {
    return (
      <BasePages pageHead="ClickFlow - Hoàn thành hồ sơ">
        <div
          className="flex min-h-screen items-center justify-center pt-32"
          style={{
            background: 'linear-gradient(135deg, #F3E8FF 0%, #EDE9FE 100%)'
          }}
        >
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
            <h2
              className="mb-6 text-center text-2xl font-bold"
              style={{ color: '#7C3AED' }}
            >
              Hoàn thành thông tin cá nhân
            </h2>
            <p className="mb-6 text-center text-gray-600">
              Vui lòng điền đầy đủ thông tin bắt buộc để tiếp tục sử dụng dịch
              vụ
            </p>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleFormSubmit}
              requiredMark={false}
            >
              <Form.Item
                label="Ngày sinh"
                name="dateOfBirth"
                rules={[
                  { required: true, message: 'Vui lòng chọn ngày sinh!' }
                ]}
              >
                <Input
                  type="date"
                  className="w-full"
                  placeholder="Chọn ngày sinh"
                  max={new Date().toISOString().split('T')[0]} // Today
                  min={
                    new Date(new Date().getFullYear() - 120, 0, 1)
                      .toISOString()
                      .split('T')[0]
                  } // 120 years ago
                />
              </Form.Item>

              <Form.Item
                label="Giới tính"
                name="gender"
                rules={[
                  { required: true, message: 'Vui lòng chọn giới tính!' }
                ]}
              >
                <Select placeholder="Chọn giới tính">
                  <Select.Option value="Nam">Nam</Select.Option>
                  <Select.Option value="Nữ">Nữ</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="Địa chỉ" name="address">
                <Input placeholder="Nhập địa chỉ (để trống nếu không có)" />
              </Form.Item>

              <Form.Item>
                <AntButton
                  type="primary"
                  htmlType="submit"
                  className="h-12 w-full border-none text-white"
                  style={{ backgroundColor: '#7C3AED' }}
                  loading={isCreating}
                >
                  Hoàn thành
                </AntButton>
              </Form.Item>
            </Form>
          </div>
        </div>
      </BasePages>
    );
  }

  // Show error page only for unexpected errors (not user detail missing)
  if (error && !needsUserDetailForm && !isLoading) {
    return (
      <BasePages pageHead="ClickFlow - Hồ sơ">
        <div className="flex h-screen items-center justify-center">
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
      </BasePages>
    );
  }

  // Final safety check - should have user data to render profile
  if (!user) {
    return (
      <BasePages pageHead="ClickFlow - Hồ sơ">
        <div className="flex h-screen items-center justify-center">
          <Card className="p-8 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <span className="text-2xl">😕</span>
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-800">
              Không có dữ liệu người dùng
            </h3>
            <p className="mb-4 text-gray-600">Vui lòng thử lại sau</p>
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => window.location.reload()}
            >
              Thử lại
            </Button>
          </Card>
        </div>
      </BasePages>
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

                {/* Hidden file input */}
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileInputChange}
                  disabled={isUploadingAvatar}
                />

                {/* Camera button for avatar change */}
                <button
                  className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ border: '2px solid #7C3AED' }}
                  onClick={() =>
                    document.getElementById('avatar-upload')?.click()
                  }
                  title={
                    isUploadingAvatar ? 'Đang upload...' : 'Thay đổi avatar'
                  }
                  disabled={isUploadingAvatar}
                >
                  {isUploadingAvatar ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-purple-600"></div>
                  ) : (
                    <Camera className="h-4 w-4" style={{ color: '#7C3AED' }} />
                  )}
                </button>
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
                        <Button
                          className="border-white/30 bg-white/20 text-white hover:bg-white/30"
                          onClick={handleEditClick}
                        >
                          <Edit3 className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </Button>
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
                                {getGenderDisplay(user.gender)}
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
                                  'vi-VN'
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

        {/* Edit Modal */}
        <Modal
          title="Chỉnh sửa thông tin cá nhân"
          open={isEditModalOpen}
          onCancel={handleEditCancel}
          footer={null}
          destroyOnClose
        >
          <Form
            form={editForm}
            layout="vertical"
            onFinish={handleEditSubmit}
            requiredMark={false}
          >
            <Form.Item
              label="Ngày sinh"
              name="dateOfBirth"
              rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
            >
              <Input
                type="date"
                className="w-full"
                placeholder="Chọn ngày sinh"
                max={new Date().toISOString().split('T')[0]} // Today
                min={
                  new Date(new Date().getFullYear() - 120, 0, 1)
                    .toISOString()
                    .split('T')[0]
                } // 120 years ago
              />
            </Form.Item>

            <Form.Item
              label="Giới tính"
              name="gender"
              rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
            >
              <Select placeholder="Chọn giới tính">
                <Select.Option value="Nam">Nam</Select.Option>
                <Select.Option value="Nữ">Nữ</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Địa chỉ" name="address">
              <Input placeholder="Nhập địa chỉ (để trống nếu không có)" />
            </Form.Item>

            <Form.Item className="mb-0 flex justify-end">
              <div className="space-x-2">
                <AntButton onClick={handleEditCancel}>Hủy</AntButton>
                <AntButton
                  type="primary"
                  htmlType="submit"
                  style={{ backgroundColor: '#7C3AED' }}
                  loading={isCreating}
                >
                  Cập nhật
                </AntButton>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </BasePages>
  );
};

export default AdvertiserProfile;
