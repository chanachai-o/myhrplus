# Environment Configuration Summary

## URL Structure (ตาม hrplus-std-rd)

### Environment Variables

```typescript
export const environment = {
  production: false,
  // Base URLs - following hrplus-std-rd pattern
  baseUrl: 'https://hrplus-std.myhr.co.th/plus',  // For /plus endpoints
  jbossUrl: 'https://hrplus-std.myhr.co.th/hr',   // For /hr endpoints (main API)
  rootUrl: 'https://hrplus-std.myhr.co.th',       // Root URL without path
  // Legacy support - keep for backward compatibility
  apiBaseUrl: 'https://hrplus-std.myhr.co.th/hr', // Alias for jbossUrl
  // ... apiEndpoints
};
```

### Usage Pattern

#### 1. `/hr` Endpoints (ใช้ `jbossUrl`)
- **Authentication**: `${jbossUrl}/usapi/authen`
- **Menu Config**: `${jbossUrl}/capi/config/menu/emv_menu`
- **API Endpoints**: `${jbossUrl}${apiEndpoints.core}`, `${jbossUrl}${apiEndpoints.workflow}`, etc.
- **File Viewer**: `${jbossUrl}/FileViewer.jsp?uploadfield=...&filename=...`

#### 2. `/plus` Endpoints (ใช้ `baseUrl`)
- **User Management**: `${baseUrl}/user/manage`
- **Other Plus APIs**: `${baseUrl}/...`

#### 3. Root URL (ใช้ `rootUrl`)
- **File Downloads**: `${rootUrl}/hr/FileDownload...`

### Files Updated

1. **environment.ts**
   - เพิ่ม `baseUrl`, `jbossUrl`, `rootUrl`
   - เก็บ `apiBaseUrl` สำหรับ backward compatibility

2. **home.service.ts**
   - เปลี่ยนจาก `apiBaseUrl.replace('/hr', '')` → `jbossUrl`
   - URL: `${jbossUrl}/capi/config/menu/emv_menu`

3. **employee.service.ts**
   - เปลี่ยนจาก `apiBaseUrl.replace('/hr', '') + '/plus'` → `baseUrl`
   - URL: `${baseUrl}/user/manage`

4. **auth.service.ts**
   - เปลี่ยนจาก `apiBaseUrl` → `jbossUrl` สำหรับทุก endpoint
   - URLs:
     - `${jbossUrl}/usapi/authen`
     - `${jbossUrl}/usapi/system/get-db-list`
     - `${jbossUrl}/restauthen/logout`
     - `${jbossUrl}/restauthen/refresh`

5. **menu.service.ts**
   - เปลี่ยนจาก `apiBaseUrl` → `jbossUrl`
   - URL: `${jbossUrl}/usapi/menu`

6. **login.component.ts**
   - เปลี่ยนจาก `apiBaseUrl` → `jbossUrl`
   - URL: `${jbossUrl}/TOKENVERFY.jsp`

7. **api.service.ts**
   - เปลี่ยนจาก `apiBaseUrl` → `jbossUrl`
   - Base URL สำหรับ generic API calls

### Migration Notes

- **Legacy Support**: `apiBaseUrl` ยังคงมีอยู่เพื่อ backward compatibility
- **Recommendation**: ควร migrate ทุกที่ให้ใช้ `jbossUrl` หรือ `baseUrl` ตามประเภท endpoint
- **Pattern**: 
  - `/hr/*` → ใช้ `jbossUrl`
  - `/plus/*` → ใช้ `baseUrl`
  - Root files → ใช้ `rootUrl`




