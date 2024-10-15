<script setup>
const props = defineProps({
    tipo: {
        type: String,
        required: true,
    },
});

const TextDisplay = {
    receta: "Receta",
    diario: "Menú Diario",
    semanal: "Menú Semanal",
    mensual: "Menú Mensual",
}

const ColorDisplay = {
    receta: "bg-[#a3e635]",
    diario: "bg-[#34d399]",
    semanal: "bg-[#22d3ee]",
    mensual: "bg-[#c084fc]",
}

</script>

<template>
    <div
    class="p-1 rounded w-40 text-center"
    :class="ColorDisplay[tipo]"
    > {{ TextDisplay[tipo] }}</div>
</template>