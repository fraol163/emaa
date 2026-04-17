'use client';

import { useState } from 'react';
import AppLayout from '@/src/components/layout/AppLayout';
import FeedbackTab from '@/src/components/feedback/FeedbackTab';
import RequestsTab from '@/src/components/requests/RequestsTab';
import StaffManagementTab from '@/src/components/staff-management/StaffManagementTab';
import { MessageSquare, Bell, Users } from 'lucide-react';

const tabs = [
  { id: 'feedback', label: 'Guest Feedback', icon: MessageSquare },
  { id: 'requests', label: 'Requests', icon: Bell },
  { id: 'staff', label: 'Staff Management', icon: Users },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('feedback');

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage feedback, requests, and staff from one place
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 border-b border-border pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'feedback' && <FeedbackTab />}
          {activeTab === 'requests' && <RequestsTab />}
          {activeTab === 'staff' && <StaffManagementTab />}
        </div>
      </div>
    </AppLayout>
  );
}
