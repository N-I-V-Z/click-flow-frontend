import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCreateTraffic } from '@/queries/traffic.query';
import PageHead from '@/components/shared/page-head';

const LinkPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const publisherId = searchParams.get('publisherId');
  const campaignId = searchParams.get('campaignId');

  const { mutateAsync: createTraffic } = useCreateTraffic();
  const [hasExecuted, setHasExecuted] = useState(false); // Prevent multiple executions
  const referrerURLRef = useRef(document.referrer || 'unknown'); // Store referrer once

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

  useEffect(() => {
    // Chỉ chạy 1 lần và khi có đủ params
    if (!publisherId || !campaignId || hasExecuted) return;

    setHasExecuted(true); // Mark as executed

    (async () => {
      const { deviceType, browser } = getDeviceAndBrowser();

      const payload = {
        deviceType: deviceType,
        orderId: '',
        browser: browser,
        referrerURL: referrerURLRef.current, // Use ref value
        timestamp: new Date(),
        campaignId: Number(campaignId),
        publisherId: Number(publisherId)
      };

      try {
        console.log('Creating traffic...', payload);
        const response = await createTraffic(payload);

        if (response?.result?.url && response?.result?.clickId) {
          console.log('Redirecting to:', response.result.url);
          window.location.replace(
            `${response.result.url}?clickId=${response.result.clickId}`
          );
        } else {
          console.error('No redirect URL found in response:', response);
        }
      } catch (err) {
        console.error('Tạo traffic thất bại:', err);
        setHasExecuted(false); // Reset if failed, allow retry
      }
    })();
  }, [publisherId, campaignId, hasExecuted, createTraffic]); // Clean dependency array

  return (
    <div style={{ padding: '2rem' }}>
      <PageHead title={'Đang chuyển trang...'} />
    </div>
  );
};

export default LinkPage;
