import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCreateTraffic } from '@/queries/traffic.query';

const LinkPage: React.FC = () => {
  const { publisherId, campaignId } = useParams<{
    publisherId: string;
    campaignId: string;
  }>();

  const { mutateAsync: createTraffic } = useCreateTraffic();

  const fetchClientIP = async () => {
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      return data.ip as string;
    } catch {
      return '';
    }
  };

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
      const ip = await fetchClientIP();
      const { deviceType, browser } = getDeviceAndBrowser();

      const payload = {
        ipAddress: ip,
        deviceType,
        orderId: 'CPC',
        browser,
        referrerUrl: referrerURL, // Updated key name to match server expectations
        campaignId: Number(campaignId),
        publisherId: Number(publisherId)
      };

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
