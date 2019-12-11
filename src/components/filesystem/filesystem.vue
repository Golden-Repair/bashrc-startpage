<template>

</template>
<script>

export default {
  name: "filesystem",
  components: {},
  data: function() {
    return {
        separator: '/',
        dirNameExp = /[\w|\~]+$/,
		containsSlashCheckExp = /\//,
		isAbsolutePathExp = /^\~/,
		allDirectories = [],
		allFiles = [],
    };
  },
  methods: {
      ls: function(args) {
          var results = [];
		if (args[0] == undefined) {
			let dirs = curr_dir.getSubdirNames()
			let links = curr_dir.getLinkNames()
			for (let x of dirs) results.push(x, ResultType.directory)
			for (let x of links) results.push(x, ResultType.link)
		} else {
			let tempDir
			if (isAbsolutePathExp.test(args[0])) {
				tempDir = getDirWithPath(args[0])
			} else {
				tempDir = getDirWithPath(curr_dir.getPath() + separator + args[0])
			}
			let dirs = tempDir.getSubdirNames()
			let links = tempDir.getLinkNames()
			for (let x of dirs) results.push(x, ResultType.directory)
			for (let x of links) results.push(x, ResultType.link)
		}
		return results;
      }

  }
};
</script>

<style>
#console {
  height: 100%;
  padding: 5rem;
  background-color: var(--dark);
  opacity: 0.95;
}
</style>
