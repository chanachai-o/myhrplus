/**
 * Navigation Constants
 * Constants สำหรับ sidebar navigation structure
 * รองรับ Rail + Drawer structure (Two-layer sidebar)
 */

export interface NavigationChild {
  label: string;
  route?: string; // Optional - parent groups may not have routes
  icon?: string;
  roles?: string[];
  badge?: string;
  badgeColor?: string;
  expanded?: boolean; // For accordion/collapsible state
  children?: NavigationChild[]; // Support nested children for sub-modules (up to 4 levels)
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;              // Icon หลักใน Rail ซ้ายสุด
  roles: string[];          // ['user', 'admin'] - ใครเห็นได้บ้าง
  route?: string;            // Optional - Dashboard route สำหรับโมดูล (หน้าแรกของโมดูล)
  children?: NavigationChild[]; // รายการที่จะไปโผล่ใน Drawer (Rail ที่ 2)
  badge?: string;
  badgeColor?: string;
}

/**
 * Navigation Items Configuration
 * กำหนดโครงสร้างเมนูสำหรับ sidebar
 * IVAP Frontend - Intelligent Video Analytics Platform
 */
export const NAVIGATION_ITEMS: NavigationItem[] = [
  // IVAP Main Navigation
  {
    id: 'ivap',
    label: 'IVAP',
    icon: 'dashboard', // icon หลักใน Rail ซ้ายสุด
    roles: ['user', 'admin'], // ทุกคนเห็น
    route: '/ivap/dashboard', // Dashboard route - หน้าแรกของโมดูล
    children: [
      // Dashboard
      {
        label: 'Dashboard',
        route: '/ivap/dashboard',
        icon: 'dashboard'
      },
      // Organization Management
      {
        label: 'Organization',
        icon: 'business',
        route: '/ivap/organization',
        children: [
          { label: 'Companies', route: '/ivap/organization/companies', icon: 'business' },
          { label: 'Departments', route: '/ivap/organization/departments', icon: 'corporate_fare' },
          { label: 'Positions', route: '/ivap/organization/positions', icon: 'work' },
          { label: 'Employees', route: '/ivap/organization/employees', icon: 'people' },
          { label: 'Members', route: '/ivap/organization/members', icon: 'person' }
        ]
      },
      // Time & Attendance
      {
        label: 'Time & Attendance',
        icon: 'access_time',
        route: '/ivap/time-attendance',
        children: [
          { label: 'Timestamps', route: '/ivap/time-attendance/timestamps', icon: 'schedule' },
          { label: 'Shifts', route: '/ivap/time-attendance/shifts', icon: 'schedule' },
          { label: 'Leave Requests', route: '/ivap/time-attendance/leaves', icon: 'event_available' }
        ]
      },
      // Visitor Management
      {
        label: 'Visitors',
        icon: 'person',
        route: '/ivap/visitors',
        children: [
          { label: 'Visitor List', route: '/ivap/visitors', icon: 'list' },
          { label: 'Register Visitor', route: '/ivap/visitors/new', icon: 'person_add' }
        ]
      },
      // Guest Management
      {
        label: 'Guests',
        icon: 'people',
        route: '/ivap/guests',
        children: [
          { label: 'Guest List', route: '/ivap/guests', icon: 'list' },
          { label: 'Register Guest', route: '/ivap/guests/new', icon: 'person_add' },
          { label: 'Guest Registration', route: '/ivap/guests/registration', icon: 'how_to_reg' }
        ]
      },
      // Event Management
      {
        label: 'Events',
        icon: 'event',
        route: '/ivap/events',
        children: [
          { label: 'Event List', route: '/ivap/events', icon: 'list' },
          { label: 'Create Event', route: '/ivap/events/new', icon: 'add' },
          { label: 'Event Registration', route: '/ivap/events/:id/registration', icon: 'how_to_reg' }
        ]
      },
      // Access Control & Security
      {
        label: 'Access Control',
        icon: 'lock',
        route: '/ivap/access-control',
        children: [
          { label: 'Door Management', route: '/ivap/access-control/doors', icon: 'door_front' },
          { label: 'Access Rules', route: '/ivap/access-control/rules', icon: 'rule' }
        ]
      },
      {
        label: 'Devices',
        icon: 'devices',
        route: '/ivap/devices',
        children: [
          { label: 'Device List', route: '/ivap/devices', icon: 'list' },
          { label: 'Add Device', route: '/ivap/devices/new', icon: 'add' }
        ]
      },
      // Verification & Biometric
      {
        label: 'Verification',
        icon: 'verified',
        route: '/ivap/verification',
        children: [
          { label: 'Sessions', route: '/ivap/verification/sessions', icon: 'session' },
          { label: 'Templates', route: '/ivap/verification/templates', icon: 'description' },
          { label: 'Configuration', route: '/ivap/verification/config', icon: 'settings' }
        ]
      },
      {
        label: 'Biometric',
        icon: 'face',
        route: '/ivap/biometric',
        children: [
          { label: 'Face Enrollment', route: '/ivap/biometric/face-enrollment', icon: 'face' },
          { label: 'Biometric Data', route: '/ivap/biometric/biometric-data', icon: 'fingerprint' }
        ]
      },
      // Vehicle & Parking
      {
        label: 'Vehicles',
        icon: 'directions_car',
        route: '/ivap/vehicles',
        children: [
          { label: 'Vehicle List', route: '/ivap/vehicles', icon: 'list' },
          { label: 'Register Vehicle', route: '/ivap/vehicles/new', icon: 'add' }
        ]
      },
      {
        label: 'Parking',
        icon: 'local_parking',
        route: '/ivap/parking',
        children: [
          { label: 'Parking Records', route: '/ivap/parking', icon: 'list' },
          { label: 'Parking Slots', route: '/ivap/parking/slots', icon: 'view_list' }
        ]
      },
      // QR Code & RFID
      {
        label: 'QR & RFID',
        icon: 'qr_code',
        route: '/ivap/qr-rfid',
        children: [
          { label: 'QR Codes', route: '/ivap/qr-rfid/qr-codes', icon: 'qr_code' },
          { label: 'RFID Cards', route: '/ivap/qr-rfid/rfid-cards', icon: 'credit_card' }
        ]
      },
      // Notifications & Alerts
      {
        label: 'Notifications',
        icon: 'notifications',
        route: '/ivap/notifications',
        children: [
          { label: 'Notifications', route: '/ivap/notifications', icon: 'notifications' },
          { label: 'Alerts', route: '/ivap/notifications/alerts', icon: 'warning' }
        ]
      },
      // Analytics & Reporting
      {
        label: 'Analytics',
        icon: 'analytics',
        route: '/ivap/analytics',
        children: [
          { label: 'Reports', route: '/ivap/analytics/reports', icon: 'assessment' },
          { label: 'Monitoring', route: '/ivap/analytics/monitoring', icon: 'monitor' }
        ]
      },
      // Video Analytics & AI
      {
        label: 'Video & AI',
        icon: 'videocam',
        route: '/ivap/video-ai',
        children: [
          { label: 'Video Analytics', route: '/ivap/video-ai/video-analytics', icon: 'videocam' },
          { label: 'AI Models', route: '/ivap/video-ai/ai-models', icon: 'smart_toy' }
        ]
      },
      // System Administration
      {
        label: 'System',
        icon: 'settings',
        route: '/ivap/system',
        children: [
          { label: 'Settings', route: '/ivap/system/settings', icon: 'settings' },
          { label: 'Logs', route: '/ivap/system/logs', icon: 'description' },
          { label: 'Safety Dashboard', route: '/ivap/system/safety', icon: 'security' }
        ]
      }
    ]
  }
];

/**
 * Get navigation items filtered by user roles
 * @param userRoles User roles array
 * @returns Filtered navigation items
 */
export function getNavigationItemsByRoles(userRoles: string[]): NavigationItem[] {
  // Always return all navigation items - admin by default
  // No role filtering - everyone sees admin menu
  return NAVIGATION_ITEMS.map(item => {
    // Return all children without filtering
    if (item.children) {
      return { ...item, children: item.children };
    }
    return item;
  });
}

/**
 * Get navigation item by ID
 * @param id Navigation item ID
 * @returns Navigation item or null
 */
export function getNavigationItemById(id: string): NavigationItem | null {
  return NAVIGATION_ITEMS.find(item => item.id === id) || null;
}

/**
 * Get navigation child by route
 * @param route Route path
 * @returns Navigation child or null
 */
export function getNavigationChildByRoute(route: string): NavigationChild | null {
  for (const item of NAVIGATION_ITEMS) {
    if (item.children) {
      const child = item.children.find(c => c.route === route);
      if (child) {
        return child;
      }
    }
  }
  return null;
}

