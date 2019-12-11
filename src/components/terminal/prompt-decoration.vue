<template>
<!-- Prompt & user input -->

    <span id="prompt_decoration">{{dec}}</span>       

</template>

<script>

export  default {
    name: 'prompt_decoration',
    data: function () {
        return {
            dec: '>'}
    }
}

</script>

<style>

#prompt_decoration {
	color: var(--green);
}

</style>