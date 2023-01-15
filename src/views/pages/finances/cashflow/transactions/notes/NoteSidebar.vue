<template>
  <b-sidebar
    id="notes-sidebar"
    lazy
    :visible="isNotesShow"
    bg-variant="white"
    sidebar-class="sidebar-lg"
    shadow
    backdrop
    no-header
    right
    @change="(val) => $emit('update:is-notes-show', val)"
  >
    <div class="d-flex flex-column justify-content-between h-100">
      <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
        <h5 class="mb-0">
          Notes of transaction #{{ targetTransaction }}
        </h5>

        <feather-icon
          class="ml-1 cursor-pointer"
          icon="XIcon"
          size="16"
          @click="clearAndHide"
        />

      </div>
      <div
        id="notes"
        style="height: 90%; overflow: auto;"
      >
        <div
          v-for="(note,index) in transactionNotesList"
          :key="index"
          class="d-flex flex-column pl-1 pt-1"
        >
          <div class="d-flex flex-row justify-content-between mb-1">
            <div class="d-flex flex-column">
              <div class="d-flex">
                {{ note.user.firstname + ' ' + note.user.lastname }}
              </div>
              <div class="d-flex">
                {{ note.created_at | moment("MM-DD-YYYY HH:mm") }}
              </div>
            </div>
            <div class="d-flex align-items-center">
              <feather-icon
                class="cursor-pointer"
                icon="EditIcon"
                size="16"
                @click="prepareNoteEdit(note)"
              />
              <feather-icon
                class="ml-1 cursor-pointer mr-1"
                icon="Trash2Icon"
                size="16"
                @click="deleteNote(note.id)"
              />
            </div>
          </div>
          {{ editedFlag(note) }}
          <b-card
            border-variant="primary"
            class="text-left"
            no-body
          >
            <span class="m-1">
              {{ note.text }}
            </span>
          </b-card>
        </div>
      </div>
      <div class="textarea-container pb-1 pl-1 pr-1">
        <b-form-textarea
          v-if="!isNoteEdit"
          id="textarea"
          v-model="noteData.text"
          placeholder="Enter something..."
          rows="1"
          max-rows="3"
          style="overflow: overlay; max-height: 50px;"
          trim
          @keydown="checkLength"
          @keypress.enter="createNote"
        />
<!--        ({-->
<!--        transaction_id: targetTransaction,-->
<!--        text: noteData.text,})-->
        <b-form-textarea
          v-else
          id="textarea"
          v-model="noteData.text"
          placeholder="Enter something..."
          rows="1"
          max-rows="3"
          style="overflow: overlay; max-height: 50px;"
          trim
          @keydown="checkLength"
          @keypress.enter="editNote"
        />
        <feather-icon
          v-if="isNoteEdit"
          class="mr-1 cursor-pointer p-absolute position-top-0 position-right-0"
          icon="XIcon"
          size="16"
          @click="$store.commit('updateEditStatus', false)"
        />
      </div>
      <b-button-group class="d-flex align-content-end">
        <b-button
          v-ripple.400="'rgba(186, 191, 199, 0.15)'"
          type="button"
          variant="outline-secondary"
          class="btn btn-outline-secondary w-50 mr-3 ml-1 rounded-right"
          @click="clearAndHide"
        >
          Cancel
        </b-button>
        <b-button
          v-if="!isNoteEdit"
          variant="primary"
          class="btn btn-outline-secondary w-50 mr-1 ml-3 rounded-left"
          @click="createNote({
            transaction_id: targetTransaction,
            text: noteData.text,})"
        >
          Post
        </b-button>
        <b-button
          v-if="isNoteEdit"
          variant="primary"
          class="btn btn-outline-secondary w-50 mr-1 ml-3 rounded-left"
          @click="editNote"
        >
          Update
        </b-button>
      </b-button-group>
    </div>
  </b-sidebar>
</template>

<script>
import {
  BButton, BButtonGroup, BSidebar, BFormTextarea, BCard, BCardText,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    BButton,
    BButtonGroup,
    BSidebar,
    BFormTextarea,
    BCard,
    BCardText,
  },
  directives: {
    Ripple,
  },
  model: {
    prop: 'isNotesShow',
    event: 'update:is-notes-show',
  },
  props: {
    isNotesShow: {
      type: Boolean,
      required: true,
    },
    countOfNewNotes: {
      type: Number,
      required: true,
    },
    targetTransaction: {
      type: Number,
      required: true,
    },
  },
  computed: mapGetters(['transactionNotesList', 'isNoteEdit']),
  watch: {
    isNotesShow(newVal) {
      if (newVal) {
        this.getNotesList(this.targetTransaction)
      }
    },
  },
  mounted() {
    this.$store.subscribe((mutation, state) => {
      switch (mutation.type) {
        case 'createNote': {
          this.noteData = { ...this.defaultValue }
          this.$nextTick(() => {
            this.updateScroll()
            this.noteData = { ...this.defaultValue }
          })
          break
        }
        case 'updateEditStatus': {
          if (!state.notes.isNoteEdit) { this.noteData = { ...this.defaultValue } }
          break
        }
      }
    })
  },
  data() {
    return {
      noteData: {
        text: '',
        transaction_id: null,
      },
      defaultValue: {
        text: '',
        transaction_id: null,
      },
    }
  },
  methods: {
    createNote(e) {
      if (e.shiftKey) { // just new line
        return
      }
      this.$store.dispatch('createNoteVuex', {
        transaction_id: this.targetTransaction,
        text: this.noteData.text,
      })
    },
    editNote(e) {
      if (e.shiftKey) { // just new line
        return
      }
      this.$store.dispatch('editNoteVuex', this.noteData)
    },
    ...mapActions(['getNotesList', 'deleteNote']),
    editedFlag(note) {
      return this.$moment(note.created_at).format('YYYY-MM-DD HH:mm:ss')
          !== this.$moment(note.updated_at).format('YYYY-MM-DD HH:mm:ss')
        ? 'Edited' : ''
    },
    prepareNoteEdit(note) {
      this.$store.commit('updateEditStatus', true)
      this.noteData = { ...note }
    },
    updateScroll() {
      const container = this.$el.querySelector('#notes')
      container.scrollTop = container.scrollHeight
    },
    checkLength(event) {
      if (this.noteData.text.length > this.$store.state.notes.maxSymbols) {
        if (event.keyCode >= 48 && event.keyCode <= 90) {
          event.preventDefault()
        }
      }
    },
    clearAndHide() {
      this.noteData = { ...this.defaultValue }
      this.$store.state.notes.notes = { ...{} }
      this.$store.commit('updateEditStatus', false)
      this.$emit('update:is-notes-show', false)
    },
  },
}
</script>

<style scoped>

.textarea-container {
  position: relative;
}
.textarea-container textarea {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.textarea-container svg {
  position: absolute;
  top: 10%;
  right: 0;
}

</style>
