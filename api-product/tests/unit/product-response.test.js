// tests/unit/product-response.test.js
import { describe, it, expect } from 'vitest';
import { mapProductToResponse, successResponse } from '../../src/utils/product-response.js';

describe('mapProductToResponse', () => {
  const productRow = {
    id: 1n,
    name: 'Kaos Katun Polos',
    price: 150000n,
    image_url: 'https://example.com/kaos.png',
    stock: 30n,
    description: 'Deskripsi produk.',
  };

  const variantRows = [
    { value: 'S', quantity: 10 },
    { value: 'M', quantity: 15 },
    { value: 'L', quantity: 5 },
  ];

  it('should map image_url to image', () => {
    const result = mapProductToResponse(productRow, variantRows);
    expect(result.image).toBe('https://example.com/kaos.png');
    expect(result.images).toEqual(['https://example.com/kaos.png']);
    expect(result.image_url).toBeUndefined();
  });

  it('should expose a gallery and keep primary image', () => {
    const row = { ...productRow, images: ['https://example.com/kaos.png', 'https://example.com/kaos-side.png'] };
    const result = mapProductToResponse(row, variantRows);
    expect(result.images).toHaveLength(2);
    expect(result.image).toBe(result.images[0]);
  });

  it('should aggregate variant values into colorOrSize array', () => {
    const result = mapProductToResponse(productRow, variantRows);
    expect(result.variants.colorOrSize).toEqual(['S', 'M', 'L']);
  });

  it('uses products.stock, not repeated variant quantity', () => {
    const duplicated = [
      { value: 'S', quantity: 10 },
      { value: 'M', quantity: 10 },
      { value: 'L', quantity: 10 },
    ];
    const result = mapProductToResponse({ ...productRow, stock: 10n }, duplicated);
    expect(result.variants.colorOrSize).toEqual(['S', 'M', 'L']);
    expect(result.variants.quantity).toBe(10); // never 30
  });

  it('does not change stock when number of variants changes', () => {
    const result = mapProductToResponse({ ...productRow, stock: 10n }, [
      ...variantRows, { value: 'XL', quantity: 10 },
    ]);
    expect(result.variants.quantity).toBe(10);
  });

  it('fails loudly if stock migration has not been applied', () => {
    const row = { ...productRow };
    delete row.stock;
    expect(() => mapProductToResponse(row, variantRows)).toThrow(/migration 004/);
  });

  it('should convert BigInt id and price to number', () => {
    const result = mapProductToResponse(productRow, variantRows);
    expect(typeof result.id).toBe('number');
    expect(typeof result.price).toBe('number');
    expect(result.id).toBe(1);
    expect(result.price).toBe(150000);
  });

  it('should handle empty variants array', () => {
    const result = mapProductToResponse(productRow, []);
    expect(result.variants.colorOrSize).toEqual([]);
    expect(result.variants.quantity).toBe(30); // stock belongs to product, even if variants empty
  });
});

describe('successResponse', () => {
  it('should wrap data in envelope with empty meta by default', () => {
    const result = successResponse({ id: 1 });
    expect(result).toEqual({ data: { id: 1 }, meta: {} });
  });

  it('should include custom meta', () => {
    const result = successResponse([], { total: 5 });
    expect(result.meta.total).toBe(5);
  });
});
