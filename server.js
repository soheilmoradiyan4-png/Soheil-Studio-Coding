// ۱. ابتدا تمام کتابخانه‌ها را در بالاترین قسمت وارد می‌کنیم
const express = require('express');
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config(); // برای خواندن توکن‌ها از فایل .env

// ۲. مقداردهی اولیه اصلی
const app = express();
const PORT = process.env.PORT || 3000;

// آدرس ربات بله (استفاده از متغیر محیطی برای امنیت)
const BALE_BOT_URL = `https://tapi.bale.ai/bot${process.env.BOT_TOKEN}/sendMessage`;

// ۳. تنظیمات میان‌افزارها (Middlewares)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// بسیار مهم: تنظیم پوشه فایل‌های استاتیک (CSS, JS, HTML)
// این خط باعث می‌شود فایل‌های داخل پوشه public در دسترس باشند
app.use(express.static(path.join(__dirname, 'public')));

// ۴. مسیر اصلی (Route) برای باز کردن صفحه سایت
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ۵. مسیر دریافت فرم درخواست خدمات
app.post('/submit-service', async (req, res) => {
    console.log("!!! یک درخواست جدید دریافت شد !!!");
    
    const { name, phone, email, budget, message } = req.body;
    
    // ساخت متن پیام برای ارسال به تلگرام/بله
    const text = `📬 *درخواست جدید از سایت SSC*:\n\n` +
                 `👤 نام: ${name}\n` +
                 `📞 تلفن: ${phone}\n` +
                 `📧 ایمیل: ${email}\n` +
                 `💰 بودجه: ${budget}\n` +
                 `💬 پیام: ${message}`;

    try {
        console.log("در حال ارسال پیام به ربات بله...");
        
        // ارسال درخواست به API بله
        const response = await axios.post(BALE_BOT_URL, { 
            chat_id: process.env.ADMIN_CHAT_ID, 
            text: text 
        });

        console.log("✅ پیام با موفقیت ارسال شد:", response.data);
        res.send("<h1>با موفقیت ثبت شد!</h1><p>در اسرع وقت با شما تماس خواهیم گرفت.</p>");
        
    } catch (error) {
        // اگر خطایی رخ داد (مثلاً توکن اشتباه بود یا اینترنت قطع بود)
        console.error("❌ خطا در ارسال پیام:");
        if (error.response) {
            console.error("جزئیات خطا از سمت بله:", error.response.data);
        } else {
            console.error("خطای شبکه یا سیستم:", error.message);
        }
        res.status(500).send("متاسفانه خطایی در ثبت درخواست رخ داد. لطفا دوباره تلاش کنید.");
    }
});

// ۶. اجرای سرور
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 سرور با موفقیت روی پورت ${PORT} روشن شد`);
    console.log(`=========================================`);
});
