import React, { useState, useEffect } from 'react';
import { Button, Input, Card, Spin, Typography, Space, Divider } from 'antd';
import { showToast } from '@/utils/toastUtils';
import { CopyOutlined, QrcodeOutlined, LinkOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import helpers from '@/helpers';
import __helpers from '@/helpers';

const { Title, Text } = Typography;

interface ProductLinkProps {
  campaignId: number;
  originUrl?: string;
}

// Decode token để lấy publisher id
const decodedToken = helpers.decodeTokens(__helpers.cookie_get('AT'));
const PUBLISHER_ID = decodedToken?.Id;

const ProductLink: React.FC<ProductLinkProps> = ({ campaignId, originUrl }) => {
  const [productLink, setProductLink] = useState<string>('');
  const [shortLink, setShortLink] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isGeneratingQR, setIsGeneratingQR] = useState<boolean>(false);
  const [isCreatingShortLink, setIsCreatingShortLink] =
    useState<boolean>(false);

  // Tạo link sản phẩm khi component mount
  useEffect(() => {
    if (PUBLISHER_ID && campaignId) {
      const generatedLink = `${window.location.origin}/link?publisherId=${PUBLISHER_ID}&campaignId=${campaignId}`;
      setProductLink(generatedLink);

      // Tạo link rút gọn thật sử dụng dịch vụ miễn phí
      createShortLink(generatedLink);
    }
  }, [campaignId]);

  // Hàm tạo link rút gọn thực tế
  const createShortLink = async (longUrl: string) => {
    setIsCreatingShortLink(true);
    try {
      // Thử dịch vụ TinyURL trước
      let response = await fetch(
        `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`
      );

      if (response.ok) {
        const shortUrl = await response.text();
        if (shortUrl && shortUrl.startsWith('http')) {
          setShortLink(shortUrl);
          setIsCreatingShortLink(false);
          return;
        }
      }

      // Nếu TinyURL không hoạt động, thử dịch vụ khác
      response = await fetch('https://is.gd/create.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `format=simple&url=${encodeURIComponent(longUrl)}`
      });

      if (response.ok) {
        const shortUrl = await response.text();
        if (shortUrl && shortUrl.startsWith('http')) {
          setShortLink(shortUrl);
          setIsCreatingShortLink(false);
          return;
        }
      }

      // Fallback: sử dụng productLink gốc
      setShortLink(longUrl);
    } catch (error) {
      console.error('Short link creation error:', error);
      // Fallback: sử dụng productLink gốc
      setShortLink(longUrl);
    } finally {
      setIsCreatingShortLink(false);
    }
  };

  // Hàm copy link
  const handleCopyLink = (link: string, type: string) => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        showToast.success(`Copy ${type} thành công!`);
      })
      .catch(() => {
        showToast.error(`Copy ${type} thất bại!`);
      });
  };

  // Hàm xử lý click vào QR code
  const handleQRClick = () => {
    showToast.info('💡 Tip: Nhấn chuột phải vào QR code để lưu hình ảnh!');
  };

  // Hàm tạo QR code với chất lượng cao
  const generateQRCode = async (link: string) => {
    setIsGeneratingQR(true);
    try {
      // Sử dụng API QR Code với chất lượng cao và error correction
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&format=png&ecc=M&data=${encodeURIComponent(link)}`;
      setQrCodeUrl(qrApiUrl);
      showToast.success('Tạo QR code thành công!');
    } catch (error) {
      console.error('QR generation error:', error);
      showToast.error('Tạo QR code thất bại!');
    } finally {
      setIsGeneratingQR(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <Title level={3} className="!mb-2">
          <LinkOutlined className="mr-2" />
          Tạo link
        </Title>
        <Text type="secondary">
          Tạo link tiếp thị và QR code cho chiến dịch của bạn
        </Text>
      </div>

      <Divider />

      {/* Product Link Section */}
      <Card
        title="Link sản phẩm"
        className="shadow-sm transition-shadow hover:shadow-md"
        extra={
          <Button
            type="primary"
            icon={<CopyOutlined />}
            onClick={() => handleCopyLink(productLink, 'link sản phẩm')}
            className="rounded-md"
          >
            Copy
          </Button>
        }
      >
        <Input.TextArea
          value={productLink}
          readOnly
          autoSize={{ minRows: 2, maxRows: 4 }}
          className="!resize-none"
          placeholder="Link sản phẩm sẽ được tạo tự động..."
        />
      </Card>

      {/* Short Link Section */}
      <Card
        title="Link rút gọn"
        className="shadow-sm transition-shadow hover:shadow-md"
        extra={
          <Space>
            <Button
              icon={<CopyOutlined />}
              onClick={() => handleCopyLink(shortLink, 'link rút gọn')}
              disabled={isCreatingShortLink || !shortLink}
            >
              Copy
            </Button>
            <Button
              type="primary"
              icon={<QrcodeOutlined />}
              onClick={() => generateQRCode(shortLink)}
              loading={isGeneratingQR}
              disabled={isCreatingShortLink || !shortLink}
              className="rounded-md border-none bg-gradient-to-r from-purple-600 to-indigo-600"
            >
              Tạo QR
            </Button>
          </Space>
        }
      >
        {isCreatingShortLink ? (
          <div className="flex items-center space-x-2">
            <Spin size="small" />
            <span className="text-gray-500">Đang tạo link rút gọn...</span>
          </div>
        ) : (
          <Input
            value={shortLink}
            readOnly
            className="!bg-gray-50"
            placeholder="Link rút gọn sẽ được tạo tự động..."
          />
        )}
      </Card>

      {/* QR Code Section */}
      {qrCodeUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            title="QR Code"
            className="text-center shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="rounded-lg bg-white p-4 shadow-inner">
                {isGeneratingQR ? (
                  <Spin size="large" />
                ) : (
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="h-64 w-64 cursor-pointer object-contain transition-opacity hover:opacity-80"
                    onClick={handleQRClick}
                    title="Click chuột phải để lưu hình ảnh"
                  />
                )}
              </div>
              <Text type="secondary" className="text-sm">
                Quét mã QR để truy cập link nhanh chóng
                <br />
                <Text type="secondary" className="text-xs">
                  💡 Nhấn chuột phải vào QR để lưu hình ảnh
                </Text>
              </Text>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Instructions */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <Title level={5} className="!mb-3 text-blue-800">
          <QrcodeOutlined className="mr-2" />
          Hướng dẫn sử dụng
        </Title>
        <div className="space-y-2 text-sm text-blue-700">
          <div>
            • <strong>Link sản phẩm:</strong> Sử dụng để theo dõi chính xác
            nguồn traffic
          </div>
          <div>
            • <strong>Link rút gọn:</strong> Phù hợp cho chia sẻ trên mạng xã
            hội
          </div>
          <div>
            • <strong>QR Code:</strong> Tiện lợi cho marketing offline - nhấn
            chuột phải để lưu hình
          </div>
          <div>• Tất cả link đều được theo dõi và thống kê đầy đủ</div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProductLink;
