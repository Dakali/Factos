<template>

  <div class="">
<p>info de connexion</p>
  </div>
</template>

<script>
module.exports = {
  props: {
    message:null,
    livres: {},
    panier: {type: Object},
    isConnected : false
  },
  data() {
    return {
      pseudo: '',
      password: ''
    }
  },
  async mounted() {
  },
  methods: {

  }
}
</script>

<style scoped>

</style>
