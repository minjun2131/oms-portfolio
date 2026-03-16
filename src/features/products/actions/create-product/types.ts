/**
 * 상품 등록 Action State 타입 (Discriminated Union)
 */

/** 성공 시 반환 타입 */
interface CreateProductSuccess {
  success: true;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

/** 실패 시 반환 타입 */
interface CreateProductFailure {
  success: false;
  message: string;
  errors: Record<string, string[]>;
}

export type CreateProductState = CreateProductSuccess | CreateProductFailure;
