<template>
    <div id="mySidenav" class="sidenav">
        <button type="button" v-if="localSelection == 1" class="btn btn-sm active" @click="showGradeLog">Dnevnik</button>
        <button type="button" v-else class="btn btn-sm"  @click="showGradeLog">Dnevnik</button>
        <button type="button" v-if="localSelection == 2" class="btn btn-sm active" @click="showStudentData">Imenik</button>
        <button type="button" v-else class="btn btn-sm"  @click="showStudentData">Imenik</button>
        <button type="button" v-if="localSelection == 3" class="btn btn-sm active" @click="showReports">Izveštaji</button>
        <button type="button" v-else class="btn btn-sm"  @click="showReports">Izveštaji</button>
        <button type="button" v-if="localSelection == 4" class="btn btn-sm active" @click="showSettings">Podešavanja</button>
        <button type="button" v-else class="btn btn-sm"  @click="showSettings">Podešavanja</button>
        
    </div>
  </template>

  <style scoped>
/* The sidenav */

  button {
    width: 95%;
  }

  .sidenav {
    height: 100%;
    width: 100px;
    position: fixed;
    z-index: 1;
    top: 10;
    left: 0;
    background-color: #6482AD;
    overflow-x: hidden;
    padding-top: 20px;
  }

  .active {
    background-color:  #e3f2fd;
  }
  .active:hover {
    color: #e3f2fd;
  }

  .inactive:hover {
    color: #e3f2fd;
  }
  
  /* On smaller screens, where height is less than 450px, change the style of the sidenav (less padding and a smaller font size) */
  @media screen and (max-height: 450px) {
    .sidenav {padding-top: 15px;}
    .sidenav button {font-size: 18px;}
  }
  </style>

  <script>
  export default {
    name: 'LeftNavbar',
    props: {
      selection: {
            type: Number,
            default: null
      },

    },
    data() {
      return{
        localSelection: this.selection
      }
    },
    methods: {
      updateData() {
        this.$emit('update-data-selection', this.localSelection)
      },
      showGradeLog() {
        this.localSelection = 1
        this.updateData()
      },
      showStudentData() {
        this.localSelection = 2
        this.updateData()
      }, 
      showReports() {
        this.localSelection = 3
        this.updateData()
      },
      showSettings() {
        this.localSelection = 4
        this.updateData()
      }
    }
  };
  </script>
  