<template>
<div class="pf-paths" ref="root">
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" ref="svg">
    <path v-for="(p, id) in paths" :key=id :d=pathData(p) />
  </svg>
</div>
</template>

<script>
import {guid, removeFirstItem, transformTo, globalTransformTo, rectOf, centerOf, isIn} from '@/js/utils.js'
export default {
  data () {
    return {
      paths: {}
    }
  },
  created () {
  },
  methods: {
    addPath (from, to, archorFrom = null, archorTo = null) {
      let id = this.generatorId()
      this.paths[id] = {from: from, to: to, archorFrom: archorFrom, archorTo: archorTo}
      this.$forceUpdate()

      if (archorFrom) {
        if (archorFrom.paths) {
          archorFrom.paths.push(id)
        } else {
          archorFrom.paths = [id]
        }
      }
      if (archorTo) {
        if (archorTo.paths) {
          archorTo.paths.push(id)
        } else {
          archorTo.paths = [id]
        }
      }
      return id
    },
    setPath (id, from, to, archorFrom = null, archorTo = null) {
      const path = this.paths[id]
      if (path) {
        path.from = from
        path.to = to
        if (path.archorFrom) {
          if (path.archorFrom.paths) {
            removeFirstItem(path.archorFrom.paths, id)
          }
        }
        if (path.archorTo) {
          if (path.archorTo.paths) {
            removeFirstItem(path.archorTo.paths, id)
          }
        }
        path.archorFrom = archorFrom
        path.archorTo = archorTo
      } else {
        this.paths[id] = {from: from, to: to, archorFrom: archorFrom, archorTo: archorTo}
      }
      if (archorFrom) {
        if (archorFrom.paths) {
          archorFrom.paths.push(id)
        } else {
          archorFrom.paths = [id]
        }
      }
      if (archorTo) {
        if (archorTo.paths) {
          archorTo.paths.push(id)
        } else {
          archorTo.paths = [id]
        }
      }
      this.$forceUpdate()
    },
    setPathFrom (id, from) {
      const path = this.paths[id]
      if (path) {
        path.from = from
      }
      this.$forceUpdate()
    },
    setPathTo (id, to) {
      const path = this.paths[id]
      if (path) {
        path.to = to
      }
      this.$forceUpdate()
    },
    setPathArchorFrom (id, archorFrom) {
      const path = this.paths[id]
      if (path) {
        if (path.archorFrom) {
          if (path.archorFrom.paths) {
            removeFirstItem(path.archorFrom.paths, id)
          }
        }
        path.archorFrom = archorFrom
      }
      if (archorFrom) {
        path.from = transformTo(archorFrom, _svg, centerOf(archorFrom))
        if (archorFrom.paths) {
          archorFrom.paths.push(id)
        } else {
          archorFrom.paths = [id]
        }
      }
      this.$forceUpdate()
    },
    setPathArchorTo (id, archorTo) {
      const path = this.paths[id]
      if (path) {
        if (path.archorTo) {
          if (path.archorTo.paths) {
            removeFirstItem(path.archorTo.paths, id)
          }
        }
        path.archorTo = archorTo
      }
      if (archorTo) {
        path.to = transformTo(archorTo, _svg, centerOf(archorTo))
        if (archorTo.paths) {
          archorTo.paths.push(id)
        } else {
          archorTo.paths = [id]
        }
      }
      this.$forceUpdate()
    },
    generatorId () {
      return guid()
    },
    onArchorMouseDown (event, type) {
      const _this = this
      const _anchor = event.target
      const _svg = this.$refs.svg
      const isInput = type === 'input'
      let center = transformTo(_anchor, _svg, centerOf(_anchor))
      let mousePosition = globalTransformTo(_svg, {x: event.clientX, y: event.clientY})
      let from = {}
      let to = {}
      if (isInput) {
        from = mousePosition
        to = center
      } else {
        from = center
        to = mousePosition
      }
      const id = this.addPath(from, to, _anchor, null)
      document.onmousemove = function (event) {
        const matchedAnchor = _this.matchAnchor(_anchor, type, {x: event.clientX, y: event.clientY})
        let pos = matchedAnchor ? transformTo(matchedAnchor, _svg, centerOf(matchedAnchor)) : globalTransformTo(_svg, {x: event.clientX, y: event.clientY})

        if (isInput) {
          from = pos
        } else {
          to = pos
        }
        _this.setPath(id, from, to, _anchor, matchedAnchor)
      }

      document.onmouseup = function (event) {
        if (isInput) {
          if (!_this.paths[id].archorFrom) {
            document.pf.showNodeCreator(id, type)
          }
        } else {
          if (!_this.paths[id].archorTo) {
            document.pf.showNodeCreator(id, type)
          }
        }
        document.onmousemove = null
        document.onmouseup = null
      }
    },
    onAnchorMoved (anchors, type) {
      const _svg = this.$refs.svg
      const isInput = type === 'input'
      for (let i = 0; i < anchors.length; ++i) {
        const anchor = anchors[i]
        for (let j = 0; anchor.paths && j < anchor.paths.length; ++j) {
          const id = anchor.paths[j]
          let center = transformTo(anchor, _svg, centerOf(anchor))
          if (isInput) {
            this.setPathTo(id, center)
          } else {
            this.setPathFrom(id, center)
          }
        }
      }
    },
    matchAnchor (anchor, type, pos) {
      const _pfNodes = document.pf.Nodes
      const _selfIO = anchor.parentElement.parentElement.parentElement // .pf-io.pf-inputs.pf-input.pf-input-anchor
      const isInput = type === 'input'
      const matchedClass = isInput ? 'pf-outputs' : 'pf-inputs'
      const matchedAnchorClass = isInput ? 'pf-output-anchor' : 'pf-input-anchor'
      const pfMatchedIOs = _pfNodes.getElementsByClassName(matchedClass)
      for (let i = 0; i < pfMatchedIOs.length; ++i) {
        const matchedIO = pfMatchedIOs[i]

        // Can't attached to self node
        if (matchedIO.parentElement === _selfIO) {
          continue
        }

        // Check the position is in the IO dom rectangle or not
        const rc = rectOf(matchedIO)
        const p = globalTransformTo(matchedIO, pos)
        if (!isIn(rc, p)) {
          console.log('rc:', rc.x, rc.y, rc.width, rc.height, 'p:', p.x, p.y)
          continue
        }

        const matchedAnchors = matchedIO.getElementsByClassName(matchedAnchorClass)
        for (let j = 0; j < matchedAnchors.length; ++j) {
          const testAnchor = matchedAnchors[j]
          const rc = rectOf(testAnchor)
          const p = globalTransformTo(testAnchor, pos)
          if (isIn(rc, p)) {
            return testAnchor
          }
        }
      }
    },
    pathData (p) {
      return 'M' + p.from.x + ',' + p.from.y + ' L' + (p.from.x + 20) + ',' + p.from.y + ' ' + (p.to.x - 20) + ',' + p.to.y + ' ' + p.to.x + ',' + p.to.y
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.pf-paths {
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 100%;
  path {
    fill: none;
    stroke: rgba(127, 127, 127, 0.5);
    stroke-width: 2;
    &:hover {
      stroke: rgba(153, 255, 153, 0.5);
      stroke-width: 3;
    }
  }
}
</style>
