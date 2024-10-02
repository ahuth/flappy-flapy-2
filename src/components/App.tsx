import {useEffect, useRef} from 'react';
import {useStore} from '../store';
import Bird from './Bird';

export default function App() {
  const actions = useStore((state) => state.actions);
  const status = useStore((state) => state.status);
  const height = useStore((state) => state.height);
  const lastRan = useRef(0);

  // Animation loop
  useEffect(() => {
    if (status !== 'playing') {
      return;
    }

    let id = requestAnimationFrame(run);

    function run(time: number) {
      if (lastRan.current) {
        actions.tick((time - lastRan.current) / 1000);
      }
      lastRan.current = time;
      id = requestAnimationFrame(run);
    }

    return () => cancelAnimationFrame(id);
  }, [actions, status]);

  // User input handlers
  useEffect(() => {
    if (status !== 'playing') {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === ' ') {
        actions.flap();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', actions.flap);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', actions.flap);
    };
  }, [status]);

  return (
    <>
      {status === 'gameover' && <h1>Game Over</h1>}
      <Bird style={{position: 'absolute', top: 500 - height}} />
    </>
  );
}
