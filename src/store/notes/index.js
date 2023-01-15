import axios from 'axios'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import useJwt from '@/auth/jwt/useJwt'
import vue from 'vue'
import {analysError} from "@/_helpers/analys_error";

export default {
  actions: {
    getNotesList(ctx, transaction) {
      axios.get(`${process.env.VUE_APP_API_URL}/notes?transaction_id=${transaction}`, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        const notes = response.data.data
        ctx.commit('updateNotesList', notes)
      }).catch(error => {
        const errorRes = analysError(error.response)
        const self = vue
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
    createNoteVuex(ctx, data) {
      axios.post(`${process.env.VUE_APP_API_URL}/notes?transaction_id=${data.transaction_id}`, data,
        {
          headers: { Authorization: `Bearer ${useJwt.getToken()}` },
        }).then(response => {
        const note = response.data.data
        ctx.commit('createNote', note)
      }).catch(error => {
        const errorRes = analysError(error.response)
        const self = vue
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
    editNoteVuex(ctx, data) {
      axios.put(`${process.env.VUE_APP_API_URL}/notes/${data.id}`, data, {
        headers: {
          Authorization: `Bearer ${useJwt.getToken()}`,
        },
      }).then(response => {
        const notes = response.data.data
        ctx.commit('updateNotesList', notes)
        ctx.commit('updateEditStatus', false)
        vue.$toast({
          component: ToastificationContent,
          position: 'top-right',
          props: {
            title: response.data.message,
            icon: 'XIcon',
            variant: 'danger',
          },
        })
      }).catch(error => {
        const errorRes = analysError(error.response)
        const self = vue
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
    deleteNote(ctx, id) {
      axios.delete(`${process.env.VUE_APP_API_URL}/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${useJwt.getToken()}`,
        },
      }).then(response => {
        const notes = response.data.data
        ctx.commit('updateNotesList', notes)
        vue.$toast({
          component: ToastificationContent,
          position: 'top-right',
          props: {
            title: response.data.message,
            icon: 'XIcon',
            variant: 'danger',
          },
        })
      }).catch(error => {
        const errorRes = analysError(error.response)
        const self = vue
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
  },
  mutations: {
    updateNotesList(state, notes) {
      state.notes = notes
    },
    createNote(state, note) {
      const noteCopy = Object.assign({}, ...note)
      state.notes.push(noteCopy)
    },
    updateEditStatus(state, status) {
      state.isNoteEdit = status
    },
  },
  state: {
    notes: [],
    isNoteEdit: false,
    maxSymbols: 299,
  },
  getters: {
    transactionNotesList(state) {
      return state.notes
    },
    isNoteEdit(state) {
      return state.isNoteEdit
    },
  },
}
