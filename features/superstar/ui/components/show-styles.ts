import styles from './show.module.css';

export function cx(names: string) {
  return names.split(' ').filter(Boolean).map(name => styles[name]).filter(Boolean).join(' ');
}
