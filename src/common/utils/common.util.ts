/**
 * Lấy string từ enum hoặc const object
 * @param obj - Enum hoặc const object
 * @param value - Giá trị cần tìm
 * @returns String tương ứng với giá trị, hoặc chuỗi rỗng nếu không tìm thấy
 */
export function getEnumOrConstString<T extends Record<string, string | number>>(obj: T, value: T[keyof T]): string {
  const entry = Object.entries(obj).find(([key, val]) => val === value || key === value);
  return entry ? entry[0] : '';
}
