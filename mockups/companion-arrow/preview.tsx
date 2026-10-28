import { useState } from 'react';
import { UnstyledButton } from '@mantine/core';
import { IconArrowRight, IconCheck } from '@tabler/icons-react';

interface CompanionChoiceProps {
  selected: boolean;
  onToggle: () => void;
}

function CompanionChoice({ selected, onToggle }: CompanionChoiceProps) {
  return (
    <UnstyledButton className="companion-choice" data-selected={selected} aria-pressed={selected} aria-label="Ich bringe eine Begleitung mit" onClick={onToggle}>
      <span className="choice-copy">
        <span className="choice-title">{selected ? 'Deine Begleitung ist dabei' : 'Ich bringe eine Begleitung mit'}</span>
        <span className="choice-hint">{selected ? 'Erneut tippen zum Entfernen' : 'Zu zweit feiern'}</span>
      </span>
      <span className="choice-icon" aria-hidden="true">
        {selected ? <IconCheck size={32} stroke={1.7} /> : <IconArrowRight size={32} stroke={1.7} />}
      </span>
    </UnstyledButton>
  );
}

export function CompanionPreview() {
  const [selected, setSelected] = useState(new URLSearchParams(window.location.search).get('state') === 'selected');
  return (
    <main>
      <section className="response" aria-labelledby="response-title">
        <p className="eyebrow">21. GEBURTSTAG</p>
        <h1 id="response-title">Du bist dabei, Max.</h1>
        <CompanionChoice selected={selected} onToggle={() => setSelected(value => !value)} />
        <p className="review-note">Interaktiver Entwurf · noch keine echte Rückmeldung</p>
      </section>
    </main>
  );
}
