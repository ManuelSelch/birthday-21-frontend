import Image from 'next/image';
import { IconStarFilled } from '@tabler/icons-react';
import { cx } from './show-styles';
import { jurors } from './show-data';

export function BuzzerReaction({index}: {index:number}) {
 const juror=jurors[index]; const Icon=juror.Icon;
 return <div className={cx(`beamer-reaction reaction-${index}`)} role="status"><div className={cx('reaction-wave')}/><div className={cx('reaction-mark')}><Image src={juror.photo} alt={juror.name} width={160} height={160}/><Icon/></div><div className={cx('reaction-copy')}><span>{juror.name.toUpperCase()} FEIERT DICH</span><strong>{juror.label}</strong></div><div className={cx('reaction-sparks')} aria-hidden="true">{Array.from({length:12},(_,i)=><IconStarFilled key={i} style={{left:`${8+(i*23)%85}%`,top:`${12+(i*31)%70}%`,animationDelay:`${i*.035}s`}}/>)}</div></div>;
}

