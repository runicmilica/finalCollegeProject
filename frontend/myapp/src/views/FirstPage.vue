<template>
    <div>
        <div class="container-fluid" style="padding-left: 120px;  padding-top: 1rem;" v-if="leftNavbarDataSelection.gradeLog">
            <div class="row">
                <div class="column col-8" style="text-align: left; font-size: x-large;">
                    <span>Dnevnik rada</span>
                </div>
                <div class="column col-4">
                    <button type="button" class="btn change" v-if="showDate != null" @click="addClass">Dodaj čas</button>
                </div>
            </div>
            <hr>
            <div class="row">
                <div class="column col-6">
                    <div class="card" style="background-color: whitesmoke;">
                        <div class="container-fluid">
                            <div class="row">
                                <div class="week"> Radna nedelja ({{workingWeek[0].getDate()}}.{{workingWeek[0].getMonth() + 1}}. - {{workingWeek[4].getDate()}}.{{workingWeek[4].getMonth() + 1}}.)</div>
                                
                            </div>
                            <div class="row"><span class="shift">prepodnevna - Redari: </span></div>
                            <div class="row" v-if="message != ''"><span style="color: coral; font-size: small; font-style: italic; padding-left: 1rem;">{{message}}</span></div>
                            <div class="row" style="padding-top: 0.5rem; padding-bottom: 0.5rem;">
                                <div class="col-1"></div>
                                <div class="col-2 days" @click="showClassesForPickedDay(0)"> Pon. {{workingWeek[0].getDate()}}.{{workingWeek[0].getMonth() + 1}}.</div>
                                <div class="col-2 days" @click="showClassesForPickedDay(1)"> Uto. {{workingWeek[1].getDate()}}.{{workingWeek[1].getMonth() + 1}}.</div>
                                <div class="col-2 days" @click="showClassesForPickedDay(2)"> Sre. {{workingWeek[2].getDate()}}.{{workingWeek[2].getMonth() + 1}}.</div>
                                <div class="col-2 days" @click="showClassesForPickedDay(3)"> Čet. {{workingWeek[3].getDate()}}.{{workingWeek[3].getMonth() + 1}}.</div>
                                <div class="col-2 days" @click="showClassesForPickedDay(4)"> Pet. {{workingWeek[4].getDate()}}.{{workingWeek[4].getMonth() + 1}}.</div>
                                <div class="col-1 days"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="column col-6">
                    <div class="card" style="background-color: whitesmoke;" v-if="showDate != null">
                        <div class="container-fluid">
                            <div class="row" style="padding-top: 1rem; padding-bottom: 1rem;">
                                <div class="week">
                                    <span style="padding-right: 3rem;">{{showDateDate}}.{{showDateMonth}}.{{showDateYear}}.</span> 
                                </div>
                            </div>
                            <div class="row">
                                <span class="workteachday" style="text-decoration: line-through;padding-right: 2rem;" v-if="teachingDay == false">Nastavni dan</span>
                                <span class="workteachday" v-else style="padding-right: 2rem;">Nastavni dan</span>
                                <button type="button" class="btn btn-light btn-extra-sm change" @click="toggleTeachingDay"> <i class="fas fa-pen" style="color: aliceblue;"></i></button>
                                
                            </div>
                            <!-- <div class="row" style="padding-top: 0.5rem; padding-bottom: 0.5rem;" v-for="c in classes" :key="c.id">
                                <div class="column col-3"></div>
                                <div class="column col-9"></div>
                            </div> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.btn-extra-sm {
    padding: 0.2rem 0.4rem; /* Adjust padding to make it smaller */
  font-size: 0.75rem;      /* Adjust font size */
  line-height: 1;          /* Adjust line height */
}
.week {
    font-size: x-large;
    padding-left: 1rem;
    color: #0a3d70;
}
.shift{
    font-size: large;
    padding-left: 1rem;
    color: #0a3d70;
}
.days{
    color: #6482AD;
}

.days:hover {
    background-color: #bbdefb; /* Slightly darker blue on hover */
    color: #0d47a1;
}

.change {
    color: #bbdefb; /* Light blue dropdown items */
    border-color: #0a3d70;
    background-color: #6482AD;
}

.change:hover {
    background-color: #bbdefb; /* Slightly darker blue on hover */
    color: #0d47a1;
}

.workteachday{
    font-size: medium;
    font-style: italic;
    color: #6482AD;
    padding-left: 1rem;
    padding-top: 0.5rem;
}
</style>

<script>
import axios from 'axios'
// import twas from '../../models/twas.ts'
// import topNavbar from '@/components/topNavbar.vue';
// import leftNavbar from '@/components/leftNavbar.vue';
import '@fortawesome/fontawesome-free/css/all.min.css';


export default {
  components: {   },
    name: 'firstPage',
    data() {
        return {
            today: null,
            workingWeek: null,
            showDate:null,
            showDateDate: null,
            showDateMonth: null,
            showDateYear: null,
            uri: 'http://localhost:4000',
            message: '',
            userData: {
                user : null,
                schoolId: null,
                schoolName: '',
                schYearId:null,
                schYear: '',
                classId: null,
                classYear: '',
                classNumber: '',
                school_years_for_school: null,
                classes: null,
                subjects: null,
                subjectId: null,
                subjectName: ''
            },
            teachingDay: true,
            leftNavbarDataSelection: {
                gradeLog: false,
                studentsData: false,
                reports: false,
                settings: false
            }
            
        }
    },
     created() {
        console.log("FIRST PAGE")
        this.today = new Date(); 
        const dayOfWeek = this.today.getDay(); // (0 = Sunday, 1 = Monday, ..., 6 = Saturday)

        // Calculate the difference from Monday (1)
        const diffFromMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Sunday (0) should go back to the previous Monday

        // Calculate the Monday of the current week
        const monday = new Date(this.today);
        monday.setDate(this.today.getDate() + diffFromMonday); // Set the date to the Monday of the current week

        // Calculate the Friday of the current week
        const friday = new Date(monday);
        friday.setDate(monday.getDate() + 4); // Add 4 days to Monday to get Friday

        // Create an array to hold the working week dates
        this.workingWeek = [];
        for (let i = 0; i < 5; i++) {
            const day = new Date(monday);
            day.setDate(monday.getDate() + i);
            this.workingWeek.push(day);
        }
    },

    methods: {
        handleDataUpdate(updatedData) {
            console.log('handleDataUpdate: ' + updatedData)
            this.userData = updatedData
            console.log(this.userData)
        },
        handleDataSelectionUpdate(updatedData) {
            this.leftNavbarDataSelection = updatedData
            console.log(this.leftNavbarDataSelection)
        },
        async showClassesForPickedDay(dayNum) {
            if(this.userData.schoolId == null || this.userData.schYearId == null || this.userData.classId == null) {
                this.message = 'Izaberite prvo školu, školsku godinu i odeljenje.'
                return
            }
            this.message = ''
            this.showDate = this.workingWeek[dayNum]
            this.showDateDate = this.showDate.getDate()
            this.showDateMonth = this.showDate.getMonth() + 1
            this.showDateYear = this.showDate.getFullYear()
            // const dateForDb = this.showDateYear + '-' + this.showDateMonth + '-' + this.showDateDate;
            const dateForDb = this.showDate.toISOString().split('T')[0];
            try {
            const response = await axios.post(`${this.uri}/wdays/getWDay`, { idSchYear:this.userData.schYearId, date: dateForDb})
            // !!!
            this.teachingDay = response.data.teachingDay
            console.log('teachingday: ' + this.teachingDay)
            } catch(error) {
                this.message = error.response?.data.message || 'An error occurred during showClassesForPickedDay.';
                console.error('Error during showClassesForPickedDay:', error);
            }

        },
        async toggleTeachingDay() {
            try {
            await axios.post(`${this.uri}/wdays/toggleTeachingDay`, { idSchYear:this.userData.schYearId, date: this.showDate.toISOString().split('T')[0]})
            //
            this.teachingDay = !this.teachingDay
            } catch(error) {
                this.message = error.response?.data.message || 'An error occurred during toggleTeachingDay.';
                console.error('Error during toggleTeachingDay:', error);
            }
        },
        addClass() {
            if(this.userData.subjectId == null) {
                this.message = 'Odaberite predmet'
                return
            }
            localStorage.setItem('userData', JSON.stringify(this.userData))
            localStorage.setItem('leftNavbarDataSelection', JSON.stringify(this.leftNavbarDataSelection))
            localStorage.setItem('showDate', JSON.stringify(this.showDate.toISOString().split('T')[0]))
            this.$router.push('/addClass')
        }
    }
}
</script>
