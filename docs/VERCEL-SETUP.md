# ตั้งค่า Vercel สำหรับ EngThai AI Academy

## ค่าที่เตรียมไว้ในเครื่อง

ไฟล์ `.env.vercel.local` ที่ root ของโปรเจกต์เป็นไฟล์ส่วนตัวและถูก Git ignore ไม่ต้อง commit หรือ push ไฟล์นี้

| ตัวแปร               | สถานะ                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| `AUTH_GOOGLE_ID`     | ใส่ Client ID ที่ได้รับแล้ว                                                                       |
| `AUTH_SECRET`        | สร้างค่าสุ่ม 32 bytes แล้ว เก็บไว้เฉพาะไฟล์ส่วนตัว                                                |
| `AUTH_GOOGLE_SECRET` | ต้องเติม Client Secret จาก Google Cloud ของ Client ID เดียวกัน                                    |
| `AUTH_URL`           | ไม่จำเป็นสำหรับ Vercel ตามปกติ เพราะ Auth.js v5 ตรวจ host ได้อัตโนมัติ                            |
| `ANTHROPIC_API_KEY`  | ไม่บังคับ ใส่เมื่อต้องการเปิดติวเตอร์ AI (สร้างที่ Anthropic Console และตั้ง spend limit ไว้ด้วย) |

ไฟล์ส่วนตัวนี้ไม่ได้อยู่ใน Git clone เครื่องอื่น หากต้องสร้างใหม่ให้ใช้ `.env.example` เป็นแนวทางและสร้าง secret ใหม่ อย่านำ `AUTH_URL=http://localhost:3000` ไปใช้บน Vercel หากจำเป็นต้องกำหนด `AUTH_URL` ให้ใช้ HTTPS origin จริงของ deployment นั้น และแยกค่าระหว่าง Preview กับ Production

## ตั้งค่าโปรเจกต์

| รายการ                   | ค่า                                        |
| ------------------------ | ------------------------------------------ |
| Repository               | `phuchitz/engthai-ai-academy`              |
| Branch ที่มีโค้ดปัจจุบัน | `codex/academy-foundation`                 |
| Framework Preset         | Next.js                                    |
| Root Directory           | root ของ repository                        |
| Node.js                  | 24.x                                       |
| Install Command          | `npm ci`                                   |
| Build Command            | `npm run build`                            |
| Output Directory         | ใช้ค่าเริ่มต้นของ Next.js ไม่ต้อง override |

หาก Vercel ใช้ `main` เป็น production branch ให้ตรวจว่าโค้ดจาก feature branch ถูกนำเข้า `main` แล้ว สำหรับการทดสอบให้เลือก deployment จาก `codex/academy-foundation` โดยไม่ต้องเปลี่ยน production branch

## ใส่ Environment Variables

1. เปิดโปรเจกต์ใน Vercel แล้วไปที่ Settings → Environment Variables
2. เพิ่ม `AUTH_GOOGLE_ID`, `AUTH_SECRET`, และ `AUTH_GOOGLE_SECRET` จากไฟล์ส่วนตัว โดยต้องเติม Google Client Secret ให้ครบก่อน
3. เลือกเฉพาะ environment ที่ตั้งใจใช้งาน เริ่มจาก Preview สำหรับการทดสอบ และใช้ secret แยกสำหรับ Production
4. บันทึกแล้วสร้าง deployment ใหม่หรือ Redeploy เพราะ environment variables ไม่ถูกนำไปใช้กับ deployment เก่า

ไม่ต้องตั้ง `NEXT_PUBLIC_` สำหรับตัวแปรเหล่านี้ และไม่ต้องตั้ง `AUTH_TRUST_HOST` เพิ่มบน Vercel ตามปกติ

## ตั้งค่า Google OAuth callback

เมื่อทราบโดเมนที่ Vercel จัดให้ ให้เพิ่ม URL นี้ใน Google Cloud → OAuth Client → Authorized redirect URIs โดยแทนที่โดเมนตัวอย่างด้วยโดเมนจริง:

```text
https://YOUR-REAL-DEPLOYMENT-DOMAIN/api/auth/callback/google
```

ใช้โดเมน Preview ที่คงที่ถ้าจะทดสอบ OAuth บน Preview และเพิ่มโดเมน Production แยกกัน ไม่สามารถใช้ wildcard แทน callback URI ได้

## ตรวจหลังตั้งค่า

- เปิด `/login` แล้วต้องไม่มีข้อความว่าขาดการตั้งค่า Google
- ทดสอบ Google Login ด้วยบัญชีที่มีอีเมลยืนยันแล้ว
- ทำ onboarding แล้วทดสอบ Logout
- หลัง Logout เปิด `/learn/settings` ต้องถูกส่งกลับไปหน้า Login
- ตรวจโดเมนจริงและผล deployment ก่อนถือว่า deploy สำเร็จ

ยังไม่มีการยืนยัน live OAuth flow หรือ live deployment จากการเตรียมไฟล์นี้

แหล่งอ้างอิง: [Auth.js deployment](https://authjs.dev/getting-started/deployment), [Google provider](https://authjs.dev/getting-started/providers/google), [Vercel environment variables](https://vercel.com/docs/environment-variables), [Vercel Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
