<template>
<div class="pf-preview" ref="root">
  <div class="pf-preview-ctrl" ref="ctrl">
    <el-checkbox v-model="lockAspectRatio" @change="onLockAspectRatioChange">Lock aspect ratio</el-checkbox>
  </div>
  <div class="pf-breview-view">
    <canvas ref="canvas" />
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      image: null,
      lockAspectRatio: true
    }
  },
  methods: {
    updateSize (previewWidth, previewHeight) {
      const _canvas = this.$refs.canvas
      const _previewDiv = _canvas.parentNode
      if (this.lockAspectRatio) {
        if (this.image) {
          const canvasScaleX = previewWidth / this.image.width
          const canvasScaleY = previewHeight / this.image.height
          if (canvasScaleX > canvasScaleY) {
            previewWidth *= canvasScaleY / canvasScaleX
          } else if (canvasScaleX < canvasScaleY) {
            previewHeight *= canvasScaleX / canvasScaleY
          }
        } else {
          if (previewWidth < previewHeight) {
            previewHeight = previewWidth
          } else {
            previewWidth = previewHeight
          }
        }
      }

      _previewDiv.style.width = previewWidth + 'px'
      _previewDiv.style.height = previewHeight + 'px'
    },
    onLockAspectRatioChange () {
      const _root = this.$refs.root
      const _ctrl = this.$refs.ctrl
      this.updateSize(_root.clientWidth, _root.clientHeight - _ctrl.clientHeight)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.pf-preview {
  display: flex;
  flex-direction: column;
  text-align: left;
  .pf-breview-view {
    background-color:#777;
    canvas {
      transform-origin: 0 0;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
