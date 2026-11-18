import { cx } from './show-styles';

export function Confetti({burst}: {burst:number}) {
  return <div className={cx('confetti')} aria-hidden="true" key={burst}>{Array.from({length:42},(_,i)=><i key={i} style={{left:`${(i*37)%100}%`,background:['#e6d4b7','#c6ab87','#f7f3ed','#a88b70'][i%4],animationDelay:`${(i%9)*0.09}s`,transform:`rotate(${i*31}deg)`}}/>)}</div>;
}

