export type CursorModelParam = {
  id: string;
  value: string;
};

export type CursorAgentModelSelection = {
  id: string;
  params?: CursorModelParam[];
};

export type CursorModelCatalogItem = {
  id: string;
  displayName?: string;
  aliases?: string[];
  variants?: Array<{
    params?: CursorModelParam[];
    isDefault?: boolean;
  }>;
};

/**
 * Pick the Composer 2 family model from a Cursor `/v1/models` response.
 * Prefers `composer-2`, then other `composer-2*` IDs (e.g. `composer-2.5`).
 * Uses the standard (non-fast) variant to avoid `composer-2.5-fast` billing.
 *
 * @param items - Model catalog entries from Cursor API
 * @returns Model id + standard-tier params for agent launch
 */
export const pickCursorComposerModel = (
  items: CursorModelCatalogItem[],
): CursorAgentModelSelection | undefined => {
  const composerModels = items.filter((item) => {
    if (item.id === 'composer-2' || item.id.startsWith('composer-2')) {
      return true;
    }
    if (item.aliases?.some((alias) => alias.includes('composer'))) {
      return true;
    }
    return item.displayName?.toLowerCase().includes('composer 2') ?? false;
  });

  if (composerModels.length === 0) {
    return undefined;
  }

  const sorted = [...composerModels].sort((a, b) => {
    const rank = (id: string): number => {
      if (id === 'composer-2') return 0;
      if (id.startsWith('composer-2')) return 1;
      return 2;
    };
    return rank(a.id) - rank(b.id);
  });

  const model = sorted[0];
  const standardVariant = model.variants?.find((variant) =>
    variant.params?.some((param) => param.id === 'fast' && param.value === 'false'),
  );
  const variant = standardVariant ?? model.variants?.[0];
  const params =
    variant?.params?.filter((param) => param.id && param.value) ??
    (model.variants?.some((v) => v.params?.some((p) => p.id === 'fast'))
      ? [{ id: 'fast', value: 'false' }]
      : undefined);

  return params && params.length > 0 ? { id: model.id, params } : { id: model.id };
};
