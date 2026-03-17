"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Truck,
  CreditCard,
  MapPin,
  User,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  Copy,
  MessageSquare,
  Printer,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const orderData = {
  id: "ORD-2024-0128",
  status: "shipping",
  date: "2024.01.28 14:23",
  customer: {
    name: "이지은",
    phone: "010-1234-5678",
    email: "jieun@example.com",
  },
  shipping: {
    address: "서울특별시 강남구 테헤란로 123",
    addressDetail: "스타타워 4층 401호",
    zipCode: "06142",
    memo: "부재 시 경비실에 맡겨주세요",
    carrier: "CJ대한통운",
    trackingNumber: "123456789012",
  },
  payment: {
    method: "카카오페이",
    subtotal: 43000,
    shipping: 3000,
    discount: -2000,
    total: 44000,
    paidAt: "2024.01.28 14:25",
  },
  items: [
    { name: "아크릴 키링 세트 (4종)", qty: 2, price: 15000, image: "KR" },
    { name: "미니 포스터 A3", qty: 1, price: 13000, image: "PS" },
  ],
  timeline: [
    { label: "주문 접수", date: "01.28 14:23", done: true },
    { label: "결제 완료", date: "01.28 14:25", done: true },
    { label: "상품 준비", date: "01.28 16:00", done: true },
    { label: "발송 완료", date: "01.29 09:30", done: true },
    { label: "배송 중", date: "01.29 14:10", done: true },
    { label: "배송 완료", date: "", done: false },
  ],
  memos: [
    { author: "김셀러", date: "01.28 16:05", text: "상품 포장 완료. 키링 세트 버블랩 추가 포장함." },
    { author: "김셀러", date: "01.29 09:32", text: "CJ대한통운 발송 완료. 송장번호 입력 완료." },
  ],
};

const statusConfig: Record<string, { label: string; className: string }> = {
  paid: { label: "결제완료", className: "bg-[oklch(0.65_0.18_145)]/10 text-[oklch(0.5_0.18_145)]" },
  preparing: { label: "준비중", className: "bg-[oklch(0.75_0.15_85)]/15 text-[oklch(0.55_0.15_85)]" },
  shipping: { label: "배송중", className: "bg-primary/10 text-primary" },
  delivered: { label: "배송완료", className: "bg-muted text-muted-foreground" },
  cancelled: { label: "취소", className: "bg-destructive/10 text-destructive" },
};

export function OrderDetail() {
  const params = useParams();
  const [newMemo, setNewMemo] = useState("");
  const [memos, setMemos] = useState(orderData.memos);
  const status = statusConfig[orderData.status];

  const handleAddMemo = () => {
    if (!newMemo.trim()) return;
    setMemos([
      ...memos,
      { author: "김셀러", date: "지금", text: newMemo },
    ]);
    setNewMemo("");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/orders"
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          주문 목록으로 돌아가기
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">{orderData.id}</h1>
                <Badge variant="secondary" className={cn("border-0 font-medium", status.className)}>
                  {status.label}
                </Badge>
              </div>
              <p className="mt-1 text-muted-foreground">
                {orderData.date} 주문
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Printer className="h-4 w-4" />
              인쇄
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>주문 수정</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">주문 취소</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Select defaultValue="shipping">
              <SelectTrigger className="h-9 w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">결제완료</SelectItem>
                <SelectItem value="preparing">준비중</SelectItem>
                <SelectItem value="shipping">배송중</SelectItem>
                <SelectItem value="delivered">배송완료</SelectItem>
                <SelectItem value="cancelled">취소</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left - Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Order Items */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Package className="h-5 w-5 text-primary" />
                주문 상품
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderData.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted text-sm font-semibold text-muted-foreground">
                      {item.image}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">수량: {item.qty}개</p>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {(item.price * item.qty).toLocaleString()}원
                    </p>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">상품 합계</span>
                  <span className="text-foreground">{orderData.payment.subtotal.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">배송비</span>
                  <span className="text-foreground">+{orderData.payment.shipping.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">할인</span>
                  <span className="text-primary">{orderData.payment.discount.toLocaleString()}원</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-foreground">총 결제금액</span>
                  <span className="text-lg font-bold text-primary">
                    {orderData.payment.total.toLocaleString()}원
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Info */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Truck className="h-5 w-5 text-primary" />
                배송 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl bg-muted/40 p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      ({orderData.shipping.zipCode}) {orderData.shipping.address}
                    </p>
                    <p className="text-sm text-muted-foreground">{orderData.shipping.addressDetail}</p>
                  </div>
                </div>
                {orderData.shipping.memo && (
                  <div className="flex items-start gap-3">
                    <MessageSquare className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{orderData.shipping.memo}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">택배사</p>
                    <p className="text-sm font-medium text-foreground">{orderData.shipping.carrier}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">송장번호</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-primary">{orderData.shipping.trackingNumber}</p>
                      <button className="text-muted-foreground hover:text-foreground">
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Memo */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <MessageSquare className="h-5 w-5 text-primary" />
                관리자 메모
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                {memos.map((memo, i) => (
                  <div key={i} className="rounded-xl bg-muted/40 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-foreground">{memo.author}</span>
                      <span className="text-xs text-muted-foreground">{memo.date}</span>
                    </div>
                    <p className="text-sm text-foreground">{memo.text}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Textarea
                  placeholder="메모를 남겨보세요..."
                  value={newMemo}
                  onChange={(e) => setNewMemo(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
              </div>
              <div className="mt-2 flex justify-end">
                <Button size="sm" onClick={handleAddMemo}>메모 추가</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right - Side Info */}
        <div className="space-y-6">
          {/* Customer */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <User className="h-5 w-5 text-primary" />
                고객 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-sm font-semibold text-primary">
                    {orderData.customer.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{orderData.customer.name}</p>
                  <p className="text-xs text-muted-foreground">일반 고객</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{orderData.customer.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{orderData.customer.email}</span>
                </div>
              </div>
              <Separator />
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">이 고객의 총 주문</p>
                <p className="text-lg font-bold text-foreground">7건</p>
                <p className="text-xs text-muted-foreground">총 320,000원</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <CreditCard className="h-5 w-5 text-primary" />
                결제 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">결제 수단</span>
                <span className="text-sm font-medium text-foreground">{orderData.payment.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">결제 일시</span>
                <span className="text-sm text-foreground">{orderData.payment.paidAt}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-foreground">결제 금액</span>
                <span className="text-sm font-bold text-primary">
                  {orderData.payment.total.toLocaleString()}원
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Clock className="h-5 w-5 text-primary" />
                주문 타임라인
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {orderData.timeline.map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-full",
                          step.done
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {step.done ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-current" />
                        )}
                      </div>
                      {i < orderData.timeline.length - 1 && (
                        <div
                          className={cn(
                            "w-px flex-1 my-1",
                            step.done ? "bg-primary/30" : "bg-border"
                          )}
                          style={{ minHeight: "20px" }}
                        />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className={cn("text-sm font-medium", step.done ? "text-foreground" : "text-muted-foreground")}>
                        {step.label}
                      </p>
                      {step.date && (
                        <p className="text-xs text-muted-foreground">{step.date}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
