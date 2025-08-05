/**
 * Utility functions for timezone conversion
 * Converts UTC time to Vietnam time (+7 hours)
 */

export const convertUTCToVietnamTime = (date: Date | string): Date => {
  const utcDate = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(utcDate.getTime())) {
    throw new Error('Invalid date');
  }
  // Add 7 hours to convert UTC to Vietnam time
  return new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);
};

export const formatDateVN = (
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string => {
  try {
    const vietnamTime = convertUTCToVietnamTime(date);
    return vietnamTime.toLocaleDateString('vi-VN', options);
  } catch {
    return '';
  }
};

export const formatTimeVN = (
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string => {
  try {
    const vietnamTime = convertUTCToVietnamTime(date);
    return vietnamTime.toLocaleTimeString(
      'vi-VN',
      options || {
        hour: '2-digit',
        minute: '2-digit'
      }
    );
  } catch {
    return '--:--';
  }
};

export const formatDateTimeVN = (
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string => {
  try {
    const vietnamTime = convertUTCToVietnamTime(date);
    return vietnamTime.toLocaleString('vi-VN', options);
  } catch {
    return '';
  }
};
