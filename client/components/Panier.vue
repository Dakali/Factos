<template>
  <div class="container">

    <div class="cartBoard">
      <h1>Mon Panier</h1>
      <hr>
      <article v-for="livre of panier.livres" :key="livre.id_pi" class="cartItem">
        <img :srcset="livre.img">
        <p>Quantité : {{ livre.qty }}</p>
        <p>ID commande : {{ livre.id_pi }}</p>
        <input type="button" @click="deleteFromCart(livre)" value="retirer du panier">
        <input type="button" @click="borow(livre)" value="Emprunter">
      </article>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: "Cart",
  props: {
    livres: {type: Array, default: []},
    panier: {type: Object},
    isConnected: {type: Boolean}
  },
  data() {
    return {
      bookInCart: {
        id_item: -1,
        id_livre:1
      }
    }
  },
  async mounted() {
    this.$emit('get-cart')
  },
  methods: {
    // showUs(livre) {
    //   this.bookInCart.id_item = livre.id_pi
    //   console.log("yoooooo "+this.bookInCart.id_item)
    // },
    deleteFromCart(livre) {
      this.bookInCart.id_item = livre.id_pi
      this.$emit('dlt-cart', this.bookInCart.id_item)
    },
    borow(livre){
      this.bookInCart.id_livre = livre.id_livre
      this.bookInCart.id_item = livre.id_pi
      this.$emit('borow', this.bookInCart)
    }
  }
}
</script>

<style scoped>
.container {
  margin: 5%;
}
* {
  box-sizing: border-box;
}
.cartBoard{
  margin-top: 10%;
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
