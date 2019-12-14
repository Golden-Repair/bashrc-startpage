<template>
    <!-- Terminal Output -->
    <div id="console_out" class="console-out">
        <a v-for="res in this.out">
            {{res}}
        </a>
    </div>
</template>

<script>

export  default {
    name: 'termOut',
    data: function () {
        return {}
    },
    props: {
        out: Array
    }
}

</script>

<style>
/* Hide scrollbar for Chrome, Safari and Opera */
.console-out::-webkit-scrollbar {
	display: none;
  }
  
  /* Hide scrollbar for IE and Edge and firefox */
  .console-out {
	-ms-overflow-style: none;
	scrollbar-width: none;
  }

.console-out {

	max-height: 100%;
	overflow:scroll;
}

.console-out a {
	display: block;
	color: white;
}

.console-out .error {
	color: var(--red);
}
.console-out .success {
	color: var(--green);
}
.console-out .link {
	color: var(--blue);
}
.console-out .directory {
	color: var(--cyan);
}

</style>