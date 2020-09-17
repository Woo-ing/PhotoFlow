<template>
  <Node name="Image Source" :inputs="inputs" :outputs="outputs" ref="node" @resized="onresize" @moved="onmoved">
    <template v-slot:props>
      <div class="pf-props" ref="props">
        <input type="file" class="upload" @change="selectImage" ref="inputer" accept="image/png,image/jpeg,image/gif,image/jpg"/>
        <a class="add"><i class="iconfont icon-plus"></i></a>
      </div>
    </template>
    <template v-slot:preview>
      <Preview ref="preview" />
    </template>
  </Node>
</template>

<script>
import Node from '@/components/PFNode.vue'
import Preview from '@/components/PFPreview.vue'
export default {
  name: 'PFNodeSource',
  components: { Node, Preview },
  pfp: {
    name: 'Source/Image File',
    guid: '1'
  },
  props: {
  },
  data () {
    return {
      url: '',
      inputs: [{name: 'RGBA'}, {name: 'R'}, {name: 'G'}, {name: 'B'}, {name: 'A'}],
      outputs: [{name: 'RGBA'}, {name: 'R'}, {name: 'G'}, {name: 'B'}, {name: 'A'}]
    }
  },
  mounted () {
    const _this = this
    const _preview = this.$refs.preview
    _preview.image = this.image = new Image()
    this.image.onload = function () {
      _this.render()
      _this.updateSize()
    }
    this.image.onerror = function (event) {
      console.log('load image error: ', event)
    }
  },
  methods: {
    selectImage (event) {
      const inputDOM = this.$refs.inputer

      const files = inputDOM.files
      if (files.length === 0) {
        return false
      }

      const file = files[0]
      const size = Math.floor(file.size / 1024)
      if (size > 5 * 1024 * 1024) {
        alert('The image file is too large, please make sure the image file size does not exceed 5M')
        return false
      }

      this.image.src = this.getImageURL(file)
    },
    getImageURL (file) {
      let url = ''
      if (window.createObjectURL !== undefined) { // basic
        url = window.createObjectURL(file)
      } else if (window.URL !== undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL !== undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file)
      }
      return url
    },
    render () {
      const _canvas = this.$refs.preview.$refs.canvas
      const ctx = _canvas.getContext('2d')

      _canvas.width = this.image.width
      _canvas.height = this.image.height
      ctx.drawImage(this.image, 0, 0)
    },
    updateSize () {
      const _preview = this.$refs.preview
      const _previewCtrl = _preview.$refs.ctrl
      const _root = this.$refs.node.$refs.root
      const _header = this.$refs.node.$refs.header
      const _io = this.$refs.node.$refs.io
      const _props = this.$refs.props

      const workAreaWidth = Math.max(0, _root.clientWidth - 6 * 2)
      const workAreaHeight = Math.max(0, _root.clientHeight - _header.offsetHeight - 6 * 2)
      let previewWidth = workAreaWidth
      let previewHeight = Math.max(0, workAreaHeight - _props.offsetHeight - _io.offsetHeight - _previewCtrl.offsetHeight)

      _preview.updateSize(previewWidth, previewHeight)
      // _canvas.style.transform = 'scale(' + canvasScale + ')'
    },
    onresize (rect) {
      this.updateSize()
    },
    onmoved (rect) {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
