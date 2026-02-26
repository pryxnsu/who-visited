import { z } from 'zod/v3';

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

export type AddSiteFormValues = z.infer<typeof addSiteSchema>;
