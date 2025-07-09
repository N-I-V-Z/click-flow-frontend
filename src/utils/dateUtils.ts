export function formatTimeAgoVi(utcString?: string): string {
  if (!utcString) return '';
  try {
    // Lấy thời gian hiện tại (local time)
    const now = Date.now();

    // 1) Loại bỏ phần dài quá của ms, chỉ giữ 3 chữ số
    const cleaned = utcString.replace(/\.(\d{3})\d*/, '.$1');
    // 2) Thêm 'Z' nếu chưa có
    const iso = cleaned.endsWith('Z') ? cleaned : cleaned + 'Z';
    const messageTime = new Date(iso).getTime();

    // Tính độ chênh lệch thời gian (đã tự động xử lý timezone)
    const diffMs = now - messageTime;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) {
      if (diffHour >= 1) return `${diffHour} giờ trước`;
      if (diffMin >= 1) return `${diffMin} phút trước`;
      return 'Vừa xong';
    }

    // Hiển thị thời gian với múi giờ Việt Nam
    return new Date(messageTime).toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'Asia/Ho_Chi_Minh'
    });
  } catch {
    return '';
  }
}
