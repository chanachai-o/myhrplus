export const environment = {
  production: false,
  // Base URLs - following myhrplus-rd pattern
  baseUrl: 'https://myhrplus.myhr.co.th/plus',  // For /plus endpoints
  jbossUrl: 'https://myhrplus.myhr.co.th/hr',   // For /hr endpoints (main API)
  rootUrl: 'https://myhrplus.myhr.co.th',       // Root URL without path
  // Legacy support - keep for backward compatibility
  apiBaseUrl: 'https://myhrplus.myhr.co.th/api', // Alias for jbossUrl
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
    unsecure: '/usapi',
    organization: '/ois'
  },
  appName: 'myHR+',
  version: '1.0.0'
};

