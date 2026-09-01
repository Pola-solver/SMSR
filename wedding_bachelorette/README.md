# 💍 Bachelorette & Wedding Memories - Web App & Drive Uploader

تطبيق ويب مميز ومصمم خصيصاً لحفلات الزفاف والـ **Bachelorette Party** لشكر الحاضرين ومشاركة الصور والفيديوهات وحفظها تلقائياً على **Google Drive** وتسجيل الرسائل في **Google Sheets**.

---

## 🌟 المميزات (Features)

1. **شاشة ترحيبية أنيميشن (Animated Intro Screen)**:
   - تصميم فاخر مع خواتم متحركة ونجوم متلألئة (Champagne Gold & Rose Gold).
   - ميزة الضغط في أي مكان لتخطي الشاشة الترحيبية والدخول مباشرة.
2. **شكر الحضور (Thank You Hero Card)**:
   - بطاقة شكر بعبارات راقية ومؤثرة لجميع المدعوين.
3. **دفتر الذكريات (Guestbook & Tags)**:
   - كتابة الاسم، اختيار صلة القرابة/الفريق (`Bride Tribe 👰‍♀️`, `Bridesmaid 🌸`, `أعز صاحبة 💖`, إلخ).
   - كتابة رسالة أو دعوة حلوة للعروسة/العروسين.
4. **منطقة سحب وإفلات الصور (Drag & Drop Photo Uploader)**:
   - السحب والإفلات أو التصفح واختيار عدة صور معاً من الموبايل أو الكاميرا أو الكمبيوتر.
   - معاينة مصغرة للصور المختارة مع إمكانية حذف أي صورة قبل الرفع.
   - ضغط الصور تلقائياً (Client-side Compression) لتوفير الباقة وضمان سرعة فائقة في الرفع.
5. **تخزين تلقائي في Google Drive و Google Sheets**:
   - يتم رفع الصور مباشرة داخل مجلد مخصص في Google Drive.
   - يتم تسجيل الاسم، الصلة، الرسالة، وروابط الصور داخل جدول Google Sheets منظم.
6. **نافذة الاحتفال (Success Modal)**:
   - ظهور نافذة احتفالية مع تأثيرات مبهجة بعد اكتمال الرفع بنجاح.

---

## 🚀 طريقة التفعيل وربط Google Drive (خطوة بخطوة في دقيقتين)

### الخطوة 1: تجهيز كود الـ Google Apps Script
1. افتح [Google Sheets](https://sheets.google.com) وأنشئ شيت جديد وسمّه: `Bachelorette & Wedding Memories`.
2. من القائمة العلوية اضغط على **Extensions (التطبيقات)** ثم **Apps Script**.
3. امسح أي كود موجود، وافتح ملف [`GoogleAppsScript_DriveUpload.js`](GoogleAppsScript_DriveUpload.js) وانسخ كل محتواه والصقه هناك.
4. اضغط على أيقونة الحفظ (💾).

### الخطوة 2: النشر (Deploy)
1. في أعلى يمين صفحة Apps Script، اضغط على زر **Deploy (نشر)** واختر **New deployment (نشر جديد)**.
2. اضغط على أيقونة الترس (⚙️) بجوار "Select type" واختر **Web app (تطبيق ويب)**.
3. اضبط الإعدادات كالتالي:
   - **Description**: `Wedding Photos Web App`
   - **Execute as**: `Me (حسابك الشخصي)`
   - **Who has access**: **`Anyone (أي شخص)`** 👈 *(مهم جداً لكي يتمكن الضيوف من الرفع دون الحاجة لتسجيل دخول)*.
4. اضغط **Deploy** وقم بالموافقة على الصلاحيات (Authorize Access).
5. انسخ **Web app URL** الذي سيظهر لك.

### الخطوة 3: وضع الرابط في كود الموقع
1. افتح ملف [`script.js`](script.js).
2. في السطر الثالث، استبدل `"YOUR_APPS_SCRIPT_URL_HERE"` بالرابط الذي نسخته:
   ```javascript
   const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx.../exec";
   ```
3. احفظ الملف! الآن أصبح الموقع جاهزاً ويعمل بنسبة 100%.

---

## 📁 محتويات المجلد (Files Structure)
```
wedding_bachelorette/
├── index.html                       # هيكل الموقع وصفحة الرفع
├── style.css                        # التنسيقات والألوان الأنثوية الفاخرة والأنيميشن
├── script.js                        # التفاعل، السحب والإفلات، الضغط، والربط البرمجي
├── GoogleAppsScript_DriveUpload.js  # كود الباك إند لجوجل درايف وجوجل شيتس
└── README.md                        # دليل التثبيت والاستخدام
```
