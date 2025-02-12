import { useParams } from 'react-router-dom';

/**
 * Hook này trả về giá trị `id` từ URL hiện tại.
 * Sử dụng `useParams` từ `react-router-dom` để lấy `id`.
 */
export function useId() {
  const { id } = useParams();
  return id;
}
