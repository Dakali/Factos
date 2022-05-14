<template>
  <div class="container">
    <div class="subDiv" v-if="type === 'ADMIN'">
      <form @submit.prevent="addLivre">
        <h1>Ajouter un livre</h1>
        <input type="text" v-model="newBook.title" placeholder="Titre" required>
        <input type="text" v-model="newBook.auth" placeholder="Auteur" required>
        <input type="number" v-model="newBook.qty" placeholder="Quantité" required>
        <textarea type="text" v-model="newBook.description" required></textarea>
        <input type="text" v-model="newBook.img" placeholder="Lien vers l'image">
        <input type="text" v-model="newBook.categorie" placeholder="Categorie">
        <input type="submit" value="Ajouter">
      </form>
    </div>
    <p v-if="type === 'ETUDIANT'">info du compte</p>
    <h2 v-if="type === 'ETUDIANT'">Livre emprunté</h2>
    <div v-if="type === 'ETUDIANT'" class="cartBoard">
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
    borowedBooks:[],
    type:{type:String}
  },
  data() {
    return {
      newBook: {
        title: '',
        description: '',
        img: '',
        auth: '',
        categorie: '',
        qty: 0 ,
      }
    }
  },
  async mounted() {
    // this.$emit('get-borow')
    const res = await axios.get('api/borowedBooks')
    this.borowedBooks = res.data
  },
  methods: {
    addLivre () {
      this.$emit('add-book', this.newBook)
    }
  }
}
</script>

<style scoped>
.container {
  margin: 5%;
}
*{
  box-sizing: border-box;
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
input[type=text],input[type=number], select {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

textarea {
  width: 100%;
  height: 150px;
  padding: 12px 20px;
  box-sizing: border-box;
  border: 2px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
  resize: none;
}

input[type=submit] {
  width: 100%;
  background-color: #000;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

input[type=submit]:hover {
  background-color: #004AAD;
}

.subDiv {
  border-radius: 5px;
  background-color: #333;
  padding: 20px;

  margin-top: 10%;
}
</style>
