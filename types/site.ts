export const SITE_VERIFICATION_STATUSES = ['pending', 'verified', 'failed'] as const;
export type SiteVerificationStatus = (typeof SITE_VERIFICATION_STATUSES)[number];

export const SITE_VERIFICATION_METHODS = ['dns_txt', 'meta_tag', 'file'] as const;
export type SiteVerificationMethod = (typeof SITE_VERIFICATION_METHODS)[number];

export interface Site {
  id: string;
  name: string;
  domain: string;
  userId: string;
  verificationStatus: SiteVerificationStatus;
  verificationMethod: SiteVerificationMethod | null;
  verificationToken: string;
  verifiedAt: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}
