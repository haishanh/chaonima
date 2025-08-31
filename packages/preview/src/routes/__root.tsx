import '../index.css';
import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export const Route = createRootRoute({
  component: () => (
    <>
      <div
        style={{
          display: 'flex',
          gap: 8,
          padding: 4,
        }}
      >
        <Link to="/">home</Link>
        <Link to="/loading">loading</Link>
        <Link to="/summary">summary</Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
