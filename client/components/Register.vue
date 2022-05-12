<template>
  <div class="sectionLogin">
    <img src="../assets/logo.png">
    <form @submit.prevent="createUser()">
      <div class="divLogin">
      <input
          type="text"
          v-model="pseudo"
          placeholder="Pseudo">
      <input
          type="text"
      type="password" v-model="password"
      placeholder="Mot de passe"
      >
      <button type="submit">Se créer un compte</button>
      </div>
      <p>L3 P2024 Tous Droits Reservés {{new Date().getFullYear()}}</p>
    </form>
  </div>
</template>

<script>
module.exports = {
  props: {
    articles: { type: Array, default: [] },
    panier: { type: Object }
  },
  data () {
    return {
      pseudo: '',
      password: ''
    }
  },
  async mounted () {
  },
  methods: {
    async createUser() {
      await axios.post('/api/register', {
        pseudo: this.pseudo,
        password: this.password
      })
      this.$router.push('/')
    }
  }
}
</script>

</script>

<style scoped>
.sectionLogin {
  display: flex;
  justify-content: center;
  align-items: center;

}

.divLogin {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 30px;
}

input {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  box-sizing: border-box;
}
p{
  color: #004AAD;
  font-size: smaller;
}
button {
  background-color: #004AAD;
  border: none;
  color: white;
  padding: 16px 32px;
  text-decoration: none;
  /*margin: 4px 2px;*/
  width: 100%;
  cursor: pointer;
}

img {
  width: 300px;
  height: 300px;
}
</style>
