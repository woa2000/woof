// src/types/dashboard.ts
export interface UserPreferences {
  role: 'veterinario' | 'gestor' | 'marketing' | 'admin';
  dashboardLayout: 'compact' | 'detailed' | 'focus';
  priorityMetrics: string[];
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  workingHours: {
    start: string;
    end: string;
    timezone: string;
  };
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'lead' | 'campaign' | 'content' | 'report';
  userId?: string;
  metadata?: Record<string, any>;
}

export interface DashboardContext {
  currentTime: Date;
  businessHours: boolean;
  userRole: UserPreferences['role'];
  activeAlerts: Alert[];
  recentActivity: Activity[];
  suggestedActions: SuggestedAction[];
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  priority: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  timestamp: string;
  actionable: boolean;
  category: 'financial' | 'operational' | 'marketing' | 'system';
  dismissed: boolean;
  autoResolve?: Date;
}

export interface SuggestedAction {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  estimatedTime: string;
  deadline?: Date;
  context: string;
  action: () => void;
}

export interface MetricConfig {
  id: string;
  title: string;
  visible: boolean;
  order: number;
  comparison: 'previous_period' | 'goal' | 'benchmark';
  alertThresholds: {
    low?: number;
    high?: number;
  };
}
