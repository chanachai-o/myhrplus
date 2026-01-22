export const environment = {
  production: true,
  apiBaseUrl: 'https://demo.myhr.co.th/hr',
  oisUrl: 'https://myhrplus.myhr.co.th/api/ois',  // For /api/ois endpoints (Organization/Company module)
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

