export const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  image: z.string(),
  password: z.string().min(6),
  experience: z.string(),
  fees: z.number(),
  about: z.string(),
  availlable: z.boolean().optional(),
  speciality: z.string(),
  degree: z.string(),
  address: z.object({
    line1: z.string(),
    line2: z.string(),
  }),
  date: z.number().optional(),
  slot_booked: z.number().min(0).default(0),
});
