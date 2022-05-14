<template>
  <div v-if="isConnected" class="container">
    <div class="subDiv">
      <h1>Le Catalogue</h1>
      <form @submit.prevent="bookSearch()" style="float: right">
        <input type="text" placeholder="Titre ou Auteur" name="search" v-model="bookInfo">
        <input type="submit" class="myBtn" value="Rechercher">
      </form>
    </div>
    <router-link to="/addForm">
    </router-link>
    <div id="btnContainer">
      <button class="btn" @click="listView()">Vue Liste</button>
      <button class="btn active" @click="gridView()">Vue Grille</button>
    </div>
    <br>
    <div>
      <article v-for="livre in livres" :key="livre.id" class="column">
        <div class="book-img">
          <img :srcset="livre.img" class="img">
          <p class="description">{{ livre.description }}</p>
        </div>
        <p class="info">{{ livre.title }}-{{ livre.auth }}</p>
        <div class="op" v-if="type === 'ETUDIANT'">
          <input type="button" class="oBtn" value="Ajouter au panier" v-if="livre.qty > 0" @click="addToCart(livre)">
          <input type="button" class="oBtnC" value="Ajouter au panier" v-else @click="addToCart(livre)">
          <p>Stock : {{ livre.qty }}</p>
        </div>
        <div class="op" v-if="type === 'ADMIN'">
          <input type="button" class="oBtn" value="Supprimer" v-if="type === 'ADMIN'">
          <p>Stock : {{ livre.qty }}</p>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: "Home",
  props: {
    livres: {type: Array, default: []},
    panier: {type: Object},
    isConnected: {type: Boolean},
    type: {type: String},
  },
  data() {
    return {
      badgePanier : 0,
      bookInfo: '',
      bookForCart: {
        id_livre: -1,
        qty: 1
      }
    }
  },
  async mounted() {
    const res = await axios.get('/api/livres')
    this.livres = res.data
  },
  methods: {
    async bookSearch() {
      this.$emit('search', this.bookInfo)
    },

    listView() {
      let elt = this.$el.getElementsByClassName("column");
      for (let i = 0; i < elt.length; i++) {
        elt[i].style.width = "100%";
      }
      var container = document.getElementById("btnContainer");
      var btns = container.getElementsByClassName("btn");
      for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function () {
          var current = document.getElementsByClassName("active");
          current[0].className = current[0].className.replace(" active", "");
          this.className += " active";
        });
      }
    },
    gridView() {
      let elt = this.$el.getElementsByClassName("column");
      for (let i = 0; i < elt.length; i++) {
        elt[i].style.width = "50%";
      }
      var container = document.getElementById("btnContainer");
      var btns = container.getElementsByClassName("btn");
      for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function () {
          var current = document.getElementsByClassName("active");
          current[0].className = current[0].className.replace(" active", "");
          this.className += " active";
        });
      }
    },
    addToCart(livre) {
      this.bookForCart.id_livre = livre.id_livre
      this.$emit('add-book-cart', this.bookForCart)
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

.subDiv {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10%;
}

.column {
  float: left;
  width: 50%;
  padding: 10px;
  border: #004AAD 1px solid;

  /*max-width: 300px;*/
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  margin: auto;
  text-align: center;
  font-family: arial;
}

.info {
  color: #004AAD;
  font-size: 22px;
}

.myBtn {
  border: none;
  color: white;
  padding: 14px 28px;
  cursor: pointer;
  background-color: #000;
}

.myBtn:hover {
  background-color: #004AAD;
}

input[type=text] {
  background-color: #004AAD;
  background-image: url('../assets/search.png');
  background-position: 10px 10px;
  background-repeat: no-repeat;
  /*padding-left: 40px;*/
  color: white;
  border: 3px solid #333;
  border-radius: 4px;
  padding: 12px 40px;
  margin: 8px 0;
  box-sizing: border-box;
}

.img {
  width: 250px;
}

.btn {
  border: none;
  outline: none;
  padding: 12px 16px;
  background-color: #f1f1f1;
  cursor: pointer;
}

.btn:hover {
  background-color: #ddd;
}

.btn.active {
  background-color: #004AAD;
  color: white;
}

.oBtn {
  border: none;
  outline: 0;
  padding: 12px;
  color: white;
  background-color: #000;
  text-align: center;
  cursor: pointer;
  width: 100%;
  font-size: 18px;
}

.oBtnC {
  border: none;
  outline: 0;
  padding: 12px;
  color: white;
  background-color: gray;
  text-align: center;
  cursor: not-allowed;
  width: 100%;
  font-size: 18px;
}

.oBtn:hover {
  opacity: 0.7;
}

.description {
  position: absolute;
  bottom: 0;
  background: rgb(0, 0, 0);
  background: rgba(0, 0, 0, 0.5);
  color: #f1f1f1;
  width: 100%;
  padding: 050px;
}

.book-img {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
}

</style>
