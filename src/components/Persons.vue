<script>
export default {
  data() {
    return {
      names: [],
      showDialog: false,
      newPerson: "",
    }
  },
  methods: {
    addPerson() {
      this.showDialog = false;
      this.names.push(this.newPerson);
      this.newPerson = "";
    }
  }
}
</script>

<template>
  <div id="addPersonDialog" v-show="showDialog">
    <input v-model="newPerson">
    <div v-show="this.newPerson" @click="addPerson()">Add person</div>
  </div>
  <img @click="showDialog = true" id="addPerson" src="../assets/person_add_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg" alt="add person">
  <ul>
    <li v-for="name in this.names" :key="name">
    {{ name  }}
    </li>
  </ul>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

#addPerson {
  height: 5vw;
  width: 5vw;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
