<template>
  <form class="index" ref="index" @change="formChange()">
    <div class="section">
      <div class="container">
        <h1 class="title" v-html="generalHeadingPhrase"/>
      </div>
    </div>
    <div class="section">
      <div class="container">

        <div
          class="panel"
          v-show="!languageByDomain"
        >
          <p class="panel-heading">
            Which language do you prefer? Welche Sprache bevorzugst Du?
          </p>
          <label class="panel-block">
            <span class="panel-icon">
              <input v-model="language" value="english" type="radio">
            </span>
            English
          </label>
          <label class="panel-block">
            <span class="panel-icon">
              <input v-model="language" value="deutsch" type="radio">
            </span>
            Deutsch
          </label>
        </div>

        <div
          class="panel"
          v-show="adult"
          v-html="introductionBodyPhrase"
        />

        <div
          class="panel"
          v-show="adult"
        >
          <p
            class="panel-heading"
            v-html="familiarHeadingPhrase"
          />
          <label class="panel-block">
            <input
              class="panel-icon"
              name="familiar"
              type="radio"
              v-model="familiar"
              value="0"
            >
            {{ noPhrase }}
          </label>
          <label class="panel-block">
            <input
              class="panel-icon"
              name="familiar"
              type="radio"
              v-model="familiar"
              value="1"
            >
            {{ bitPhrase }}
          </label>
          <label class="panel-block">
            <input
              class="panel-icon"
              name="familiar"
              type="radio"
              v-model="familiar"
              value="2"
            >
            {{ yesPhrase }}
          </label>
        </div>

        <div class="panel">
          <div
            class="panel-heading"
            v-html="imagesHeadingPhrase"
          />
          <div class="panel-block">
            <span v-html="imagesBodyPhrase"/>
          </div>
        </div>

        <image-selection
          :key="columnI"
          :language="language"
          :ref="'imageSelection' + columnI"
          @select-image="selectImage(columnI, $event)"
          @set-synchronized="setSynchronized(columnI)"
          v-for="columnI in 3"
        />

        <div
          class="panel"
          v-show="adult"
        >
          <div
            class="panel-heading"
            v-html="commentHeadingPhrase"
          />
          <div class="panel-block">
            <div class="control">
              <textarea
                :placeholder="commentPhrase"
                class="input"
                v-model="comment"
              />
            </div>
          </div>
        </div>

        <div
          class="panel"
          v-show="adult"
        >
          <div
            class="panel-heading"
            v-html="titleHeadingPhrase"
          />
          <div class="panel-block">
            <div class="control">
              <textarea
                :placeholder="titlePhrase"
                class="input"
                v-model="title"
              />
            </div>
          </div>
        </div>

        <div
          class="panel"
          v-show="adult"
        >
          <p
            class="panel-heading"
            v-html="technologyHeadingPhrase"
          />
          <label class="panel-block">
            <input
              class="panel-icon"
              name="technology"
              type="radio"
              v-model="technology"
              value="2"
            >
            {{ veryImportantPhrase }}
          </label>
          <label class="panel-block">
            <input
              class="panel-icon"
              name="technology"
              type="radio"
              v-model="technology"
              value="1"
            >
            {{ importantPhrase }}
          </label>
          <label class="panel-block">
            <input
              class="panel-icon"
              name="technology"
              type="radio"
              v-model="technology"
              value="0"
            >
            {{ neitherNorImportantPhrase }}
          </label>
          <label class="panel-block">
            <input
              class="panel-icon"
              name="technology"
              type="radio"
              v-model="technology"
              value="-1"
            >
            {{ unimportantPhrase }}
          </label>
          <label class="panel-block">
            <input
              class="panel-icon"
              name="technology"
              type="radio"
              v-model="technology"
              value="-2"
            >
            {{ veryUnimportantPhrase }}
          </label>
        </div>

        <div
          class="panel"
          v-show="adult"
        >
          <p
            class="panel-heading"
            v-html="influencesHeadingPhrase"
          />
          <label class="panel-block">
            <input
              :disabled="influenceTogglable(nutritional)"
              class="panel-icon"
              name="influences"
              type="checkbox"
              v-model="nutritional"
            >
            {{ nutritionalPhrase }}
          </label>
          <label class="panel-block">
            <input
              :disabled="influenceTogglable(local)"
              class="panel-icon"
              name="influences"
              type="checkbox"
              v-model="local"
            >
            {{ localPhrase }}
          </label>
          <label class="panel-block">
            <input
              :disabled="influenceTogglable(price)"
              class="panel-icon"
              name="influences"
              type="checkbox"
              v-model="price"
            >
            {{ pricePhrase }}
          </label>
          <label class="panel-block">
            <input
              :disabled="influenceTogglable(organic)"
              class="panel-icon"
              name="influences"
              type="checkbox"
              v-model="organic"
            >
            {{ organicPhrase }}
          </label>
          <label class="panel-block">
            <input
              :disabled="influenceTogglable(outdoors)"
              class="panel-icon"
              name="influences"
              type="checkbox"
              v-model="outdoors"
            >
            {{ outdoorsPhrase }}
          </label>
          <label class="panel-block">
            <input
              :disabled="influenceTogglable(ethical)"
              class="panel-icon"
              name="influences"
              type="checkbox"
              v-model="ethical"
            >
            {{ ethicalPhrase }}
          </label>

          <label
            @click="otherLabelClick"
            class="panel-block"
          >
            <input
              :disabled="influenceTogglable(other)"
              @change="otherChange"
              class="panel-icon"
              name="influences"
              type="checkbox"
              v-model="other"
            >
            <div class="control" style="width: 100%;">
              <input
                :disabled="influenceTogglable(other)"
                :placeholder="otherPhrase"
                @blur="otherStringBlur"
                @focus="otherStringFocus"
                class="input"
                ref="otherString"
                type="text"
                v-model="otherString"
              >
            </div>
          </label>
        </div>

        <div
          class="panel"
          v-show="adult"
        >
          <div
            class="panel-heading"
            v-html="ageHeadingPhrase"
          />
          <div class="panel-block">
            <div class="control">
              <input
                @input="ageInput"
                class="input"
                inputmode="numeric"
                pattern="[0-9]*"
                type="text"
                v-model="age"
                value="30"
              >
            </div>
          </div>
        </div>

        <div
          class="panel"
          v-show="adult"
        >
          <p
            class="panel-heading"
            v-html="residenceHeadingPhrase"
          />

          <div class="panel-block">
            <b-autocomplete
              :data="filteredCountries"
              :field="language"
              :placeholder="countryPhrase"
              @blur="countryBlur"
              @select="countrySelect"
              keep-first
              open-on-focus
              v-model="countryInput"
            />
          </div>

          <label class="panel-block">
            <input
              :placeholder="postalCodePhrase"
              class="input"
              type="text"
              v-model="postalCode"
            >
          </label>
        </div>

        <div class="panel">
          <div class="control">
            <a
              class="button is-fullwidth is-large is-info"
              @click="submit()"
              v-html="submitPhrase"
            />
          </div>
        </div>

        <div
          class="panel"
          v-show="!['initial','changed'].includes(resultState)"
        >
          <b-notification
            :closable="false"
            type="is-danger"
            v-show="resultState === 'error'"
          >
            {{resultHeadingPhrase}} {{resultMessagePhrase}}
          </b-notification>
          <b-modal
            :active="resultState === 'success'"
            :canCancel="[]"
          >
            <b-notification
              :closable="false"
              type="is-success"
            >
              {{resultHeadingPhrase}}
            </b-notification>
          </b-modal>
        </div>
      </div>
    </div>

    <div class="footer has-text-white has-background-grey-darker">
      <div class="container">
        <h1
          class="heading"
          v-html="impressHeadingPhrase"
        />
        <p v-html="impressPhrase"/>
      </div>
    </div>

    <div class="footer">
        <div class="container">
          <h1 class="heading">
            Funded by
          </h1>
          <img src="http://signature.eitfood.eu/EIT-Food-EU.png" style="margin-top: 1em;">
      </div>
    </div>

  </form>
</template>

<script>

  'use strict';

  import ImageSelection from 'Components/ImageSelection';
  import translate from 'Utilities/translate';
  import countries from 'Utilities/countries';

  import Vue from 'vue';

  const defaults = {
    age:                null,
    comment:            null,
    countDown:          5,
    countryInput:       null,
    countrySelection:   { code: null, deutsch: null, english: null, },
    ethical:            false,
    familiar:           null,
    images:             [],
    imagesSynchronized: Array(3).fill(false),
    language:           'english', // ∈ ['deutsch','english']
    languageByDomain:   false,
    local:              false,
    nutritional:        false,
    organic:            false,
    other:              null,
    otherString:        null,
    otherStringOld:     null,
    outdoors:           false,
    postalCode:         null,
    price:              false,
    resultMessage:      null,
    resultState:        'initial', // ∈ ['changed','error','initial','success']
    technology:         null,
    title:              null,
  };

  export default {

    data() {
      // TODO: make following snippet automatic:
      return {
        age:                defaults.age,
        child:              null, // do not reset `child` variable
        comment:            defaults.comment,
        countryInput:       defaults.countryInput,
        countrySelection:   defaults.countrySelection,
        countDown:          defaults.countDown,
        ethical:            defaults.ethical,
        familiar:           defaults.familiar,
        images:             defaults.images,
        imagesSynchronized: defaults.imagesSynchronized,
        language:           defaults.language,
        languageByDomain:   defaults.languageByDomain,
        local:              defaults.local,
        nutritional:        defaults.nutritional,
        organic:            defaults.organic,
        other:              defaults.other,
        otherString:        defaults.otherString,
        otherStringOld:     defaults.otherStringOld,
        outdoors:           defaults.outdoors,
        postalCode:         defaults.postalCode,
        price:              defaults.price,
        resultMessage:      defaults.resultMessage,
        resultState:        defaults.resultState,
        technology:         defaults.technology,
        title:              defaults.title,
      };
    },

    name: 'index',

    computed: {

      adult() {
        return this.child !== true;
      },

      allImagesSynchronized() {
        return this.imagesSynchronized.every(s => s === true);
      },

      filteredCountries() {
        if (this.countryInput === null) {
          return countries;
        }
        else {
          return countries.filter(
            countryObject => countryObject[this.language]
              .toLowerCase()
              .indexOf(this.countryInput.toLowerCase()) >= 0);
        }
      },

      // phrases:

      ageHeadingPhrase() {
        return translate(
          this.language,
          'Optional: How old are you?',
          'Optional: Wie alt bist Du?');
      },

      bitPhrase() {
        return translate(
          this.language,
          'A little bit.',
          'Ein wenig.');
      },

      commentPhrase() {
        return translate(this.language, '', '');
      },

      commentHeadingPhrase() {
        return translate(
          this.language,
          'I selected these images because…',
          'Ich habe diese Bilder ausgewählt, weil…');
      },

      countryPhrase() {
        return translate(this.language, 'Country', 'Land');
      },

      ethicalPhrase() {
        return translate(
          this.language,
          'Ethical business practices',
          'Ethische Geschäftspraktiken');
      },

      familiarHeadingPhrase() {
        return translate(
          this.language,
          'Have you ever heard of Vertical Farming before today?',
          'Hatten Sie vor dem heutigen Tag bereits von Vertical Farming gehört?');
      },

      generalHeadingPhrase() {
        return translate(
          this.language,
          'Re-Visioning Vertical Farming',
          'Vertical Farming neu visionieren');
      },

      imagesBodyPhrase() {
        return translate(
          this.language,
          'These images are randomly generated from Instagram, and they are all hash-tagged with #verticalfarming. We invite you to select three images, one in each row. You can click back and forth, and once you picked your image simply leave it on the screen and move on to the next image.',
          'Diese Bilder wurden zufällig aus Instagram generiert. Sie sind alle mit dem Hashtag #verticalfarming versehen. Wir laden Sie ein, drei Bilder auszuwählen – davon eines in jeder Zeile. Sie können vor- und zurück klicken. Sobald Sie ihr Bild ausgesucht haben, lassen Sie es einfach auf dem Bildschirm stehen und machen Sie mit dem nächsten Bild weiter.');
      },

      imagesHeadingPhrase() {
        return translate(
          this.language,
          'How do you envision vertical farming? Please select three images.',
          'Wie stellen Sie sich Vertical Farming vor? Bitte wählen Sie drei Bilder aus.');
      },

      importantPhrase() {
        return translate(this.language, 'Important', 'Wichtig');
      },

      impressHeadingPhrase() {
        return translate(this.language, 'Imprint', 'Impressum');
      },

      impressPhrase() {
        return translate(
          this.language,
          'Technical University Munich<br/>Arcisstraße 21<br/>80333 Munich<br/>Germany / Deutschland',
          'Technische Universität München<br/>Arcisstraße 21<br/>80333 München<br/>Deutschland / Germany');
      },

      influencesHeadingPhrase() {
        return translate(
          this.language,
          'What influences the decisions you make about food? Select up to three from the below options.',
          'Was beeinflusst die Entscheidungen, die Du zur Ernährung triffst? Wähle bis zu drei der Optionen.');
      },

      introductionBodyPhrase() {
        return translate(
          this.language,
          '<p class="panel-heading">About the Project “Cultivating Engagement: a citizen participation forum”</p><p class="panel-block"><span>Welcome! You are taking part of the EU project “Cultivating Engagement”. As part of our citizen participation forum, you can explore the subject of vertical farming through a collection of Instagram posts, made by users like you.</span></p><p class="panel-block"><span>If you don’t know what vertical farming is, that’s fine! We still value your opinion. This survey aims to better understand what people like you think about vertical farming, and what images you associate with it.</span></p><p class="panel-block"><span>If you would like to know more about the project, please visit <a>http://www.mcts.tum.de/cultivating-engagement/</a> or contact us via email at <a>mascha.gugganig@tum.de</a>. The project is led by the Technical University Munich and funded by the EIT Food (European Institute of Innovation & Technology).</span></p>',
          '<p class="panel-heading">Über das Projekt „Teilnahme kultivieren: Ein Bürgerbeteiligungsforum“</p><p class="panel-block"><span>Willkommen! Sie nehmen am EU-Projekt "Teilnahme kultivieren" teil. Als Teil unseres Bürgerbeteiligungsforums können Sie das Thema Vertical Farming (vertikale Landwirtschaft) durch eine Sammlung von Instagram-Beiträgen entdecken, welche von Nutzern wie Ihnen erstellt wurden.</span></p><p class="panel-block"><span>Wenn Sie nicht wissen, was Vertical Farming ist, macht das nichts! Wir schätzen Ihre Meinung trotzdem. Diese Umfrage zielt darauf ab, besser zu verstehen, was Menschen wie Sie über Vertical Farming denken, und welche Bilder Sie damit asoziieren.</span></p><p class="panel-block"><span>Falls Sie mehr über das Projekt erfahren möchten, besuchen Sie <a>https://www.mcts.tum.de/de/cultivating-engagement/</a> oder kontaktieren Sie uns per E-Mail an <a>mascha.gugganig@tum.de</a>. Das Projekt wird an der Technischen Universität München geführt und von EIT Food (Europäisches Institut für Innovation und Technologie) gefördert.</span></p>');
      },

      localPhrase() {
        return translate(this.language, 'Grown locally', 'Lokal angebaut');
      },

      neitherNorImportantPhrase() {
        return translate(
          this.language,
          'Neither important, nor unimportant',
          'Weder wichtig, noch unwichtig');
      },

      noPhrase() {
        return translate(
          this.language,
          'No, not at all.',
          'Nein, noch gar nicht.');
      },

      nutritionalPhrase() {
        return translate(
          this.language, 'Nutritional value', 'Nährstoffgehalt');
      },

      organicPhrase() {
        return translate(
          this.language,
          'Organic production',
          'Bio-Produktion');
      },

      otherPhrase() {
        return translate(this.language, 'Other', 'Andere');
      },

      outdoorsPhrase() {
        return translate(this.language, 'Grown outdoors', 'Draußen angebaut');
      },

      postalCodePhrase() {
        return translate(this.language, 'Postal code', 'Postleitzahl');
      },

      pricePhrase() {
        return translate(
          this.language,
          'Price of food item',
          'Preis des Lebensmittels');
      },

      residenceHeadingPhrase() {
        return translate(
          this.language,
          'Optional: Where do you live?',
          'Optional: Wo wohnst Du?');
      },

      resultHeadingPhrase() {
        switch(this.resultState) {

          default:
          case 'error':
            return translate(
              this.language,
              'Oops, sorry! An error occurred. Your submission could not be saved.',
              'Es tut uns leid. Es ist ein Fehler aufgetreten. Deine Eingaben konnten nicht gespeichert werden.');

          case 'success':
            return translate(
              this.language,
              'Your submission was saved successfully. Thank you for participating. This application will restart in 5 seconds.',
              'Deine Eingaben wurden erfolgreich gespeichert. Vielen Dank für die Teilnahme. Diese Applikation wird in 5 Sekunden neustarten.');
        }
      },

      resultMessagePhrase() {
        if (this.resultMessage === null) {
          return '';
        }
        else {
          return translate(
            this.language,
            this.resultMessage.english,
            this.resultMessage.deutsch);
        }
      },

      submitPhrase() {
        return translate(this.language, 'Submit', 'Abschicken');
      },

      technologyHeadingPhrase() {
        return translate(
          this.language,
          'How important is technological innovation for the future of food?',
          'Wie wichtig ist technologische Innovation für die Zukunft der Nahrung?');
      },

      titlePhrase() {
        return translate(this.language, '', '');
      },

      titleHeadingPhrase() {
        return translate(
          this.language,
          'To me, Vertical Farming means…',
          'Für mich bedeutet Vertical Farming…');
      },

      unimportantPhrase() {
        return translate(this.language, 'Unimportant', 'Unwichtig');
      },

      veryImportantPhrase() {
        return translate(this.language, 'Very important', 'Sehr wichtig');
      },

      veryUnimportantPhrase() {
        return translate(this.language, 'Very unimportant', 'Sehr unwichtig');
      },

      yesPhrase() {
        return translate(this.language, 'Yes.', 'Ja.');
      },

    },

    components: {
      ImageSelection,
    },

    methods: {

      ageInput() {
        // remove non-digit characters and leading zero.
        this.age = this.age
                       .replace(/[^\d]/g, '')
                       .replace(/^0*/, '')
                       .substr(0,2);
      },

      countrySelect(countryOption) {
        this.countrySelection = countryOption;
      },

      countryBlur() {
        switch (this.filteredCountries.length) {
          case 1:
            this.countrySelection = this.filteredCountries[0];
            this.countryInput = this.countrySelection[this.language];
            break;
          default:
            this.countrySelection = defaults.countrySelection;
            this.countryInput = defaults.countryInput;
            break;
        }
      },

      formChange() {
        this.resultState = 'changed';
      },

      imageSource(column) {
        if (
          this.images[column] &&
          this.images[column].html &&
          this.images[column].html.src
        ) {
          return this.images[column].html.src;
        }

        else {
          return '';
        }
      },

      influenceTogglable(influence) {
        return !influence && [
          this.ethical,
          this.local,
          this.nutritional,
          this.organic,
          this.other,
          this.outdoors,
          this.price,
        ].reduce((sum, influence) => sum + (influence ? 1 : 0)) >= 3;
      },

      infoPhrasing(column) {
        if (
          this.images[column] &&
          this.images[column].uploaderName &&
          this.images[column].url
        ) {
          switch (this.language) {
            default:
            case 'english':
              return `Image posted by <em>${this.images[column].uploaderName}</em> on Instagram at <a>${this.images[column].url}</a>.`;

            case 'deutsch':
              return `Bild gepostet von <em>${this.images[column].uploaderName}</em> auf Instagram unter <a>${this.images[column].url}</a>.`;
          }
        }

        else {
          return '';
        }
      },

      otherChange() {
        if (this.other) {
          this.otherString = this.otherStringOld;
        }
        else {
          this.otherStringOld = this.otherString;
          this.otherString = null;
        }
      },

      otherLabelClick() {
        this.$refs['otherString'].focus();
      },

      otherStringBlur() {
        this.other = !this.otherStringIsEmpty();
      },

      otherStringFocus() {
        this.other = true;
      },

      otherStringIsEmpty() {
        return this.otherString === undefined ||
               this.otherString === null ||
               /^\s*$/.test(this.otherString);
      },

      reset() {
        // reset to defaults.
        for (let key in defaults) {
          this[key] = defaults[key];
        }

        // reset images:
        for (let column of [1,2,3]) {
          this.$refs['imageSelection' + column][0].reset();
        }
      },

      result(loading, state, messageEnglish, messageDeutsch) {
        this.resultState = state;
        this.resultMessage = {
          deutsch: messageDeutsch,
          english: messageEnglish,
        };
        loading.close();
      },

      selectImage(column, image) {
        this.$set(this.images, column - 1, image);
      },

      setSynchronized(column) {
        this.$set(this.imagesSynchronized, column - 1, true);
      },

      submit() {

        const loading = this.$loading.open();

        fetch('./api/vision', {
          method: 'POST',
          body: JSON.stringify({
            age:           this.age,
            child:         this.child,
            comment:       this.comment,
            familiar:      this.familiar,
            images:        this.images.map(image => ({
              caption: image.caption,
              filter: image.filter,
              id: image.id,
              location: image.location,
              mediaUrl: image.mediaUrl,
              noComments: image.noComments,
              noLikes: image.noLikes,
              tags: image.tags,
              thumbnailUrl: image.thumbnailUrl,
              uploadTime: image.uploadTime,
              uploaderId: image.uploaderId,
              uploaderName: image.uploaderName,
              url: image.url,
            })),
            influences: {
              ethical:     this.ethical,
              local:       this.local,
              nutritional: this.nutritional,
              organic:     this.organic,
              other:       this.other ? this.otherString : null,
              outdoors:    this.outdoors,
              price:       this.price,
            },
            language:      this.language,
            residence: {
              country:     this.countrySelection.code,
              postalCode:  this.postalCode,
            },
            technology:    this.technology,
            title:         this.title,
          }),
          headers: new Headers({
            'Content-Type': 'application/json'
          })
        })

          .catch(() => {
            this.result(
              loading,
              'error',
              'Could not post vision.',
              'Angaben konnten nicht verschickt werden.');
          })

          .then(response => response.json())

          .catch(() => {
            this.result(
              loading,
              'error',
              'Could not parse server response to JSON.',
              `Antwort des Servers konnte nicht als JSON interpretiert
               werden.`);
          })

          .then(response => {

            // case: server successfully saved vision in database.
            if (response && response.success) {
              this.result(loading, 'success', null, null);

              this.countDown = defaults.countDown;
              let interval = window.setInterval(
                () => {
                  if (this.countDown > 0) {
                    this.countDown--;
                  }
                  else {
                    document.body.scrollIntoView(true);
                    this.reset();
                    window.clearInterval(interval);
                  }
                },
                1000);

            }

            // case: server responded error:
            else if (
              (response                 !== undefined) &&
              (response.message         !== undefined) &&
              (response.message.deutsch !== undefined) &&
              (response.message.english !== undefined)
            ) {
              this.result(
                loading,
                'error',
                response.message.english,
                response.message.deutsch);
            }

            // case: unknown error from server:
            else {
              this.result(
                loading,
                'error',
                'Unknown error on server-side.',
                'Unbekannter Fehler auf der Serverseite.');
            }
          });

        return false;
      },
    },

    mounted() {
      let splitHost = window.location.host.split(/[.:]/);

      // iff hostname contains some childish subdomain, set `child` to true.
      this.child = splitHost.some(hostSnip =>
        ['kids','kinder','child','children'].includes(hostSnip));

      // iff hostname contains some language specification ('de','en'), don't ask for language.
      if (splitHost.some(hostSnip => ['de','deutsch'].includes(hostSnip))) {
        this.languageByDomain = true;
        this.language = 'deutsch';
      }
      else if (splitHost.some(hostSnip => ['en','english'].includes(hostSnip))) {
        this.languageByDomain = true;
        // this.language = 'english'; // is default already.
      }
    },

    watch: {

      language() {
        if (null === this.countrySelection) {
          return;
        }
        // translate countryInput into new language
        this.countryInput = this.countrySelection[this.language];
      },

    },

  };

</script>
