import { z } from 'zod/v3';
import { SITE_VERIFICATION_METHODS } from './site';

export const addSiteSchema = z.object({
  name: z
    .string({
      required_error: 'Site name is required',
      invalid_type_error: 'Site name must be text',
    })
    .trim()
    .min(1, 'Site name is required')
    .max(100, 'Site name must be at most 100 characters'),
  domain: z
    .string({
      required_error: 'Domain is required',
      invalid_type_error: 'Domain must be text',
    })
    .trim()
    .toLowerCase()
    .min(1, 'Domain is required')
    .max(253, 'Domain is too long (maximum 253 characters)'),
});

export const trackSchema = z.object({
  siteId: z
    .string()
    .min(3)
    .max(40)
    .regex(/^[a-zA-Z0-9_-]+$/),

  path: z.string().default('/'),

  referrer: z.string().nullable().optional(),

  userAgent: z.string().optional(),

  timezone: z.string().optional(),

  language: z.string().optional(),

  platform: z.string().optional(),

  screen: z
    .object({
      width: z.number(),
      height: z.number(),
    })
    .optional(),

  timestamp: z.string().optional(),
});

export const verifySiteSchema = z.object({
  method: z.enum(SITE_VERIFICATION_METHODS, {
    required_error: 'Verification method is required',
    invalid_type_error: 'Invalid verification method',
  }),
});

export type AddSiteFormValues = z.infer<typeof addSiteSchema>;
export type VerifySiteValues = z.infer<typeof verifySiteSchema>;
