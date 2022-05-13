<template>
  <div>
    <h2>Mon Panier</h2>
    <ul>
      <li v-for="livre of panier.livres" :key="livre.id_livre">
        {{ find(livre.id_livre).title}} - {{ find(livre.id_livre).description }}
      </li>
    </ul>
    <button @click="pay" v-if="isConnected">Payer</button>
    <router-link to="/login" v-else>Se connecter pour payer</router-link>
  </div>
</template>

<script>
module.exports = {
  props: {
    livres: { type: Array, default: [] },
    panier: { type: Object },
    isConnected: { type: Boolean }
  },
  data () {
    return {
    }
  },
  async mounted () {
  },
  methods: {
    find (articleId) {
      return this.livres.find(livre => livre.id_livre === livreID)
    },
    pay () {
      this.$emit('pay')
    }
  }
}
</script>

<style scoped>
</style>
