import { ShoppingCart, Truck, BarChart3, Package } from 'lucide-react';

export const PRICING_PLANS = [
  {
    id: 'free',
    name: '무료 플랜',
    price: '0',
    period: '월',
    description: '소규모 사업을 시작하는 분을 위한 기본 기능',
    features: [
      '월 100건 주문 관리',
      '기본 상품 등록 (최대 50개)',
      '매출 대시보드',
      '배송 추적 (기본)',
      '이메일 지원',
    ],
    cta: '무료로 시작',
    highlight: false,
  },
  {
    id: 'pro',
    name: 'PRO 플랜',
    price: '9,900',
    period: '월',
    description: '성장하는 비즈니스를 위한 모든 기능',
    badge: '추천',
    features: [
      '무제한 주문 관리',
      '무제한 상품 등록',
      '고급 매출 분석 및 리포트',
      '실시간 배송 추적',
      '우선 고객 지원 (24시간)',
      '고급 재고 관리',
      '여러 상점 관리 (최대 5개)',
      'API 접근',
    ],
    cta: '지금 시작하기',
    highlight: true,
  },
];

export const PRICING_FEATURES = [
  {
    icon: ShoppingCart,
    title: '주문 관리',
    description: '모든 주문을 한눈에 관리하고 빠르게 처리하세요',
  },
  {
    icon: Truck,
    title: '배송 현황',
    description: '실시간으로 배송 상태를 추적하고 고객에게 알려주세요',
  },
  {
    icon: BarChart3,
    title: '매출 통계',
    description: '상세한 매출 리포트로 사업 현황을 파악하세요',
  },
  {
    icon: Package,
    title: '상품 관리',
    description: '상품 정보와 재고를 효율적으로 관리하세요',
  },
];
