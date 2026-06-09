/**
 * Base URL for email-manager Express (EMAIL_MANAGER_EXPRESS_URL).
 */
export const getEmailManagerBaseUrl = (): string => {
  const baseUrl = process.env.EMAIL_MANAGER_EXPRESS_URL?.trim();
  if (!baseUrl) {
    throw new Error('EMAIL_MANAGER_EXPRESS_URL is not configured');
  }
  return baseUrl.replace(/\/$/, '');
};
