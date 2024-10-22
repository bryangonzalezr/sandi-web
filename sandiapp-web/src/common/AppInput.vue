<script setup>
import { ref } from 'vue';
const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  placeholder: {
    type: [String, Number],
    required: false,
  },
  error: {
    type: Boolean,
    required: false,
    default: false,
  },
  label: {
    type: [String, Boolean],
    required: false,
  },
  modelValue: {
    type: [String, Number],
    required: false,
    default: "",
  },
  errorMessage: {
    type: Array,
    required: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  displayRow: {
    type: Boolean,
    default: false,
  }
});

const seePassword = ref(false)
const type = ref('password')

const changeType = () => {
    seePassword.value =!seePassword.value;
    if(seePassword.value){
        type.value = "text"
    }else{
        type.value = "password"
    }
}
</script>

<template>
    <div :class="displayRow ? 'flex gap-2 items-center w-full' : 'flex flex-col'">
        <label class="text-sm text-nowrap" v-if="props.label">{{props.label}}</label>
        <div class="flex flex-col w-full">
          <div class="w-full flex items-center bg-white rounded">
            <input
                class="py-[6px] px-1 rounded w-full border border-[#aaaeb7] hover:border-[#5f6061] focus:border-[#5f6061] transition-all outline-0"
                :class="props.error ? 'border border-bold-red': ''"
                :value="modelValue"
                :type="props.type == 'password' ? type : props.type"
                :placeholder="props.placeholder"
                @input="$emit('update:modelValue', $event.target.value)"
                @change="$emit('update:modelValue', $event.target.value)"
                :disabled="props.disabled"
              >
              </input>
              <font-awesome-icon
                  class="text-bold-red p-2 cursor-pointer"
                  v-if="props.type == 'password'"
                  :icon="seePassword ? ['fas', 'eye-slash'] : ['fas', 'eye'] "
                  @click="changeType()"
              />
          </div>
          <p v-if="props.error" class="text-xs text-bold-red flex gap-1 items-center">
            <font-awesome-icon :icon="['fas', 'circle-exclamation']" />
            {{ props.errorMessage[0] }}
          </p>
        </div>
    </div>
</template>
