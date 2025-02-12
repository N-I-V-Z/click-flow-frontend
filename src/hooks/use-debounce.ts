import { useState, useEffect } from 'react';

/**
 *  Là một custom hook được sử dụng trong React để trì hoãn việc cập nhật giá trị của một biến.
 *
 * @param value Giá trị cần debounce
 * @param delay Thời gian chờ trước khi cập nhật giá trị
 *
 * @description
 * Điều này rất hữu ích trong các tình huống mà bạn không muốn thực hiện một hành động ngay lập tức sau khi giá trị thay đổi.
 * Như khi người dùng nhập liệu vào một ô tìm kiếm và bạn muốn đợi một khoảng thời gian trước khi thực hiện tìm kiếm.
 */ export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup nếu người dùng tiếp tục gõ trước khi timeout kết thúc
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
