import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Initialize Google Gemini AI safely
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('✅ Gemini AI client initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize Gemini AI client:', err);
  }
} else {
  console.log('ℹ️ Running in AI Demo mode (No valid GEMINI_API_KEY detected). Smart simulated AI generator active.');
}

// Helper: Intelligent Fallback Generator for Demo Mode
function generateSmartFallback(action: string, prompt: string, data: any = {}) {
  const targetJob = (data.targetJob || data.jobTitle || 'Professional').trim();
  const name = data.fullName || 'Candidate';
  const skills = Array.isArray(data.skills) ? data.skills.join(', ') : (data.skills || 'problem-solving, communication');

  switch (action) {
    case 'summary':
      return `Results-driven and detail-oriented ${targetJob} with proven expertise in optimizing operational workflows, driving quality standards, and collaborating with cross-functional teams. Demonstrated strength in ${skills}. Dedicated to leveraging technical competence and analytical precision to deliver measurable impact in fast-paced professional environments.`;

    case 'improve_experience':
      return `• Spearheaded daily ${targetJob || 'operational'} responsibilities, achieving a 22% improvement in workflow turnaround time through systematic process optimization.
• Collaborated closely with team members and key stakeholders to uphold stringent quality, security, and compliance protocols.
• Diagnosed and resolved complex operational bottlenecks, successfully reducing incident escalations by 35%.
• Authored comprehensive procedural documentation and guided 5+ team members on best practices.`;

    case 'generate_responsibilities':
      if (targetJob.toLowerCase().includes('cctv') || targetJob.toLowerCase().includes('security')) {
        return `• Monitored high-definition surveillance feeds across 50+ camera channels, ensuring continuous safety coverage and immediate threat detection.
• Maintained meticulous incident logbooks and reported security anomalies to site supervisors in accordance with ISO standards.
• Conducted routine diagnostic tests on CCTV hardware, video management software (VMS), and backup recording drives.
• Assisted local emergency responders and law enforcement with timestamped video evidence retrieval, adhering to strict chain of custody.`;
      }
      return `• Oversaw end-to-end execution of core deliverables aligned with strategic company objectives.
• Monitored operational metrics, identifying areas for continuous improvement and mitigating process risks.
• Facilitated seamless communication between technical teams, management, and external clients.
• Ensured 100% adherence to industry compliance standards, organizational safety policies, and Service Level Agreements (SLAs).`;

    case 'suggest_skills':
      if (targetJob.toLowerCase().includes('cctv') || targetJob.toLowerCase().includes('security')) {
        return `Video Surveillance Systems (CCTV), Incident Reporting & Dispatch, Video Management Systems (Milestone/Hikvision), Physical Security Protocols, Threat Assessment, Emergency Response Coordination, Chain of Custody Documentation, Loss Prevention, Detail Orientation, Communication Under Pressure`;
      }
      if (targetJob.toLowerCase().includes('developer') || targetJob.toLowerCase().includes('software') || targetJob.toLowerCase().includes('engineer')) {
        return `JavaScript/TypeScript, React.js, Node.js & Express, RESTful APIs, Git & Version Control, Database Management (SQL/NoSQL), Unit Testing, CI/CD Pipelines, Agile/Scrum Methodologies, Problem Solving, Cross-functional Collaboration`;
      }
      return `Strategic Planning, Project Management, Data Analysis, Risk Assessment, Cross-Functional Leadership, Quality Assurance, Workflow Optimization, Stakeholder Communication, Problem Resolution, Time Management`;

    case 'cover_letter':
      const company = data.companyName || 'Hiring Team';
      return `Dear ${company} Hiring Team,\n\nI am writing to express my strong enthusiasm for the ${targetJob} position. With a strong track record of operational excellence, analytical diligence, and continuous professional growth, I am confident in my ability to make an immediate, positive contribution to your team.\n\nThroughout my background, I have focused on executing responsibilities with precision, fostering collaboration across departments, and implementing structured solutions to operational challenges. My experience utilizing core skills including ${skills} has prepared me to meet and exceed the performance standards expected at ${company}.\n\nWhat excites me most about this opportunity is your organization's reputation for innovation and quality. I look forward to the possibility of discussing how my technical background, dedication, and problem-solving mindset align with your goals.\n\nThank you for your time and consideration.\n\nSincerely,\n${name}`;

    case 'optimize_job':
      return `• Targeted Alignment: Updated terminology to directly match ATS keywords for "${targetJob}".
• Quantifiable Impact: Infused bullet points with measurable outcomes (e.g. percentage improvements, turnaround speed).
• ATS Keyword Density: Strengthened relevant core competencies (${skills}) across summary and experience sections.
• Action Verbs: Replaced passive phrases with strong power verbs (e.g., Spearheaded, Orchestrated, Optimized, Monitored).`;

    default:
      return `Professional ATS-optimized content generated for ${targetJob || 'your target position'}, emphasizing measurable accomplishments, industry terminology, and high-readability formatting.`;
  }
}

// 1. API: AI Content Generation Endpoint
app.post('/api/ai', async (req: Request, res: Response) => {
  const { action = 'summary', prompt = '', data = {} } = req.body;

  try {
    if (aiClient) {
      const systemInstruction = `You are ResumeAI Pro, an elite professional ATS resume writer and career coach.
Rules you must strictly follow:
1. Generate truthful, professional, concise, and ATS-friendly content.
2. DO NOT invent fake university degrees, fake past employers, fake job titles, or fake certifications. Only refine and structure the user's provided input.
3. Use active voice and strong action verbs (e.g., Orchestrated, Spearheaded, Streamlined, Monitored, Implemented).
4. Keep output ready to paste into a resume or cover letter. Do not include introductory conversational fluff like "Sure! Here is your resume...". Return ONLY the requested resume text or bullet points.`;

      let modelPrompt = '';
      const targetJob = data.targetJob || data.jobTitle || 'Professional';

      switch (action) {
        case 'summary':
          modelPrompt = `Write a high-impact, ATS-friendly professional summary (3-4 sentences, max 80 words) for a "${targetJob}".
User Background Details:
- Name: ${data.fullName || 'Candidate'}
- Current Title: ${data.jobTitle || targetJob}
- Key Skills: ${Array.isArray(data.skills) ? data.skills.join(', ') : (data.skills || 'relevant skills')}
- Experience Context: ${data.experienceContext || 'Professional experience in this domain'}
Ensure it highlights core strengths, reliability, and readiness to drive results.`;
          break;

        case 'improve_experience':
          modelPrompt = `Enhance the following job experience into 3-4 powerful, ATS-friendly bullet points using strong action verbs and quantifiable impact where appropriate.
Target Job / Current Role: ${targetJob}
Company: ${data.company || ''}
Raw Responsibilities / Notes:
${prompt || data.responsibilities || 'Executed core operational and professional tasks.'}
Do not invent unverified metrics, but frame responsibilities around efficiency, accuracy, collaboration, and standard operating procedures.`;
          break;

        case 'generate_responsibilities':
          modelPrompt = `Provide 4 realistic, professional bullet points describing core daily responsibilities for a "${targetJob}" role at company "${data.company || 'the organization'}".
Ensure realistic day-to-day duties, safety/quality compliance, problem escalation, and teamwork.`;
          break;

        case 'suggest_skills':
          modelPrompt = `Provide a comma-separated list of the 10 most critical hard and soft skills for an ATS-optimized resume targeting the role: "${targetJob}".
Format: Skill 1, Skill 2, Skill 3, etc. No preamble or numbering.`;
          break;

        case 'cover_letter':
          modelPrompt = `Write a compelling, professional cover letter (under 250 words) for the position of "${targetJob}" at "${data.companyName || 'the company'}".
Candidate Name: ${data.fullName || 'Candidate'}
Background / Experience: ${data.experienceContext || 'Solid professional experience'}
Key Skills: ${Array.isArray(data.skills) ? data.skills.join(', ') : (data.skills || 'domain skills')}
Tone: Professional, confident, and genuine. Do not invent fake previous companies. Return only the letter.`;
          break;

        case 'optimize_job':
          modelPrompt = `Analyze the resume data for target role "${targetJob}" and provide 3-4 concise actionable recommendations and refined bullet points to maximize ATS keyword scoring.
Target Job: ${targetJob}
Resume Notes: ${prompt || JSON.stringify(data).slice(0, 500)}`;
          break;

        default:
          modelPrompt = prompt || `Generate professional resume text for ${targetJob}.`;
      }

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: modelPrompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const text = response.text?.trim();
      if (text) {
        return res.json({
          success: true,
          result: text,
          source: 'gemini-3.8-flash',
        });
      }
    }

    // Fallback to smart local template generation
    const fallbackText = generateSmartFallback(action, prompt, data);
    return res.json({
      success: true,
      result: fallbackText,
      source: 'smart-template-engine',
    });
  } catch (error: any) {
    console.warn('Gemini API call encountered an issue, serving smart fallback:', error?.message || error);
    const fallbackText = generateSmartFallback(action, prompt, data);
    return res.json({
      success: true,
      result: fallbackText,
      source: 'smart-fallback',
      warning: 'Executed in resilient offline demo mode.',
    });
  }
});

// 2. API: Contact Form Submission Endpoint
app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: 'Please fill in all required fields (Name, Email, and Message).',
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a valid email address.',
    });
  }

  console.log(`[Contact Form Received] From: ${name} <${email}> | Subject: ${subject || 'No Subject'}`);
  console.log(`Message: ${message}`);

  return res.json({
    success: true,
    message: 'Thank you for contacting ResumeAI Pro! Your message has been received and our team will get back to you within 24 hours.',
  });
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    appName: 'ResumeAI Pro',
    version: '1.0.0',
    geminiConfigured: !!aiClient,
  });
});

// Setup Vite middleware in development / static serving in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 ResumeAI Pro running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
