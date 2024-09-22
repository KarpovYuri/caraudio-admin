<template>
	<h1 class="text-3xl text-day-blue-300">{{ msg }}</h1>
</template>

<script setup lang="ts">
defineProps<{ msg: string }>()
</script>
