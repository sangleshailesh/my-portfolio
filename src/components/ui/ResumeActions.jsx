import { RESUME_PDF, profile } from '../../data/portfolioData';
import { Action } from './Action';

/**
 * Résumé actions.
 *
 * The primary action always points at the in-app /resume page, which is built
 * from the same data as the rest of the site — so it can never 404 and is
 * always current. If a real PDF is dropped into `public/` and `RESUME_PDF` is
 * set, a download action appears beside it.
 */
export function ResumeActions() {
  return (
    <>
      <Action
        to="/resume"
        variant={RESUME_PDF ? 'outline' : 'solid'}
        icon="document"
        iconPosition="start"
      >
        Résumé
      </Action>

      {RESUME_PDF && (
        <Action
          href={RESUME_PDF}
          variant="solid"
          icon="arrowUpRight"
          external
          aria-label={`Download ${profile.name}'s résumé as a PDF (opens in a new tab)`}
        >
          Download PDF
        </Action>
      )}
    </>
  );
}
