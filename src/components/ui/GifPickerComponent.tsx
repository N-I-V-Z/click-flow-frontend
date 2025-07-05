import React, { useState } from 'react';
import { GiphyFetch, GifsResult } from '@giphy/js-fetch-api';
import { Grid } from '@giphy/react-components';

const gf = new GiphyFetch(import.meta.env.VITE_GIF_API_KEY);

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

// Danh sách từ khóa nhạy cảm cần chặn
const SENSITIVE_KEYWORDS = [
  'sex',
  'nipple',
  'penis',
  'vagina',
  'fuck',
  'pussy',
  'dick',
  'boobs',
  'cum',
  'porn',
  'nude',
  'naked',
  'anal',
  'blowjob',
  'cock',
  'suck',
  'bitch',
  'ass',
  'slut',
  'milf',
  'hentai',
  'xxx',
  'rape',
  'sexy',
  'orgasm',
  'masturbate',
  'erection',
  'fetish',
  'horny',
  'lesbian',
  'gay',
  'trans',
  'fisting',
  'fap',
  'handjob',
  'jerk',
  'spank',
  'strip',
  'threesome',
  'whore',
  'bdsm',
  'bondage',
  'cunnilingus',
  'dildo',
  'dominatrix',
  'ejaculate',
  'escort',
  'incest',
  'kinky',
  'orgy',
  'pegging',
  'prostitute',
  'rimjob',
  'shemale',
  'squirting',
  'strapon',
  'tit',
  'voyeur',
  'wetdream',
  'cumshot',
  'deepthroat',
  'gangbang',
  'hardcore',
  'intercourse',
  'lube',
  'menstruation',
  'menstrual',
  'molest',
  'molestation',
  'nipple',
  'panties',
  'penetrate',
  'penetration',
  'pubic',
  'rape',
  'sperm',
  'stripper',
  'testicle',
  'vibrator',
  'virgin',
  'vulva',
  'wank',
  'xxx',
  'yuri',
  'yaoi',
  'hent',
  'henta',
  'doggy'
];

const GifPickerComponent = ({ onGifSelect }) => {
  const [search, setSearch] = useState('');
  const [showWarning, setShowWarning] = useState(false);

  // Kiểm tra từ khóa nhạy cảm
  const isSensitive = (text: string) => {
    const lower = text.toLowerCase();
    return SENSITIVE_KEYWORDS.some((kw) => lower.includes(kw));
  };

  // Hàm kiểm tra ảnh có load được không
  const checkImage = (url: string) => {
    return new Promise<boolean>((resolve) => {
      const img = new window.Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  // Khi nhập input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    setShowWarning(isSensitive(val));
  };

  return (
    <div style={pickerBoxStyle}>
      <input
        type="text"
        placeholder="Tìm GIF..."
        value={search}
        onChange={handleInputChange}
        style={{
          width: '100%',
          marginBottom: 4,
          padding: 3,
          fontSize: 13,
          borderRadius: 4,
          border: '1px solid #ccc'
        }}
      />
      {showWarning && (
        <div style={{ color: 'red', fontSize: 12, marginBottom: 4 }}>
          Từ khóa không hợp lệ!
        </div>
      )}
      <div style={{ maxHeight: 200, overflowY: 'auto' }}>
        <Grid
          key={search}
          fetchGifs={(offset) => {
            if (search && isSensitive(search)) {
              // Nếu từ khóa nhạy cảm, trả về mảng rỗng đúng kiểu GifsResult
              const emptyResult: GifsResult = {
                data: [],
                pagination: { total_count: 0, count: 0, offset },
                meta: { status: 200, msg: 'OK', response_id: '' }
              };
              return Promise.resolve(emptyResult);
            }
            return gf.search(search && search.trim() ? search : 'funny', {
              offset,
              limit: 6
            });
          }}
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
