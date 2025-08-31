import { Spinner } from './Spinner';
import clazz from './StartButton.module.scss';
import clsx from 'clsx';

export function LoadingDot() {
  return <span className={clazz.loadingDot} />;
}

export function Button({
  loading,
  iconOnly,
  ...props
}: { loading?: boolean; iconOnly?: boolean } & React.ComponentProps<'button'>) {
  return (
    <button className={clsx(clazz.btn, 'light', { [clazz.iconOnly]: iconOnly })} {...props}>
      {loading ? <Spinner /> : null}
      {props.children}
    </button>
  );
}
