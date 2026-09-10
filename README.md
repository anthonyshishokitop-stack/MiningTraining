# Act 29 – Mining Training Platform (MHSA Compliant)

Modernised static frontend for **https://www.miningtraining.co.za/**

## Features
- 24 critical competency modules aligned with MHSA
- Video instruction + rigorous assessments
- PDF certificates (jsPDF)
- Progress tracking via localStorage
- Mobile-first responsive design
- Dashboard, Certificates, Descriptions & Resources
- Community links (WhatsApp / Discord / Shared Drive)
- Ready for GitHub Pages / Netlify / any static host

## Structure
```
miningtraining/
├── index.html
├── css/styles.css
├── js/
│   ├── data.js          (modules, quizzes, videos, descriptions, resources)
│   ├── app.js           (navigation, rendering, progress)
│   ├── quiz.js          (assessment engine)
│   └── certificate.js   (PDF generation)
├── assets/              (add favicon / logos here)
├── manifest.json        (PWA ready)
└── README.md
```

## Deploy
1. Push this folder to a GitHub repository
2. Enable GitHub Pages (Settings → Pages → Deploy from main branch / root)
3. Or drag-and-drop the folder to Netlify / Cloudflare Pages
4. Point the domain `miningtraining.co.za` to the deployment

## Future recommendations
- Add a backend (Firebase / Supabase) for real user accounts + audit trail
- Full offline / PWA support with service worker
- Role-based learning paths
- Certificate expiry & refresher reminders
- SCORM export for LMS integration

**Founded & maintained by:** Shishoki Anthony  
**Mission:** Zero Harm through better knowledge, better decisions and better culture.
