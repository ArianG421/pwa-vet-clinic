// Facts only — translatable text lives in messages/{locale}.json under
// "crm.templates.<id>". See getEmailTemplates below.

export type EmailTemplateFact = { id: string };

export const emailTemplateFacts: EmailTemplateFact[] = [
  { id: "we-miss-you" },
  { id: "seasonal-checkup" },
  { id: "member-offer" },
];

export type EmailTemplate = EmailTemplateFact & { label: string; subject: string; body: string };

// {{name}} is replaced with the lead's name (or a generic fallback) when a
// template is applied to the compose form — plain string substitution, no
// templating engine needed for three short snippets.
export function getEmailTemplates(t: (key: string) => string): EmailTemplate[] {
  return emailTemplateFacts.map((template) => ({
    ...template,
    label: t(`${template.id}.label`),
    subject: t(`${template.id}.subject`),
    body: t(`${template.id}.body`),
  }));
}

export function applyTemplate(body: string, name: string): string {
  return body.replaceAll("{{name}}", name);
}
