var PriorityQueue = function PriorityQueue() {
  this.data = []
}

PriorityQueue.prototype.push = function(node) {

  for (var i = 0; i < this.data.length && this.data[i].cost > node.cost; i++);
  this.data.splice(i, 0, node)
}

PriorityQueue.prototype.pop = function() {
  return this.data.pop()
}

PriorityQueue.prototype.size = function() {
  return this.data.length
}

PriorityQueue.prototype.get = function(i) {
  return this.data[i]
}

PriorityQueue.prototype.search = function(k) {
    for (var i=0; i < this.data.length; i++) {
        if (this.data[i].state == k) {
            return {
                    data: this.data[i],
                    i: i
                  }
        }
    }
    return null
}

PriorityQueue.prototype.remove = function(i) {
    this.data.splice(i, 1);
}

module.exports = PriorityQueue;