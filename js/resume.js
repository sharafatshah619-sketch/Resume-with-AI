/**
 * ResumeAI Pro – Resume State & Template Engine (Vanilla JS)
 * Manages multi-step form data, live two-way preview binding,
 * LocalStorage caching, dynamic entry manipulation, and the 5 ATS templates.
 */

const ResumeApp = {
  // Default Resume State
  state: {
    template: 'classic',
    targetJob: 'CCTV Operator',
    personal: {
      fullName: 'Marcus Vance',
      jobTitle: 'Certified CCTV & Security Control Room Operator',
      phone: '+1 (555) 349-8201',
      email: 'marcus.vance@example.com',
      city: 'Chicago',
      country: 'United States',
      linkedin: 'linkedin.com/in/marcusvance-security',
      website: '',
      photoUrl: ''
    },
    summary: 'Diligent and licensed CCTV Control Room Operator with 5+ years of experience overseeing complex surveillance systems in commercial and transportation hubs. Expert in real-time threat detection, Milestone VMS, video evidence archiving, and emergency incident dispatch. Consistently maintained a 99.8% surveillance compliance audit rating.',
    experience: [
      {
        id: 'exp-1',
        jobTitle: 'Senior CCTV Operator',
        company: 'Metro Transit Authority',
        location: 'Chicago, IL',
        startDate: '2022',
        endDate: 'Present',
        current: true,
        responsibilities: '• Monitored 120+ high-definition pan-tilt-zoom (PTZ) IP surveillance streams across 8 transit terminals, identifying suspicious activities.\n• Liaised directly with Chicago Police Department dispatchers and transit security to coordinate timely responses to 150+ incidents.\n• Audited video storage integrity, adhering to strict legal chain-of-custody protocols for court-subpoenaed evidence.\n• Trained and mentored 4 junior operators on standard operating procedures (SOPs) and emergency panic-alarm drills.'
      },
      {
        id: 'exp-2',
        jobTitle: 'Security Surveillance Specialist',
        company: 'Apex Commercial Properties',
        location: 'Chicago, IL',
        startDate: '2019',
        endDate: '2022',
        current: false,
        responsibilities: '• Supervised building perimeter alarms, access control logs, and CCTV monitoring matrices for a 45-story commercial complex.\n• Documented daily shift logs, tracking visitor access anomalies and security incidents with zero compliance violations.\n• Resolved hardware signal dropouts by collaborating with network engineers, reducing camera downtime by 40%.'
      }
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'Associate of Applied Science in Criminal Justice & Security Technologies',
        institution: 'City Colleges of Chicago',
        location: 'Chicago, IL',
        startYear: '2017',
        endYear: '2019',
        description: 'Relevant coursework: Physical Security Systems, Incident Investigation, Emergency Management, Cyber & Electronic Surveillance.'
      }
    ],
    skills: [
      'CCTV Surveillance (Milestone, Hikvision, Pelco)',
      'Incident Reporting & Dispatch',
      'Video Management Systems (VMS)',
      'Emergency Response Protocols',
      'Chain of Custody & Evidence Archiving',
      'Access Control Systems',
      'Radio Communications',
      'Detail Orientation & Threat Assessment'
    ],
    languages: [
      { id: 'lang-1', language: 'English', proficiency: 'Native' },
      { id: 'lang-2', language: 'Spanish', proficiency: 'Professional Working' }
    ],
    certifications: [
      { id: 'cert-1', certificate: 'Certified CCTV Surveillance Specialist (CCSS)', organization: 'ASIS International', year: '2021' },
      { id: 'cert-2', certificate: 'State Security Officer License (PERC)', organization: 'Illinois IDFPR', year: '2019' }
    ],
    projects: [
      { id: 'proj-1', name: 'Control Room Modernization Initiative', description: 'Assisted in upgrading analog DVR recording systems to cloud-backed IP-VMS, improving camera latency by 35%.', technologies: 'Milestone XProtect, Axis PTZ' }
    ],
    references: [
      { id: 'ref-1', name: 'Available upon request', company: 'Metro Transit Authority', title: 'Security Director', contact: 'hr-security@transit.example.com' }
    ]
  },

  currentStep: 1,
  totalSteps: 10,

  // Initialize on Create Resume Page
  init() {
    this.checkURLParams();
    this.loadFromStorage();
    this.bindInputs();
    this.renderFormDynamicSections();
    this.renderPreview();
    this.setupStepper();
    this.setupAIActions();
  },

  checkURLParams() {
    const params = new URLSearchParams(window.location.search);
    const templateParam = params.get('template');
    if (templateParam && ['classic', 'modern', 'minimal', 'executive', 'graduate'].includes(templateParam)) {
      this.state.template = templateParam;
    }
  },

  // Save to LocalStorage
  saveToStorage() {
    try {
      localStorage.setItem('resumeai_data', JSON.stringify(this.state));
      if (window.Toast) {
        window.Toast.success('Resume draft saved in your browser!');
      }
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  },

  // Load from LocalStorage
  loadFromStorage() {
    try {
      const saved = localStorage.getItem('resumeai_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.state = Object.assign(this.state, parsed);
      }
    } catch (e) {
      console.warn('LocalStorage load failed:', e);
    }
  },

  // Reset Resume
  resetResume() {
    if (confirm('Are you sure you want to clear your resume and start from scratch?')) {
      localStorage.removeItem('resumeai_data');
      this.state.personal = { fullName: '', jobTitle: '', phone: '', email: '', city: '', country: '', linkedin: '', website: '', photoUrl: '' };
      this.state.summary = '';
      this.state.experience = [];
      this.state.education = [];
      this.state.skills = [];
      this.state.languages = [];
      this.state.certifications = [];
      this.state.projects = [];
      this.state.references = [];
      this.syncInputsWithState();
      this.renderFormDynamicSections();
      this.renderPreview();
      if (window.Toast) window.Toast.info('Clean canvas ready!');
    }
  },

  // Load Sample Presets
  loadPreset(type = 'cctv') {
    if (type === 'cctv') {
      // already default CCTV Operator
      this.state.targetJob = 'CCTV Operator';
    } else if (type === 'tech') {
      this.state.targetJob = 'Frontend Software Engineer';
      this.state.personal = {
        fullName: 'Sophia Martinez',
        jobTitle: 'Senior Frontend Developer',
        phone: '+1 (555) 782-9912',
        email: 'sophia.martinez@example.com',
        city: 'Austin',
        country: 'United States',
        linkedin: 'linkedin.com/in/sophia-frontend',
        website: 'https://sophiacodes.dev',
        photoUrl: ''
      };
      this.state.summary = 'Passionate Frontend Engineer with 6+ years building accessible, responsive, and performant web applications using TypeScript, React, and Next.js. Reduced application bundle sizes by 42% and elevated Lighthouse Core Web Vitals to 98+. Experienced in mentor-driven agile environments.';
      this.state.experience = [
        {
          id: 'exp-1',
          jobTitle: 'Lead Frontend Engineer',
          company: 'CloudScale Technologies',
          location: 'Austin, TX',
          startDate: '2022',
          endDate: 'Present',
          current: true,
          responsibilities: '• Architected design systems and UI component libraries used by 45+ developers across 3 SaaS platforms.\n• Spearheaded page speed optimization initiatives, reducing initial load latency from 2.8s to 0.9s.\n• Mentored 6 software engineers on modern React hooks, automated Jest testing, and WCAG accessibility standards.'
        }
      ];
      this.state.education = [
        {
          id: 'edu-1',
          degree: 'B.S. in Computer Science',
          institution: 'University of Texas at Austin',
          location: 'Austin, TX',
          startYear: '2016',
          endYear: '2020',
          description: 'Graduated Magna Cum Laude. President of Association for Computing Machinery (ACM).'
        }
      ];
      this.state.skills = ['TypeScript', 'React.js', 'Next.js', 'Tailwind CSS', 'GraphQL', 'REST APIs', 'Jest / Vitest', 'CI/CD Pipelines', 'Performance Optimization', 'Git'];
      this.state.certifications = [
        { id: 'cert-1', certificate: 'AWS Certified Cloud Practitioner', organization: 'Amazon Web Services', year: '2023' }
      ];
      this.state.projects = [
        { id: 'proj-1', name: 'Open-Source Design System', description: 'Published modular component library with 1,200+ GitHub stars.', technologies: 'React, Storybook, TypeScript' }
      ];
    }

    this.syncInputsWithState();
    this.renderFormDynamicSections();
    this.renderPreview();
    if (window.Toast) window.Toast.success(`Loaded sample resume for ${this.state.targetJob}!`);
  },

  // Sync Input Elements with State
  syncInputsWithState() {
    const bindMap = {
      'target-job-input': this.state.targetJob,
      'personal-fullname': this.state.personal.fullName,
      'personal-title': this.state.personal.jobTitle,
      'personal-phone': this.state.personal.phone,
      'personal-email': this.state.personal.email,
      'personal-city': this.state.personal.city,
      'personal-country': this.state.personal.country,
      'personal-linkedin': this.state.personal.linkedin,
      'personal-website': this.state.personal.website,
      'summary-text': this.state.summary,
      'template-selector': this.state.template
    };

    for (const [id, value] of Object.entries(bindMap)) {
      const el = document.getElementById(id);
      if (el) el.value = value || '';
    }
  },

  // Bind Form Inputs to State
  bindInputs() {
    this.syncInputsWithState();

    const onInput = (id, callback) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          callback(e.target.value);
          this.renderPreview();
        });
      }
    };

    onInput('target-job-input', (val) => { this.state.targetJob = val; });
    onInput('personal-fullname', (val) => { this.state.personal.fullName = val; });
    onInput('personal-title', (val) => { this.state.personal.jobTitle = val; });
    onInput('personal-phone', (val) => { this.state.personal.phone = val; });
    onInput('personal-email', (val) => { this.state.personal.email = val; });
    onInput('personal-city', (val) => { this.state.personal.city = val; });
    onInput('personal-country', (val) => { this.state.personal.country = val; });
    onInput('personal-linkedin', (val) => { this.state.personal.linkedin = val; });
    onInput('personal-website', (val) => { this.state.personal.website = val; });
    onInput('summary-text', (val) => { this.state.summary = val; });

    const templateSelect = document.getElementById('template-selector');
    if (templateSelect) {
      templateSelect.addEventListener('change', (e) => {
        this.setTemplate(e.target.value);
      });
    }

    // Photo input handler (optional)
    const photoInput = document.getElementById('personal-photo');
    if (photoInput) {
      photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            this.state.personal.photoUrl = event.target.result;
            this.renderPreview();
          };
          reader.readAsDataURL(file);
        }
      });
    }
  },

  setTemplate(templateName) {
    this.state.template = templateName;
    const templateSelect = document.getElementById('template-selector');
    if (templateSelect) templateSelect.value = templateName;

    // Highlight active template card if exists
    document.querySelectorAll('.template-preview-card').forEach(card => {
      if (card.dataset.template === templateName) {
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }
    });

    this.renderPreview();
  },

  // Setup AI Action Buttons
  setupAIActions() {
    // 1. Generate Summary
    const summaryBtn = document.getElementById('ai-generate-summary-btn');
    if (summaryBtn && window.AIService) {
      summaryBtn.addEventListener('click', () => {
        window.AIService.handleAIButtonAction(
          summaryBtn,
          'summary',
          () => `Target Role: ${this.state.targetJob || this.state.personal.jobTitle}`,
          () => ({
            targetJob: this.state.targetJob || this.state.personal.jobTitle,
            fullName: this.state.personal.fullName,
            skills: this.state.skills,
            experienceContext: this.state.experience.map(e => `${e.jobTitle} at ${e.company}`).join('; ')
          }),
          (generated) => {
            this.state.summary = generated;
            const summaryEl = document.getElementById('summary-text');
            if (summaryEl) summaryEl.value = generated;
            this.renderPreview();
          }
        );
      });
    }

    // 2. Suggest Skills
    const suggestSkillsBtn = document.getElementById('ai-suggest-skills-btn');
    if (suggestSkillsBtn && window.AIService) {
      suggestSkillsBtn.addEventListener('click', () => {
        window.AIService.handleAIButtonAction(
          suggestSkillsBtn,
          'suggest_skills',
          () => this.state.targetJob,
          () => ({ targetJob: this.state.targetJob }),
          (skillsStr) => {
            const newSkills = skillsStr.split(/[,;\n]+/).map(s => s.trim().replace(/^[•\d\.\-]+\s*/, '')).filter(Boolean);
            newSkills.forEach(skill => {
              if (!this.state.skills.includes(skill)) {
                this.state.skills.push(skill);
              }
            });
            this.renderSkillsList();
            this.renderPreview();
          }
        );
      });
    }

    // 3. Optimize Resume for Job
    const optimizeBtn = document.getElementById('ai-optimize-resume-btn');
    if (optimizeBtn && window.AIService) {
      optimizeBtn.addEventListener('click', () => {
        window.AIService.handleAIButtonAction(
          optimizeBtn,
          'optimize_job',
          () => this.state.targetJob,
          () => ({
            targetJob: this.state.targetJob,
            skills: this.state.skills,
            summary: this.state.summary
          }),
          (optimizations) => {
            alert(`ATS Optimization Recommendations for "${this.state.targetJob}":\n\n${optimizations}`);
          }
        );
      });
    }
  },

  // Dynamic Lists Rendering
  renderFormDynamicSections() {
    this.renderExperienceList();
    this.renderEducationList();
    this.renderSkillsList();
    this.renderLanguagesList();
    this.renderCertificationsList();
    this.renderProjectsList();
    this.renderReferencesList();
  },

  // Experience List
  renderExperienceList() {
    const container = document.getElementById('experience-entries-container');
    if (!container) return;

    container.innerHTML = '';
    this.state.experience.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'entry-card';
      card.innerHTML = `
        <div class="entry-card-header">
          <span class="entry-title">${index + 1}. ${item.jobTitle || 'New Position'} at ${item.company || 'Company'}</span>
          <button type="button" class="btn btn-sm btn-danger remove-exp-btn" data-id="${item.id}">Remove</button>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Job Title <span class="required">*</span></label>
            <input type="text" class="form-input exp-title" value="${this.escapeAttr(item.jobTitle)}" placeholder="e.g. CCTV Operator">
          </div>
          <div class="form-group">
            <label class="form-label">Company <span class="required">*</span></label>
            <input type="text" class="form-input exp-company" value="${this.escapeAttr(item.company)}" placeholder="e.g. Metro Transit">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Location</label>
            <input type="text" class="form-input exp-location" value="${this.escapeAttr(item.location)}" placeholder="e.g. Chicago, IL">
          </div>
          <div class="form-group">
            <label class="form-label">Start Date</label>
            <input type="text" class="form-input exp-start" value="${this.escapeAttr(item.startDate)}" placeholder="e.g. 2021 or Jan 2021">
          </div>
          <div class="form-group">
            <label class="form-label">End Date</label>
            <input type="text" class="form-input exp-end" value="${this.escapeAttr(item.endDate)}" placeholder="e.g. Present" ${item.current ? 'disabled' : ''}>
          </div>
        </div>
        <div class="form-group">
          <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; cursor: pointer;">
            <input type="checkbox" class="exp-current" ${item.current ? 'checked' : ''}> I currently work in this role
          </label>
        </div>
        <div class="form-group">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
            <label class="form-label" style="margin-bottom: 0;">Key Responsibilities & Achievements</label>
            <div style="display: flex; gap: 0.5rem;">
              <button type="button" class="btn btn-sm btn-ai improve-exp-ai-btn" data-id="${item.id}">✨ Improve With AI</button>
            </div>
          </div>
          <textarea class="form-textarea exp-resp" placeholder="Describe your duties or achievements using bullet points">${this.escapeAttr(item.responsibilities)}</textarea>
          <div class="form-help">Tip: Begin bullet points with strong action verbs like "Monitored", "Spearheaded", "Maintained".</div>
        </div>
      `;

      // Event listeners for this card
      card.querySelector('.exp-title').addEventListener('input', (e) => { item.jobTitle = e.target.value; this.renderPreview(); });
      card.querySelector('.exp-company').addEventListener('input', (e) => { item.company = e.target.value; this.renderPreview(); });
      card.querySelector('.exp-location').addEventListener('input', (e) => { item.location = e.target.value; this.renderPreview(); });
      card.querySelector('.exp-start').addEventListener('input', (e) => { item.startDate = e.target.value; this.renderPreview(); });
      card.querySelector('.exp-end').addEventListener('input', (e) => { item.endDate = e.target.value; this.renderPreview(); });
      card.querySelector('.exp-current').addEventListener('change', (e) => {
        item.current = e.target.checked;
        if (item.current) item.endDate = 'Present';
        this.renderExperienceList();
        this.renderPreview();
      });
      card.querySelector('.exp-resp').addEventListener('input', (e) => { item.responsibilities = e.target.value; this.renderPreview(); });

      // Remove button
      card.querySelector('.remove-exp-btn').addEventListener('click', () => {
        this.state.experience = this.state.experience.filter(x => x.id !== item.id);
        this.renderExperienceList();
        this.renderPreview();
      });

      // Improve with AI button
      const aiBtn = card.querySelector('.improve-exp-ai-btn');
      aiBtn.addEventListener('click', () => {
        window.AIService.handleAIButtonAction(
          aiBtn,
          'improve_experience',
          () => item.responsibilities,
          () => ({
            targetJob: item.jobTitle || this.state.targetJob,
            company: item.company,
            responsibilities: item.responsibilities
          }),
          (improvedText) => {
            item.responsibilities = improvedText;
            card.querySelector('.exp-resp').value = improvedText;
            this.renderPreview();
          }
        );
      });

      container.appendChild(card);
    });
  },

  addExperienceEntry() {
    this.state.experience.push({
      id: 'exp-' + Date.now(),
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: 'Present',
      current: true,
      responsibilities: ''
    });
    this.renderExperienceList();
    this.renderPreview();
  },

  // Education List
  renderEducationList() {
    const container = document.getElementById('education-entries-container');
    if (!container) return;

    container.innerHTML = '';
    this.state.education.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'entry-card';
      card.innerHTML = `
        <div class="entry-card-header">
          <span class="entry-title">${index + 1}. ${item.degree || 'Degree / Diploma'}</span>
          <button type="button" class="btn btn-sm btn-danger remove-edu-btn" data-id="${item.id}">Remove</button>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Degree or Major <span class="required">*</span></label>
            <input type="text" class="form-input edu-degree" value="${this.escapeAttr(item.degree)}" placeholder="e.g. B.S. in Computer Science">
          </div>
          <div class="form-group">
            <label class="form-label">Institution / University <span class="required">*</span></label>
            <input type="text" class="form-input edu-school" value="${this.escapeAttr(item.institution)}" placeholder="e.g. University of Illinois">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Location</label>
            <input type="text" class="form-input edu-location" value="${this.escapeAttr(item.location)}" placeholder="e.g. Chicago, IL">
          </div>
          <div class="form-group">
            <label class="form-label">Start Year</label>
            <input type="text" class="form-input edu-start" value="${this.escapeAttr(item.startYear)}" placeholder="e.g. 2018">
          </div>
          <div class="form-group">
            <label class="form-label">End Year (or Expected)</label>
            <input type="text" class="form-input edu-end" value="${this.escapeAttr(item.endYear)}" placeholder="e.g. 2022">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Description / Honors (Optional)</label>
          <textarea class="form-textarea edu-desc" placeholder="Notable coursework, honors, GPA, or activities">${this.escapeAttr(item.description)}</textarea>
        </div>
      `;

      card.querySelector('.edu-degree').addEventListener('input', (e) => { item.degree = e.target.value; this.renderPreview(); });
      card.querySelector('.edu-school').addEventListener('input', (e) => { item.institution = e.target.value; this.renderPreview(); });
      card.querySelector('.edu-location').addEventListener('input', (e) => { item.location = e.target.value; this.renderPreview(); });
      card.querySelector('.edu-start').addEventListener('input', (e) => { item.startYear = e.target.value; this.renderPreview(); });
      card.querySelector('.edu-end').addEventListener('input', (e) => { item.endYear = e.target.value; this.renderPreview(); });
      card.querySelector('.edu-desc').addEventListener('input', (e) => { item.description = e.target.value; this.renderPreview(); });

      card.querySelector('.remove-edu-btn').addEventListener('click', () => {
        this.state.education = this.state.education.filter(x => x.id !== item.id);
        this.renderEducationList();
        this.renderPreview();
      });

      container.appendChild(card);
    });
  },

  addEducationEntry() {
    this.state.education.push({
      id: 'edu-' + Date.now(),
      degree: '',
      institution: '',
      location: '',
      startYear: '',
      endYear: '',
      description: ''
    });
    this.renderEducationList();
    this.renderPreview();
  },

  // Skills List
  renderSkillsList() {
    const container = document.getElementById('skills-cloud-container');
    if (!container) return;

    container.innerHTML = '';
    this.state.skills.forEach((skill, idx) => {
      const tag = document.createElement('span');
      tag.className = 'skill-tag';
      tag.innerHTML = `
        ${this.escapeAttr(skill)}
        <button type="button" class="skill-tag-remove" aria-label="Remove skill">&times;</button>
      `;
      tag.querySelector('.skill-tag-remove').addEventListener('click', () => {
        this.state.skills.splice(idx, 1);
        this.renderSkillsList();
        this.renderPreview();
      });
      container.appendChild(tag);
    });
  },

  addSkill(skillName) {
    const trimmed = skillName.trim();
    if (trimmed && !this.state.skills.includes(trimmed)) {
      this.state.skills.push(trimmed);
      this.renderSkillsList();
      this.renderPreview();
    }
  },

  // Languages List
  renderLanguagesList() {
    const container = document.getElementById('languages-container');
    if (!container) return;

    container.innerHTML = '';
    this.state.languages.forEach((lang, idx) => {
      const row = document.createElement('div');
      row.className = 'form-row';
      row.style.alignItems = 'center';
      row.innerHTML = `
        <div class="form-group" style="flex: 2; margin-bottom: 0;">
          <input type="text" class="form-input lang-name" value="${this.escapeAttr(lang.language)}" placeholder="e.g. English, Spanish">
        </div>
        <div class="form-group" style="flex: 2; margin-bottom: 0;">
          <select class="form-select lang-prof">
            <option value="Native" ${lang.proficiency === 'Native' ? 'selected' : ''}>Native / Bilingual</option>
            <option value="Fluent" ${lang.proficiency === 'Fluent' ? 'selected' : ''}>Fluent</option>
            <option value="Professional Working" ${lang.proficiency === 'Professional Working' ? 'selected' : ''}>Professional Working</option>
            <option value="Conversational" ${lang.proficiency === 'Conversational' ? 'selected' : ''}>Conversational</option>
          </select>
        </div>
        <button type="button" class="btn btn-sm btn-danger remove-lang-btn" style="height: 38px;">Remove</button>
      `;

      row.querySelector('.lang-name').addEventListener('input', (e) => { lang.language = e.target.value; this.renderPreview(); });
      row.querySelector('.lang-prof').addEventListener('change', (e) => { lang.proficiency = e.target.value; this.renderPreview(); });
      row.querySelector('.remove-lang-btn').addEventListener('click', () => {
        this.state.languages.splice(idx, 1);
        this.renderLanguagesList();
        this.renderPreview();
      });

      container.appendChild(row);
    });
  },

  addLanguageEntry() {
    this.state.languages.push({
      id: 'lang-' + Date.now(),
      language: '',
      proficiency: 'Professional Working'
    });
    this.renderLanguagesList();
    this.renderPreview();
  },

  // Certifications List
  renderCertificationsList() {
    const container = document.getElementById('certifications-container');
    if (!container) return;

    container.innerHTML = '';
    this.state.certifications.forEach((cert, idx) => {
      const row = document.createElement('div');
      row.className = 'form-row';
      row.style.alignItems = 'center';
      row.innerHTML = `
        <div class="form-group" style="flex: 3; margin-bottom: 0;">
          <input type="text" class="form-input cert-name" value="${this.escapeAttr(cert.certificate)}" placeholder="Certificate Name">
        </div>
        <div class="form-group" style="flex: 2; margin-bottom: 0;">
          <input type="text" class="form-input cert-org" value="${this.escapeAttr(cert.organization)}" placeholder="Issuing Org">
        </div>
        <div class="form-group" style="flex: 1; margin-bottom: 0;">
          <input type="text" class="form-input cert-year" value="${this.escapeAttr(cert.year)}" placeholder="Year">
        </div>
        <button type="button" class="btn btn-sm btn-danger remove-cert-btn" style="height: 38px;">Remove</button>
      `;

      row.querySelector('.cert-name').addEventListener('input', (e) => { cert.certificate = e.target.value; this.renderPreview(); });
      row.querySelector('.cert-org').addEventListener('input', (e) => { cert.organization = e.target.value; this.renderPreview(); });
      row.querySelector('.cert-year').addEventListener('input', (e) => { cert.year = e.target.value; this.renderPreview(); });
      row.querySelector('.remove-cert-btn').addEventListener('click', () => {
        this.state.certifications.splice(idx, 1);
        this.renderCertificationsList();
        this.renderPreview();
      });

      container.appendChild(row);
    });
  },

  addCertificationEntry() {
    this.state.certifications.push({
      id: 'cert-' + Date.now(),
      certificate: '',
      organization: '',
      year: ''
    });
    this.renderCertificationsList();
    this.renderPreview();
  },

  // Projects List
  renderProjectsList() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    container.innerHTML = '';
    this.state.projects.forEach((proj, idx) => {
      const card = document.createElement('div');
      card.className = 'entry-card';
      card.innerHTML = `
        <div class="entry-card-header">
          <span class="entry-title">${idx + 1}. ${proj.name || 'Project Name'}</span>
          <button type="button" class="btn btn-sm btn-danger remove-proj-btn">Remove</button>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Project Name</label>
            <input type="text" class="form-input proj-name" value="${this.escapeAttr(proj.name)}" placeholder="Project title">
          </div>
          <div class="form-group">
            <label class="form-label">Technologies / Tools</label>
            <input type="text" class="form-input proj-tech" value="${this.escapeAttr(proj.technologies)}" placeholder="e.g. CCTV, Milestone, Python">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Description / Outcomes</label>
          <textarea class="form-textarea proj-desc" placeholder="Describe the purpose, actions, and quantifiable outcome">${this.escapeAttr(proj.description)}</textarea>
        </div>
      `;

      card.querySelector('.proj-name').addEventListener('input', (e) => { proj.name = e.target.value; this.renderPreview(); });
      card.querySelector('.proj-tech').addEventListener('input', (e) => { proj.technologies = e.target.value; this.renderPreview(); });
      card.querySelector('.proj-desc').addEventListener('input', (e) => { proj.description = e.target.value; this.renderPreview(); });
      card.querySelector('.remove-proj-btn').addEventListener('click', () => {
        this.state.projects.splice(idx, 1);
        this.renderProjectsList();
        this.renderPreview();
      });

      container.appendChild(card);
    });
  },

  addProjectEntry() {
    this.state.projects.push({
      id: 'proj-' + Date.now(),
      name: '',
      description: '',
      technologies: ''
    });
    this.renderProjectsList();
    this.renderPreview();
  },

  // References List
  renderReferencesList() {
    const container = document.getElementById('references-container');
    if (!container) return;

    container.innerHTML = '';
    this.state.references.forEach((ref, idx) => {
      const row = document.createElement('div');
      row.className = 'form-row';
      row.style.alignItems = 'center';
      row.innerHTML = `
        <div class="form-group" style="flex: 2; margin-bottom: 0;">
          <input type="text" class="form-input ref-name" value="${this.escapeAttr(ref.name)}" placeholder="Referee Name or 'Upon Request'">
        </div>
        <div class="form-group" style="flex: 2; margin-bottom: 0;">
          <input type="text" class="form-input ref-org" value="${this.escapeAttr(ref.company)}" placeholder="Company / Role">
        </div>
        <div class="form-group" style="flex: 2; margin-bottom: 0;">
          <input type="text" class="form-input ref-contact" value="${this.escapeAttr(ref.contact)}" placeholder="Email or Phone">
        </div>
        <button type="button" class="btn btn-sm btn-danger remove-ref-btn" style="height: 38px;">Remove</button>
      `;

      row.querySelector('.ref-name').addEventListener('input', (e) => { ref.name = e.target.value; this.renderPreview(); });
      row.querySelector('.ref-org').addEventListener('input', (e) => { ref.company = e.target.value; this.renderPreview(); });
      row.querySelector('.ref-contact').addEventListener('input', (e) => { ref.contact = e.target.value; this.renderPreview(); });
      row.querySelector('.remove-ref-btn').addEventListener('click', () => {
        this.state.references.splice(idx, 1);
        this.renderReferencesList();
        this.renderPreview();
      });

      container.appendChild(row);
    });
  },

  addReferenceEntry() {
    this.state.references.push({
      id: 'ref-' + Date.now(),
      name: '',
      company: '',
      title: '',
      contact: ''
    });
    this.renderReferencesList();
    this.renderPreview();
  },

  // Stepper Controller
  setupStepper() {
    const stepTabs = document.querySelectorAll('.step-tab');
    stepTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const step = parseInt(tab.dataset.step, 10);
        if (step) this.goToStep(step);
      });
    });

    const prevBtn = document.getElementById('step-prev-btn');
    const nextBtn = document.getElementById('step-next-btn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentStep > 1) this.goToStep(this.currentStep - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.currentStep < this.totalSteps) this.goToStep(this.currentStep + 1);
      });
    }

    // Mobile view switch toggle
    const toggleMobileBtn = document.getElementById('toggle-mobile-preview-btn');
    const layout = document.querySelector('.builder-layout');
    if (toggleMobileBtn && layout) {
      toggleMobileBtn.addEventListener('click', () => {
        if (layout.classList.contains('view-preview')) {
          layout.classList.remove('view-preview');
          layout.classList.add('view-editor');
          toggleMobileBtn.textContent = '👁️ Preview Resume';
        } else {
          layout.classList.remove('view-editor');
          layout.classList.add('view-preview');
          toggleMobileBtn.textContent = '✏️ Edit Resume';
        }
      });
    }
  },

  goToStep(stepNum) {
    this.currentStep = stepNum;

    // Toggle step sections
    document.querySelectorAll('.step-content-section').forEach(sec => {
      if (parseInt(sec.dataset.step, 10) === stepNum) {
        sec.style.display = 'block';
      } else {
        sec.style.display = 'none';
      }
    });

    // Update tab bar state
    document.querySelectorAll('.step-tab').forEach(tab => {
      const s = parseInt(tab.dataset.step, 10);
      tab.classList.remove('active');
      if (s === stepNum) {
        tab.classList.add('active');
      } else if (s < stepNum) {
        tab.classList.add('completed');
      }
    });

    // Update prev/next button text/visibility
    const prevBtn = document.getElementById('step-prev-btn');
    const nextBtn = document.getElementById('step-next-btn');
    if (prevBtn) prevBtn.style.visibility = stepNum === 1 ? 'hidden' : 'visible';
    if (nextBtn) {
      if (stepNum === this.totalSteps) {
        nextBtn.textContent = '🎉 Complete & Preview';
      } else {
        nextBtn.textContent = 'Next Step →';
      }
    }

    window.scrollTo({ top: 120, behavior: 'smooth' });
  },

  // ==========================================================================
  // RESUME PREVIEW RENDERING (ATS COMPLIANT)
  // ==========================================================================
  renderPreview() {
    const container = document.getElementById('resume-preview-sheet');
    if (!container) return;

    const p = this.state.personal;
    const t = this.state.template;

    // Build contact elements string
    const contactParts = [];
    if (p.phone) contactParts.push(`<span>📞 ${this.escapeAttr(p.phone)}</span>`);
    if (p.email) contactParts.push(`<span>✉️ ${this.escapeAttr(p.email)}</span>`);
    if (p.city || p.country) contactParts.push(`<span>📍 ${[p.city, p.country].filter(Boolean).map(this.escapeAttr).join(', ')}</span>`);
    if (p.linkedin) contactParts.push(`<span>🔗 ${this.escapeAttr(p.linkedin)}</span>`);
    if (p.website) contactParts.push(`<span>🌐 ${this.escapeAttr(p.website)}</span>`);

    // Build experience HTML
    let expHTML = '';
    if (this.state.experience.length > 0) {
      expHTML += `
        <div class="resume-section">
          <div class="resume-section-title">Work Experience</div>
          ${this.state.experience.map(item => `
            <div class="resume-item">
              <div class="resume-item-header">
                <div>
                  <span class="resume-item-title">${this.escapeAttr(item.jobTitle || 'Role')}</span>
                  ${item.company ? `<span class="resume-item-subtitle"> | ${this.escapeAttr(item.company)}</span>` : ''}
                  ${item.location ? `<span style="color: #64748b; font-size: 8.5pt;"> (${this.escapeAttr(item.location)})</span>` : ''}
                </div>
                <div class="resume-item-date">${this.escapeAttr(item.startDate || '')} – ${this.escapeAttr(item.endDate || 'Present')}</div>
              </div>
              ${this.formatBulletPoints(item.responsibilities)}
            </div>
          `).join('')}
        </div>
      `;
    }

    // Build education HTML
    let eduHTML = '';
    if (this.state.education.length > 0) {
      eduHTML += `
        <div class="resume-section">
          <div class="resume-section-title">Education</div>
          ${this.state.education.map(item => `
            <div class="resume-item">
              <div class="resume-item-header">
                <div>
                  <span class="resume-item-title">${this.escapeAttr(item.degree || 'Degree')}</span>
                  ${item.institution ? `<span class="resume-item-subtitle"> | ${this.escapeAttr(item.institution)}</span>` : ''}
                  ${item.location ? `<span style="color: #64748b; font-size: 8.5pt;"> (${this.escapeAttr(item.location)})</span>` : ''}
                </div>
                <div class="resume-item-date">${this.escapeAttr(item.startYear || '')}${item.startYear && item.endYear ? ' – ' : ''}${this.escapeAttr(item.endYear || '')}</div>
              </div>
              ${item.description ? `<div style="font-size: 9pt; color: #475569; margin-top: 0.2rem;">${this.escapeAttr(item.description)}</div>` : ''}
            </div>
          `).join('')}
        </div>
      `;
    }

    // Build skills HTML
    let skillsHTML = '';
    if (this.state.skills.length > 0) {
      skillsHTML += `
        <div class="resume-section">
          <div class="resume-section-title">Core Competencies & Skills</div>
          <div class="resume-skills-grid">
            ${this.state.skills.map(s => `<span class="resume-skill-badge">${this.escapeAttr(s)}</span>`).join('')}
          </div>
        </div>
      `;
    }

    // Build certifications HTML
    let certHTML = '';
    if (this.state.certifications.length > 0) {
      certHTML += `
        <div class="resume-section">
          <div class="resume-section-title">Certifications & Licenses</div>
          ${this.state.certifications.map(c => `
            <div class="resume-item">
              <div class="resume-item-header">
                <span class="resume-item-title">${this.escapeAttr(c.certificate)}</span>
                <span class="resume-item-date">${this.escapeAttr(c.year || '')}</span>
              </div>
              ${c.organization ? `<div style="font-size: 8.5pt; color: #64748b;">${this.escapeAttr(c.organization)}</div>` : ''}
            </div>
          `).join('')}
        </div>
      `;
    }

    // Build projects HTML
    let projHTML = '';
    if (this.state.projects.length > 0) {
      projHTML += `
        <div class="resume-section">
          <div class="resume-section-title">Key Projects</div>
          ${this.state.projects.map(p => `
            <div class="resume-item">
              <div class="resume-item-header">
                <span class="resume-item-title">${this.escapeAttr(p.name)}</span>
                ${p.technologies ? `<span style="font-size: 8.5pt; color: #64748b;">[${this.escapeAttr(p.technologies)}]</span>` : ''}
              </div>
              ${p.description ? `<div style="font-size: 9.5pt; color: #334155; margin-top: 0.2rem;">${this.escapeAttr(p.description)}</div>` : ''}
            </div>
          `).join('')}
        </div>
      `;
    }

    // Build languages HTML
    let langHTML = '';
    if (this.state.languages.length > 0) {
      langHTML += `
        <div class="resume-section">
          <div class="resume-section-title">Languages</div>
          <div style="font-size: 9.5pt; color: #334155;">
            ${this.state.languages.map(l => `<strong>${this.escapeAttr(l.language)}</strong> (${this.escapeAttr(l.proficiency)})`).join(' • ')}
          </div>
        </div>
      `;
    }

    // Build references HTML
    let refHTML = '';
    if (this.state.references.length > 0) {
      refHTML += `
        <div class="resume-section">
          <div class="resume-section-title">References</div>
          <div style="font-size: 9pt; color: #475569;">
            ${this.state.references.map(r => `<div><strong>${this.escapeAttr(r.name)}</strong> - ${this.escapeAttr(r.company || '')} ${r.contact ? `(${this.escapeAttr(r.contact)})` : ''}</div>`).join('')}
          </div>
        </div>
      `;
    }

    // Set template class on container
    container.className = `resume-sheet template-${t}`;

    // Fresh graduate layout prioritizes education and skills right below summary
    const bodySections = t === 'graduate'
      ? `${eduHTML}${skillsHTML}${expHTML}${certHTML}${projHTML}${langHTML}${refHTML}`
      : `${expHTML}${eduHTML}${skillsHTML}${certHTML}${projHTML}${langHTML}${refHTML}`;

    container.innerHTML = `
      <header class="resume-header">
        <h1 class="candidate-name">${this.escapeAttr(p.fullName || 'YOUR NAME')}</h1>
        <div class="candidate-title">${this.escapeAttr(p.jobTitle || this.state.targetJob || 'PROFESSIONAL TITLE')}</div>
        <div class="candidate-contact">
          ${contactParts.join(' • ')}
        </div>
      </header>

      ${this.state.summary ? `
        <section class="resume-section">
          <div class="resume-section-title">Professional Summary</div>
          <p style="font-size: 9.75pt; line-height: 1.5; color: #1e293b;">${this.escapeAttr(this.state.summary)}</p>
        </section>
      ` : ''}

      ${bodySections}
    `;
  },

  // Format bullet points cleanly
  formatBulletPoints(text) {
    if (!text) return '';
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return '';

    return `
      <ul class="resume-bullet-list">
        ${lines.map(line => `<li>${this.escapeAttr(line.replace(/^[•\-\*]\s*/, ''))}</li>`).join('')}
      </ul>
    `;
  },

  escapeAttr(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};

window.ResumeApp = ResumeApp;
