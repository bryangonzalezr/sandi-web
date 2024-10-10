<script setup>
const props = defineProps({
    tipo: {
        type: String,
        required: true,
    },
});

const TextDisplay = {
    receta: "Receta",
    menu_diario: "Menú Diario",
    menu_semanal: "Menú Semanal",
    menu_mensual: "Menú Mensual",
}

const ColorDisplay = {
    receta: "bg-[#a3e635]",
    menu_diario: "bg-[#34d399]",
    menu_semanal: "bg-[#22d3ee]",
    menu_mensual: "bg-[#c084fc]",
}

</script>

<template>
    <div
    class="p-1 rounded w-40 text-center"
    :class="ColorDisplay[tipo]"
    > {{ TextDisplay[tipo] }}</div>
</template>