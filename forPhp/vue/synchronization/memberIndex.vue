<template>
  <div style="padding: 20px;">
    <synchronization-dialog :synchronizationType="synchronizationType"></synchronization-dialog>
  </div>
</template>

<script>
import synchronizationDialog from './synchronizationDialog'
export default {
  props: {

  },
  data() {
    return {
      synchronizationType: 'areaOperation'

    };
  },
  computed: {

  },
  created() {

  },
  mounted() {

  },
  watch: {

  },
  methods: {

  },
  components: {
    synchronizationDialog,

  }
};
</script>

<style scoped lang="scss">

</style>
