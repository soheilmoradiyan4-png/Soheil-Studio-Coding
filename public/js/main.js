// دریافت فرم از صفحه
const form = document.querySelector('form');

// گوش دادن به رویداد ارسال فرم
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // جلوگیری از رفرش شدن صفحه

    // جمع‌آوری اطلاعات فرم
    const formData = new FormData(form);
    
    // ارسال اطلاعات به سرور با استفاده از Fetch
    try {
        const response = await fetch('/submit-service', {
            method: 'POST',
            body: new URLSearchParams(formData)
        });

        const result = await response.text();
        
        // نمایش پیام موفقیت (می‌تونی این رو با یک باکس قشنگ‌تر عوض کنی)
        alert("پیام شما با موفقیت ارسال شد!"); 
        form.reset(); // پاک کردن فرم پس از ارسال
    } catch (error) {
        alert("خطایی رخ داد، دوباره تلاش کن.");
    }
});
