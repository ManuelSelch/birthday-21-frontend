import { IconSparkles } from '@tabler/icons-react';

export interface ProgrammeEntry {
  time: string;
  title: string;
  summary: string;
  chapter: string;
  highlight?: boolean;
}

export function ProgrammeItem({ entry }: { entry: ProgrammeEntry }) {
  return <li className={entry.highlight ? 'programme-item highlight' : 'programme-item'}>
    <div className="time-column"><span>{entry.time}</span><span className="timeline-dot" /></div>
    <div className="entry-content">
      <div className="entry-body">
        <div className="entry-copy">
          <span className="chapter">{entry.highlight && <IconSparkles size={13} aria-hidden="true" />}{entry.chapter}</span>
          <h2>{entry.title}</h2>
          <p>{entry.summary}</p>
        </div>
      </div>
    </div>
  </li>;
}
