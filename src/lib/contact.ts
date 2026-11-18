/** Field length limits shared by the contact form (maxLength) and the server action (validation). */
export const CONTACT_LIMITS = {
  name: 200,
  email: 254,
  message: 5000,
} as const;
