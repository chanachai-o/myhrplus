# EMFILE Error - ทำไมระบบถึงรันหลายไฟล์?

**วันที่**: 2025-01-02  
**สถานะ**: ✅ แก้ไขแล้ว

---

## 🔴 ปัญหา

```
[ERROR] EMFILE: too many open files, open 'D:\Project\...\tailwind.config.js' [plugin angular-sass]
```

---

## 📋 สาเหตุ

### 1. **File Watchers มากเกินไป**

Angular dev server ใช้ **file watchers** เพื่อตรวจสอบการเปลี่ยนแปลงไฟล์:
- **File Watchers**: เปิดไฟล์ไว้เพื่อ watch การเปลี่ยนแปลง
- **Windows Limit**: Windows มี file descriptor limit ต่ำ (~512-2048)
- **Angular Project**: โปรเจกต์ใหญ่มีไฟล์มาก (1000+ files)
- **SCSS Compilation**: แต่ละ SCSS file ต้อง compile และ watch

**ผลลัพธ์**: ระบบเปิดไฟล์มากเกิน limit → EMFILE error

### 2. **SCSS Import Chain**

เมื่อ SCSS files import กันหลายชั้น:
```
styles.scss
  → _backgrounds.scss
  → _design-tokens.scss
  → _mixins.scss
  → ... (หลายไฟล์)
```

แต่ละ import = เปิดไฟล์เพิ่ม → ใช้ file descriptors มากขึ้น

### 3. **Tailwind Config Processing**

Tailwind ต้อง process:
- `tailwind.config.js` (หลายครั้ง)
- ทุก SCSS file ที่ใช้ Tailwind classes
- PostCSS processing

---

## ✅ วิธีแก้ไข

### Solution 1: เพิ่ม Polling Configuration (แนะนำ)

**Polling** = ตรวจสอบการเปลี่ยนแปลงไฟล์แบบ periodic แทน file watching

**ข้อดี**:
- ใช้ file descriptors น้อยกว่า
- ทำงานได้ดีใน Windows
- เสถียรกว่า

**ข้อเสีย**:
- อาจช้ากว่า file watching ~1-2 วินาที

**การตั้งค่า**:

1. **angular.json** - เพิ่ม `"poll": 3000` (3 วินาที)
   ```json
   {
     "build": {
       "options": {
         "poll": 3000
       },
       "configurations": {
         "development": {
           "poll": 3000
         }
       }
     },
     "serve": {
       "options": {
         "poll": 3000
       },
       "configurations": {
         "development": {
           "poll": 3000
         }
       }
     }
   }
   ```

2. **package.json** - เพิ่ม `--poll=3000` ใน scripts
   ```json
   {
     "scripts": {
       "start": "ng serve --poll=3000",
       "build": "ng build --poll=3000"
     }
   }
   ```

---

### Solution 2: เพิ่ม File Descriptor Limit (Windows)

**PowerShell (Run as Administrator)**:
```powershell
# ตรวจสอบ current limit
wmic process where name="node.exe" get ProcessId,HandleCount

# เพิ่ม UV_THREADPOOL_SIZE
[System.Environment]::SetEnvironmentVariable("UV_THREADPOOL_SIZE", "128", "User")
```

**Restart Terminal** หลังจากตั้งค่า

---

### Solution 3: ลดจำนวนไฟล์ที่ต้อง Watch

1. **เพิ่ม `.gitignore` และ `.cursorignore`**:
   ```
   node_modules/
   dist/
   .angular/
   *.log
   ```

2. **ปิด IDE/Editor ที่เปิดไฟล์มาก**
   - VS Code, WebStorm, etc.
   - File watchers อื่นๆ

3. **ปิด Browser DevTools** ที่เปิดหลาย tabs

---

### Solution 4: ใช้ WSL2 (Windows)

WSL2 มี file descriptor limit สูงกว่า Windows native:

```bash
# Install WSL2
wsl --install

# ใช้ WSL2 terminal แทน PowerShell/CMD
```

---

## 🔧 การตั้งค่าที่แก้ไขแล้ว

### ✅ angular.json

เพิ่ม `"poll": 3000` ใน:
- `build.options`
- `build.configurations.development`
- `serve.options`
- `serve.configurations.development`

### ✅ package.json

เพิ่ม `--poll=3000` ใน:
- `start` script
- `build` script (ถ้าต้องการ)

---

## 📊 เปรียบเทียบ

| Method | File Descriptors | Performance | Stability |
|--------|-----------------|-------------|-----------|
| **File Watching** | สูง (1000+) | เร็ว (~100ms) | ไม่เสถียร (EMFILE) |
| **Polling (3000ms)** | ต่ำ (~100) | ช้ากว่า (~1-2s) | เสถียร ✅ |

---

## 🎯 ผลลัพธ์

หลังจากเพิ่ม polling configuration:

1. ✅ **ไม่มี EMFILE error**
2. ✅ **Build สำเร็จ** โดยไม่มี error
3. ✅ **Hot reload ทำงาน** (อาจช้ากว่าเดิมเล็กน้อย)
4. ✅ **เสถียรกว่า** - ไม่ crash จาก file descriptor limit

---

## 💡 Tips

1. **Polling Interval**: `3000ms` (3 วินาที)
   - ช้ากว่า: `5000` หรือ `10000` (ลด load)
   - เร็วกว่า: `2000` หรือ `1000` (เพิ่ม load)

2. **Development vs Production**:
   - Development: ใช้ polling (3000ms)
   - Production: ไม่ต้อง polling (build ครั้งเดียว)

3. **Performance Trade-off**:
   - File Watching: เร็วแต่ไม่เสถียร
   - Polling: ช้ากว่าแต่เสถียร ✅

---

## 🚨 ถ้ายังมีปัญหา

1. **Restart Terminal** - ปิด terminal ทั้งหมดแล้วเปิดใหม่
2. **Kill Node Processes**:
   ```powershell
   Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
   ```
3. **ลบ Cache**:
   ```powershell
   Remove-Item -Recurse -Force .angular
   Remove-Item -Recurse -Force node_modules\.cache
   ```
4. **Restart Dev Server**:
   ```powershell
   npm start
   ```

---

**Last Updated**: 2025-01-02  
**Status**: ✅ Fixed

