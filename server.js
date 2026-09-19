// server.js
const PORT = process.env.PORT || 3000;
const path = require('path');

// فایل‌های CSS و JS و HTML در پوشه‌ای به نام public باشند
app.use(express.static(path.join(__dirname, 'public')));

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config(); // برای خواندن اطلاعات مخفی از فایل .env

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // فایل‌های استاتیک مثل CSS و JS را از پوشه public می‌خواند

// مسیر آدرس ربات بله
const BALE_BOT_URL = `https://tapi.bale.ai/bot${process.env.BOT_TOKEN}/sendMessage`;

// دریافت درخواست خدمات از فرم سایت
// نسخه اصلاح شده برای عیب‌یابی (Debug Version)

app.post('/submit-service', async (req, res) => {
    console.log("!!! سرور درخواست را دریافت کرد !!!"); // این خط باید حتماً در پاورشل چاپ شود
    
    const { name, phone, email, budget, message } = req.body;
    const text = `📬 درخواست جدید:\nنام: ${name}\nتلفن: ${phone}\nایمیل: ${email}\nبودجه: ${budget}\nپیام: ${message}`;

    try {
        console.log("در حال ارسال به بله...");
        const response = await axios.post(BALE_BOT_URL, { 
            chat_id: process.env.ADMIN_CHAT_ID, 
            text: text 
        });
        console.log("نتیجه از سمت بله:", response.data);
        res.send("درخواست شما با موفقیت ثبت شد!");
    } catch (error) {
        console.log("خطای اصلی اینجاست:");
        console.log(error.response ? error.response.data : error.message);
        res.status(500).send("خطا در ارسال به ربات");
    }
});


// اجرای سرور روی پورت 3000
// سرور را روی پورتی که Render می‌دهد اجرا کن، اگر نبود روی ۳۰۰۰


app.listen(PORT, () => {
    console.log(`سرور روی پورت ${PORT} در حال اجراست`);
});

