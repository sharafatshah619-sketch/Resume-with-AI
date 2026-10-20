# ResumeAI Pro – AI Resume Maker

> A modern, fast, mobile-first, and ATS-friendly web application for building professional resumes and cover letters with artificial intelligence, live preview, and vector A4 PDF export.

---

## 🌟 Core Features

- **ATS-Friendly Architecture:** Strict single-column hierarchy, standardized date formatting, and machine-readable typography tested against modern applicant tracking algorithms (Workday, Taleo, Greenhouse).
- **5 Professional Templates:**
  1. *Classic Professional:* Timeless centered layout with refined divider rules.
  2. *Modern Professional:* Contemporary design with a colored accent bar and modern sans-serif typography.
  3. *Minimal ATS:* Clean monochrome layout with zero parsing friction for enterprise and government portals.
  4. *Executive:* Dark navy header banner and authoritative styling for management and leadership roles.
  5. *Fresh Graduate:* Section order prioritizing education, projects, certifications, and skills over work history.
- **AI-Powered Assistance (Server-Side Proxy):**
  - Instant professional summary generation.
  - Bullet point enhancement using Google's X-Y-Z formula.
  - Job responsibility generation for targeted roles (e.g. CCTV Operator, Software Engineer).
  - Core competency and hard skill suggestions.
  - AI Cover Letter generator with customizable writing tones.
  - Target job keyword gap analysis.
- **Offline / Resilient Demo Mode:** Operates immediately without configuration using intelligent contextual fallbacks.
- **Local Browser Persistence:** Automatically caches drafts in `LocalStorage`—no accidental data loss.
- **High-Fidelity PDF Export:** Native A4 print stylesheets stripping out website headers, footers, and sidebars, producing crisp vector PDFs with 100% selectable text.

---

## 📁 Project Directory Structure

```text
├── css/
│   └── style.css            # Responsive, mobile-first stylesheet & print CSS
├── js/
│   ├── app.js               # Global UI, mobile navigation, toast alerts, FAQ accordion
│   ├── ai.js                # Secure client-side AI service proxying to /api/ai
│   ├── resume.js            # Resume state manager, dynamic item list, 5 ATS templates
│   └── pdf.js               # A4 PDF download orchestrator
├── index.html               # High-converting homepage with features, guide, FAQ & schema
├── create-resume.html       # 10-step interactive resume builder with live split preview
├── templates.html           # Interactive template gallery with 1-click preset selector
├── ai-cover-letter.html     # Dedicated AI cover letter drafting workbench
├── resume-tips.html         # In-depth career guide, ATS secrets & writing formulas
├── about.html               # Mission, ethical AI pledge, and privacy commitments
├── contact.html             # Contact page with real-time field validation & API handler
├── privacy-policy.html      # Clear privacy statement addressing LocalStorage & AI data
├── terms.html               # Terms of service for ethical, truthful resume creation
├── robots.txt               # SEO web crawler configuration
├── sitemap.xml              # XML sitemap indexing all 9 pages
├── server.ts                # Express backend running Gemini AI and Vite middlewares
├── metadata.json            # AI Studio application metadata
└── package.json             # NPM dependencies and scripts
```

---

## 🚀 1. How to Run Locally

### Prerequisites
- Node.js (version 18 or higher)
- npm or bun

### Steps
1. Clone or extract the project files into a folder:
   ```bash
   cd resumeai-pro
   ```
2. Install project dependencies:
   ```bash
   npm install
   ```
3. (Optional) Provide your Gemini API key in an `.env` file:
   ```env
   GEMINI_API_KEY="your-gemini-api-key-here"
   PORT=3000
   ```
   *Note: If no API key is provided, the application runs seamlessly in intelligent demo mode with sample generation.*
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```

---

## 🌐 2. How to Deploy to Shared Hosting (cPanel / Apache / Nginx)

ResumeAI Pro is built with clean semantic HTML5, CSS3, and Vanilla JavaScript.

### Static Frontend Deployment:
1. Run the build command to generate optimized static files:
   ```bash
   npm run build
   ```
2. Upload all files from the `dist/` directory (or the root HTML, `css/`, and `js/` folders) directly into your shared hosting `public_html/` folder using cPanel File Manager or FTP.
3. If hosting purely as static files without Node.js, the client script `/js/ai.js` will automatically execute in **resilient demo mode**, supplying realistic AI content via its built-in smart generator!

### Full-Stack Node.js Deployment (cPanel "Setup Node.js App"):
1. Create a Node.js application in cPanel.
2. Set Application startup file to `server.ts` (run via `tsx`) or compile `server.ts` to `server.js` using `npm run build`.
3. Add the environment variable `GEMINI_API_KEY` in the cPanel environment settings.
4. Restart the Node application.

---

## 🔑 3. Where to Connect the AI API

The project follows a secure architecture where **no API keys are ever stored or exposed in the frontend**.

1. Open `/server.ts`.
2. Locate the Gemini client initialization:
   ```typescript
   const apiKey = process.env.GEMINI_API_KEY;
   if (apiKey) {
     aiClient = new GoogleGenAI({ apiKey, ... });
   }
   ```
3. Set your API key in your `.env` file:
   ```env
   GEMINI_API_KEY="AIzaSy..."
   ```
4. If you wish to switch from Google Gemini to another provider (e.g. OpenAI, Anthropic, or an internal LLM):
   - Modify the `POST /api/ai` handler in `/server.ts`.
   - Your frontend `/js/ai.js` sends `{ action, prompt, data }` and expects `{ success: true, result: "generated text" }`. No frontend changes required!

---

## 🏷️ 4. Where to Add Your Domain Name

Replace `https://resumeai-pro.com/` with your real domain:
1. **Canonical URLs & Meta Tags:**
   - In `index.html`, `create-resume.html`, `templates.html`, `ai-cover-letter.html`, `resume-tips.html`, `about.html`, `contact.html`, `privacy-policy.html`, `terms.html`:
     Update `<link rel="canonical" href="https://yourdomain.com/...">` and `<meta property="og:url" content="...">`.
2. **`sitemap.xml`:**
   - Replace `https://resumeai-pro.com/` with `https://yourdomain.com/` across all `<loc>` entries.
3. **`robots.txt`:**
   - Update `Sitemap: https://yourdomain.com/sitemap.xml`.

---

## 🔍 5. How to Add Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console).
2. Add your property (e.g. `https://yourdomain.com`).
3. Choose the **HTML Tag** verification method.
4. Copy the verification code:
   ```html
   <meta name="google-site-verification" content="YOUR_VERIFICATION_STRING" />
   ```
5. Paste it inside the `<head>` tag of `index.html`.
6. Click **Verify** in Search Console.
7. Submit your sitemap link: `https://yourdomain.com/sitemap.xml`.

---

## 📊 6. How to Add Google Analytics (GA4)

1. Create a Google Analytics 4 property at [analytics.google.com](https://analytics.google.com).
2. Obtain your **Measurement ID** (e.g. `G-XXXXXXXXXX`).
3. Open `index.html` (and any other HTML pages you wish to track) and paste the standard Google tag before the closing `</head>` tag:
   ```html
   <!-- Google tag (gtag.js) -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

---

## 💰 7. How to Add Google AdSense Later

1. Apply for [Google AdSense](https://www.google.com/adsense/) with your custom domain.
2. Once approved, place the AdSense verification script in `<head>`:
   ```html
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
   ```
3. To display banners without interfering with the clean resume builder:
   - Mount ad units on informational pages (`/resume-tips.html` or `/templates.html`).
   - Use the `.no-print` CSS class on all ad wrappers so ads **never appear on printed or exported PDF resumes**:
     ```html
     <div class="no-print" style="margin: 2rem 0; text-align: center;">
       <!-- AdSense unit code -->
     </div>
     ```

---

## 🔌 8. How to Replace Placeholder API Endpoints

### Contact Form Endpoint (`POST /api/contact`)
Located in `/server.ts`:
- Currently logs the received message and returns a success response.
- To connect real email dispatch, install `nodemailer` or use an email API like Resend or SendGrid:
  ```typescript
  import { Resend } from 'resend';
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: 'support@yourdomain.com',
    to: 'your-inbox@yourdomain.com',
    subject: `[Contact Form] ${subject}`,
    text: `From: ${name} (${email})\n\n${message}`
  });
  ```

---

## 📄 License
This application is provided under the MIT License. You are free to customize, rebrand, and deploy for commercial or personal use.
