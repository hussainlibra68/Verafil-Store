/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Format currency amounts in Pakistani Rupees (PKR)
 * Example: formatPKR(4200) => "PKR 4,200"
 */
export function formatPKR(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null || amount === '') return 'PKR 0';
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  return `PKR ${Math.round(num).toLocaleString('en-PK')}`;
}

export default formatPKR;
