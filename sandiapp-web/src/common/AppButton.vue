<script setup>
const props = defineProps({
  text: {
    type: String,
  },
  hoverText: {
    type: String,
  },
  class: {
    type: String,
  },
  type: {
    type: String,
    default: "button",
  },
  icons: {
    type: [Array,String],
    default: "",
  },
  first: {
    type: Boolean,
    default: true,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
    <template v-if="props.type == 'icon'">
      <div class="relative group">
        <button
          :class="props.class ? props.class : 'text-light-green'"
          :disabled="props.isDisabled"
          :type="props.type"
        >
          <font-awesome-icon v-if="props.icons != '' && first" :icon="props.icons" />
        </button>
        <div 
          v-if="props.hoverText"
          class="absolute right-0 z-10 invisible bg-white shadow-md p-2 text-xs text-nowrap"
          :class="props.isDisabled ? 'group-hover:invisible' : 'group-hover:visible'"
        >
          {{ props.hoverText }}
        </div>
      </div>
    </template>
    <template v-else>
      <button
        class="flex items-center justify-center gap-1 text-base border rounded px-2 min-h-[1.625rem] min-w-[53px] transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        :class="props.class ? props.class : 'bg-light-green text-black border-light-green enabled:hover:bg-white enabled:hover:text-black enabled:hover:border-black'"
        :disabled="props.isDisabled"
        :type="props.type"
      >
        <font-awesome-icon v-if="props.icons != '' && first" :icon="props.icons" />
        {{ props.text }}
        <font-awesome-icon
          v-if="props.icons != '' && first == false"
          :icon="props.icons"
        />
      </button>
    </template>
  </template>