<template>
  <div class="imageSelection panel">
    <div class="imageAndArrows panel-block">

      <div
        @click="propagate(-1)"
        alt="Show previous image"
        :class="[ 'imageButton', { disabled: present <= 0 } ]"
      >
        <span>❬</span>
      </div>

      <figure
        :style="{ 'background-image': 'url(' + imageSource + ')' }"
      />

      <div
        @click="propagate(1)"
        alt="Show next random image"
        class="imageButton"
      >
        <span>❭</span>
      </div>
    </div>

    <div class="panel-block">
      <span class="imageInfo" v-html="infoPhrase"/>
    </div>

  </div>
</template>

<script>

  'use strict';

  import log from 'Utilities/log';

  export default {

    computed: {

      infoPhrase() {
        if (!this.allowed(0)) {
          return '';
        }

        switch (this.language) {

          default:
          case 'english':
            return `This image originally was posted by <em>${this.imageHistory[this.present].uploaderName}</em> on Instagram at <a>${this.imageHistory[this.present].url}</a>.`;

          case 'deutsch':
            return `Dieses Bild wurde ursprünglich gepostet von <em>${this.imageHistory[this.present].uploaderName}</em> auf Instagram unter <a>${this.imageHistory[this.present].url}</a>.`;
        }
      },

      imageSource() {
        if (this.allowed(0)) {
          return this.imageHistory[this.present].html.src;
        }

        else {
          return '';
        }
      },
    },

    data() {
      return {
        present: -1,
        info: true,
        synchronized: false,
        imageHistory: [],
      };
    },

    name: 'imageSelection', 

    methods: {

      allowed(timeDiff) {
        return (
          (this.present + timeDiff >= 0) &&
          (this.imageHistory[this.present + timeDiff]) &&
          (this.imageHistory[this.present + timeDiff].state === 'loaded')
        );
      },

      begin() {
        this.preloadImages(-1);
      },

      loadImage(timeIndex) {
        log('load image for time index', timeIndex);

        // case: image has been preloaded or is being preloaded.
        if (
          (this.imageHistory[timeIndex] !== undefined) &&
          (['preloading', 'loaded'].includes(this.imageHistory[timeIndex].state))
        ) {
          return;
        }

        // case: image neither has been preloaded nor is being preloaded.

        // flag image as being preloaded.
        this.$set(this.imageHistory, timeIndex, { state: 'preloading' });

        // request image-details from server:
        fetch('./api/image')

          .catch(() => this.$set(this.imageHistory, timeIndex, {
            errorMessage: 'Could not request image-API.',
            state: 'error',
          }))

          .then(response => response.json())

          .catch(() => this.$set(this.imageHistory, timeIndex, {
            errorMessage: 'Could not parse image-JSON.',
            state: 'error',
          }))

          .then(json => {

            // case: server responded successful image-JSON.
            if (json.success) {

              // preload image:
              fetch(json.image.mediaUrl)

                .catch(() => this.$set(this.imageHistory, timeIndex, {
                  errorMessage: `Could not fetch media-URL of
                                 instagram-image.`,
                  state: 'error',
                }))

                .then(response => response.blob())

                .catch(() => this.$set(this.imageHistory, timeIndex, {
                  errorMessage: 'Could not blob instagram-image.',
                  state: 'error',
                }))

                .then(blob => {
                  const image = json.image;
                  image.html = new Image();
                  image.html.src = URL.createObjectURL(blob);
                  image.state = 'loaded';
                  this.$set(this.imageHistory, timeIndex, image);

                  // case: image for timeIndex=0 has been loaded.
                  if (timeIndex === 0) {
                    this.synchronized = true;
                    this.propagate(1);
                    this.$emit('set-synchronized');
                  }
                });
            }

            // case: server responded unsuccessful image-JSON.
            else {
              this.$set(this.imageHistory, timeIndex, {
                errorMessage: 'Server responded unsuccessful image-JSON.',
                state: 'error',
              });
            }
          })
      },

      // preloads some images for time-indices *after* given time-index:
      preloadImages(timeIndex) {
        for (var timeDiff = 1; timeDiff <= 3; timeDiff++) {
          this.loadImage(timeIndex + timeDiff);
        }
      },

      propagate(timeDiff) {

        // case: not propagation not allowed.
        if (!this.allowed(timeDiff)) {
          // ignore.
          return;
        }

        // case: propagation allowed.

        // propagate.
        this.present += timeDiff;

        // notify parent-component of selection.
        this.$emit('select-image', this.imageHistory[this.present]);

        // load present image and preload some future images.
        this.preloadImages(this.present);
      },

      reset() {
        // for some data, set each to its respective default value.
        this.synchronized = false;
        this.present = -1;

        // remove each loaded image from memory.
        this.imageHistory.map(image => {
          if (
            image &&
            image.state === 'loaded' &&
            image.html &&
            image.html.src
          ) {
            log('revoke object URL', image.html.src)
            URL.revokeObjectURL(image.html.src)
          }
        });

        this.imageHistory = [];

        this.begin();
      },

      toggleInfo() {
        this.info = !this.info;
      },
    },

    mounted() {
      this.begin();
    },

    props: [
      'language',
    ],

  };

</script>
