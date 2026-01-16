export const environment = {
  production: false,
  // Base URLs - following hrplus-std-rd pattern
  baseUrl: 'https://hrplus-std.myhr.co.th/plus',  // For /plus endpoints
  jbossUrl: 'http://192.168.30.71:8082/hr',   // For /hr endpoints (main API)
  rootUrl: 'https://hrplus-std.myhr.co.th',       // Root URL without path
  // Legacy support - keep for backward compatibility
  apiBaseUrl: 'http://192.168.30.71:8082/hr', // Alias for jbossUrl
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

