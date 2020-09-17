<template>
<div class="pf-node-root" ref ="root" :style="rootStyle" @mousemove="onRootMouseMove" @mousedown="onRootMouseDown">
  <div class="pf-node-header" ref="header" @mousedown="onHeaderMouseDown">
    <span>{{ name }}</span>
  </div>
  <div class="pf-node-body" ref="body">
    <IO ref="io" :inputs="inputs" :outputs="outputs" />
    <slot name="props" />
    <slot name="preview" />
  </div>
</div>
</template>

<script>
import IO from '@/components/PFIO.vue'
export default {
  components: { IO },
  props: {
    name: String,
    inputs: Array,
    outputs: Array
  },
  data () {
    return {
      rect: {
        x: 100,
        y: 100,
        w: 200,
        h: undefined
      }
    }
  },
  computed: {
    rootStyle: function () {
      return 'left:' + this.rect.x + 'px; top:' +
        this.rect.y + 'px; width:' +
        this.rect.w + 'px; height:' +
        (this.rect.h === undefined ? 'auto' : this.rect.h + 'px;')
    }
  },
  mounted () {
  },
  methods: {
    hitTest (event) {
      function getHitFlag (x, x0, x1) {
        if (x < x0 || x > x1) {
          return 0
        } else if (x - x0 < 8) {
          return 1
        } else if (x1 - x < 8) {
          return 2
        } else {
          return 4
        }
      }
      const _root = this.$refs.root
      const X = _root.offsetLeft
      const Y = _root.offsetTop
      const W = _root.clientWidth
      const H = _root.clientHeight

      const XCode = getHitFlag(event.clientX, X, X + W)
      const YCode = getHitFlag(event.clientY, Y, Y + H)

      switch (XCode + YCode * 8) {
        case 32 + 1: // left
          return 1
        case 32 + 2: // right
          return 2
        case 4 + 8: // top
          return 3
        case 4 + 16: // bottom
          return 4
        case 1 + 8: // top left
          return 5
        case 2 + 8: // top right
          return 6
        case 1 + 16: // bottom left
          return 7
        case 2 + 16: // bottom right
          return 8
      }
      return 9
    },
    onRootMouseMove (event) {
      const _this = this
      const _root = this.$refs.root
      event = event || window.event
      if (event.buttons & 1) {
        return
      }
      const hitCode = _this.hitTest(event)
      if (hitCode === 0) {
        return
      }
      switch (hitCode) {
        case 1: // left
          _root.style.cursor = 'w-resize'
          break
        case 2: // right
          _root.style.cursor = 'e-resize'
          break
        case 3: // top
          _root.style.cursor = 'n-resize'
          break
        case 4: // bottom
          _root.style.cursor = 's-resize'
          break
        case 5: // top left
          _root.style.cursor = 'nw-resize'
          break
        case 6: // top right
          _root.style.cursor = 'ne-resize'
          break
        case 7: // bottom left
          _root.style.cursor = 'sw-resize'
          break
        case 8: // bottom right
          _root.style.cursor = 'se-resize'
          break
        case 9: // bottom right
          _root.style.cursor = 'default'
          break
      }
    },
    onRootMouseDown (event) {
      const _this = this
      const _root = this.$refs.root
      const _io = this.$refs.io
      const _rect = this.rect
      event = event || window.event
      const hitCode = _this.hitTest(event)
      if (hitCode === 0 || hitCode === 9) {
        return
      }

      let LastX = event.clientX
      let LastY = event.clientY

      document.onmousemove = function (event) {
        event = event || window.event
        switch (hitCode) {
          case 1: // left
            _rect.x += event.clientX - LastX
            _rect.w -= event.clientX - LastX
            break
          case 2: // right
            _rect.w += event.clientX - LastX
            break
          case 3: // top
            _rect.y += event.clientY - LastY
            if (_rect.h !== undefined) {
              _rect.h = _root.clientHeight
            }
            _rect.h -= event.clientY - LastY
            break
          case 4: // bottom
            if (_rect.h !== undefined) {
              _rect.h = _root.clientHeight
            }
            _rect.h += event.clientY - LastY
            if (_rect.h <= 0) {
              _rect.h = undefined
              document.onmousemove = null
              event.stopImmediatePropagation()
            }
            break
          case 5: // top left
            _rect.x += event.clientX - LastX
            _rect.w -= event.clientX - LastX
            _rect.y += event.clientY - LastY
            if (_rect.h !== undefined) {
              _rect.h = _root.clientHeight
            }
            _rect.h -= event.clientY - LastY
            break
          case 6: // top right
            _rect.w += event.clientX - LastX
            _rect.y += event.clientY - LastY
            if (_rect.h !== undefined) {
              _rect.h = _root.clientHeight
            }
            _rect.h -= event.clientY - LastY
            break
          case 7: // bottom left
            _rect.x += event.clientX - LastX
            _rect.w -= event.clientX - LastX
            if (_rect.h !== undefined) {
              _rect.h = _root.clientHeight
            }
            _rect.h += event.clientY - LastY
            break
          case 8: // bottom right
            _rect.w += event.clientX - LastX
            if (_rect.h !== undefined) {
              _rect.h = _root.clientHeight
            }
            _rect.h += event.clientY - LastY
            break
        }
        _this.$emit('resized', _rect) // notify the parent components
        _io.onNodeResized()
        LastX = event.clientX
        LastY = event.clientY
      }

      document.onmouseup = function (event) {
        document.onmousemove = null
        document.onmouseup = null
      }
    },
    onHeaderMouseDown (event) {
      const _this = this
      const _rect = this.rect
      const _io = this.$refs.io
      event = event || window.event
      let LastX = event.clientX
      let LastY = event.clientY
      document.onmousemove = function (event) {
        event = event || window.event
        _rect.x += event.clientX - LastX
        _rect.y += event.clientY - LastY
        _this.$emit('moved', _rect) // notify the parent components
        _io.onNodeMoved()
        LastX = event.clientX
        LastY = event.clientY
      }

      document.onmouseup = function (event) {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.pf-node-root {
  position: absolute;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  color: #eee;
  min-width: 160px;
  .pf-node-header {
    padding: 6px;
    cursor: move;
    background-color: rgba(69, 69, 69, 0.5);
  }
  .pf-node-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 6px;
    background-color: rgba(153, 153, 153, 0.5);
  }
}
</style>
