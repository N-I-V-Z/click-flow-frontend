import React, { useState } from 'react';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { Grid } from '@giphy/react-components';

const gf = new GiphyFetch('cr6ETC3y7TAqq1L5wTLYtJgQe70yGZ0Y');

const pickerBoxStyle: React.CSSProperties = {
  width: 250,
  padding: 4,
  border: '1px solid #d1d5db',
  borderRadius: 10,
  boxShadow: '0 2px 12px rgba(80,80,120,0.13)',
  background: '#fff',
  maxHeight: 260,
  overflow: 'hidden',
  zIndex: 1000
};

const GifPickerComponent = ({ onGifSelect }) => {
  const [search, setSearch] = useState('');

  // Hàm kiểm tra ảnh có load được không
  const checkImage = (url: string) => {
    return new Promise<boolean>((resolve) => {
      const img = new window.Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  return (
    <div style={pickerBoxStyle}>
      <input
        type="text"
        placeholder="Tìm GIF..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: '100%',
          marginBottom: 4,
          padding: 3,
          fontSize: 13,
          borderRadius: 4,
          border: '1px solid #ccc'
        }}
      />
      <div style={{ maxHeight: 200, overflowY: 'auto' }}>
        <Grid
          key={search}
          fetchGifs={(offset) =>
            gf.search(search && search.trim() ? search : 'funny', {
              offset,
              limit: 6
            })
          }
          width={210}
          columns={3}
          gutter={4}
          onGifClick={async (gif, e) => {
            e.preventDefault();
            e.stopPropagation();
            const url = gif.images.fixed_width.url;
            const ok = await checkImage(url);
            if (ok) {
              onGifSelect(url);
            } else {
              alert('GIF này bị lỗi, vui lòng chọn GIF khác!');
            }
          }}
          hideAttribution
        />
      </div>
    </div>
  );
};

export default GifPickerComponent;
