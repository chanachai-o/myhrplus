# คู่มือการตั้งค่า Nginx สำหรับ Angular Application

## 📋 ภาพรวม

คู่มือนี้จะช่วยคุณตั้งค่า Nginx เพื่อ:
- ✅ ลบ hash routing (`/#`) ออกจาก URL
- ✅ ใช้ HTML5 routing (PathLocationStrategy) แทน
- ✅ ตั้งค่า reverse proxy สำหรับ development และ production

## 🎯 สาเหตุของปัญหา Hash Routing

Angular ใช้ **PathLocationStrategy** เป็นค่าเริ่มต้น (ไม่ใช่ HashLocationStrategy) แต่:
- ตอนพัฒนา: Angular dev server อาจแสดง hash ถ้าไม่ได้ตั้งค่า
- ตอน production: ต้องตั้งค่า nginx ให้รองรับ HTML5 routing

## 🚀 วิธีตั้งค่า

### 1. Development Setup (ใช้ Angular Dev Server)

#### ขั้นตอนที่ 1: ตรวจสอบ Angular Routing

ตรวจสอบว่า Angular ใช้ PathLocationStrategy (ไม่ใช่ HashLocationStrategy):

```typescript
// frontend/src/app/app.config.ts
// ต้องไม่มี useHash: true
```

#### ขั้นตอนที่ 2: ตั้งค่า Nginx สำหรับ Development

1. **คัดลอกไฟล์ config:**
```bash
# Windows (PowerShell)
Copy-Item frontend/nginx.conf.dev C:\nginx\conf\nginx.conf

# Linux/Mac
sudo cp frontend/nginx.conf.dev /etc/nginx/sites-available/angular-dev
sudo ln -s /etc/nginx/sites-available/angular-dev /etc/nginx/sites-enabled/
```

2. **แก้ไข path ใน config (ถ้าจำเป็น):**
```nginx
# ตรวจสอบว่า backend ทำงานที่ port 8000
location /api/ {
    proxy_pass http://127.0.0.1:8000;
}
```

3. **ทดสอบ config:**
```bash
# Windows
C:\nginx\nginx.exe -t

# Linux/Mac
sudo nginx -t
```

4. **รีสตาร์ท nginx:**
```bash
# Windows
C:\nginx\nginx.exe -s reload

# Linux/Mac
sudo systemctl reload nginx
```

5. **รัน Angular dev server:**
```bash
cd frontend
npm start
# หรือ
ng serve
```

6. **เข้าถึงแอปผ่าน nginx:**
```
http://localhost/          # แทนที่จะเป็น http://localhost:4200/#
http://localhost/portal/dashboard
```

### 2. Production Setup (ใช้ Built Files)

#### ขั้นตอนที่ 1: Build Angular App

```bash
cd frontend
npm run build -- --configuration=production
```

Output จะอยู่ที่: `frontend/dist/frontend/browser/`

#### ขั้นตอนที่ 2: ตั้งค่า Nginx สำหรับ Production

1. **คัดลอกไฟล์ build:**
```bash
# Windows
xcopy /E /I frontend\dist\frontend\browser C:\nginx\html

# Linux/Mac
sudo cp -r frontend/dist/frontend/browser/* /var/www/angular-app/dist/frontend/browser/
sudo chown -R www-data:www-data /var/www/angular-app/
```

2. **คัดลอกไฟล์ config:**
```bash
# Windows
Copy-Item frontend/nginx.conf.prod C:\nginx\conf\nginx.conf

# Linux/Mac
sudo cp frontend/nginx.conf.prod /etc/nginx/sites-available/angular-prod
sudo ln -s /etc/nginx/sites-available/angular-prod /etc/nginx/sites-enabled/
```

3. **แก้ไข path ใน config:**
```nginx
# แก้ไข path ให้ตรงกับตำแหน่งที่คุณคัดลอกไฟล์
root /var/www/angular-app/dist/frontend/browser;  # Linux/Mac
# หรือ
root C:/nginx/html;  # Windows
```

4. **ทดสอบและรีสตาร์ท:**
```bash
# Windows
C:\nginx\nginx.exe -t
C:\nginx\nginx.exe -s reload

# Linux/Mac
sudo nginx -t
sudo systemctl reload nginx
```

5. **เข้าถึงแอป:**
```
http://localhost/          # ไม่มี hash routing
http://localhost/portal/dashboard
```

## 🔧 การตั้งค่าเพิ่มเติม

### ใช้ Custom Domain

แก้ไข `server_name` ใน nginx config:

```nginx
server {
    listen 80;
    server_name myapp.local yourdomain.com;
    # ...
}
```

### ใช้ HTTPS (SSL)

ดูตัวอย่างใน `frontend/nginx.conf.example` สำหรับการตั้งค่า SSL

### ใช้ Custom Port

แก้ไข `listen` ใน nginx config:

```nginx
server {
    listen 8080;  # ใช้ port 8080 แทน 80
    server_name localhost;
    # ...
}
```

## ✅ ตรวจสอบการทำงาน

### 1. ตรวจสอบว่าไม่มี Hash Routing

- ✅ URL ควรเป็น: `http://localhost/portal/dashboard`
- ❌ ไม่ควรเป็น: `http://localhost/#/portal/dashboard`

### 2. ตรวจสอบ API Proxy

```bash
# ทดสอบ API
curl http://localhost/api/health
```

### 3. ตรวจสอบ Static Files

```bash
# ทดสอบ static files
curl http://localhost/assets/...
```

## 🐛 แก้ไขปัญหา

### ปัญหา: 404 เมื่อเข้าถึง routes โดยตรง

**สาเหตุ:** Nginx ไม่ได้ตั้งค่า `try_files` ให้ fallback ไปที่ `index.html`

**แก้ไข:** ตรวจสอบว่า config มี:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### ปัญหา: API ไม่ทำงาน

**สาเหตุ:** Backend ไม่ได้รัน หรือ port ไม่ตรง

**แก้ไข:** 
1. ตรวจสอบว่า backend รันที่ port 8000
2. ตรวจสอบ `proxy_pass` ใน nginx config

### ปัญหา: CORS Error

**สาเหตุ:** Backend ไม่ได้ตั้งค่า CORS headers

**แก้ไข:** ตรวจสอบ backend CORS settings หรือเพิ่ม headers ใน nginx:
```nginx
add_header Access-Control-Allow-Origin * always;
```

## 📝 ไฟล์ที่เกี่ยวข้อง

- `frontend/nginx.conf.dev` - Config สำหรับ development
- `frontend/nginx.conf.prod` - Config สำหรับ production
- `frontend/nginx.conf.example` - Config ตัวอย่างพร้อม SSL
- `frontend/proxy.conf.json` - Angular dev server proxy config

## 🔗 เอกสารเพิ่มเติม

- [Angular Routing Guide](https://angular.io/guide/router)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PathLocationStrategy vs HashLocationStrategy](https://angular.io/api/common/PathLocationStrategy)

---

**หมายเหตุ:** 
- Development: ใช้ `nginx.conf.dev` เพื่อ proxy ไปที่ Angular dev server
- Production: ใช้ `nginx.conf.prod` เพื่อ serve static files
- ตรวจสอบ path และ port ให้ตรงกับ environment ของคุณ




