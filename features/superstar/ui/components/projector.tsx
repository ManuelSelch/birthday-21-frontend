import { IconStarFilled } from '@tabler/icons-react';
import { cx } from './show-styles';
import { birthday, type Performer } from './show-data';
import { imageUrl } from '../../domain/show-catalogue';
import type { Scene } from '../../domain/show';
import { Confetti } from './confetti';
import { CameraIllustration } from './camera-illustration';
import { BuzzerReaction } from './buzzer-reaction';

interface ProjectorProps {
  scene: Scene;
  performer: Performer;
  imageIndex?: number;
  celebrate: boolean;
  burst: number;
  reaction: number | null;
  active: boolean[];
}

export function Projector({ scene, performer, celebrate, burst, reaction, active, imageIndex = 0 }: ProjectorProps) {
  return (
    <div className={cx(scene === 'act' ? 'projector act-projector' : 'projector')} data-act-screen={scene === 'act' ? '' : undefined}>
      {scene === 'act' ? <div className={cx('act-header')}><span>GEBURTSTAG SUCHT DEN SUPERSTAR</span></div> : <div className={cx('show-top')}>
        <span className={cx('show-wordmark')}><IconStarFilled/> GEBURTSTAG SUCHT DEN SUPERSTAR</span>
        <span className={cx('show-edition')}>DREI MAL 21</span>
      </div>}
      {scene === 'act' && (
        <div className={cx('act-layout')}>
          <div className={cx('act-details')}>
            <h2>{performer.name}</h2>
            <div className={cx('act-rule')}/>
            <strong className={cx('act-title')}>{performer.act}</strong>
            <p>{performer.description}</p>
          </div>
          <div className={cx('act-image')}>
            {performer.images[imageIndex] ? <img src={imageUrl(performer.images[imageIndex])} alt={performer.name}/> : <div className={cx('act-image-empty')} role="img" aria-label="Kein Bild vorhanden">
              <span>G</span><small>GEBURTSTAG SUCHT DEN SUPERSTAR</small>
            </div>}
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
      {scene !== 'act' && <div className={cx('show-bottom')}><span>ECHTE FREUNDE. UNENTDECKTE TALENTE.</span></div>}
      {reaction !== null && !celebrate && <BuzzerReaction active={active} burst={burst}/>}
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
