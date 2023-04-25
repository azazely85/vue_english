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
      <b-row class="justify-content-center" v-if="word.show" >
        <b-col
            cols="12"
            md="6"
            class="mb-2"
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
              {{ word.translate }}
            </b-card-body>
          </b-card>
        </b-col>
        <b-col
            cols="12"
            md="6"
            class="mb-2"
        >

          <b-list-group

          >
            <b-list-group-item v-for="translate in word.checkName" :key="translate"
                               class="flex-column align-items-start cursor-pointer"
                               @click="check(word, translate, $event)"
                               :class="{active: checkAnswer(word, translate) && checkTranslate}">
              {{ translate }}
            </b-list-group-item>

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
  BRow, BCol, BContainer, BCard, BLink, BCardHeader, VBTooltip, BCardBody, BOverlay, BTabs, BTab, BListGroup,
  BListGroupItem, BButton
} from 'bootstrap-vue'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { StatusIndicator } from 'vue-status-indicator'
import { analysError } from '@/_helpers/analys_error'
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
      checkTranslate: false,
      finish: false,
      playSound: 0
    }
  },
  beforeMount() {
    this.getWords()
  },
  watch: {
    playSound() {
      this.words = this.words.map((word) => {
        if (word.show) {
          let sound = `http://laravel.local/api/world/voice/${word.name.replaceAll(' ', '_')}_pronunciation_english_mp3`
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
      axios.get(`${process.env.VUE_APP_API_URL}/learning/translate_words`, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        this.loading = false
        let check = 0;
        this.words = response.data.data.map((word) => {
          if (check === 0) {
            word.show = true
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
      let currentIndex = array.length,  randomIndex;

      // While there remain elements to shuffle.
      while (currentIndex !== 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex], array[currentIndex]];
      }

      return array;
    },
    nextWord() {
      let check = true;
      this.checkTranslate = false;
      this.words = this.shuffle(this.words);
      this.words = this.words.map((word) => {
        if (word.show) {
          word.show = false
        }
        if (check) {
          if (!word.show && !word.check) {
            word.show = true;
            check = false;
          }
        }
        return word;
      })
      console.log(this.words)
      if (check) {
        this.finish = true;
      }
    },
    check(word, translate, e) {
      if (this.checkTranslate) {
        return
      }
      let check = false;
      if (word.name === translate) {
        check = true;
        word.check = true
        this.playSound +=1
      }
      if (!check) {
        event.target.style.background = 'red';
        word.first = 1
      } else {
        if (word.first === 0) {
          word.first = 1
          axios.get(`${process.env.VUE_APP_API_URL}/learning/change_status?check=tw&id=${word.word_id}`, {
            headers: { Authorization: `Bearer ${useJwt.getToken()}` },
          }).then(response => {
            this.loading = false
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
        event.target.style.background = 'green';
      }
      this.checkTranslate = true;
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

<style scoped>

</style>
