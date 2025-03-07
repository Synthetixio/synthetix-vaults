import { currency } from './';
import { wei } from '@synthetixio/wei';

describe('currency', () => {
  it('should format positive Wei value with default options', () => {
    const value = wei('123456789000000000', 18, true);
    expect(currency(value)).toBe('0.12');
  });

  it('should format negative Wei value with default options', () => {
    const value = wei('-123456789000000000', 18, true);
    expect(currency(value)).toBe('-0.12');
  });

  it('should format zero Wei value with default options', () => {
    const value = wei('0');
    expect(currency(value)).toBe('0.00');
  });

  it('should format large positive Wei value', () => {
    const value = wei('123456789123456789123456789', 18, true);
    expect(currency(value)).toBe('123,456,789.12');
  });

  it('should format large negative Wei value', () => {
    const value = wei('-123456789123456789123456789', 18, true);
    expect(currency(value)).toBe('-123,456,789.12');
  });

  it('should format large positive Wei value with average option', () => {
    const value = wei('123456789123456789123456789', 18, true);
    expect(currency(value, { average: true })).toBe('123.46m');
  });

  it('should format large negative Wei value with average option', () => {
    const value = wei('-123456789123456789123456789', 18, true);
    expect(currency(value, { average: true })).toBe('-123.46m');
  });
});
