import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button as ShadcnButton } from '@/components/ui/button';
import { useRouter } from '@/routes/hooks';
import {
  useGetUserDetail,
  useCreateUpdateUserDetail
} from '@/queries/user.query';
import { Wallet, KeySquare, Edit3 } from 'lucide-react';
import BasePages from '@/components/shared/base-pages';
import helpers from '@/helpers';
import __helpers from '@/helpers';
import { TokenDecoded } from '@/types';
import { Form, Input, Select, DatePicker, message, Button, Modal } from 'antd';
import moment from 'moment';
import { useState, useEffect } from 'react';

const decodedToken: TokenDecoded | null = helpers.decodeTokens(
  __helpers.cookie_get('AT')
);
const publisherId =
  decodedToken?.Id !== undefined ? parseInt(decodedToken.Id) : 0;

const PublisherProfile = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Add CSS to prevent scroll wheel on DatePicker inputs
  const datePickerStyle = `
    .ant-picker-input input {
      pointer-events: none !important;
    }
    .ant-picker-input input:focus {
      pointer-events: none !important;
    }
  `;

  // Inject CSS style
  if (!document.getElementById('datepicker-no-scroll-style')) {
    const style = document.createElement('style');
    style.id = 'datepicker-no-scroll-style';
    style.textContent = datePickerStyle;
    document.head.appendChild(style);
  }

  // Clean up style on unmount
  useEffect(() => {
    return () => {
      const existingStyle = document.getElementById(
        'datepicker-no-scroll-style'
      );
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  // Fetch user data
  const { data, isLoading, error, refetch } = useGetUserDetail(publisherId);
  const user = data?.result;

  // Create/Update user detail mutation
  const { mutate: createUpdateUserDetail, isPending: isCreating } =
    useCreateUpdateUserDetail();

  // Check if we need to show the form
  // Show form when: not loading AND (has error OR no user data)
  const needsUserDetailForm = !isLoading && (error || !user);

  // Handle form submission
  const handleFormSubmit = (values: {
    dateOfBirth: moment.Moment;
    gender: string;
    address?: string;
  }) => {
    // Generate avatar URL from user's name
    const userName = decodedToken?.Name || 'User';
    const avatarURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=8B5CF6&color=ffffff&size=200`;

    const payload = {
      dateOfBirth: values.dateOfBirth.toDate().toISOString(),
      gender: values.gender,
      avatarURL: avatarURL,
      address: values.address?.trim() || 'Trống'
    };

    createUpdateUserDetail(payload, {
      onSuccess: () => {
        message.success('Thông tin đã được cập nhật thành công!');
        form.resetFields();
        // Refetch user data
        window.location.reload();
      },
      onError: () => {
        message.error('Có lỗi xảy ra khi cập nhật thông tin!');
      }
    });
  };

  // Handle edit modal
  const handleEditClick = () => {
    if (!user) return;

    setIsEditModalOpen(true);
    // Pre-fill form with current user data
    // Ensure proper date parsing
    const userDate = user.dateOfBirth ? moment(user.dateOfBirth) : null;

    editForm.setFieldsValue({
      dateOfBirth: userDate && userDate.isValid() ? userDate : null,
      gender: user.gender,
      address: user.address === 'Trống' ? '' : user.address
    });
  };

  const handleEditSubmit = (values: {
    dateOfBirth: moment.Moment;
    gender: string;
    address?: string;
  }) => {
    // Generate avatar URL from user's name
    const userName = decodedToken?.Name || 'User';
    const avatarURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=8B5CF6&color=ffffff&size=200`;

    // Safely convert date to ISO string
    let dateOfBirthISO: string;
    try {
      if (moment.isMoment(values.dateOfBirth) && values.dateOfBirth.isValid()) {
        dateOfBirthISO = values.dateOfBirth.toDate().toISOString();
      } else {
        throw new Error('Invalid date');
      }
    } catch (error) {
      message.error('Ngày sinh không hợp lệ!');
      return;
    }

    const payload = {
      dateOfBirth: dateOfBirthISO,
      gender: values.gender,
      avatarURL: avatarURL,
      address: values.address?.trim() || 'Trống'
    };

    createUpdateUserDetail(payload, {
      onSuccess: () => {
        message.success('Thông tin đã được cập nhật thành công!');
        setIsEditModalOpen(false);
        editForm.resetFields();
        refetch(); // Refetch user data
      },
      onError: () => {
        message.error('Có lỗi xảy ra khi cập nhật thông tin!');
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
                  { required: true, message: 'Vui lòng chọn ngày sinh!' },
                  {
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.reject('Vui lòng chọn ngày sinh!');
                      }
                      if (value.isAfter(moment())) {
                        return Promise.reject(
                          'Ngày sinh không thể là ngày trong tương lai!'
                        );
                      }
                      if (value.isBefore(moment().subtract(120, 'years'))) {
                        return Promise.reject('Ngày sinh không hợp lệ!');
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <DatePicker
                  className="w-full"
                  placeholder="Chọn ngày sinh (DD/MM/YYYY)"
                  format="DD/MM/YYYY"
                  disabledDate={(current) => {
                    // Disable dates after today and before 120 years ago
                    return (
                      current &&
                      (current > moment().endOf('day') ||
                        current < moment().subtract(120, 'years'))
                    );
                  }}
                  showToday={false}
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
                      onClick={handleEditClick}
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

        {/* Edit Profile Modal */}
        <Modal
          title="Chỉnh sửa thông tin cá nhân"
          open={isEditModalOpen}
          onCancel={handleEditCancel}
          footer={null}
          centered
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
              rules={[
                { required: true, message: 'Vui lòng chọn ngày sinh!' },
                {
                  validator: (_, value) => {
                    if (!value) {
                      return Promise.reject('Vui lòng chọn ngày sinh!');
                    }
                    if (!moment.isMoment(value) || !value.isValid()) {
                      return Promise.reject('Ngày sinh không hợp lệ!');
                    }
                    if (value.isAfter(moment())) {
                      return Promise.reject(
                        'Ngày sinh không thể là ngày trong tương lai!'
                      );
                    }
                    if (value.isBefore(moment().subtract(120, 'years'))) {
                      return Promise.reject('Ngày sinh quá xa trong quá khứ!');
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <DatePicker
                className="w-full"
                placeholder="Chọn ngày sinh (DD/MM/YYYY)"
                format="DD/MM/YYYY"
                disabledDate={(current) => {
                  return (
                    current &&
                    (current > moment().endOf('day') ||
                      current < moment().subtract(120, 'years'))
                  );
                }}
                showToday={false}
                allowClear={true}
                inputReadOnly={true}
                changeOnBlur={false}
                onOpenChange={(open) => {
                  if (!open) {
                    // Prevent unwanted changes when closing
                    return;
                  }
                }}
                getPopupContainer={(trigger) =>
                  trigger.parentElement || document.body
                }
                onFocus={(e) => {
                  // Disable scroll wheel on focus
                  const preventDefault = (e: WheelEvent) => e.preventDefault();
                  e.target?.addEventListener('wheel', preventDefault, {
                    passive: false
                  });

                  // Clean up on blur
                  const onBlur = () => {
                    e.target?.removeEventListener('wheel', preventDefault);
                    e.target?.removeEventListener('blur', onBlur);
                  };
                  e.target?.addEventListener('blur', onBlur);
                }}
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
              <Button onClick={handleEditCancel} className="mr-2">
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isCreating}
                style={{ backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' }}
              >
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </BasePages>
  );
};

export default PublisherProfile;
