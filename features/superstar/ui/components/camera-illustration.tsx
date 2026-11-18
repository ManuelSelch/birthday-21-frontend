import { IconCamera, IconHeartFilled } from '@tabler/icons-react';
import { cx } from './show-styles';

export function CameraIllustration(){
  return <div className={cx('camera-illustration')}><div className={cx('camera-grain')}/><div className={cx('camera-stamp')}><IconCamera size={16}/> KAMERA-VORSCHAU / SIMULIERT</div><div className={cx('table-shadow')}/><div className={cx('playing-card card-back')}/><div className={cx('playing-card card-front')}><span>A<br/>♥</span><IconHeartFilled/><span>A<br/>♥</span></div><div className={cx('camera-caption')}>Ganz nah dran.<small>Hier würde die Live-Kamera den Kartentrick zeigen.</small></div></div>;
}

