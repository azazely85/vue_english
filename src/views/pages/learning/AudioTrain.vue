<template>
  <b-overlay
    :show="loading"
    spinner-type="grow"
    spinner-variant="primary"
    :variant="`transparent`"
    :opacity="1"
    :blur="`2px`"
    rounded="sm"
  >
    <b-container align-h="around" v-for="word in words" :key="word.id">
      <b-row class="justify-content-center" v-if="word.show">
        <b-col
          cols="12"
          md="12"
          class="mb-12"
        >
          <b-card
            class="h-100"
          >
            <b-card-header
              class="d-flex justify-content-end"
            >
            </b-card-header>
            <b-card-body
              class="d-flex justify-content-center"
            >
              <feather-icon
                icon="PlayCircleIcon"
                class="mr-1 cursor-pointer"
                size="60"
                @click="playSound += 1"
              />
            </b-card-body>
          </b-card>
        </b-col>
        <b-col
          cols="12"
          md="12"
          class="mb-12"
        >

          <b-list-group

          >
            <b-card-body
              class="d-flex justify-content-center mobile-wrap"
            >
              <b-list-group-item v-for="(item, index) in word.spell" :key="index"
                                 v-show="item.show"
                                 class="flex-column align-items-start cursor-pointer">
                {{ item.character }}
              </b-list-group-item>
            </b-card-body>
          </b-list-group>
          <b-list-group>
            <b-card-body
              class="d-flex justify-content-center mobile-wrap"
            >
              <b-list-group-item v-for="(item, index) in word.spell_names" :key="index"
                                 v-show="!item.show"
                                 class="flex-column align-items-start cursor-pointer"
                                 @click="checking(item.character, index, word, $event)">
                {{ item.character }}
              </b-list-group-item>
            </b-card-body>
          </b-list-group>
          <b-list-group v-if="checkTranslate">
            <b-card-body
              class="d-flex justify-content-center"
            >
              <div>{{ word.translate }}</div>
            </b-card-body>
            <b-card-body
              class="d-flex justify-content-center"
            >
                <div>
                    <div v-html="word.description"></div>
                    <div v-if="word.prsi">Present simple (I / you / we / they ): <b>{{word.prsi}}</b></div>
                    <div v-if="word.prsh">Present simple (he / she / it): <b>{{word.prsh}}</b></div>
                    <div v-if="word.pas">Past simple: <b>{{word.pas}}</b></div>
                    <div v-if="word.pasp">Past participle: <b>{{word.pasp}}</b></div>
                    <div v-if="word.ing">Ing: <b>{{word.ing}}</b></div>
                    <div v-if="word.pasp2">Ing: <b>{{word.pasp2}}</b></div>
                    <div v-if="word.comparative">Comparative: <b>{{word.comparative}}</b></div>
                    <div v-if="word.superlative">Superlative: <b>{{word.superlative}}</b></div>
                    <div v-if="word.plural">Plural: <b>{{word.plural}}</b></div>
                </div>
            </b-card-body>
          </b-list-group>
          <div v-if="checkTranslate"
               class="d-flex justify-content-between mb-1"
          >
            <b-button
              class="rounded"
              variant="outline-primary mt-1"
              @click="nextWord()"
            >
              Next
            </b-button>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </b-overlay>
</template>

<script>
import {
  BButton,
  BCard,
  BCardBody,
  BCardHeader,
  BCol,
  BContainer,
  BLink,
  BListGroup,
  BListGroupItem,
  BOverlay,
  BRow,
  BTab,
  BTabs,
  VBTooltip
} from 'bootstrap-vue-next'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import {StatusIndicator} from 'vue-status-indicator'
import {analysError} from '@/_helpers/analys_error'
import axios from "axios";
import useJwt from "@/auth/jwt/useJwt";

export default {
  components: {
    BRow,
    BCol,
    BContainer,
    BCard,
    BLink,
    BTabs,
    BTab,
    BListGroup,
    BListGroupItem,
    BCardHeader,
    StatusIndicator,
    BCardBody,
    BButton,
    BOverlay,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  data() {
    return {
      loading: false,
      onlyArchivedProjects: false,
      words: [],
      tabIndex: 0,
      finish: false,
      checkTranslate: false,
      playSound: 0,
      check_index: 0,
      check: true
    }
  },
  beforeMount() {
    this.getWords()
  },
  watch: {
    playSound() {
      this.words = this.words.map((word) => {
        if (word.show) {
          let name = word.name.replace(" ", "_")
          let sound = `${process.env.VUE_APP_API_URL}/world/voice/${name}_pronunciation_english_mp3`
          let audio = new Audio(sound);
          audio.play();
        }
        return word;
      })
    }
  },
  methods: {
    getWords() {
      this.loading = true
      axios.get(`${process.env.VUE_APP_API_URL}/learning/audio_words`, {
        headers: {Authorization: `Bearer ${useJwt.getToken()}`},
      }).then(response => {
        this.loading = false
        let check = 0;
        this.words = response.data.data.map((word) => {
          word.spell_names = [...word.spell]
          this.shuffle(word.spell_names)
          if (check === 0) {
            word.show = true
            let name = word.name.replace(" ", "_")
            let sound = `${process.env.VUE_APP_API_URL}/world/voice/${name}_pronunciation_english_mp3`
            let audio = new Audio(sound);
            audio.play();
          } else {
            word.show = false
          }
          word.first = 0
          word.check = false
          check++;
          return word;
        })
      }).catch(error => {
        this.loading = false
        const errorRes = analysError(error.response)
        const self = this
        errorRes.forEach(value => {
          self.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: value,
              icon: 'XIcon',
              variant: 'danger',
            },
          })
        })
      })
    },
    shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        this.$set(array, i, array[j]);
        this.$set(array, j, temp);
      }
    },
    nextWord() {
      let check = true;
      this.checkTranslate = false;
      this.shuffle(this.words);
      this.words = this.words.map((word) => {
        this.shuffle(word.spell_names)
        if (word.show) {
          word.show = false
        }
        if (check) {
          if (!word.show && !word.checked) {
            word.show = true;
            let name = word.name.replace(" ", "_")
            let sound = `${process.env.VUE_APP_API_URL}/world/voice/${name}_pronunciation_english_mp3`
            let audio = new Audio(sound);
            audio.play();
            check = false;
          }
        }
        return word;
      })
      if (check) {
        this.finish = true;
      }
    },
    checking(character, index, word) {
      if (word.spell[this.check_index].character === character) {
        let temp = Object.assign({}, word.spell[this.check_index])
        temp.show = true;
        this.$set(word.spell, this.check_index, temp);
        temp = Object.assign({}, word.spell_names[index])
        temp.show = true;
        this.$set(word.spell_names, index, temp)
        this.check_index++
        if (this.check_index === word.name.length) {
          this.checkTranslate = true
          this.check_index = 0
          word.checked = true
          if (this.check) {
            word.checked = true
            if (word.first === 0) {
              axios.get(`${process.env.VUE_APP_API_URL}/learning/change_status?check=audio_test&id=${word.word_id}`, {
                headers: {Authorization: `Bearer ${useJwt.getToken()}`},
              }).then(response => {
                this.loading = false
                this.check = true
              }).catch(error => {
                this.loading = false
                const errorRes = analysError(error.response)
                const self = this
                errorRes.forEach(value => {
                  self.$toast({
                    component: ToastificationContent,
                    position: 'top-right',
                    props: {
                      title: value,
                      icon: 'XIcon',
                      variant: 'danger',
                    },
                  })
                })
              })
            }
          } else {
            this.check = true
            word.first = 1
          }
        }
      } else if (this.check) {
        this.check = false
      }
    },
    checkAnswer(word, translate, e) {
      let check = false;
      if (word.name === translate) {
        check = true;
      }
      return check;
    }
  },
}
</script>