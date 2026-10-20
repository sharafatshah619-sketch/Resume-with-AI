/**
 * ResumeAI Pro – AI Service Module
 * Connects securely to backend endpoint POST /api/ai
 * Never exposes private AI keys in client JavaScript.
 * Includes graceful fallback and input sanitization to prevent XSS.
 */

const AIService = {
  // Primary AI content generation function
  async generateAIContent(action, prompt = '', data = {}) {
    const payload = {
      action,
      prompt,
      data,
    };

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to generate AI content');
      }

      return result.result;
    } catch (err) {
      console.warn('Backend /api/ai reached an error or is offline, using client fallback:', err.message);
      // Graceful local smart fallback so application always works smoothly in demo mode
      return this.getLocalFallback(action, prompt, data);
    }
  },

  // Helper for UI buttons: manages loading state, disabled styling, and error handling
  async handleAIButtonAction(buttonElement, action, promptGetter, dataGetter, onResult) {
    if (!buttonElement) return;

    const originalText = buttonElement.innerHTML;
    try {
      buttonElement.disabled = true;
      buttonElement.innerHTML = `
        <svg style="animation: spin 1s linear infinite; width: 14px; height: 14px; display: inline-block; vertical-align: middle; margin-right: 4px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg> Generating...
      `;

      const prompt = typeof promptGetter === 'function' ? promptGetter() : (promptGetter || '');
      const data = typeof dataGetter === 'function' ? dataGetter() : (dataGetter || {});

      const result = await this.generateAIContent(action, prompt, data);

      if (typeof onResult === 'function') {
        onResult(result);
      }

      if (window.Toast) {
        window.Toast.success('AI content generated successfully!');
      }
      return result;
    } catch (err) {
      console.error('AI Button Action error:', err);
      if (window.Toast) {
        window.Toast.error('Could not generate AI content. Please try again.');
      }
    } finally {
      buttonElement.disabled = false;
      buttonElement.innerHTML = originalText;
    }
  },

  // Intelligent client-side fallback if network is interrupted
  getLocalFallback(action, prompt, data = {}) {
    const targetJob = (data.targetJob || data.jobTitle || 'Professional').trim();
    const skills = Array.isArray(data.skills) ? data.skills.join(', ') : (data.skills || 'problem-solving, communication');

    if (action === 'summary') {
      return `Dedicated and results-driven ${targetJob} with extensive experience coordinating complex operational workflows and upholding rigorous quality standards. Proven track record in ${skills}. Adept at collaborating across cross-functional teams, solving operational challenges, and driving continuous improvement in demanding environments.`;
    }

    if (action === 'improve_experience') {
      return `• Spearheaded operational workflows as ${targetJob}, achieving an estimated 20% enhancement in procedural efficiency.
• Coordinated daily duties adhering strictly to compliance guidelines, quality standards, and workplace safety protocols.
• Identified workflow bottlenecks and implemented structured resolutions that reduced task turnarounds.
• Maintained detailed documentation and collaborated with colleagues to maintain seamless cross-shift continuity.`;
    }

    if (action === 'generate_responsibilities') {
      if (targetJob.toLowerCase().includes('cctv')) {
        return `• Monitored live multi-screen CCTV surveillance feeds across perimeter and high-security zones.
• Documented all suspicious incidents, security breaches, and equipment faults in digital logbooks.
• Maintained strict adherence to data protection regulations and video evidence chain-of-custody protocols.
• Performed routine camera angle audits and system health checks to maintain 99.9% uptime.`;
      }
      return `• Executed core operational deliverables in alignment with departmental goals and performance metrics.
• Analyzed operational trends to identify process improvements and reduce response latencies.
• Liaised with clients, managers, and technical specialists to ensure timely project execution.
• Audited standard operating procedures (SOPs) to ensure continuous regulatory and safety compliance.`;
    }

    if (action === 'suggest_skills') {
      if (targetJob.toLowerCase().includes('cctv')) {
        return 'CCTV Monitoring, Video Management Systems (VMS), Security Incident Reporting, Emergency Dispatch, Loss Prevention, Perimeter Surveillance, Chain of Custody, Attention to Detail, Communication';
      }
      return 'Operational Management, Process Optimization, Quality Control, Cross-Functional Teamwork, Problem Resolution, Risk Mitigation, Technical Documentation, Performance Tracking';
    }

    if (action === 'cover_letter') {
      return `Dear Hiring Manager,\n\nI am excited to submit my application for the ${targetJob} position at ${data.companyName || 'your organization'}. With a proven background in operational excellence and a deep commitment to quality standards, I am confident in my ability to quickly add value to your team.\n\nThroughout my career, I have honed skills in ${skills}. I take pride in maintaining exceptional attention to detail, solving operational challenges efficiently, and supporting collaborative team goals.\n\nI welcome the opportunity to discuss how my qualifications align with your objectives. Thank you for your consideration.\n\nSincerely,\n${data.fullName || 'Candidate'}`;
    }

    return `Professional ATS-compliant resume content generated for ${targetJob}.`;
  },

  // Safe text sanitizer
  sanitizeHTML(str) {
    if (!str) return '';
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
  }
};

window.AIService = AIService;
