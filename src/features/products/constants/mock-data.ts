import type { Product } from "@/features/products/types";

export interface InventoryItem extends Omit<Product, "status" | "price" | "stock"> {
  currentStock: number;
  minStock: number;
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "아크릴 키링 - 봄날의 토끼",
    imageUrl: "/placeholder.svg?height=60&width=60",
    category: "키링",
    price: 8000,
    stock: 45,
    status: "active",
    sku: "KEYRING-001",
  },
  {
    id: "2",
    name: "마스킹 테이프 세트 (5개입)",
    imageUrl: "/placeholder.svg?height=60&width=60",
    category: "문구",
    price: 12000,
    stock: 120,
    status: "active",
    sku: "TAPE-001",
  },
  {
    id: "3",
    name: "일러스트 엽서 10종 세트",
    imageUrl: "/placeholder.svg?height=60&width=60",
    category: "엽서",
    price: 15000,
    stock: 0,
    status: "sold_out",
    sku: "POSTCARD-001",
  },
  {
    id: "4",
    name: "캔버스 에코백 - 고양이 패턴",
    imageUrl: "/placeholder.svg?height=60&width=60",
    category: "패브릭",
    price: 22000,
    stock: 32,
    status: "active",
    sku: "BAG-001",
  },
  {
    id: "5",
    name: "스티커팩 - 귀여운 동물들",
    imageUrl: "/placeholder.svg?height=60&width=60",
    category: "스티커",
    price: 5000,
    stock: 200,
    status: "active",
    sku: "STICKER-001",
  },
  {
    id: "6",
    name: "포토카드 홀더 바인더",
    imageUrl: "/placeholder.svg?height=60&width=60",
    category: "문구",
    price: 18000,
    stock: 8,
    status: "active",
    sku: "BINDER-001",
  },
  {
    id: "7",
    name: "아크릴 스탠드 - 캐릭터 A",
    imageUrl: "/placeholder.svg?height=60&width=60",
    category: "아크릴",
    price: 25000,
    stock: 0,
    status: "hidden",
    sku: "STAND-001",
  },
  {
    id: "8",
    name: "미니 포스터 A3 사이즈",
    imageUrl: "/placeholder.svg?height=60&width=60",
    category: "포스터",
    price: 10000,
    stock: 55,
    status: "active",
    sku: "POSTER-001",
  },
];

export const mockInventoryItems: InventoryItem[] = mockProducts.map(
  (product) => ({
    id: product.id,
    name: product.name,
    imageUrl: product.imageUrl,
    sku: product.sku,
    category: product.category,
    currentStock: product.stock, // stock 값을 currentStock으로 초기화
    minStock: 15, // 목업 테스트용 일괄 설정
  })
);
