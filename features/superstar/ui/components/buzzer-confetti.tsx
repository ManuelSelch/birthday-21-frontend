import { cx } from './show-styles';

const colors = ['#e8b9a7', '#d1baff', '#f1ce72', '#a9d9d2', '#ee8e94', '#f3ebd5', '#a7bff1'];

export function BuzzerConfetti() {
  return <div className={cx('buzzer-confetti')} aria-hidden="true">{Array.from({ length: 100 }, (_, i) => <i key={i} style={{
    left: `${(i * 71 + 11) % 101}%`, backgroundColor: colors[i % colors.length],
    width: `${.35 + (i % 4) * .11}cqw`, height: `${.7 + (i % 5) * .13}cqw`,
    animationDelay: `${-((i * 17) % 24) / 10}s`, animationDuration: `${2 + (i % 9) * .17}s`,
    rotate: `${(i * 37) % 180}deg`,
  }}/>)}</div>;
}
