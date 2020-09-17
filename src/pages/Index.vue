<template>
  <div>
    <div id="pf-nodes" ref="pfNodes">
     <PFNodeSource/>
    </div>
    <PFPaths ref="pfPaths" />
    <PFNodeCreator ref="pfNodeCreator" />
  </div>
</template>
<script>
import PFNodeSource from '@/components/PFNodeSource.vue'
import PFPaths from '@/components/PFPaths.vue'
import PFNodeCreator from '@/components/PFNodeCreator.vue'
export default {
  components: { PFNodeSource, PFPaths, PFNodeCreator },
  data () {
    return {
    }
  },
  beforeCreate () {
    document.pf = {} // I don't like using events to call functions, tt's hard to debug and understand, why don't we use global instance?
  },
  created () {
    // Disable user to select text or images
    document.onselectstart = function () {
      return false
    }
  },
  mounted () {
    document.pf.Nodes = this.$refs.pfNodes
    document.pf.Paths = this.$refs.pfPaths
    document.pf.NodeCreator = this.$refs.pfNodeCreator
  },
  methods: {
  }
}
</script>
<style scoped>
</style>
