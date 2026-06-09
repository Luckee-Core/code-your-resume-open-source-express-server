/**
 * Replace `{{key}}` placeholders in a prompt template with string values.
 */
export const renderPromptTemplate = (
  template: string,
  vars: Record<string, string>,
): string => {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
    if (Object.prototype.hasOwnProperty.call(vars, key)) {
      return vars[key];
    }
    return match;
  });
};
