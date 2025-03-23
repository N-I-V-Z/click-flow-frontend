import React from 'react';
import { useParams } from 'react-router-dom';

const LinkPage: React.FC = () => {
  // Ép kiểu useParams nếu cần, đảm bảo publisherId và campaignId là string
  const { publisherId, campaignId } = useParams<{
    publisherId: string;
    campaignId: string;
  }>();

  return (
    <div>
      <h1>Campaign Detail</h1>
      <p>Publisher ID: {publisherId}</p>
      <p>Campaign ID: {campaignId}</p>
    </div>
  );
};

export default LinkPage;
