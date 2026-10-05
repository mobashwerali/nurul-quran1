# নূরুল কুরআন (Nurul Quran) - Digital Quran with Bangla Translation & Audio

একটি আধুনিক ও দৃষ্টিনন্দন ডিজিটাল আল-কুরআন ওয়েব অ্যাপ্লিকেশন। এতে রয়েছে ১১৪টি সূরার বিশুদ্ধ আরবি তিলাওয়াত, বাংলা উচ্চারণ ও অর্থ, বিশ্বখ্যাত কারিদের সুললিত তিলাওয়াত এবং স্বয়ংক্রিয় বাংলা তরজমা পাঠ।

---

## ✨ প্রধান বৈশিষ্ট্যসমূহ (Key Features)

- 📖 **১১৪টি পূর্ণাঙ্গ সূরা:** মাক্কী ও মাদানী সূরার সুবিন্যস্ত তালিকা ও অনুসন্ধান।
- 🎙️ **বিশ্বখ্যাত কারিদের তিলাওয়াত:** মিশারি রশিদ আল-আফাসি, মাহমুদ খলিল আল-হুসারি, আবদুল বাসিত, সায়াদ আল-গামদি প্রমুখের তিলাওয়াত।
- 🔊 **স্বয়ংক্রিয় বাংলা অর্থ পাঠ (Bangla Translation Voice):** আরবি তিলাওয়াত শেষ হওয়ার সাথে সাথে খাঁটি বাঙালি উচ্চারণে বাংলা অর্থ পাঠ।
- 🎛️ **স্মার্ট অডিও প্লেয়ার:** কন্টিনিউয়াস (ধারাবাহিক), রিপিট (একক আয়াত পুনরাবৃত্তি) ও গতি নিয়ন্ত্রণ (0.75x, 1.0x, 1.25x)।
- 💡 **AI তাফসীর ও তাজবীদ বিধান:** জেমিনাই (Gemini) চালিত বিশুদ্ধ ইসলামিক তাফসীর ও তিলাওয়াত বিধান।
- 🎨 **কাস্টমাইজেবল রিডিং ইন্টারফেস:** আরবি ফন্ট সাইজ নিয়ন্ত্রণ, উচ্চারণ, বাংলা ও ইংরেজি অনুবাদ দেখার সুবিধা।
- ⭐ **প্রিয় আয়াত সংগ্রহ (Bookmarks):** যেকোনো আয়াত বুকমার্ক করে পরবর্তীতে দ্রুত পড়ার সুযোগ।

---

## 🛠️ প্রযুক্তি (Tech Stack)

- **Frontend:** React 19, TypeScript, Tailwind CSS, Vite, Lucide Icons
- **Backend:** Node.js, Express, TSX
- **AI Integration:** Google Gemini API (`@google/genai`)
- **Audio Engine:** Dual Audio Stream + Bengali Speech Engine

---

## 🚀 লোকাল সেটআপ ও রান করার নিয়ম (Getting Started)

### ১. রিপোজিটরি ক্লোন করুন:
```bash
git clone https://github.com/your-username/nurul-quran.git
cd nurul-quran
```

### ২. ডিপেন্ডেন্সি ইনস্টল করুন:
```bash
npm install
```

### ৩. এনভায়রনমেন্ট ভেরিয়েবল সেটআপ করুন:
`.env` ফাইল তৈরি করে আপনার Google Gemini API Key যোগ করুন (তাফসীর ফিচারের জন্য):
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

### ৪. ডেভেলপমেন্ট সার্ভার চালু করুন:
```bash
npm run dev
```
এরপর ব্রাউজারে `http://localhost:3000` ওপেন করুন।

### ৫. প্রোডাকশন বিল্ড:
```bash
npm run build
npm start
```

---

## 🌐 গিটহাবে আপলোড করার নিয়ম (How to Push to GitHub)

১. প্রথমে [GitHub.com](https://github.com)-এ গিয়ে **New Repository** তৈরি করুন (যেমন: `nurul-quran`)।
২. আপনার টার্মিনাল বা কমান্ড প্রম্পটে নিচের কমান্ডগুলো চালান:

```bash
git init
git add .
git commit -m "Initial commit - Nurul Quran App"
git branch -M main
git remote add origin https://github.com/<your-username>/nurul-quran.git
git push -u origin main
```

---

## ⚡ Vercel-এ লাইভ করার নিয়ম (Deploy to Vercel)

১. প্রথমে আপনার কোড GitHub-এ পুশ করুন।
২. [vercel.com](https://vercel.com)-এ গিয়ে GitHub দিয়ে লগইন করুন।
3. **"Add New..."** -> **"Project"**-এ ক্লিক করুন।
4. আপনার `nurul-quran` রিপোজিটরিটি সিলেক্ট করে **Import** বাটনে ক্লিক করুন।
5. **Environment Variables** সেকশনে ক্লিক করে:
   - Key: `GEMINI_API_KEY`
   - Value: আপনার Gemini API Key টি দিন
6. **"Deploy"** বাটনে ক্লিক করুন। প্রজেক্টটিতে ইতিমধ্যে `vercel.json` ও সার্ভারলেস ফাংশন কনফিগার করা আছে, তাই কোনো ঝামেলা ছাড়াই ১ মিনিটে লাইভ হয়ে যাবে!

---

## 📄 লাইসেন্স
MIT License
