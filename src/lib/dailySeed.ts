/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const getTodayChallengeId = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

export const getDailySeed = (): number => {
  const id = getTodayChallengeId();
  // Simple hash for seed
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  return hash;
};

export const getTodayLabel = (): string => {
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date());
};
