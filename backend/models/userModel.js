import { z } from 'zod';

export const userModel = z.object({
  name: z.string().min(1), // Name must be at least 1 character
  email: z.string().email(), // Email must be a valid email address
  image: z.string("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAABSUlEQVR4nN2UPU4DMRCFP4KSBgoOQc3CJRAdUYCEW1DwU1MCSRckLoByJTYEuAK/BT9iF430VlotNrYp86QnWfab8XhmPDDv6AADYALkwJuYa68vzb+wA9wDZYB3QC/F8SIwcjgqgKlYOM6HQCvmApfzHFiraTJd1NRdxKSlafQth01knpd0fc47yqcreh9cr3jwFX7gKeI08QLjnks88YgLT4rWPSkyXqdEU+osazi//UPvTOtLoN+LQJvWab5+4TXiU5WRfE5NUZnIm9giPwJX6rBVYEm09b7OnmKL3K8J3oFjYJkwTHMim8p+N/TRxqTjUrYzoO0T9ST6BDYTnG8BX7LdDomHEprBaWBCLgAHwIdszmKiaWkq1jviENgAVkRbH+ms0p3HjusKXeUz1JKzmLT40NbgsrazaO0zGm1te9Yt3oLOB34ACqrfyi5MYE4AAAAASUVORK5CYII="), // Image URL or path
  password: z.string().min(6), // Password must be at least 6 characters
  address: z.object({
    line1: z.string(), // Address line 1
    line2: z.string(), // Address line 2
  }),
  gender: z.string(), // Gender as a string
  dob: z.string().refine(value => !isNaN(Date.parse(value)), { // Ensure it's a valid date string
    message: "Invalid date format"
  }), 
  phone: z.string().min(11), // Phone number stored as string (e.g., can be formatted)
});
