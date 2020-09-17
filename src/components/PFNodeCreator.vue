<template>
<div class="pf-node-creator" ref ="root" v-show="visible">
  <div class="pf-creator-filter">
    <el-input
      placeholder="input node name"
      prefix-icon="el-icon-search"
      v-model="filter">
    </el-input>
  </div>
  <el-cascader-panel v-model="selPlugin" :options="pluginOptions" :filter="filter" @change="createNode"></el-cascader-panel>
</div>
</template>

<script>
import NodeSource from '@/components/PFNodeSource.vue'
import Vue from 'vue'
export default {
  components: { NodeSource },
  props: {
  },
  data () {
    return {
      filter: '',
      selPlugin: '',
      type: '',
      visible: false,
      plugins: [],
      pluginsWithInputs: [],
      pluginsWithOutputs: [],
      constructors: {}
    }
  },
  computed: {
    pluginOptions: function () {
      if (this.type === 'input') {
        return this.pluginsWithOutputs
      } else if (this.type === 'output') {
        return this.pluginsWithInputs
      } else {
        return this.plugins
      }
    }
  },
  mounted () {
    document.pf.showNodeCreator = this.show
    document.pf.hideNodeCreator = this.hide
    this.addPlugin(NodeSource, 'test', '2')
    this.addPlugin(NodeSource, 'Image/test', '2')
  },
  methods: {
    show (id, type) {
      this.visible = true
      this.type = type
      this.id = id
    },
    hide () {
      this.visible = false
    },
    addPlugin (component) {
      function addPluginTo (component, plugins) {
        const labels = component.pfp.name.split('/')
        let treeItem = plugins
        let i = 0
        for (; i < labels.length - 1; ++i) {
          let label = labels[i]
          let findItem = null
          for (let j = 0; j < treeItem.length; ++j) {
            if (treeItem[j].label === label && treeItem[j].hasOwnProperty('children')) {
              findItem = treeItem[j].children
            }
          }
          if (!findItem) {
            const newItem = { label: label, value: label, children: [] }
            treeItem.push(newItem)
            findItem = newItem.children
          }
          treeItem = findItem
        }
        let label = labels[i]
        const item = {label: label, value: component.pfp.guid}
        treeItem.push(item)
        return item
      }
      function addPluginSlots (item, slots) {
        if (!item.children) {
          item.children = []
        }

        for (let i = 0; i < slots.length; ++i) {
          const slot = slots[i]
          item.children.push({ label: slot.name, value: slot.name })
        }
      }

      addPluginTo(component, this.plugins)
      const itemForPI = addPluginTo(component, this.pluginsWithInputs)
      addPluginSlots(itemForPI, component.data().inputs)
      const itemForPO = addPluginTo(component, this.pluginsWithOutputs)
      addPluginSlots(itemForPO, component.data().outputs)

      this.constructors[component.pfp.guid] = Vue.extend(component)
    },
    createNode () {
      if (this.selPlugin.length === 0) {
        return
      }

      if (this.type === 'input') {
        const slot = this.selPlugin.pop()
        const guid = this.selPlugin.pop()
        let constructor = this.constructors[guid]
        if (constructor) {
          const node = new constructor()
          node.$mount(document.pf.Nodes)
          const archorFrom = node.$refs.node.$refs.io.getInputArchor(slot)
          document.pf.paths.setPathArchorFrom(this.id, archorFrom)
        }
      } else if (this.type === 'output') {
        const slot = this.selPlugin.pop()
        const guid = this.selPlugin.pop()
        let constructor = this.constructors[guid]
        if (constructor) {
          const node = new constructor()
          node.$mount(document.pf.Nodes)
          const archorto = node.$refs.node.$refs.io.getOutputArchor(slot)
          document.pf.paths.setPathArchorTo(this.id, archorto)
        }
      } else {
        const guid = this.selPlugin.pop()
        let constructor = this.constructors[guid]
        if (constructor) {
          const node = new constructor()
          node.$mount(document.pf.Nodes)
        }
      }
      this.hide()
      this.selPlugin = []
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
