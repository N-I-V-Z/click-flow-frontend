import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Hàm `cn` kết hợp các lớp CSS từ các đối số đầu vào.
 *
 * @param inputs - Các giá trị lớp có thể là chuỗi, số, mảng, đối tượng, hoặc các giá trị null, boolean, undefined.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
