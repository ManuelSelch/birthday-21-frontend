import Image from 'next/image';
import { cx } from './show-styles';
import { jurors } from './show-data';
import { BuzzerConfetti } from './buzzer-confetti';

export function BuzzerReaction({ active, burst }: { active: boolean[]; burst: number }) {
  return <div className={cx('beamer-reaction')} role="status" aria-label="Jury-Reaktion">
    <div key={burst}><BuzzerConfetti/></div>
    <div className={cx('buzzer-people')}>
      {jurors.map((juror, index) => active[index] && <div className={cx('buzzer-person')} key={juror.name}>
        <Image src={juror.photo} alt={juror.name} width={160} height={160}/>
        <strong>{juror.name}</strong>
      </div>)}
    </div>
  </div>;
}
