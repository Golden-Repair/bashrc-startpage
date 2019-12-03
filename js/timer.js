
function Timer() {
	var self = {}
	self.starttime = 0
	self.endtime = 0
	self.running = false
	self.isReset = true

	self.getTime = function () {
		if (this.running) {
			return new Date().getTime() - this.starttime
		} else {
			if (this.isReset) {
				return 0
			}
			return this.endtime - this.starttime
		}

	}

	self.start = function () {
		this.running = true
		this.isReset = false
		this.starttime = new Date().getTime()
	}
	self.stop = function () {
		this.running = false
		this.endtime = new Date().getTime()
		this.time = this.endtime - this.starttime

	}
	self.reset = function () {
		if (this.running) {
			this.starttime = new Date().getTime()
		} else {
			this.isReset = true
		}

	}
	return self
}
