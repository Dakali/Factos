<template>
  <div v-if="isConnected" class="container">
    {{ isConnected }}{{ type }}


      <div class="subDiv">
        <h1>Notre Catalogue</h1>
        <form @submit.prevent="bookSearch()" style="float: right">
          <input type="text" placeholder="search" name="search" v-model="bookInfo">
          <input type="submit">
        </form>
      </div>
      <input type="button" value="ajouter un livre au catalogue" v-if="type === 'ADMIN'">
      <div id="btnContainer">
        <button class="btn" @click="listView()"><i class="fa fa-bars"></i> List</button>
        <button class="btn active" @click="gridView()"><i class="fa fa-th-large"></i> Grid</button>
      </div>
      <br>
      <div>
        <article v-for="livre in livres" :key="livre.id" class="column">
          <div class="book-img">
            <img :srcset="livre.img">
          </div>
          <p class="info">{{ livre.title }}-{{ livre.auth }}</p>
          <p class="info">{{ livre.auth }}</p>
          <p class="description">{{ livre.description }}</p>
          <div class="op">
            <input type="button" value="Ajouter au panier" v-if="type === 'ETUDIANT'">
            <input type="button" value="Supprimer" v-if="type === 'ADMIN'">
            <p>Stock : {{ livre.qty }}</p>
          </div>
        </article>
      </div>



    <!--    <h1>Notre Catalogue de livres</h1>-->
    <!--    <article v-for="livre in livres" :key="livre.id" class="card">-->
    <!--      <div  class="book-img">-->
    <!--        <img  :srcset="livre.img">-->
    <!--      </div>-->
    <!--      <p class="info">{{ livre.title }}-{{ livre.auth }}</p>-->
    <!--      <p class="info">{{ livre.auth }}</p>-->
    <!--      <p class="description">{{ livre.description }}</p>-->
    <!--      <div class="op">-->
    <!--        <input type="button" value="Emprunter">-->
    <!--        <p>Stock : {{ livre.qty }}</p>-->
    <!--      </div>-->
    <!--    </article>-->


    <!--    <div class="card-content">-->
    <!--      <div class="article-img">-->
    <!--        <div :style="{ backgroundImage: 'url(' + livre.img + ')' }" class="img">-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <div class="article-content" v-if="editingArticle.id !== livre.id">-->
    <!--        <div class="article-title">-->
    <!--          <h2>{{ livre.title }}</h2>-->
    <!--          <h4>{{ livre.auth }}</h4>-->
    <!--        </div>-->
    <!--        <p>{{ livre.description }}</p>-->
    <!--        <div class="options">-->
    <!--          <span>Emprunter</span>-->
    <!--          &lt;!&ndash;              <button @click="deleteArticle(livre.id_livre)">Supprimer</button>&ndash;&gt;-->
    <!--          &lt;!&ndash;              <button @click="editArticle(livre)">Modifier</button>&ndash;&gt;-->
    <!--        </div>-->
    <!--        <p>qte : {{ livre.qty }}</p>-->
    <!--      </div>-->
    <!--      &lt;!&ndash;        <div class="article-content" v-else>&ndash;&gt;-->
    <!--      &lt;!&ndash;          <div class="article-title">&ndash;&gt;-->
    <!--      &lt;!&ndash;            <h2><input type="text" v-model="editingArticle.name"> - <input type="number" v-model="editingArticle.price"></h2>&ndash;&gt;-->
    <!--      &lt;!&ndash;            <div>&ndash;&gt;-->
    <!--      &lt;!&ndash;              <button @click="sendEditArticle()">Valider</button>&ndash;&gt;-->
    <!--      &lt;!&ndash;              <button @click="abortEditArticle()">Annuler</button>&ndash;&gt;-->
    <!--      &lt;!&ndash;            </div>&ndash;&gt;-->
    <!--      &lt;!&ndash;          </div>&ndash;&gt;-->
    <!--      &lt;!&ndash;          <p><textarea v-model="editingArticle.description"></textarea></p>&ndash;&gt;-->
    <!--      &lt;!&ndash;          <input type="text" v-model="editingArticle.image" placeholder="Lien vers l'image">&ndash;&gt;-->
    <!--      &lt;!&ndash;        </div>&ndash;&gt;-->
    <!--    </div>-->


    <!--    <form @submit.prevent="addArticle">-->
    <!--      <h2>Nouveau produit à ajouter</h2>-->
    <!--      <input type="text" v-model="newArticle.name" placeholder="Nom du produit" required>-->
    <!--      <input type="number" v-model="newArticle.price" placeholder="Prix" required>-->
    <!--      <textarea type="text" v-model="newArticle.description" required></textarea>-->
    <!--      <input type="text" v-model="newArticle.image" placeholder="Lien vers l'image">-->
    <!--      <button type="submit">Ajouter</button>-->
    <!--    </form>-->
  </div>
</template>

<script>
module.exports = {
  props: {
    livres: {type: Array, default: []},
    panier: {type: Object},
    isConnected: {type: Boolean},
    type: {type: String},
  },
  data() {
    return {
      newArticle: {
        name: '',
        description: '',
        image: '',
        price: 0
      },
      editingArticle: {
        id: -1,
        name: '',
        description: '',
        image: '',
        price: 0
      },
      bookInfo: '',
    }
  },
  methods: {
    async bookSearch() {
      this.$emit('search', this.bookInfo)
    },
    addArticle() {
      this.$emit('add-article', this.newArticle)
    },
    deleteArticle(articleId) {
      this.$emit('delete-article', articleId)
    },
    editArticle(article) {
      this.editingArticle.id = article.id
      this.editingArticle.name = article.name
      this.editingArticle.description = article.description
      this.editingArticle.image = article.image
      this.editingArticle.price = article.price
    },
    sendEditArticle() {
      this.$emit('update-article', this.editingArticle)
      this.abortEditArticle()
    },
    abortEditArticle() {
      this.editingArticle = {
        id: -1,
        name: '',
        description: '',
        image: '',
        price: 0
      }
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

  }
}
</script>

<style scoped>
.container{
  margin: 5%;
}
* {
  box-sizing: border-box;
}

.subDiv{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.column {
  float: left;
  width: 50%;
  padding: 10px;
  border: #004AAD 1px solid;
}


input[type=text] {
  background-color: #004AAD;
  background-image: url('../assets/search.png');
  background-position: 10px 10px;
  background-repeat: no-repeat;
  /*padding-left: 40px;*/
  color: white;
  border: 3px solid #004AAD;
  border-radius: 4px;
  padding: 12px 40px;
  margin: 8px 0;
  box-sizing: border-box;
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


</style>
