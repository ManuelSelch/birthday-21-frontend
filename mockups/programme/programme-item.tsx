import { useState } from 'react';
import { UnstyledButton, Collapse } from '@mantine/core';
import { IconPlus, IconMinus, IconSparkles } from '@tabler/icons-react';

export interface ProgrammeEntry {
  time: string;
  title: string;
  summary: string;
  details: string;
  chapter: string;
  highlight?: boolean;
}

export function ProgrammeItem({ entry, index }: { entry: ProgrammeEntry; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const detailId = 'programme-detail-' + index;
  return <li className={entry.highlight ? 'programme-item highlight' : 'programme-item'}>
    <div className="time-column"><span>{entry.time}</span><span className="timeline-dot" /></div>
    <div className="entry-content">
      <UnstyledButton className="entry-toggle" onClick={() => setExpanded(!expanded)} aria-expanded={expanded} aria-controls={detailId}>
        <div className="entry-copy">
          <span className="chapter">{entry.highlight && <IconSparkles size={13} aria-hidden="true" />}{entry.chapter}</span>
          <h2>{entry.title}</h2>
          <p>{entry.summary}</p>
        </div>
        <span className="expand-icon">{expanded ? <IconMinus size={18} aria-hidden="true" /> : <IconPlus size={18} aria-hidden="true" />}</span>
      </UnstyledButton>
      <Collapse in={expanded}><div id={detailId} className="entry-details">{entry.details}</div></Collapse>
    </div>
  </li>;
}
