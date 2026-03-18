"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Search,
  Save,
  ChevronDown,
  Package,
  Truck,
  CreditCard,
  User,
  MapPin,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useProducts } from "../../../products/hooks/queries/use-products";
import { createOrderAction } from "../../actions/create-order";

interface OrderItem {
  id: number;
  product_id: string;
  shop_id: string;
  name: string;
  variant: string;
  price: number;
  quantity: number;
}

export function OrderCreateForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { data: productsResult } = useProducts();
  const productsData = productsResult?.data ?? [];
  const productSuggestions = productsData.map((p: any) => ({
    product_id: p.id,
    shop_id: p.shop_id,
    name: p.name,
    price: p.price,
    variants: ["기본"], // 현재 DB에 variant가 없으므로 기본값 사용
  }));

  const [currentStep, setCurrentStep] = useState(0);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [deliveryMemo, setDeliveryMemo] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("paid");
  const [orderMemo, setOrderMemo] = useState("");
  const [nextItemId, setNextItemId] = useState(1);

  const steps = [
    { label: "주문 상품", icon: <Package className="h-4 w-4" /> },
    { label: "주문자 정보", icon: <User className="h-4 w-4" /> },
    { label: "배송 정보", icon: <Truck className="h-4 w-4" /> },
    { label: "결제 / 메모", icon: <CreditCard className="h-4 w-4" /> },
  ];

  const filteredProducts = productSuggestions.filter((p: any) =>
    p.name.includes(searchQuery)
  );

  const addItem = (product: any) => {
    setOrderItems([
      ...orderItems,
      {
        id: nextItemId,
        product_id: product.product_id,
        shop_id: product.shop_id,
        name: product.name,
        variant: "기본",
        price: product.price,
        quantity: 1,
      },
    ]);
    setNextItemId(nextItemId + 1);
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const handleSubmit = async () => {
    if (orderItems.length === 0) {
      alert("상품을 1개 이상 선택해주세요.");
      return;
    }

    startTransition(async () => {
      try {
        const payload = {
          shop_id: orderItems[0].shop_id, // 첫 번째 상품의 상점 ID를 기준으로 함 (주문 당 1개 샵 가정)
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_email: customerEmail || null,
          receiver_name: receiverName,
          receiver_phone: receiverPhone,
          zipcode: zipcode,
          address: address,
          address_detail: addressDetail || null,
          delivery_memo: deliveryMemo || null,
          shipping_cost: shippingCost,
          subtotal_amount: subtotal,
          total_amount: total,
          payment_method: paymentMethod || null,
          payment_status: paymentStatus,
          order_memo: orderMemo || null,
          items: orderItems.map((item) => ({
            product_id: item.product_id,
            product_name: item.name,
            variant: item.variant,
            price: item.price,
            quantity: item.quantity,
          })),
        };

        const result = await createOrderAction(null, payload);

        if (!result.success && result.errors) {
          const firstError = Object.values(result.errors)[0][0] as string;
          alert(`등록 실패: ${firstError}`);
          return;
        }

        if (result.success) {
          alert("주문이 성공적으로 등록되었습니다.");
          router.push("/orders");
        }
      } catch (error) {
        console.error("Order creation error:", error);
        alert("알 수 없는 오류가 발생했습니다.");
      }
    });
  };

  const removeItem = (id: number) => {
    setOrderItems(orderItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setOrderItems(
      orderItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingCost = subtotal >= 50000 ? 0 : 3000;
  const total = subtotal + shippingCost;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <Link
          href="/orders"
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          주문 목록으로 돌아가기
        </Link>
        <h1 className="text-2xl font-bold text-foreground">주문 등록</h1>
        <p className="mt-1 text-muted-foreground">
          어드민이 직접 주문 정보를 입력하여 등록합니다
        </p>
      </div>

      {/* Step Indicator */}
      <div>
        <div className="flex items-center gap-0">
          {steps.map((step, index) => (
            <div key={step.label} className="flex items-center flex-1 last:flex-initial">
              <button
                onClick={() => setCurrentStep(index)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
                  currentStep === index
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : currentStep > index
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                )}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-current/10 text-xs">
                  {currentStep > index ? (
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.icon
                  )}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-px mx-2",
                    currentStep > index ? "bg-primary/40" : "bg-border"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Order Items */}
      {currentStep === 0 && (
        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Package className="h-5 w-5 text-primary" />
                주문 상품 선택
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Product Search */}
              <div className="relative">
                <Label className="text-sm font-medium mb-2 block">
                  상품 검색
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="상품명으로 검색하세요..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(e.target.value.length > 0);
                    }}
                    onFocus={() => {
                      if (searchQuery.length > 0) setShowSuggestions(true);
                    }}
                    className="h-11 pl-10"
                  />
                </div>
                {showSuggestions && filteredProducts.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full rounded-xl border border-border bg-card shadow-lg">
                    {filteredProducts.map((product) => (
                      <button
                        key={product.name}
                        onClick={() => addItem(product)}
                        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted/50 first:rounded-t-xl last:rounded-b-xl"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            옵션: {product.variants.join(", ")}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-foreground">
                          {product.price.toLocaleString()}원
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Items */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  선택된 상품 ({orderItems.length}개)
                </Label>
                {orderItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/50 bg-muted/20 py-12">
                    <Package className="h-10 w-10 text-muted-foreground/50 mb-3" />
                    <p className="text-sm text-muted-foreground">
                      상품을 검색하여 추가해주세요
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orderItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 rounded-xl border border-border/50 bg-card p-4"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/5">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {item.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Select defaultValue={item.variant}>
                              <SelectTrigger className="h-7 w-auto text-xs border-0 bg-muted/50 px-2">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {productSuggestions
                                  .find((p) => p.name === item.name)
                                  ?.variants.map((v) => (
                                    <SelectItem key={v} value={v}>
                                      {v}
                                   </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            <span className="text-xs text-muted-foreground">
                              {item.price.toLocaleString()}원
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center rounded-lg border border-border/50 bg-background">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                            >
                              +
                            </button>
                          </div>
                          <span className="w-20 text-right text-sm font-semibold text-foreground">
                            {(item.price * item.quantity).toLocaleString()}원
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary - Always Visible */}
          <Card className="border-primary/20 bg-primary/[0.02] shadow-sm">
            <CardContent className="p-5">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">상품 금액</span>
                  <span className="font-medium text-foreground">
                    {subtotal.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">배송비</span>
                  <span className="font-medium text-foreground">
                    {shippingCost === 0 ? (
                      <span className="text-primary">무료</span>
                    ) : (
                      `${shippingCost.toLocaleString()}원`
                    )}
                  </span>
                </div>
                {shippingCost > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {(50000 - subtotal).toLocaleString()}원 추가 시 무료 배송
                  </p>
                )}
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold text-foreground">
                      총 결제 금액
                    </span>
                    <span className="text-lg font-bold text-primary">
                      {total.toLocaleString()}원
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 2: Customer Info */}
      {currentStep === 1 && (
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <User className="h-5 w-5 text-primary" />
              주문자 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customerName" className="text-sm font-medium">
                  주문자명 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="customerName"
                  placeholder="이름을 입력하세요"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerPhone" className="text-sm font-medium">
                  연락처 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="customerPhone"
                  placeholder="010-0000-0000"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="h-11"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerEmail" className="text-sm font-medium">
                이메일
              </Label>
              <Input
                id="customerEmail"
                type="email"
                placeholder="example@email.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">
                주문 확인 메일이 이 주소로 발송됩니다
              </p>
            </div>

            {/* Quick Customer Select */}
            <div className="rounded-xl border border-border/50 bg-muted/20 p-4">
              <p className="mb-3 text-sm font-medium text-foreground">
                최근 주문 고객
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "이지은", phone: "010-1234-5678" },
                  { name: "박민수", phone: "010-9876-5432" },
                  { name: "김하늘", phone: "010-5555-1234" },
                ].map((customer) => (
                  <button
                    key={customer.name}
                    onClick={() => {
                      setCustomerName(customer.name);
                      setCustomerPhone(customer.phone);
                    }}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-sm transition-all",
                      customerName === customer.name
                        ? "border-primary bg-primary/5 text-primary font-medium"
                        : "border-border/50 bg-card text-foreground hover:border-primary/30"
                    )}
                  >
                    {customer.name}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Shipping Info */}
      {currentStep === 2 && (
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <MapPin className="h-5 w-5 text-primary" />
              배송 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <input
                type="checkbox"
                id="sameAsCustomer"
                className="h-4 w-4 rounded border-border text-primary accent-[oklch(0.55_0.18_250)]"
                onChange={(e) => {
                  if (e.target.checked) {
                    setReceiverName(customerName);
                    setReceiverPhone(customerPhone);
                  }
                }}
              />
              <Label
                htmlFor="sameAsCustomer"
                className="text-sm text-foreground cursor-pointer"
              >
                주문자 정보와 동일
              </Label>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="receiverName" className="text-sm font-medium">
                  수령인 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="receiverName"
                  placeholder="수령인 이름"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="receiverPhone" className="text-sm font-medium">
                  연락처 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="receiverPhone"
                  placeholder="010-0000-0000"
                  value={receiverPhone}
                  onChange={(e) => setReceiverPhone(e.target.value)}
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                배송지 주소 <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="우편번호"
                  value={zipcode}
                  onChange={(e) => setZipcode(e.target.value)}
                  className="h-11 w-32"
                />
                <Button variant="outline" className="h-11 bg-transparent">
                  주소 검색
                </Button>
              </div>
              <Input
                placeholder="기본 주소"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-11"
              />
              <Input
                placeholder="상세 주소 (동/호수 등)"
                value={addressDetail}
                onChange={(e) => setAddressDetail(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">배송 메모</Label>
              <Select
                value={deliveryMemo}
                onValueChange={setDeliveryMemo}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="배송 메모를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="door">문 앞에 놓아주세요</SelectItem>
                  <SelectItem value="guard">경비실에 맡겨주세요</SelectItem>
                  <SelectItem value="call">배송 전 연락 부탁드립니다</SelectItem>
                  <SelectItem value="box">택배함에 넣어주세요</SelectItem>
                  <SelectItem value="custom">직접 입력</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">배송 방법</Label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  { label: "일반 택배", desc: "2~3일 소요", value: "standard" },
                  { label: "빠른 배송", desc: "1~2일 소요", value: "express" },
                  { label: "직접 수령", desc: "현장 수령", value: "pickup" },
                ].map((method) => (
                  <button
                    key={method.value}
                    className="rounded-xl border border-border/50 bg-card p-4 text-left transition-all hover:border-primary/30 focus:border-primary focus:ring-1 focus:ring-primary/20"
                  >
                    <p className="text-sm font-medium text-foreground">
                      {method.label}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {method.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Payment & Memo */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <CreditCard className="h-5 w-5 text-primary" />
                결제 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    결제 수단 <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="결제 수단 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">신용/체크카드</SelectItem>
                      <SelectItem value="transfer">계좌이체</SelectItem>
                      <SelectItem value="phone">휴대폰 결제</SelectItem>
                      <SelectItem value="cash">현금 수령</SelectItem>
                      <SelectItem value="kakaopay">카카오페이</SelectItem>
                      <SelectItem value="naverpay">네이버페이</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    결제 상태 <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={paymentStatus}
                    onValueChange={setPaymentStatus}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="결제 상태 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">결제 완료</SelectItem>
                      <SelectItem value="pending">입금 대기</SelectItem>
                      <SelectItem value="partial">부분 결제</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {paymentMethod === "transfer" && (
                <div className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-3">
                  <p className="text-sm font-medium text-foreground">
                    입금 계좌 안내
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        은행
                      </Label>
                      <Select>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="은행 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kb">국민은행</SelectItem>
                          <SelectItem value="shinhan">신한은행</SelectItem>
                          <SelectItem value="hana">하나은행</SelectItem>
                          <SelectItem value="woori">우리은행</SelectItem>
                          <SelectItem value="kakao">카카오뱅크</SelectItem>
                          <SelectItem value="toss">토스뱅크</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        입금자명
                      </Label>
                      <Input placeholder="입금자명" className="h-10" />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <FileText className="h-5 w-5 text-primary" />
                관리자 메모
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="주문 관련 내부 메모를 작성하세요. 고객에게는 보이지 않습니다."
                value={orderMemo}
                onChange={(e) => setOrderMemo(e.target.value)}
                className="min-h-[120px] resize-none"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                이 메모는 관리자만 확인할 수 있습니다
              </p>
            </CardContent>
          </Card>

          {/* Final Summary */}
          <Card className="border-primary/20 bg-primary/[0.02] shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">주문 요약</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  {orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {item.name} ({item.variant}) x {item.quantity}
                      </span>
                      <span className="font-medium text-foreground">
                        {(item.price * item.quantity).toLocaleString()}원
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">상품 금액</span>
                    <span className="text-foreground">{subtotal.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">배송비</span>
                    <span className="text-foreground">
                      {shippingCost === 0 ? "무료" : `${shippingCost.toLocaleString()}원`}
                    </span>
                  </div>
                  {customerName && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">주문자</span>
                      <span className="text-foreground">{customerName}</span>
                    </div>
                  )}
                  {paymentMethod && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">결제 수단</span>
                      <span className="text-foreground">
                        {paymentMethod === "card" && "신용/체크카드"}
                        {paymentMethod === "transfer" && "계좌이체"}
                        {paymentMethod === "phone" && "휴대폰 결제"}
                        {paymentMethod === "cash" && "현금 수령"}
                        {paymentMethod === "kakaopay" && "카카오페이"}
                        {paymentMethod === "naverpay" && "네이버페이"}
                      </span>
                    </div>
                  )}
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-foreground">
                      총 결제 금액
                    </span>
                    <span className="text-xl font-bold text-primary">
                      {total.toLocaleString()}원
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="bg-transparent"
        >
          이전
        </Button>
        {currentStep < steps.length - 1 ? (
          <Button
            onClick={() =>
              setCurrentStep(Math.min(steps.length - 1, currentStep + 1))
            }
          >
            다음 단계
          </Button>
        ) : (
          <Button
            className="gap-2 px-8"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                등록 중...
              </span>
            ) : (
              <>
                <Save className="h-4 w-4" />
                주문 등록
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
