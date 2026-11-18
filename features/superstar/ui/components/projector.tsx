import { IconStarFilled } from '@tabler/icons-react';
import { cx } from './show-styles';
import { performers, birthday } from './show-data';
import type { Scene } from '../../domain/show';
import { Confetti } from './confetti';
import { CameraIllustration } from './camera-illustration';
import { BuzzerReaction } from './buzzer-reaction';

interface ProjectorProps {
  scene: Scene;
  performer: typeof performers[number];
  celebrate: boolean;
  burst: number;
  reaction: number | null;
}

export function Projector({ scene, performer, celebrate, burst, reaction }: ProjectorProps) {
  const ActIcon = performer.Icon;
  return (
    <div className={cx('projector')}>
      <div className={cx('show-top')}>
        <span className={cx('show-wordmark')}><IconStarFilled/> GEBURTSTAG SUCHT DEN SUPERSTAR</span>
        <span className={cx('show-edition')}>DREI MAL 21</span>
      </div>
      {scene === 'act' && (
        <div className={cx('act-content')}>
          <div className={cx('act-copy')}>
            <span className={cx('kicker')}>KEIN DRUCK. NUR APPLAUS.</span>
            <h2>{performer.name}<span>ist am Start.</span></h2>
            <div className={cx('act-tag')}><ActIcon size={21}/>{performer.act}</div>
            <p>Talent optional. Legendenstatus garantiert.</p>
          </div>
          <div className={cx('portrait-art')}>
            <span className={cx('portrait-placeholder')}>FOTO-PLATZHALTER</span>
            <span className={cx('portrait-initials')}>{performer.initials}</span>
            <span className={cx('portrait-star')}><IconStarFilled/></span>
            <span className={cx('portrait-sticker')}>DEIN<br/>MOMENT!</span>
          </div>
        </div>
      )}
      {scene === 'camera' && (
        <div className={cx('camera-layout')}>
          <CameraIllustration/>
          <div className={cx('camera-lower')}>
            <strong>{performer.name}</strong><span>{performer.act}</span>
            <span className={cx('live-label')}>NAHAUFNAHME</span>
          </div>
        </div>
      )}
      {(scene === 'vote' || scene === 'results') && (
        <div className={cx('vote-content')}>
          <span className={cx('kicker')}>
            {scene === 'vote' ? 'IHR SEID GEFRAGT' : 'DAS SAGT DAS PUBLIKUM'} / {performer.name.toUpperCase()}
          </span>
          <h2>{scene === 'vote' ? birthday.question : birthday.award}</h2>
          <div className={cx('vote-options')}>
            {birthday.answers.map((answer, index) => (
              <div className={cx('vote-option')} key={answer}>
                <span className={cx('option-number')}>0{index + 1}</span><strong>{answer}</strong>
                {scene === 'results' && <>
                  <span className={cx('result-percent')}>{birthday.values[index]} %</span>
                  <div className={cx('result-bar')} style={{ width: `${birthday.values[index]}%` }}/>
                </>}
              </div>
            ))}
          </div>
          <span className={cx('vote-foot')}>
            {scene === 'vote' ? 'Mit dem Handy abstimmen / Zugang und QR-Code später' : '42 Stimmen / erfundene Vorschauwerte / kein Ranking der Acts'}
          </span>
        </div>
      )}
      {scene === 'idle' && (
        <div className={cx('idle-content')}>
          <span className={cx('kicker')}>MANUEL / MARCO / DAVID</span>
          <h2>21<span>und kein bisschen leise.</span></h2>
          <p>Kurze Pause. Großer Applaus.</p>
          <IconStarFilled className={cx('idle-star')}/>
        </div>
      )}
      <div className={cx('show-bottom')}><span>ECHTE FREUNDE. UNENTDECKTE TALENTE.</span></div>
      {reaction !== null && !celebrate && <BuzzerReaction key={burst} index={reaction}/>}
      {celebrate && (
        <div className={cx('golden-moment')} key={burst}>
          <Confetti burst={burst}/><IconStarFilled/>
          <span>DREI MAL JA ZU DIR.</span>
          <strong>Das ist dein<br/>goldener Moment!</strong>
          <small>KEIN FINALE-TICKET. EINFACH MAXIMALER APPLAUS.</small>
        </div>
      )}
    </div>
  );
}
