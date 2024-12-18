import { EJwtConfigKey, ETokenType } from '../enums/auth.enum';

/**
 * Ánh xạ từ loại token sang khóa cấu hình JWT tương ứng.
 *
 * @example
 * ETokenType.ACCESS (0) -> EJwtConfigKey.JWT_ACCESS_TOKEN_SECRET
 * ETokenType.REFRESH (1) -> EJwtConfigKey.JWT_REFRESH_TOKEN_SECRET
 * ETokenType.RESET_PASSWORD (2) -> EJwtConfigKey.JWT_RESET_PASSWORD_TOKEN_SECRET
 */
export const mapTokenTypeToConfigKey: Record<ETokenType, EJwtConfigKey> = {
  [ETokenType.ACCESS]: EJwtConfigKey.JWT_ACCESS_TOKEN_SECRET,
  [ETokenType.REFRESH]: EJwtConfigKey.JWT_REFRESH_TOKEN_SECRET,
  [ETokenType.RESET_PASSWORD]: EJwtConfigKey.JWT_RESET_PASSWORD_TOKEN_SECRET,
  [ETokenType.VERIFY_ACCOUNT]: EJwtConfigKey.JWT_VERIFY_ACCOUNT_TOKEN_SECRET
};

/**
 * Ánh xạ ngược từ khóa cấu hình JWT sang loại token.
 *
 * @example
 * EJwtConfigKey.JWT_ACCESS_TOKEN_SECRET -> ETokenType.ACCESS (0)
 * EJwtConfigKey.JWT_REFRESH_TOKEN_SECRET -> ETokenType.REFRESH (1)
 * EJwtConfigKey.JWT_RESET_PASSWORD_TOKEN_SECRET -> ETokenType.RESET_PASSWORD (2)
 */
export const mapConfigKeyToTokenType: Record<EJwtConfigKey, ETokenType> = Object.fromEntries(
  Object.entries(mapTokenTypeToConfigKey).map(([key, value]) => [value, Number(key) as ETokenType])
) as Record<EJwtConfigKey, ETokenType>;
