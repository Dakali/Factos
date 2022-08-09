<template>
  <div class="container">
    <h1>Facts explorer</h1>
    <hr>
    <div class="subDiv">
      <router-link to="/">Nouvelle recherche</router-link>
    </div>
    <hr>
    <div id="btnContainer1">
      <button class="btn" @click="listView()"><i class="fa fa-bars"></i> List</button>
      <button class="btn active" @click="gridView()"><i class="fa fa-th-large"></i> Grid</button>
    </div>
    <br>
    <div class="row">
      <article v-for="r in searchResult" :key="r.claimReview[0].title" class="column">
<!--        <div class="book-img">-->
<!--          <img :srcset="r.img">-->
<!--        </div>-->
        <p class="info">TITRE : {{ r.claimReview[0].title}}</p>
        <p class="info">Auteur : {{ r.claimReview[0].publisher.name }}</p>
        <p class="description">Description : {{ r.text }}</p>
        <p class="description">Statut : {{ r.claimReview[0].textualRating }}</p>
        <p class="description">Source : {{ r.claimReview[0].url }}</p>

      </article>
    </div>
  </div>

</template>

<script>
module.exports = {
  name: "SearchR",

  data() {
    return {
      searchResult: [],
    }
  },
  created() {
    this.searchResult = this.$route.params.data
  },
  async mounted() {
  },
  methods: {
    listView() {
      let elt = this.$el.getElementsByClassName("column");
      for (let i = 0; i < elt.length; i++) {
        elt[i].style.width = "100%";
      }
      var container = document.getElementById("btnContainer1");
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
      var container = document.getElementById("btnContainer1");
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
.subDiv , .op{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
* {
  box-sizing: border-box;
}

.column {
  float: left;
  width: 50%;
  padding: 10px;
  border: #5e17eb 1px solid;
}


/* Style des buttons */
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
  background-color: #5e17eb;
  color: white;
}


</style>