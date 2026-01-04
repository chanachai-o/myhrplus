export interface NestedMenuItem {
  text: string;
  id: string;
  iconCss?: string;
  route?: string;
  badge?: string;
  badgeColor?: string;
  child?: NestedMenuItem[];
}

export interface MainModule {
  id: string;
  name: string;
  iconCss: string;
  menuItems: NestedMenuItem[];
}

/**
 * Sidebar Modules Configuration
 * IVAP Frontend - Intelligent Video Analytics Platform
 */
export const PREDEFINED_MODULES: MainModule[] = [
  {
    id: 'ivap',
    name: 'IVAP',
    iconCss: 'e-icons e-dashboard',
    menuItems: [
      {
        text: 'Dashboard',
        id: 'ivap-dashboard',
        iconCss: 'e-icons e-dashboard',
        route: '/ivap/dashboard'
      },
      {
        text: 'Organization',
        id: 'ivap-organization',
        iconCss: 'e-icons e-briefcase',
        route: '/ivap/organization'
      },
      {
        text: 'Time & Attendance',
        id: 'ivap-time-attendance',
        iconCss: 'e-icons e-clock',
        route: '/ivap/time-attendance'
      },
      {
        text: 'Visitors',
        id: 'ivap-visitors',
        iconCss: 'e-icons e-user',
        route: '/ivap/visitors'
      },
      {
        text: 'Guests',
        id: 'ivap-guests',
        iconCss: 'e-icons e-people',
        route: '/ivap/guests'
      },
      {
        text: 'Events',
        id: 'ivap-events',
        iconCss: 'e-icons e-calendar',
        route: '/ivap/events'
      },
      {
        text: 'Access Control',
        id: 'ivap-access-control',
        iconCss: 'e-icons e-lock',
        route: '/ivap/access-control'
      },
      {
        text: 'Devices',
        id: 'ivap-devices',
        iconCss: 'e-icons e-devices',
        route: '/ivap/devices'
      },
      {
        text: 'Verification',
        id: 'ivap-verification',
        iconCss: 'e-icons e-verified',
        route: '/ivap/verification'
      },
      {
        text: 'Biometric',
        id: 'ivap-biometric',
        iconCss: 'e-icons e-face',
        route: '/ivap/biometric'
      },
      {
        text: 'Vehicles',
        id: 'ivap-vehicles',
        iconCss: 'e-icons e-car',
        route: '/ivap/vehicles'
      },
      {
        text: 'Parking',
        id: 'ivap-parking',
        iconCss: 'e-icons e-parking',
        route: '/ivap/parking'
      },
      {
        text: 'QR & RFID',
        id: 'ivap-qr-rfid',
        iconCss: 'e-icons e-qr-code',
        route: '/ivap/qr-rfid'
      },
      {
        text: 'Notifications',
        id: 'ivap-notifications',
        iconCss: 'e-icons e-notifications',
        route: '/ivap/notifications'
      },
      {
        text: 'Analytics',
        id: 'ivap-analytics',
        iconCss: 'e-icons e-chart',
        route: '/ivap/analytics'
      },
      {
        text: 'Video & AI',
        id: 'ivap-video-ai',
        iconCss: 'e-icons e-video',
        route: '/ivap/video-ai'
      },
      {
        text: 'System',
        id: 'ivap-system',
        iconCss: 'e-icons e-settings',
        route: '/ivap/system'
      }
    ]
  }
];

export const MODULE_ROUTE_MAP: { [key: string]: string } = {
  'ivap': 'ivap',
  'dashboard': 'ivap',
  'home': 'ivap'
};

