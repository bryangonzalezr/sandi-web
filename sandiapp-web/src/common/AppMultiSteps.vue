<script setup>
const props = defineProps({
    titles: {
        type: Array,
        required: true,
    },
    currentStep: {
        type: Number,
        required: true,
    },
    classStepsBox:{
        type: String,
        required: false,
        deafult: 'flex w-full justify-between pr-3'
    },
    ClassStep:{
        type: String,
        required: false,
        default: 'flex flex-col items-center'
    }
});

</script>

<template>
    <div :class="props.classStepsBox ?? 'flex w-full justify-between pr-3'">
        <div v-for="(title, index) in props.titles" :key="index" :class="props.ClassStep">
            <div>{{ title }}</div>
            <div 
                    :class="{
                        'bg-forest-green': props.currentStep >= index+1,
                        'bg-gray': props.currentStep < index+1
                    }"
                    class="p-2 rounded-full w-10 h-10 text-center text-white"
                > 
                    <div v-if="props.currentStep <= index+1"> {{ index+1 }} </div>
                    <font-awesome-icon v-else :icon="['fas', 'check']" />
            </div>
        </div>   
    </div>
</template>