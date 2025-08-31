import clazz from './Star.module.scss';
import clsx from 'clsx';

export function Star(props: { size?: number }) {
  const size = props.size || 128;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 128 128">
      <path
        fill="#3c91da"
        d="M64 0c0 35.346 28.654 64 64 64-35.346 0-64 28.654-64 64 0-35.346-28.654-64-64-64 35.346 0 64-28.654 64-64"
      />
    </svg>
  );
}

export function StarAi({ style }: { style?: React.CSSProperties }) {
  return (
    <span className={clazz.ai} style={style}>
      <span className={clsx(clazz.item, clazz.a)}>
        <Star size={36} />
      </span>
      <span className={clsx(clazz.item, clazz.b)}>
        <Star size={16} />
      </span>
      <span className={clsx(clazz.item, clazz.c)}>
        <Star size={16} />
      </span>
    </span>
  );
}
