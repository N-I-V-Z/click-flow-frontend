import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCreateTraffic } from '@/queries/traffic.query';
import { log } from 'console';

const LinkPage: React.FC = () => {
  const { publisherId, campaignId } = useParams<{
    publisherId: string;
    campaignId: string;
  }>();

  const { mutateAsync: createTraffic } = useCreateTraffic();

  const getDeviceAndBrowser = () => {
    const ua = navigator.userAgent.toLowerCase();
    let deviceType = 'desktop';
    if (/mobile|android|iphone|ipad|tablet|phone|ipod/.test(ua)) {
      deviceType = 'mobile';
    }
    let browser = 'unknown';
    if (ua.includes('chrome')) browser = 'chrome';
    else if (ua.includes('firefox')) browser = 'firefox';
    else if (ua.includes('safari') && !ua.includes('chrome'))
      browser = 'safari';
    else if (ua.includes('edg')) browser = 'edge';
    return { deviceType, browser };
  };

  const referrerURL = document.referrer || '';

  useEffect(() => {
    if (!publisherId || !campaignId) return;

    (async () => {
      const { deviceType, browser } = getDeviceAndBrowser();

      // Lấy thông tin OS từ navigator.platform
      const deviceOs = navigator.platform || 'unknown';

      const payload = {
        deviceType: deviceType,
        browser: browser,
        referrerURL: referrerURL,
        timestamp: new Date().toISOString(),
        campaignId: Number(campaignId),
        publisherId: Number(publisherId)
      };
      console.log('fsadfasd ', payload);

      try {
        const response = await createTraffic(payload);
        if (response.isSuccess && response.result) {
          window.location.href = response.result;
        } else {
          console.error('Traffic created but no redirect URL found:', response);
        }
      } catch (err) {
        console.error('Tạo traffic thất bại:', err);
      }
    })();
  }, [publisherId, campaignId, createTraffic]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Đang ghi nhận lượt truy cập...</h1>
      <p>Publisher ID: {publisherId}</p>
      <p>Campaign ID: {campaignId}</p>
      <p>Referrer: {referrerURL}</p>
      <p>Vui lòng chờ...</p>
    </div>
  );
};

export default LinkPage;
