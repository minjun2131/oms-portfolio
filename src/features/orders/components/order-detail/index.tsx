"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
import { toast } from "sonner";
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
import { useOrder } from "../../hooks/queries/use-order";
import { updateOrderStatusAction } from "../../actions/update-order-status";
import { deleteOrderAction } from "../../actions/delete-order";

const statusConfig: Record<string, { label: string; className: string }> = {
  paid: { label: "결제완료", className: "bg-[oklch(0.65_0.18_145)]/10 text-[oklch(0.5_0.18_145)]" },
  preparing: { label: "준비중", className: "bg-[oklch(0.75_0.15_85)]/15 text-[oklch(0.55_0.15_85)]" },
  shipping: { label: "배송중", className: "bg-primary/10 text-primary" },
  delivered: { label: "배송완료", className: "bg-muted text-muted-foreground" },
  cancelled: { label: "취소", className: "bg-destructive/10 text-destructive" },
};

export function OrderDetail() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const { data: order, isLoading, error: queryError } = useOrder(orderId);

  const [isUpdating, setIsUpdating] = useState(false);
  const [carrier, setCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [memo, setMemo] = useState("");

  if (isLoading) return <div className="flex h-96 items-center justify-center">Loading...</div>;
  if (queryError || !order) return <div className="p-8 text-center text-destructive">주문을 불러오는 중 오류가 발생했습니다.</div>;

  const currentStatus = statusConfig[order.status] || statusConfig.preparing;

  const handleUpdateStatus = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const result = await updateOrderStatusAction(orderId, { status: newStatus });
      if (result.success) {
        toast.success("상태가 업데이트되었습니다.");
      } else {
        toast.error(result.message || "상태 업데이트 중 오류가 발생했습니다.");
      }
    } catch (err) {
      toast.error("업데이트 중 오류가 발생했습니다.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateShipping = async () => {
    setIsUpdating(true);
    try {
      const result = await updateOrderStatusAction(orderId, {
        carrier: carrier || order.carrier,
        tracking_number: trackingNumber || order.tracking_number,
      });
      if (result.success) {
        toast.success("배송 정보가 업데이트되었습니다.");
      } else {
        toast.error(result.message || "배송 정보 수정 중 오류가 발생했습니다.");
      }
    } catch (err) {
      toast.error("업데이트 중 오류가 발생했습니다.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateMemo = async () => {
    if (!memo.trim()) return;
    setIsUpdating(true);
    try {
      const result = await updateOrderStatusAction(orderId, { order_memo: memo });
      if (result.success) {
        toast.success("메모가 업데이트되었습니다.");
        setMemo("");
      } else {
        toast.error(result.message || "메모 업데이트 중 오류가 발생했습니다.");
      }
    } catch (err) {
      toast.error("업데이트 중 오류가 발생했습니다.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (!window.confirm("정말로 이 주문을 삭제하시겠습니까? 삭제된 정보는 복구할 수 없습니다.")) {
      return;
    }

    setIsUpdating(true);
    try {
      const result = await deleteOrderAction(orderId);
      if (result.success) {
        toast.success("주문이 삭제되었습니다.");
        router.push("/orders");
      } else {
        toast.error(result.message || "주문 삭제 중 오류가 발생했습니다.");
      }
    } catch (err) {
      toast.error("삭제 중 오류가 발생했습니다.");
    } finally {
      setIsUpdating(false);
    }
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
                <h1 className="text-2xl font-bold text-foreground">{order.id.split("-")[0].toUpperCase()}</h1>
                <Badge variant="secondary" className={cn("border-0 font-medium", currentStatus.className)}>
                  {currentStatus.label}
                </Badge>
              </div>
              <p className="mt-1 text-muted-foreground">
                {new Date(order.created_at).toLocaleString()} 주문
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
                <DropdownMenuItem
                  className="text-destructive font-semibold"
                  onClick={handleDeleteOrder}
                  disabled={isUpdating}
                >
                  주문 삭제
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Select
              defaultValue={order.status}
              onValueChange={handleUpdateStatus}
              disabled={isUpdating}
            >
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
                {order.order_items.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted text-xs font-semibold text-muted-foreground overflow-hidden text-center p-1">
                      {item.product_name.substring(0, 4)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{item.product_name}</p>
                      <p className="text-xs text-muted-foreground">옵션: {item.variant || "기본"} / 수량: {item.quantity}개</p>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {(item.price * item.quantity).toLocaleString()}원
                    </p>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">상품 합계</span>
                  <span className="text-foreground">{order.subtotal_amount.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">배송비</span>
                  <span className="text-foreground">+{order.shipping_cost.toLocaleString()}원</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-foreground">총 결제금액</span>
                  <span className="text-lg font-bold text-primary">
                    {order.total_amount.toLocaleString()}원
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
                      ({order.zipcode}) {order.address}
                    </p>
                    <p className="text-sm text-muted-foreground">{order.address_detail}</p>
                  </div>
                </div>
                {order.delivery_memo && (
                  <div className="flex items-start gap-3">
                    <MessageSquare className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{order.delivery_memo}</p>
                  </div>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">택배사</p>
                  <Select
                    defaultValue={order.carrier || ""}
                    onValueChange={setCarrier}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="택배사 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CJ대한통운">CJ대한통운</SelectItem>
                      <SelectItem value="한진택배">한진택배</SelectItem>
                      <SelectItem value="롯데택배">롯데택배</SelectItem>
                      <SelectItem value="우체국택배">우체국택배</SelectItem>
                      <SelectItem value="로젠택배">로젠택배</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">송장번호</p>
                  <div className="flex gap-2">
                    <Input
                      placeholder="송장번호 입력"
                      defaultValue={order.tracking_number || ""}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="h-10"
                    />
                    <Button
                      size="sm"
                      onClick={handleUpdateShipping}
                      disabled={isUpdating}
                    >
                      저장
                    </Button>
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
                {order.order_memo ? (
                  <div className="rounded-xl bg-muted/40 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-foreground">관리자</span>
                      <span className="text-xs text-muted-foreground">{new Date(order.updated_at).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-foreground">{order.order_memo}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground py-4 text-center">등록된 메모가 없습니다.</p>
                )}
              </div>
              <div className="space-y-2">
                <Textarea
                  placeholder="메모를 남겨보세요..."
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
                <div className="flex justify-end">
                  <Button size="sm" onClick={handleUpdateMemo} disabled={isUpdating}>메모 저장</Button>
                </div>
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
                    {order.customer_name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{order.customer_name}</p>
                  <p className="text-xs text-muted-foreground">일반 고객</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{order.customer_phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{order.customer_email || "이메일 없음"}</span>
                </div>
              </div>
              <Separator />
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">이 고객의 총 주문</p>
                <p className="text-lg font-bold text-foreground">1건</p>
                <p className="text-xs text-muted-foreground">총 {order.total_amount.toLocaleString()}원</p>
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
                <span className="text-sm font-medium text-foreground">{order.payment_method || "정보 없음"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">결제 상태</span>
                <span className="text-sm text-foreground uppercase">{order.payment_status}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-foreground">결제 금액</span>
                <span className="text-sm font-bold text-primary">
                  {order.total_amount.toLocaleString()}원
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
                {[
                  { label: "주문 접수", done: true, date: new Date(order.created_at).toLocaleString() },
                  { label: "발송 준비", done: ["preparing", "shipping", "delivered"].includes(order.status) },
                  { label: "발송 완료", done: ["shipping", "delivered"].includes(order.status) },
                  { label: "배송 중", done: ["shipping", "delivered"].includes(order.status) },
                  { label: "배송 완료", done: order.status === "delivered" },
                ].map((step, i, arr) => (
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
                      {i < arr.length - 1 && (
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
