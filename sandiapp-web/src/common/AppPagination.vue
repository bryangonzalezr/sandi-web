<script setup>
import { defineEmits } from "vue";
const props = defineProps({
  links: {
    type: Object,
  },
  meta: {
    type: Object,
  },
});

const emit = defineEmits(["handlePage"]);

const cutLink = (link) => {
  return link.split("=")[1];
};

const getPage = (page) => {
  const link = props.meta.links.find((link) => link.label == page);
  return link ? cutLink(link.url) : null;
};

const isPageActive = (page) => {
  return props.meta.current_page == page;
};

const isInFirstPage = () => {
  return props.meta.current_page == 1;
};

const isInLastPage = () => {
  return props.meta.current_page == props.meta.last_page;
};

const onClickPage = (page) => {
  emit("handlePage", getPage(page));
};

const onClickFirstPage = () => {
  isInFirstPage() ? null : emit("handlePage", cutLink(props.links.first));
};

const onClickPreviousPage = () => {
  isInFirstPage() ? null : emit("handlePage", cutLink(props.links.prev));
};

const onClickNextPage = () => {
  isInLastPage() ? null : emit("handlePage", cutLink(props.links.next));
};

const onClickLastPage = () => {
  isInLastPage() ? null : emit("handlePage", cutLink(props.links.last));
};
</script>

<template>
  <div class="flex-col flex lg:flex-row gap-10 lg:gap-20 items-center justify-between py-4 work-sans text-base"
    v-if="props.meta.total > 0">
    <div>
      <p class="leading-5">
        Mostrando de
        <span class="text-md">{{ props.meta.from }}</span>
        a
        <span class="text-md">{{ props.meta.to }}</span>
        de
        <span class="text-md">{{ props.meta.total }}</span>
        resultados
      </p>
    </div>
    <div>
      <nav class="relative z-0 inline-flex shadow-sm text-xl sm:text-base gap-2 lg:gap-1.5">
        <!-- BOTONES DE PRIMERA Y ANTERIOR PÁGINA -->
        <div class="inline-flex gap-2 lg:gap-1.5">
          <a class="relative inline-flex items-center py-1 px-2 bg-mid-green text-gray border-none leading-5 focus:z-10 focus:outline-none active:bg-dark-green active transition ease-in-out duration-150"
            role="button" rel="prev" :disabled="isInFirstPage" :class="{
              'cursor-not-allowed': isInFirstPage(),
              'opacity-60': isInFirstPage(),
              'hover:text-black': !isInFirstPage(),
            }" @click.prevent="onClickFirstPage">
            <font-awesome-icon icon="angle-double-left" />
          </a>
          <a role="button"
            class="relative inline-flex items-center py-1 px-2.5 bg-mid-green text-gray border-none leading-5 focus:z-10 focus:outline-none active:bg-dark-green active transition ease-in-out duration-150"
            aria-label="Previous" :disabled="isInFirstPage" :class="{
              'cursor-not-allowed': isInFirstPage(),
              'opacity-50': isInFirstPage(),
              'hover:text-black': !isInFirstPage(),
            }" @click="onClickPreviousPage">
            <font-awesome-icon icon="angle-left" />
          </a>
        </div>

        <!-- NUMERACIÓN DE PÁGINAS -->
        <template v-for="page in props.meta.last_page" :key="page">
          <a v-if="page >= props.meta.current_page - 1 &&
            page <= props.meta.current_page + 3
            "
            class="relative inline-flex items-center  py-1 px-2.5 border-none leading-5 focus:z-10 focus:outline-none active:bg-dark-green active:text-gray transition ease-in-out duration-150 hover:bg-dark-green cursor-pointer"
            :class="{
              'text-white bg-neutral-green': isPageActive(page),
              'hover:text-black bg-mid-green text-gray': !isPageActive(page),
            }" aria-current="page" @click="onClickPage(page)">
            {{ page }}
          </a>
        </template>

        <!-- BOTONES DE SIGUIENTE Y ÚLTIMA PÁGINA -->
        <div class="inline-flex gap-2 lg:gap-1.5">
          <a role="button"
            class="relative inline-flex items-center py-1 px-2.5 p bg-mid-green text-gray border-none leading-5 focus:z-10 focus:outline-none active:bg-dark-green active transition ease-in-out duration-150"
            aria-label="Next" :disabled="isInLastPage" :class="{
              'cursor-not-allowed': isInLastPage(),
              'opacity-50': isInLastPage(),
              'hover:text-black': !isInLastPage(),
            }" @click="onClickNextPage">
            <font-awesome-icon icon="angle-right" />
          </a>
          <a class="relative inline-flex items-center py-1 px-2 bg-mid-green text-gray border-none leading-5 focus:z-10 focus:outline-none active:bg-dark-green active transition ease-in-out duration-150"
            rel="next" role="button" :disabled="isInLastPage" :class="{
              'cursor-not-allowed': isInLastPage(),
              'opacity-50': isInLastPage(),
              'hover:text-black': !isInLastPage(),
            }" @click.prevent="onClickLastPage">
            <font-awesome-icon icon="angle-double-right" />
          </a>
        </div>
      </nav>
    </div>
  </div>
</template>