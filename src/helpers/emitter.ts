import events from 'events';

const buildEmitter = () => {
  return new events.EventEmitter();
};

export const emitter = buildEmitter();
