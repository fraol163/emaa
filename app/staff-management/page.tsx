'use client';

import AppLayout from '@/src/components/layout/AppLayout';
import StaffManagementTab from '@/src/components/staff-management/StaffManagementTab';

export default function StaffManagementPage() {
  return (
    <AppLayout>
      <StaffManagementTab />
    </AppLayout>
  );
}
