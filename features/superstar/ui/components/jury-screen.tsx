import Image from 'next/image';
import { IconStarFilled } from '@tabler/icons-react';
import { cx } from './show-styles';
import { jurors } from './show-data';
import type { JuryMode } from '../../domain/show';

export function JuryScreen({index,active,mode,burst}: {index:number;active:boolean;mode:JuryMode;burst:number}){
 const j=jurors[index]; const Icon=j.Icon;
 return <div className={cx(`jury-screen ${j.color} ${active?'is-active':''}`)} key={`${mode}-${burst}`}><div className={cx('jury-body')}>{active?<><Icon className={cx('jury-symbol')}/><strong>{j.label}</strong><small>{j.sub}</small></>:mode==='names'?<><Icon className={cx('jury-id-icon')}/><strong>{j.name}</strong><small>BEREIT FÜR DEINEN MOMENT</small></>:mode==='portraits'?<><div className={cx('jury-photo')}><Image src={j.photo} alt={j.name} width={160} height={160}/></div><strong>{j.name}</strong></>:<><IconStarFilled className={cx('jury-symbol')}/><strong className={cx('jury-art-title')}>{['DREI','MAL','21'][index]}</strong><small>GEMEINSAM WIRD’S GROSS</small></>}</div>{active&&<div className={cx('jury-rings')}/>}</div>;
}

