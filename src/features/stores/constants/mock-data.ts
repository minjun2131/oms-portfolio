export interface Store {
  id: number;
  name: string;
  category: string;
  status: "active" | "paused";
  address: string;
  phone: string;
  website: string;
  products: number;
  monthlyOrders: number;
  monthlySales: number;
  growth: number;
  description: string;
}

export const mockStores: Store[] = [
  {
    id: 1,
    name: "봄날의 아틀리에",
    category: "일러스트 굿즈",
    status: "active",
    address: "서울특별시 마포구 연남동 223-15",
    phone: "02-1234-5678",
    website: "bomnal-atelier.kr",
    products: 42,
    monthlyOrders: 128,
    monthlySales: 8420000,
    growth: 15.3,
    description: "감성 일러스트 기반의 아크릴 키링, 엽서, 스티커 전문 상점",
  },
  {
    id: 2,
    name: "달빛 스튜디오",
    category: "포토카드 / 인쇄물",
    status: "active",
    address: "서울특별시 강남구 역삼동 831-42",
    phone: "02-9876-5432",
    website: "moonlight-studio.com",
    products: 78,
    monthlyOrders: 215,
    monthlySales: 12850000,
    growth: 22.1,
    description: "아이돌 포토카드 및 고급 인쇄물 제작 전문 상점",
  },
  {
    id: 3,
    name: "코지핸즈",
    category: "패브릭 / 소품",
    status: "active",
    address: "부산광역시 해운대구 좌동 1402-5",
    phone: "051-555-1234",
    website: "cozyhands.shop",
    products: 31,
    monthlyOrders: 67,
    monthlySales: 3980000,
    growth: -5.2,
    description: "수제 패브릭 파우치, 에코백, 자수 소품 전문 상점",
  },
  {
    id: 4,
    name: "픽셀드림",
    category: "디지털 아트 굿즈",
    status: "paused",
    address: "대전광역시 유성구 봉명동 535-8",
    phone: "042-333-7890",
    website: "pixeldream.co.kr",
    products: 18,
    monthlyOrders: 0,
    monthlySales: 0,
    growth: 0,
    description: "디지털 아트 프린트, 마우스패드, 데스크매트 전문 상점 (리뉴얼 준비중)",
  },
];
