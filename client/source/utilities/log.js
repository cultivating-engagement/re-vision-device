'use strict';

export default function log() {
  if (process.env.NODE_ENV === 'development') {
    console.log(...arguments);
  }
}
