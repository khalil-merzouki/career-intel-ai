import { z } from 'zod';

export const profileRequestSchema = z.object({
  text: z.string().trim().min(20).max(100_000),
}).strict();

export const profileExtractionSchema = z.object({
  currentRole: z.string().max(500),
  experience: z.array(z.object({
    role: z.string().max(500), company: z.string().max(500),
    period: z.string().max(500), description: z.string().max(2000),
  }).strict()).max(100),
  skills: z.array(z.object({
    name: z.string().max(500),
    proficiency: z.enum(['Unspecified', 'Beginner', 'Intermediate', 'Advanced', 'Expert']),
  }).strict()).max(100),
  education: z.array(z.object({
    qualification: z.string().max(500), institution: z.string().max(500), year: z.string().max(500),
  }).strict()).max(100),
  certifications: z.array(z.object({
    name: z.string().max(500), issuer: z.string().max(500),
  }).strict()).max(100),
  languages: z.array(z.object({
    name: z.string().max(500), proficiency: z.string().max(500),
  }).strict()).max(100),
  interests: z.array(z.string().max(200)).max(100),
  workModels: z.array(z.string().max(200)).max(100),
  locations: z.array(z.string().max(200)).max(100),
  salaryCurrency: z.string().max(10),
  salaryMinimum: z.string().max(50),
  salaryTarget: z.string().max(50),
}).strict();

export type ProfileRequest = z.infer<typeof profileRequestSchema>;
export type ProfileExtraction = z.infer<typeof profileExtractionSchema>;
