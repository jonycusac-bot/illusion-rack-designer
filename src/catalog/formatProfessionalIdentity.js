export const formatProfessionalIdentity = professional => [
  professional?.fabricante?.trim(),
  professional?.modelo?.trim(),
].filter(Boolean).join(' · ');
