'use strict';

export default function translate(language, english, deutsch) {
  switch (language) {
    default:
    case 'english': return english;
    case 'deutsch': return deutsch;
  }
}
