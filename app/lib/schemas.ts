import { z } from "zod";

// Belt Ranks (approximate list for validation)
export const RankEnum = z.enum([
  "White",
  "Yellow",
  "Orange",
  "Green",
  "Blue",
  "Purple",
  "Brown",
  "Red",
  "Black",
]);

export const StudentSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is too short").optional(),
  dateOfBirth: z.string().datetime().optional(), // ISO String expected from frontend
  emergencyContact: z.string().min(5, "Emergency contact details required"),
  rank: RankEnum.default("White"),
  classId: z.string().optional(),
});

export const AttendanceSchema = z.object({
  studentId: z.string().cuid(),
  classType: z.string().min(1, "Class type is required"),
});

export const PromotionSchema = z.object({
  studentId: z.string().cuid(),
  rankId: z.string().cuid(),
  notes: z.string().optional(),
});
