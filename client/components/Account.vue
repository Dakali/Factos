<template>
  <div class="container">
    <p>info du compte</p>
    <h2>Livre emprunté</h2>
    <div class="cartBoard">
      <article v-for="r in borowedBooks" :key="r.id_emprunt" class="cartItem">
        <div class="book-img">
          <img :srcset="r.img">
        </div>
        <p>Date d'emprunt : {{r.date_act}}</p>
        <p>Echéance : {{r.date_ech}}</p>
      </article>

    </div>
  </div>
</template>

<script>
module.exports = {
  name: "Account",
  props: {
    borowedBooks:[]
  },
  data() {
    return {

    }
  },
  async mounted() {
    // this.$emit('get-borow')
    const res = await axios.get('api/borowedBooks')
    this.borowedBooks = res.data
  },
  methods: {}
}
</script>

<style scoped>
.container {
  margin: 5%;
}

.cartItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5px;
}

.cartItem img {
  width: 150px;
  height: 150px;
}
</style>
