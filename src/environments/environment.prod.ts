export const environment = {
  production: true,
  // IVAP API Base URLs (Production)
  baseUrl: 'https://api.ivap.example.com',              // IVAP API base URL (production)
  apiVersion: '/api/v1',                                // API version path
  rootUrl: 'https://api.ivap.example.com',              // Root URL without path

  // Legacy support - keep for backward compatibility (if needed)
  apiBaseUrl: 'https://api.ivap.example.com/api/v1',  // Full API base URL

  // IVAP API Endpoints
  apiEndpoints: {
    auth: '/auth',
    companies: '/companies',
    employees: '/employees',
    visitors: '/visitors',
    guests: '/guests',
    events: '/events',
    vehicles: '/vehicles',
    parking: '/parking',
    devices: '/devices',
    doors: '/doors',
    timestamps: '/timestamps',
    shifts: '/shifts',
    leaves: '/leaves',
    accessControl: '/access-control',
    verification: '/verification',
    analytics: '/analytics',
    monitoring: '/monitoring',
    alerts: '/alerts',
    system: '/system'
  },
  appName: 'IVAP Frontend',
  version: '1.0.0'
};

