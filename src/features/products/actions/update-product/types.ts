/**
 * 상품 수정 Action State 타입 (Discriminated Union)
 */

/** 성공 시 반환 타입 */
interface UpdateProductSuccess {
  success: true;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

/** 실패 시 반환 타입 */
interface UpdateProductFailure {
  success: false;
  message: string;
  errors: Record<string, string[]>;
}

export type UpdateProductState = UpdateProductSuccess | UpdateProductFailure;
