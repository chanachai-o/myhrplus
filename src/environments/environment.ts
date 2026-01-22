export const environment = {
  production: false,
  // Base URLs - following myhrplus-rd pattern
  baseUrl: 'https://hrplus-std.myhr.co.th/plus',  // For /plus endpoints
  jbossUrl: 'https://hrplus-std.myhr.co.th/hr',   // For /hr endpoints (main API)
  rootUrl: 'https://hrplus-std.myhr.co.th',       // Root URL without path
  oisUrl: 'https://myhrplus.myhr.co.th/api/ois',  // For /api/ois endpoints (Organization/Company module)
  // Legacy support - keep for backward compatibility
  apiBaseUrl: 'https://hrplus-std.myhr.co.th/hr', // Alias for jbossUrl
  apiEndpoints: {
    auth: '/restauthen',
    core: '/capi',
    workflow: '/wapi',
    timeAttendance: '/taapi',
    training: '/trapi',
    employeeView: '/emvapi',
    appraisal: '/apsapi',
    payroll: '/prapi',
    welfare: '/welapi',
    recruit: '/reapi',
    unsecure: '/usapi'
  },
  appName: 'HR System',
  version: '1.0.0'
};

