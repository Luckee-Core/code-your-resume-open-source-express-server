export type ExchangeTableRegistryRow = {
  id: string;
  logical_key: string;
  table_name: string;
  occurred_at_column: string;
  input_tokens_column: string;
  output_tokens_column: string;
  model_column: string | null;
  enabled: boolean;
  sort_order: number;
  notes: string | null;
};
