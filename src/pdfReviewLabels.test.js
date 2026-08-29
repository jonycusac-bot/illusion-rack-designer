import { describe, expect, it } from 'vitest';
import { PDF_REVIEW_LABELS } from './pdfReviewLabels';

describe('PDF_REVIEW_LABELS', () => {
  it('usa textos de revisión técnica sin afirmar homologación o conformidad', () => {
    const labels = Object.values(PDF_REVIEW_LABELS).join(' ').toUpperCase();

    expect(labels).not.toContain('HOMOLOGACIÓN');
    expect(labels).not.toContain('CONFORME PARA INSTALACIÓN');
    expect(labels).not.toContain('DISEÑO VERIFICADO');
    expect(labels).not.toContain('CÓDIGO VERIFICACIÓN');
    expect(PDF_REVIEW_LABELS.heading).toBe('REVISIÓN TÉCNICA DEL PROYECTO');
    expect(PDF_REVIEW_LABELS.status).toBe('Estado: PENDIENTE DE REVISIÓN PROFESIONAL');
    expect(PDF_REVIEW_LABELS.standard).toBe('CONFIGURACIÓN PARA FORMATO DE RACK 19"');
    expect(PDF_REVIEW_LABELS.notice).toBe('Validar antes de compra e instalación');
  });
});
