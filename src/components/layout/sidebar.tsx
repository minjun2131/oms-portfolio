"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronDown,
  LogOut,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    label: "대시보드",
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: "/", // Modified from "/courses" to "/"
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
  },
  {
    label: "고객 관리",
    icon: <Users className="h-5 w-5" />,
    href: "/customers",
  },
  {
    label: "매출 분석",
    icon: <BarChart3 className="h-5 w-5" />,
    href: "/analytics",
  },
];

const bottomNavItems: NavItem[] = [
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
];

export function Sidebar() {
  const [activeItem, setActiveItem] = useState("/");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleExpand = (label: string) => {
    setExpandedItem(expandedItem === label ? null : label);
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <span className="text-sm font-bold text-primary-foreground">SF</span>
        </div>
        <span className="text-lg font-semibold text-sidebar-foreground">
          셀러플로우
        </span>
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
                            onClick={() => setActiveItem(child.href)}
                            className={cn(
                              "block rounded-lg px-3 py-2 text-sm transition-colors",
                              activeItem === child.href
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
                  onClick={() => setActiveItem(item.href)}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    activeItem === item.href
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
              김
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              김셀러
            </p>
            <p className="text-xs text-sidebar-foreground/60 truncate">
              seller@example.com
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-sidebar-foreground/60 hover:text-sidebar-foreground"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-sidebar border-b border-sidebar-border px-4 py-3 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-xs font-bold text-primary-foreground">SF</span>
          </div>
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
          <SidebarContent />
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <SidebarContent />
      </aside>
    </>
  );
}
