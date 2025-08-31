import s from './Spinner.module.scss';
import clsx from 'clsx';

export function Spinner() {
  return <div className={clsx(s.loading, s.loadingTransparent)} />;
}
