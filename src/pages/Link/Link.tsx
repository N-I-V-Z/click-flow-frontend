import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCreateTraffic } from '@/queries/traffic.query';

const LinkPage: React.FC = () => {
  const { publisherId, campaignId } = useParams<{
    publisherId: string;
    campaignId: string;
  }>();

  const { mutateAsync: createTraffic, isSuccess } = useCreateTraffic();

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

  const referrerURL = document.referrer || 'unknown';

  useEffect(() => {
    if (!publisherId || !campaignId) return;

    (async () => {
      const { deviceType, browser } = getDeviceAndBrowser();

      const payload = {
        deviceType: deviceType,
        orderId: '',
        browser: browser,
        referrerURL: referrerURL,
        timestamp: new Date().toISOString(),
        campaignId: Number(campaignId),
        publisherId: Number(publisherId)
      };

      try {
        const response = await createTraffic(payload);
        if (isSuccess) {
          window.location.replace(response.result as string);
        } else {
          console.error('Traffic created but no redirect URL found:', response);
        }
      } catch (err) {
        console.error('Tạo traffic thất bại:', err);
      }
    })();
  }, [referrerURL, isSuccess, publisherId, campaignId, createTraffic]);

  return <div style={{ padding: '2rem' }}></div>;
};

export default LinkPage;
