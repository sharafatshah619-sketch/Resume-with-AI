/**
 * ResumeAI Pro – PDF & Print Manager
 * Produces crisp, selectable vector A4 PDFs using browser print engine.
 * Ensures all website chrome, sidebars, and navbars are stripped away.
 */

const PDFService = {
  downloadPDF() {
    // 1. Ensure preview is up to date
    if (window.ResumeApp) {
      window.ResumeApp.renderPreview();
    }

    // 2. Display friendly tip
    if (window.Toast) {
      window.Toast.info('Preparing PDF... Select "Save as PDF" and "A4" size in the print dialog.', 4000);
    }

    // 3. Briefly delay to allow any pending DOM paint
    setTimeout(() => {
      window.print();
    }, 300);
  },

  initButtons() {
    document.querySelectorAll('.download-pdf-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.downloadPDF();
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  PDFService.initButtons();
});

window.PDFService = PDFService;
