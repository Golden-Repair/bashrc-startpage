<template>
<!-- Prompt & user input -->
    <form v-on:submit.prevent="onSubmit">
        <input
        v-model='input'
         v-on:input="onInput"
         id="input_field" type="text" autofocus="autofocus" autocomplete="off">
         </input>
    </form>
</template>

<script>

export  default {
    name: 'promptInput',
    data (){
        return {
            input: ''
        }
    },
    methods: {
        onSubmit(command) {
            this.$emit('submit', this.input);
            this.input = ''
        },
        onInput(input) {
            this.$emit('input', this.input);
        }
    }
}

</script>

<style>

.form-wrapper {
 width: auto;
 overflow: hidden;
}

input 	{
	width:100%;
	outline: none !important;
	background: none;
	border: none;
	color: #FFF;
	font-size: 1em;
}


form {
	display: inline;
}

</style>