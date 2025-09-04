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
                            <h1>{{ word.name }}</h1>
                        </b-card-body>
                    </b-card>
                </b-col>
                <b-col
                        cols="12"
                        md="12"
                        class="mb-12"
                >
                    <b-list-group>
                        <b-card-body
                                class="d-flex justify-content-center"
                        >
                            <b-list-group-item v-for="(item, index) in word.checkTranslate" :key="index"
                                               v-show="!item.show"
                                               class="flex-column align-items-start cursor-pointer"
                                               @click="checking(item, index,word,  $event)">
                                {{ item }}
                            </b-list-group-item>
                        </b-card-body>
                    </b-list-group>
                    <b-list-group v-if="checkTranslate">
                        <b-card-body
                                class="d-flex justify-content-center"
                        >
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
      words: [],
      tabIndex: 0,
      finish: false,
      checkTranslate: false,
      check_index: 0,
      check: true
    }
  },
  beforeMount() {
    this.getWords()
  },
  methods: {
    getWords() {
      this.loading = true
      axios.get(`${process.env.VUE_APP_API_URL}/learning/get_repeat`, {
        headers: {Authorization: `Bearer ${useJwt.getToken()}`},
      }).then(response => {
        this.loading = false
        let check = 0;
        this.words = response.data.data.map((word) => {
          word.show = check === 0;
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
    nextWord() {
      let check = true;
      this.checkTranslate = false;
      this.words = this.words.map((word) => {
        if (word.check) {
          word.show = false
        }
        if (check) {
          if (!word.check) {
            word.show = true;
            check = false;
          }
        }
        return word;
      })
      if (check) {
        this.finish = true;
      }
    },
    checking(translate, index, word) {
      if (this.checkTranslate) {
        return
      }
      if (translate !== word.translate) {
        event.target.style.background = 'red';
      } else {
          event.target.style.background = 'green';
      }
      this.checkTranslate = true
      word.check = 1;
      axios.get(`${process.env.VUE_APP_API_URL}/learning/change_repeat?check=${translate === word.translate}&id=${word.word_id}`,
        {
          headers: {Authorization: `Bearer ${useJwt.getToken()}`},
        }).then(response => {
        this.loading = false
        this.check = true
        let sound = `${process.env.VUE_APP_API_URL}/world/voice/${word.name.replaceAll(' ', '_')}_pronunciation_english_mp3`
        let audio = new Audio(sound);
        audio.play();
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
    checkAnswer(word, translate, e) {
      console.log(word.translate == translate)

      let check = false;
      if (word.translate === translate) {
        check = true;
      }
      return check;
    }
  },
}
</script>