import { describe, expect, it, vi } from 'vitest';
import {
  buildEquipmentReviewPayload,
  submitEquipmentForReview
} from './equipmentReview.js';

const equipment = {
  id: 'custom_qsc',
  nombre: 'QSC Core 110f',
  fabricante: 'QSC',
  modelo: 'Core 110f',
  categoria: 'Audio',
  esRackable: true,
  uOcupadas: 1,
  fondo: 286,
  pesoKg: 4.5,
  consumo: 120,
  urlProducto: 'https://www.qsys.com/core-110f',
  notas: 'Comprobar consumo nominal.'
};

const user = {
  displayName: 'Técnico',
  email: 'tecnico@example.com',
  uid: 'user_123'
};

describe('buildEquipmentReviewPayload', () => {
  it('builds the complete email review payload', () => {
    expect(buildEquipmentReviewPayload(equipment, user)).toMatchObject({
      _subject: '[Illusion Rack Designer] Propuesta: QSC Core 110f',
      email: 'tecnico@example.com',
      remitente: 'Técnico',
      fabricante: 'QSC',
      modelo: 'Core 110f',
      url_oficial: 'https://www.qsys.com/core-110f',
      altura_rack: '1U',
      profundidad: '286 mm',
      consumo_declarado: '120 W',
      estado: 'Pendiente de revisión manual'
    });
  });
});

describe('submitEquipmentForReview', () => {
  it('posts the review request to the email service', async () => {
    const request = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: 'true', message: 'Email sent' })
    });

    await submitEquipmentForReview(equipment, user, request);

    expect(request).toHaveBeenCalledOnce();
    expect(request.mock.calls[0][0]).toBe('https://formsubmit.co/ajax/jonycusac@gmail.com');
    expect(request.mock.calls[0][1]).toMatchObject({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });
  });

  it('reports a failed delivery instead of showing a false success', async () => {
    const request = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      json: async () => ({ success: 'false', message: 'Too many requests' })
    });

    await expect(submitEquipmentForReview(equipment, user, request))
      .rejects.toThrow('No se pudo enviar la solicitud de revisión.');
  });
});
