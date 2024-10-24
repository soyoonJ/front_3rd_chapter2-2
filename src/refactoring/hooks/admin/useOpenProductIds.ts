import { useState } from 'react';

import { updateOpenProductIds } from '@/refactoring/helpers';

export const useOpenProductIds = () => {
  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());
  const toggleProductAccordion = (productId: string) => {
    setOpenProductIds((prev) => updateOpenProductIds(prev, productId));
  };

  return {
    openProductIds,
    toggleProductAccordion,
  };
};
