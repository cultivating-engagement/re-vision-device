'use strict';

import Index from 'Components/Index';
import './index.scss';

import Vue from 'vue';
import Buefy from 'buefy';

Vue.use(Buefy);

new Vue({
  el: '#mount-point',
  render: h => h(Index),
});
