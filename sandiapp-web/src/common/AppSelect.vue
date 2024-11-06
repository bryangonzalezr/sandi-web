<script setup>
import { ref } from 'vue';

const props = defineProps({
  label: {
    type: [String, Boolean],
    required: false,
    default: 'Selecciona',
  },
  options: {
    type: [Array, Object],
  },
  optionText: {
    type: String,
  },
  value: {
    type: String,
    default: ''
  },
  firstOptionValue: {
    type: String,
    required: false,
    default: 'Selecciona',
  },
  selectedOption: {
    type: String,
    default: ''
  },
  error: {
    type: Boolean,
    required: false,
    default: false,
  },
  errorMessage: {
    type: Array,
    required: false,
  },
  disabledFirstOption: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  displayRow: {
    type: Boolean,
    default: false,
  },
  classSelect: {
    type: String,
    default: '',
  },
  classOption: {
    type: String,
    default: '',
  }
});

const emit = defineEmits(["update:selectedOption"]);

const selectedOption = ref(props.selectedOption);

const changeSelect = () => {
  selectedOption.value = event.target.value;
  emit('update:selectedOption', selectedOption)
}
</script>

<template>
  <div :class="displayRow ? 'flex gap-2 items-center w-full' : 'flex flex-col'">
    <label class="text-sm">{{ props.label }}</label>
    <div :class="[displayRow ? 'relative flex-grow' : 'w-full relative', props.classSelect]">
      <select
        id="selectRef"
        class="w-full rounded py-1.5 pl-1 pr-7 custom-select border border-[#aaaeb7] hover:border-[#5f6061] focus:border-[#5f6061] transition-all outline-0"
        :class="{
          'cursor-not-allowed': props.disabled,
          'border border-bold-red': error === true,
          'select-placeholder': props.disabledFirstOption && selectedOption == '',
        }"
        :disabled="props.disabled"
        @change="changeSelect()"
      >
        <option
          v-if="selectedOption == ''"
          :key="props.firstOptionValue"
          :disabled="props.disabledFirstOption"
          value=""
          selected
          :class="props.classOption"
        >
          {{ props.firstOptionValue }}
        </option>
        <template
          v-if="props.value == ''">
          <option 
            v-for="(option, key) in props.options" 
            :key="key" 
            :value="key" 
            :selected="key == props.selectedOption"
          >
            {{ option }}
          </option>
        </template>
        <template
          v-else>
          <option
            v-for="option in options"
            :key="option[props.value]"
            :value="option[props.value]"
            :selected="option[props.value] == props.selectedOption"
          >
            {{ option[props.optionText] }}
        </option>
        </template>
      </select>
    </div>
    <p v-if="props.error" class="text-xs text-bold-red flex gap-1 items-center">
      <font-awesome-icon :icon="['fas', 'circle-exclamation']" />
      {{ props.errorMessage[0] }}
    </p>
  </div>
</template>

<style lang="postcss" scoped>
.custom-select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  cursor: pointer;
  background: url(@/assets/icons/chevron-down-solid.svg) no-repeat;
  background-position: 99% 50%;
  background-size: 1.25rem;
  background-color: white;
  color: black;
  option {
    color: black;
  }
  option[value=""][disabled] {
    display: none;
  }
}

.select-placeholder {
  color: #9CA3AF;
}

</style>