import { Badge, Button, SegmentedControl, Select } from '@mantine/core';
import { IconCamera, IconPlayerPlay, IconArrowUpRight, IconConfetti } from '@tabler/icons-react';
import { sceneLabels, type Scene, type JuryMode, type ShowState, type ShowAction } from '../../domain/show';
import { demoShows, type ShowDefinition } from '../../domain/show-catalogue';
import { jurors } from './show-data';
import { cx } from './show-styles';

interface ShowControlsProps {
  state: ShowState;
  onAction: (action: ShowAction) => void;
  live?: boolean;
  shows?: ShowDefinition[];
  disabled?: boolean;
}

export function ShowControls({state, onAction, live = false, disabled = false, shows = demoShows}: ShowControlsProps) {
  const {scene, performerIndex, mode} = state;
  return (    <aside className={cx('controls')}><div className={cx('control-heading')}><span className={cx('status-dot')}/><strong>{live ? 'Show-Regie' : 'Regie-Spielplatz'}</strong>{!live && <Badge size="xs" color="gray">DEMO</Badge>}</div>{!live && <p className={cx('control-explainer')}>Hier probierst du die Bilder aus. Noch keine echte Showsteuerung.</p>}
      <fieldset disabled={disabled} className="m-0 min-w-0 border-0 p-0">
      <label className={cx('field-label')}>{live ? 'Beamer' : '01 / WAS SIEHT DAS PUBLIKUM?'}</label><div className={cx('scene-buttons')}>{Object.entries(sceneLabels).map(([v,label])=><Button key={v} variant={scene===v?'filled':'default'} size="xs" onClick={()=>onAction({type:'scene',scene:v as Scene})} leftSection={v==='camera'?<IconCamera size={14}/>:v==='act'?<IconPlayerPlay size={14}/>:undefined}>{label}</Button>)}</div>
      <Select label="Act für die Vorschau" data={shows.map((p,i)=>({value:String(i),label:p.name}))} value={String(performerIndex)} onChange={v=>{onAction({type:'performer',index:Number(v??'0')});}} allowDeselect={false}/>
      {live && (shows[performerIndex]?.images.length ?? 0) > 1 && <Select label="Beamerbild"
        data={shows[performerIndex].images.map((image, index) => ({ value: String(index), label: 'Bild ' + (index + 1) }))}
        value={String(state.imageIndex)} allowDeselect={false} onChange={value => { if (value !== null) onAction({ type: 'image', index: Number(value) }); }}/>}
      <div className={cx('control-divider')}/><label className={cx('field-label')}>{live ? 'Jury' : '02 / JEDER BUZZER EIN KOMPLIMENT'}</label><div className={cx('buzzer-list')}>{jurors.map((j,i)=><Button key={j.name} variant="default" className={cx(`buzzer-button ${j.color}`)} onClick={()=>onAction({type:'buzz',index:i})} leftSection={<j.Icon size={19}/>} rightSection={<IconArrowUpRight size={15}/>}><span className={cx('buzzer-copy')}><strong>{j.name}</strong><small>{j.label}</small></span></Button>)}</div>
      <Button className={cx('golden-button')} fullWidth leftSection={<IconConfetti size={18}/>} onClick={()=>{onAction({type:'golden'});}}>Goldener Moment für alle</Button><Button fullWidth variant="subtle" color="gray" size="xs" onClick={()=>{onAction({type:'reset'});}}>Reaktionen zurücksetzen</Button>
      <div className={cx('control-divider')}/><label className={cx('field-label')}>03 / JURYTISCH IM RUHEZUSTAND</label><SegmentedControl fullWidth size="xs" value={mode} onChange={mode=>onAction({type:'mode',mode:mode as JuryMode})} data={[{value:'portraits',label:'Porträts'},{value:'art',label:'Motive'}]}/>{!live && <p className={cx('control-note')}>Zwei Ansichten für die Tischfronten. Buzzer-Reaktionen verschwinden nach etwa drei Sekunden. Der goldene Moment bleibt bis zum Zurücksetzen.</p>}
      </fieldset>
    </aside>);
}
