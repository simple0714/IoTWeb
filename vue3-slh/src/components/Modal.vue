<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  title: String,
  message: String,
  show: Boolean,
  mode: {
    type: String,
    default: 'alert'
  }
})

const emit = defineEmits(['update:show', 'closeDialog', 'cancel', 'confirm'])

const dialog = ref(false)

watch(() => props.show, (val) => {
  dialog.value = val
})

watch(dialog, (val) => {
  if (val !== props.show) {
    emit('update:show', val)
  }
})

const closeDialog = () => {
  dialog.value = false
  emit('update:show', false)
  emit('closeDialog')
}

const cancel = () => {
  dialog.value = false
  emit('update:show', false)
  emit('cancel')
}

const confirm = () => {
  dialog.value = false
  emit('update:show', false)
  emit('confirm')
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="400">
    <v-card>
      <v-card-title class="headline">{{ title }}</v-card-title>

      <v-card-text>
        {{ message }}
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <template v-if="mode === 'confirm'">
          <v-btn color="blue darken-1" text @click="confirm">확인</v-btn>
          <v-btn color="red darken-1" text @click="cancel">취소</v-btn>
        </template>
        <template v-else-if="mode === 'alert'">
          <v-btn color="blue darken-1" text @click="closeDialog">확인</v-btn>
        </template>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>