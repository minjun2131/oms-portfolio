/**
 * 상품 삭제 Action State 타입 (Discriminated Union)
 */

/** 성공 시 반환 타입 */
interface DeleteProductSuccess {
  success: true;
  message: string;
  data: { id: string };
}

/** 실패 시 반환 타입 */
interface DeleteProductFailure {
  success: false;
  message: string;
  errors: Record<string, string[]>;
}

export type DeleteProductState = DeleteProductSuccess | DeleteProductFailure;
