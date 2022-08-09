<template>

  <div class="container">
    <img src="../assets/main.png">
    <p>Type a keyword and check the fake news about it! <br>Let's start</p>
    <form @submit.prevent="factCheck()" class="searchForm">
      <input type="text" placeholder="ex: Coronavirus" class="searchInput" v-model="keyword">
      <button type="submit" class="btnPrimary">Check</button>
    </form>
  </div>
</template>

<script>


module.exports = {
  name: "Home",
  data() {
    return {
      keyword: '',
    }
  },

  methods: {
    async factCheck() {
      this.$emit('search', this.keyword)
    },
  },

}
</script>

<style scoped>
.container {
  margin: 5%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

* {
  box-sizing: border-box;
}


.searchInput {
  /*border: none;*/
  border: 2px solid #5e17eb;
  border-radius: 25px;
  background-color: white;
  background-image: url('../assets/search.png');
  background-position: 10px 10px;
  background-repeat: no-repeat;
  padding-left: 40px;
  width: 75%;
  margin: 8px 0;
  box-sizing: border-box;
  font-size: 32px;
}

.searchForm {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
}

</style>
