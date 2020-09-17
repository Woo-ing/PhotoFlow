<template>
<div class="pf-io" ref="root">
  <div class="pf-inputs" ref="inputs">
    <div class="pf-input" v-for="(inputData, i) in inputs" :key=i>
      <div class="pf-input-anchor" @mousedown="onAnchorMouseDown($event, 'input')"/>
      <div class="pf-input-name"> {{inputData.name}} </div>
    </div>
  </div>
  <div class="pf-outputs"  ref="outputs">
    <div class="pf-output" v-for="(outputData, i) in outputs" :key=i>
      <div class="pf-output-name"> {{outputData.name}} </div>
      <div class="pf-output-anchor" @mousedown="onAnchorMouseDown($event, 'output')"/>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    inputs: Array,
    outputs: Array
  },
  data () {
    return {}
  },
  methods: {
    onAnchorMouseDown (event, type) {
      document.pf.Paths.onArchorMouseDown(event, type)
    },
    onNodeResized () {
      const inputAnchors = this.$refs.inputs.getElementsByClassName('pf-input-anchor')
      document.pf.Paths.onAnchorMoved(inputAnchors, 'input')
      const outputAnchors = this.$refs.outputs.getElementsByClassName('pf-output-anchor')
      document.pf.Paths.onAnchorMoved(outputAnchors, 'output')
    },
    onNodeMoved () {
      const inputAnchors = this.$refs.inputs.getElementsByClassName('pf-input-anchor')
      document.pf.Paths.onAnchorMoved(inputAnchors, 'input')
      const outputAnchors = this.$refs.outputs.getElementsByClassName('pf-output-anchor')
      document.pf.Paths.onAnchorMoved(outputAnchors, 'output')
    },
    getInputArchor (slotName) {
      const inputNames = this.$refs.inputs.getElementsByClassName('pf-input-name')
      for (let i = 0; i < inputNames.length; ++i) {
        if (inputNames[i].innerText === slotName) {
          const inputAnchors = inputNames[i].parentElement.getElementsByClassName('pf-input-anchor')
          return inputAnchors.length > 0 ? inputAnchors[0] : null
        }
      }
      return null
    },
    getOutputArchor (slotName) {
      const outputNames = this.$refs.outputs.getElementsByClassName('pf-output-name')
      for (let i = 0; i < outputNames.length; ++i) {
        if (outputNames[i].innerText === slotName) {
          const outputAnchors = outputNames[i].parentElement.getElementsByClassName('pf-output-anchor')
          return outputAnchors.length > 0 ? outputAnchors[0] : null
        }
      }
      return null
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.pf-io {
  display: flex;
  flex-direction:row;
  .pf-inputs {
    display: flex;
    flex-direction: column;
    width: 100%;
    .pf-input{
      display: flex;
      flex-direction: row;
      .pf-input-name {
        min-width: 40px;
        text-align: left;
        padding-left: 4px;
        line-height: 20px;
      }
      .pf-input-anchor {
        width: 6px;
        height: 6px;
        border-radius: 6px;
        border: 2px solid #8bc;
        margin: 4px;
        cursor: crosshair;
        &:hover {
          box-shadow: 0 0 6px 2px #bbf7fb;
        }
        &.connected {
          background-color: rgb(217, 255, 255);
        }
        & {
          transition: 0.25s;
          box-shadow: none;
          background-color: transparent;
        }
      }
    }
  }
  .pf-outputs {
    display: flex;
    flex-direction: column;
    width: 100%;
    .pf-output{
      display: flex;
      flex-direction: row;
      margin-left: auto;
      .pf-output-name {
        min-width: 40px;
        text-align: right;
        padding-right: 4px;
        line-height: 20px;
      }
      .pf-output-anchor {
        width: 6px;
        height: 6px;
        border-radius: 6px;
        border: 2px solid #cb8;
        margin: 4px;
        cursor: crosshair;
        &:hover {
          box-shadow: 0 0 6px 2px #fbf5bb;
        }
        &.connected {
          background-color: rgb(249, 250, 189);
        }
        & {
          transition: 0.25s;
          box-shadow: none;
          background-color: transparent;
        }
      }
    }
  }
}
</style>
