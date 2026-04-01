"use client";

import { useState } from 'react';
import {
  User,
  Bell,
  Lock,
  LogOut,
  ChevronRight,
  Save,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SettingsClientProps {
  initialProfile: {
    email: string;
    fullName: string;
    phone: string;
    company: string;
    address: string;
  };
  isSubscribed: boolean;
  onLogout: () => Promise<void>;
}

export function SettingsClient({ initialProfile, isSubscribed, onLogout }: SettingsClientProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotification: true,
    smsNotification: false,
    orderUpdate: true,
    shipmentUpdate: true,
    weeklyReport: true,
  });

  const [profileData, setProfileData] = useState(initialProfile);

  const handleProfileChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    // API 호출 위치 (Supabase 갱신 로직 추가 가능)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('설정이 저장되었습니다.');
  };

  const handleNotificationChange = (key: string) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  return (
    <div className="max-w-4xl pb-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">설정</h1>

      {/* 구독 상태 섹션 */}
      {!isSubscribed ? (
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                셀러플로우 PRO 플랜으로 업그레이드하세요
              </h2>
              <p className="text-sm text-gray-600">
                고급 기능을 사용하여 더욱 효율적으로 사업을 관리해보세요.
              </p>
            </div>
            <Button 
              onClick={() => window.location.href = '/subscribe'}
              className="bg-primary hover:bg-primary/90"
            >
              구독하기
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-green-900">
                  PRO 플랜 구독 중
                </h2>
                <p className="text-sm text-green-700">
                  모든 프리미엄 기능을 사용할 수 있습니다.
                </p>
              </div>
            </div>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/subscribe'}
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              플랜 관리
            </Button>
          </div>
        </div>
      )}

      {/* 프로필 섹션 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-gray-900">
            프로필 설정
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이름
            </label>
            <Input
              value={profileData.fullName}
              onChange={(e) =>
                handleProfileChange('fullName', e.target.value)
              }
              placeholder="성명"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이메일
            </label>
            <Input
              type="email"
              value={profileData.email}
              onChange={(e) => handleProfileChange('email', e.target.value)}
              placeholder="이메일"
              className="bg-gray-50 text-gray-500"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">
              이메일은 변경할 수 없습니다.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              전화번호
            </label>
            <Input
              value={profileData.phone}
              onChange={(e) => handleProfileChange('phone', e.target.value)}
              placeholder="010-0000-0000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              회사명
            </label>
            <Input
              value={profileData.company}
              onChange={(e) =>
                handleProfileChange('company', e.target.value)
              }
              placeholder="회사명"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              주소
            </label>
            <Input
              value={profileData.address}
              onChange={(e) =>
                handleProfileChange('address', e.target.value)
              }
              placeholder="주소"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  저장 중...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  저장
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* 알림 설정 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-gray-900">
            알림 설정
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              key: 'emailNotification',
              label: '이메일 알림',
              description: '중요한 알림을 이메일로 받습니다.',
            },
            {
              key: 'smsNotification',
              label: 'SMS 알림',
              description: '긴급 알림을 문자로 받습니다.',
            },
            {
              key: 'orderUpdate',
              label: '주문 업데이트',
              description: '새 주문과 주문 상태 변경 알림을 받습니다.',
            },
            {
              key: 'shipmentUpdate',
              label: '배송 업데이트',
              description: '배송 상태 변경 및 배송 완료 알림을 받습니다.',
            },
            {
              key: 'weeklyReport',
              label: '주간 리포트',
              description: '매주 월요일 판매 현황 리포트를 받습니다.',
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    notificationSettings[
                      item.key as keyof typeof notificationSettings
                    ]
                  }
                  onChange={() => handleNotificationChange(item.key)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary"
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* 보안 설정 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-gray-900">
            보안 설정
          </h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="font-medium text-blue-900 mb-2">비밀번호 변경</p>
            <p className="text-sm text-blue-700 mb-4">
              정기적으로 비밀번호를 변경하여 계정을 더욱 안전하게 보호하세요.
            </p>
            <Button variant="outline" className="w-full bg-white border-blue-200 text-blue-700 hover:bg-blue-50">
              비밀번호 변경
            </Button>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-gray-900">
                  두 단계 인증 (2FA)
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  추가 보안 계층을 활성화합니다.
                </p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                활성화됨
              </span>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">
                  로그인 히스토리
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  최근 로그인 기록을 확인합니다.
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* 계정 관리 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <LogOut className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-gray-900">
            계정 관리
          </h2>
        </div>

        <div className="p-4 border border-red-100 bg-red-50 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium text-red-900">로그아웃</p>
              <p className="text-sm text-red-700 mt-1">
                모든 기기에서 로그아웃합니다.
              </p>
            </div>
            <Button variant="outline" onClick={onLogout} className="text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700">
              <LogOut className="w-4 h-4 mr-2" />
              로그아웃
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
