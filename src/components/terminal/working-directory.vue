<template>
<!-- Prompt & user input -->
    <span id="wd">{{wd}}</span>
</template>

<script>

export  default {
    name: 'working-directory',
    data: function () {
        return {}
    }, 
    props: {
        'wd' : String
    }
}

</script>

<style>

#wd {
	color: var(--cyan);
}

</style>