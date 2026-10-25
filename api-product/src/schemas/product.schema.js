// src/schemas/product.schema.js
// Validasi request body POST/PUT menggunakan Zod.

import { z } from 'zod';

const VariantsSchema = z
  .object({
    colorOrSize: z
      .array(
        z
          .string({ invalid_type_error: 'Each variant value must be a string' })
          .trim()
          .min(1, 'Each variant value must not be empty')
          .max(50, 'Each variant value must not exceed 50 characters'),
      )
      .min(1, 'variants.colorOrSize must have at least one item'),
    quantity: z
      .number({ invalid_type_error: 'variants.quantity must be a number' })
      .int('variants.quantity must be an integer')
      .min(0, 'variants.quantity must be >= 0')
      .max(Number.MAX_SAFE_INTEGER, 'variants.quantity exceeds safe integer'),
  })
  .strict('variants contains unknown fields');

const imageUrlSchema = z.string({ invalid_type_error: 'image must be a string' })
  .max(2048, 'image URL must not exceed 2048 characters')
  .refine((val) => {
    try {
      const url = new URL(val);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch { return false; }
  }, { message: 'Image must be a valid HTTP/HTTPS URL' });

export const ProductInputSchema = z
  .object({
    name: z
      .string({ invalid_type_error: 'name must be a string' })
      .trim()
      .min(1, 'name must not be empty')
      .max(120, 'name must not exceed 120 characters'),
    price: z
      .number({ invalid_type_error: 'price must be a number' })
      .int('price must be an integer')
      .min(0, 'price must be >= 0')
      .max(Number.MAX_SAFE_INTEGER, 'price exceeds safe integer'),
    image: imageUrlSchema,
    // Optional: klien lama tetap boleh hanya mengirim field image.
    images: z.array(imageUrlSchema)
      .min(1, 'images must contain at least one photo')
      .max(3, 'images must contain at most three photos')
      .optional(),
    variants: z
      .object(
        {
          colorOrSize: z.any(),
          quantity: z.any(),
        },
        { invalid_type_error: 'variants must be an object' },
      )
      .passthrough()
      .pipe(VariantsSchema),
    description: z
      .string({ invalid_type_error: 'description must be a string' })
      .trim()
      .min(1, 'description must not be empty')
      .max(2000, 'description must not exceed 2000 characters'),
  })
  .strict('Request body contains unknown fields')
  .superRefine((data, context) => {
    if (data.images?.length && data.images[0] !== data.image) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ['images'], message: 'First photo must match image (primary photo)' });
    }
    if (data.images && new Set(data.images).size !== data.images.length) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ['images'], message: 'Image URLs must be unique' });
    }
  });

/**
 * Parse dan validasi body. Kembalikan { data } atau lempar AppError.
 * Digunakan oleh validate-request middleware.
 */
export function parseProductInput(body, instance) {
  return ProductInputSchema.safeParse(body);
}
