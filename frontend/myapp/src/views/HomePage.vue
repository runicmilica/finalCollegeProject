<template>
    <div>
        <top-navbar :userData="userData" @update-user="handleDataUpdate"></top-navbar>
        <!-- <left-navbar :selection="selection" @update-data-selection="selectionUpdate"></left-navbar> -->
        <div id="mySidenav" class="sidenav">
          <router-link class="rt"
            v-for="link in links"
            :key="link.name"
            :to="link.path"
            :class="{ active: isSelected(link.path) }">
          {{ link.name }} <br>
        </router-link>
        </div>
        
        <router-view :userData="userData" @update-user="handleDataUpdate"></router-view>      
        
    </div>
    
</template>

<style scoped>
  

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

  .rt {
    color: #0a3d70;
    font-size: medium;
  }

  .rt:hover {
    color: #e3f2fd;
  }

  .active {
    color:  #e3f2fd;
  }

  .page-content {
    margin-top: 300px; /* Adjust to the height of your navbar */
  }
  
  /* On smaller screens, where height is less than 450px, change the style of the sidenav (less padding and a smaller font size) */
  @media screen and (max-height: 450px) {
    .sidenav {padding-top: 15px;}
    .sidenav button {font-size: 18px;}
  }
</style>

<script>
import topNavbar from '@/components/topNavbar.vue';
import { ref } from 'vue';
import { RouterView } from 'vue-router';
import { useRouter } from 'vue-router';
    export default{
        name: 'homePage',
        components: {topNavbar, RouterView},
        data() {
            return {
                selection: null,
                userData: {}
            }
        }, 
        created() {
          console.log('logged in')
        },
        methods: {
            selectionUpdate(updatedSelection) {
                this.selection = updatedSelection
                // console.log(this.selection)
                if(this.selection === 1) {
                    console.log('here')
                    this.$router.push('homePage/firstPage')
                }
            },
            handleDataUpdate(updatedData) {
                this.userData = updatedData
                console.log(this.userData)
            }
        },
        setup() {
          const router = useRouter();
          const links = ref([
            { name: 'Dnevnik', path: '/homePage/gradelog' },
            { name: 'Imenik', path: '/homePage/studentdata' },
            { name: 'Izveštaj', path: '/homePage/reports' },
            { name: 'Upravljanje', path: '/homePage/settings' },
          ]);

          const isSelected = (path) => router.currentRoute.value.path === path;

          return {
            links,
            isSelected,
          };
        },
    }
</script>