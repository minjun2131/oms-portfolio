"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Store,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronDown,
  LogOut,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PreparingModal } from "@/components/shared/preparing-modal";


interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
  children?: { label: string; href: string }[];
  onClick?: (e: React.MouseEvent) => void;
}

interface SidebarProps {
  profile?: {
    email: string;
    avatar_url: string | null;
  } | null;
}

export function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPreparingOpen, setIsPreparingOpen] = useState(false);

  const navItems: NavItem[] = React.useMemo(() => [
    {
      label: "대시보드",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/",
    },
    {
      label: "상품 관리",
      icon: <Package className="h-5 w-5" />,
      href: "/products",
      children: [
        { label: "전체 상품", href: "/products" },
        { label: "상품 등록", href: "/products/new" },
        { label: "재고 관리", href: "/products/inventory" },
      ],
    },
    {
      label: "주문 관리",
      icon: <ShoppingCart className="h-5 w-5" />,
      href: "/orders",
      badge: 12,
      children: [
        { label: "주문 목록", href: "/orders" },
        { label: "주문 등록", href: "/orders/new" },
      ],
    },
    {
      label: "점포 관리",
      icon: <Store className="h-5 w-5" />,
      href: "#",
      onClick: (e) => {
        e.preventDefault();
        setIsPreparingOpen(true);
      }
    },
    {
      label: "매출 리포트",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/reports",
    },
  ], []);

  const bottomNavItems: NavItem[] = React.useMemo(() => [
    {
      label: "설정",
      icon: <Settings className="h-5 w-5" />,
      href: "/settings",
    },
    {
      label: "도움말",
      icon: <HelpCircle className="h-5 w-5" />,
      href: "/help",
    },
  ], []);

  const [expandedItem, setExpandedItem] = useState<string | null>(() => {
    // 현재 경로에 맞는 카테고리를 미리 펼쳐둠
    const activeParent = navItems.find(item => 
      item.children?.some(child => pathname === child.href || pathname.startsWith(child.href + "/"))
    );
    return activeParent ? activeParent.label : null;
  });


  const toggleExpand = (label: string) => {
    setExpandedItem(expandedItem === label ? null : label);
  };

  // 활성화 상태 체크 함수
  const isPathActive = (href: string, exact = false) => {
    if (exact || href === "/") return pathname === href;
    return pathname.startsWith(href);
  };

  const renderSidebarContent = () => {
    const defaultName = profile?.email ? profile.email.split('@')[0] : "Admin";
    const initial = defaultName.charAt(0).toUpperCase();

    return (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <h1 className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="셀러플로우"
            width={36}
            height={36}
            className="rounded-lg"
          />
          <span className="text-lg font-semibold text-sidebar-foreground">
            셀러플로우
          </span>
        </h1>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.label}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleExpand(item.label)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      {item.icon}
                      {item.label}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        expandedItem === item.label && "rotate-180"
                      )}
                    />
                  </button>
                  {expandedItem === item.label && (
                    <ul className="mt-1 ml-4 space-y-1 border-l border-sidebar-border pl-4">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={cn(
                              "block rounded-lg px-3 py-2 text-sm transition-colors",
                              isPathActive(child.href, true)
                                ? "bg-sidebar-accent text-sidebar-primary font-medium"
                                : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                            )}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  onClick={item.onClick}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isPathActive(item.href)
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <span className="flex items-center gap-3">
                    {item.icon}
                    {item.label}
                  </span>
                  {item.badge && (
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary text-xs px-2"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-sidebar-border px-3 py-4">
        <ul className="space-y-1">
          {bottomNavItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* User Profile */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
              {initial}
            </AvatarFallback>
            {profile?.avatar_url && (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover rounded-full" />
            )}
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {defaultName}
            </p>
            <p className="text-xs text-sidebar-foreground/60 truncate">
              {profile?.email || "admin@example.com"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={async () => {
              const { createClient } = await import('@/lib/supabase/client');
              const supabase = createClient();
              await supabase.auth.signOut();
              window.location.href = '/login';
            }}
            className="h-8 w-8 text-sidebar-foreground/60 hover:text-sidebar-foreground"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-sidebar border-b border-sidebar-border px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="셀러플로우"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="text-base font-semibold text-sidebar-foreground">
            셀러플로우
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Bell className="h-5 w-5 text-sidebar-foreground/70" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed top-14 left-0 z-40 h-[calc(100vh-3.5rem)] w-72 transform bg-sidebar transition-transform duration-300 ease-in-out lg:hidden",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {renderSidebarContent()}
        </div>
      </aside>

      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        {renderSidebarContent()}
      </aside>

      <PreparingModal isOpen={isPreparingOpen} onOpenChange={setIsPreparingOpen} />
    </>
  );
}
