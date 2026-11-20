import { Badge } from '@mantine/core';
import type { ShowConnection } from '../../app/use-live-show';
import { ConnectionStatus } from './connection-status';
import { cx } from './show-styles';

export function ShowHeader({ connection }: { connection?: ShowConnection }) {
  return <header className={cx('studio-header')}>
    <a className={cx('studio-brand')} href="/superstar"><span>21</span><div>SUPERSTAR<small>MANUEL / MARCO / DAVID</small></div></a>
    {connection ? <ConnectionStatus connection={connection} indicator/> : <a href="/superstar/control">Live-Regie</a>}
    {!connection && <Badge variant="light" color="gray">LOKALE DEMO</Badge>}
  </header>;
}
