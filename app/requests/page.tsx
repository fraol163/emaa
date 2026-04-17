'use client';

import AppLayout from '@/src/components/layout/AppLayout';
import RequestsTab from '@/src/components/requests/RequestsTab';

export default function RequestsPage() {
  return (
    <AppLayout>
      <RequestsTab />
    </AppLayout>
  );
}
