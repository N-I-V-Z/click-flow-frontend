import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button as ShadcnButton } from '@/components/ui/button';
import { useRouter } from '@/routes/hooks';
import {
  useGetUserDetail,
  useCreateUpdateUserDetail
} from '@/queries/user.query';
import { useUploadImage } from '@/queries/campaign.query';
import { Wallet, KeySquare, Edit3, Camera } from 'lucide-react';
import BasePages from '@/components/shared/base-pages';
import helpers from '@/helpers';
import __helpers from '@/helpers';
import { TokenDecoded, ApiResponse, UploadImageResponse } from '@/types';
import { Form, Input, Select, Button, Modal } from 'antd';
import { toast } from 'react-toastify';
import { useState } from 'react';

const decodedToken: TokenDecoded | null = helpers.decodeTokens(
  __helpers.cookie_get('AT')
);
const publisherId =
  decodedToken?.Id !== undefined ? parseInt(decodedToken.Id) : 0;

const PublisherProfile = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [isEditInfoModalOpen, setIsEditInfoModalOpen] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Fetch user data
  const { data, isLoading, error, refetch } = useGetUserDetail(publisherId);
  const user = data?.result;

  // Upload image mutation
  const { mutate: uploadImageMutation } = useUploadImage();

  // Create/Update user detail mutation
  const { mutate: createUpdateUserDetail, isPending: isCreating } =
    useCreateUpdateUserDetail();

  // Check if we need to show the form
  // Show form when: not loading AND (has error OR no user data)
  const needsUserDetailForm = !isLoading && (error || !user);

  // Handle form submission
  const handleFormSubmit = (values: {
    dateOfBirth: string;
    gender: string;
    address?: string;
  }) => {
    // Generate avatar URL from user's name
    const userName = decodedToken?.Name || 'User';
    const avatarURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=8B5CF6&color=ffffff&size=200`;

    // Convert date string to ISO format
    const dateOfBirthISO = new Date(values.dateOfBirth).toISOString();

    const payload = {
      dateOfBirth: dateOfBirthISO,
      gender: values.gender,
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

  // Handle edit modal for personal info
  const handleEditInfoClick = () => {
    if (!user) return;

    setIsEditInfoModalOpen(true);
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

    // Use original gender value from userDetail (Male/Female/Other) not the converted display text
    const originalGender = user.user?.userDetail?.gender || user.gender;

    editForm.setFieldsValue({
      dateOfBirth: userDate,
      gender: originalGender, // Use original API value, not converted display text
      address: user.address === 'Trống' ? '' : user.address
    });
  };

  // Handle cancel for info edit modal
  const handleEditInfoCancel = () => {
    setIsEditInfoModalOpen(false);
    editForm.resetFields();
  };

  const handleEditSubmit = (values: {
    dateOfBirth: string;
    gender: string;
    address?: string;
  }) => {
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
      gender: values.gender,
      avatarURL: user?.avatarURL || '', // Keep existing avatar
      address: values.address?.trim() || 'Trống'
    };

    createUpdateUserDetail(payload, {
      onSuccess: () => {
        toast.success('Thông tin đã được cập nhật thành công!', {
          autoClose: 3000
        });
        setIsEditInfoModalOpen(false);
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
          gender: user?.user?.userDetail?.gender || user?.gender || 'Male',
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

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div
          className="h-20 w-20 animate-pulse rounded-full border-4"
          style={{ borderColor: '#E5E7EB', borderTopColor: '#8B5CF6' }}
        ></div>
      </div>
    );
  }

  // Show form modal if user detail doesn't exist or has specific error
  if (needsUserDetailForm && !isLoading) {
    return (
      <BasePages pageHead="ClickFlow - Hoàn thành hồ sơ">
        <div
          className="flex min-h-screen items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #EDE9FE 0%, #F3E8FF 100%)'
          }}
        >
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
            <h2
              className="mb-6 text-center text-2xl font-bold"
              style={{ color: '#6B46C1' }}
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
                  <Select.Option value="Male">Nam</Select.Option>
                  <Select.Option value="Female">Nữ</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="Địa chỉ" name="address">
                <Input placeholder="Nhập địa chỉ (để trống nếu không có)" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="h-12 w-full border-none text-white"
                  style={{ backgroundColor: '#8B5CF6' }}
                  loading={isCreating}
                >
                  Hoàn thành
                </Button>
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
      <div className="flex h-screen items-center justify-center bg-white text-gray-800">
        <div className="text-center">
          <h3 className="text-2xl font-bold">Unexpected error occurred</h3>
          <ShadcnButton
            className="mt-4 rounded-md border border-none text-white hover:opacity-80"
            style={{ backgroundColor: '#8B5CF6' }}
            onClick={() => router.reload()}
          >
            Retry
          </ShadcnButton>
        </div>
      </div>
    );
  }

  // Final safety check - should have user data to render profile
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-white text-gray-800">
        <div className="text-center">
          <h3 className="text-2xl font-bold">No user data available</h3>
          <ShadcnButton
            className="mt-4 rounded-md border border-none text-white hover:opacity-80"
            style={{ backgroundColor: '#8B5CF6' }}
            onClick={() => window.location.reload()}
          >
            Retry
          </ShadcnButton>
        </div>
      </div>
    );
  }

  return (
    <BasePages pageHead="ClickFlow - Hồ sơ">
      <div
        className="min-h-screen text-black"
        style={{
          background:
            'linear-gradient(135deg, #EDE9FE 0%, #F3E8FF 50%, #E0E7FF 100%)'
        }}
      >
        <div className="container mx-auto px-4 pt-12">
          <div className="mx-auto max-w-6xl space-y-12">
            {/* Profile Header */}
            <div className="flex flex-col items-center space-y-6 md:flex-row md:justify-between md:space-y-0">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Avatar
                    className="h-24 w-24 rounded-full"
                    style={{ boxShadow: '0 0 0 2px #8B5CF6' }}
                  >
                    <AvatarImage src={user.avatarURL} alt={user.fullName} />
                    <AvatarFallback
                      className="text-2xl font-bold text-white"
                      style={{
                        background:
                          'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)'
                      }}
                    >
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
                    style={{ border: '2px solid #8B5CF6' }}
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
                      <Camera
                        className="h-4 w-4"
                        style={{ color: '#8B5CF6' }}
                      />
                    )}
                  </button>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    {user.fullName}
                  </h2>
                  <p className="mt-1" style={{ color: '#8B5CF6' }}>
                    {user?.user.fullName}
                  </p>
                </div>
              </div>

              <div className="flex space-x-4">
                <ShadcnButton
                  className="flex items-center space-x-2 rounded-md border-none px-6 py-6 text-white hover:opacity-80"
                  style={{ backgroundColor: '#8B5CF6' }}
                  onClick={() => router.push('/publisher/wallet-publisher')}
                >
                  <Wallet className="h-5 w-5" />
                  <span>Ví cá nhân</span>
                </ShadcnButton>

                <ShadcnButton
                  className="flex items-center space-x-2 rounded-md border-none px-6 py-6 text-white hover:opacity-80"
                  style={{ backgroundColor: '#A855F7' }}
                  onClick={() => router.push('/publisher/change-password')}
                >
                  <KeySquare className="h-5 w-5" />
                  <span>Đổi mật khẩu</span>
                </ShadcnButton>
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
                    <ShadcnButton
                      size="sm"
                      className="flex items-center space-x-1 border-none text-white hover:opacity-80"
                      style={{ backgroundColor: '#8B5CF6' }}
                      onClick={handleEditInfoClick}
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Chỉnh sửa</span>
                    </ShadcnButton>
                  </div>
                </div>

                <div className="mt-8 grid gap-y-8">
                  <div className="group">
                    <p className="text-sm text-gray-500">Họ và Tên</p>
                    <p
                      className="mt-2 text-lg font-medium text-gray-800 group-hover:text-gray-600"
                      style={{ transition: 'color 0.2s' }}
                    >
                      {user?.user.fullName}
                    </p>
                  </div>

                  <div className="group">
                    <p className="text-sm text-gray-500">Ngày sinh</p>
                    <p
                      className="mt-2 text-lg font-medium text-gray-800 group-hover:text-gray-600"
                      style={{ transition: 'color 0.2s' }}
                    >
                      {new Date(user.dateOfBirth).toLocaleDateString('vi-VN')}
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
                    <p
                      className="mt-2 text-lg font-medium text-gray-800 group-hover:text-gray-600"
                      style={{ transition: 'color 0.2s' }}
                    >
                      {getGenderDisplay(user.gender)}
                    </p>
                  </div>

                  <div className="group">
                    <p className="text-sm text-gray-500">Địa chỉ</p>
                    <p
                      className="mt-2 text-lg font-medium text-gray-800 group-hover:text-gray-600"
                      style={{ transition: 'color 0.2s' }}
                    >
                      {user.address}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Edit Personal Info Modal */}
        <Modal
          title="Chỉnh sửa thông tin cá nhân"
          open={isEditInfoModalOpen}
          onCancel={handleEditInfoCancel}
          footer={null}
          centered
          width={500}
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
                <Select.Option value="Male">Nam</Select.Option>
                <Select.Option value="Female">Nữ</Select.Option>
                <Select.Option value="Other">Khác</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Địa chỉ" name="address">
              <Input placeholder="Nhập địa chỉ (để trống nếu không có)" />
            </Form.Item>

            <Form.Item className="mb-0 flex justify-end space-x-2">
              <Button onClick={handleEditInfoCancel} className="mr-2">
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isCreating}
                style={{ backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' }}
              >
                Cập nhật thông tin
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </BasePages>
  );
};

export default PublisherProfile;
