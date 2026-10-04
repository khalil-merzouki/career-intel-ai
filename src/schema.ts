import { z } from 'zod';

export const requestSchema = z.object({
  description: z.string().trim().min(100).max(50_000),
  url: z.union([z.literal(''), z.url().refine((value) => /^https?:\/\//i.test(value))]).default(''),
}).strict();

export const extractionSchema = z.object({
  role: z.string().max(500).describe('Job title, or empty when not stated.'),
  company: z.string().max(500).describe('Employer name, or empty when not stated.'),
  location: z.string().max(500).describe('Job location, or Unknown when not stated.'),
  workType: z.enum(['remote', 'hybrid', 'on-site', 'unknown']),
  salary: z.string().max(500).describe('Only compensation stated in the job description; otherwise empty.'),
  salarySource: z.enum(['listed', 'estimated']).describe('listed when salary is stated; estimated when the salary field is empty.'),
  seniority: z.string().max(500).describe('Seniority explicitly stated or empty.'),
  experience: z.string().max(1000).describe('Experience requirement explicitly stated or empty.'),
  requirements: z.array(z.object({
    category: z.enum(['skill', 'language', 'certification', 'location', 'work']),
    text: z.string().min(1).max(1000),
    priority: z.enum(['required', 'preferred']),
  }).strict()).max(100),
}).strict();

export type ExtractRequest = z.infer<typeof requestSchema>;
export type Extraction = z.infer<typeof extractionSchema>;
