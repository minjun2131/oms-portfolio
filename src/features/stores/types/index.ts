/**
 * 상점 UI 타입 정의
 */
export interface Shop {
  id: string;
  name: string;
  ownerId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}
