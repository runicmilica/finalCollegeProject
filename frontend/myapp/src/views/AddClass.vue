<template>
    <div>
        <!-- <top-navbar :userData="userData" @update-user="handleDataUpdate"></top-navbar> -->
        <!-- <left-navbar :leftNavbarDataSelection="leftNavbarDataSelection" @update-data-selection="handleDataSelectionUpdate"></left-navbar> -->
        <div class="container-fluid" style="padding-left: 120px;  padding-top: 1rem;">
            <div class="row">
                <div class="column col-8" style="text-align: left; font-size: x-large;">
                    <span>Radni čas</span>
                    <b-button class="abort" @click="abort">Odustani</b-button>
                </div>
                <div class="column col-4">
                    <!-- <button type="button" class="btn change" v-if="showDate != null" @click="addClass">Dodaj čas</button> -->
                </div>
            </div>
            <hr>
            <div class="row">
                <div class="column col-7">
                    <div class="container-fluid">
                        <!-- <div class="row">
                            <div> Nastavna jedinica</div> 
                        </div> -->
                        <div class="row">
                            <span style="color: grey;">Prethodna nastavna jedinica: <span style="font-style: italic;">~{{previousLesson.lesson}}~</span> {{previousLesson.date}}</span> 
                        </div>
                        <div class="row">
                            <span>Nastavna jedinica <span style="color: red;">*</span></span>
                            <textarea v-model="lesson" placeholder="Unesite nastavnu jedinicu..."></textarea>
                        </div>
                        <div class="row">
                            <span>Beleška </span> <br>
                        </div>
                        <div class="row" >
                            <textarea v-model="note" placeholder="Unesite belešku..."></textarea>
                        </div>
                    </div>
                </div>
                
                <div class="column col-5">
                    <div class="card" style="background-color: whitesmoke; overflow: hidden;">
                        <div class="container-fluid">
                            <div class="row">
                                <output>Datum:  {{showDate}}</output>
                            </div>
                            <div class="row">
                                <output>Smena<span style="color: red;">* </span>:</output>
                                <select v-model="shift" style="max-width: 200px; ">
                                    <option v-for="s in shifts" :key="s">{{s}}</option>
                                </select>
                            </div>
                            <div class="row">
                                <output>Redni broj časa u danu<span style="color: red;">* </span>:</output>
                                <select v-model="classNum" style="max-width: 100px; ">
                                    <option v-for="num in classNumbersInDay" :key="num">{{num}}</option>
                                </select>
                            </div>
                            <div class="row">
                                    <b-button :class="toggledBlock"  @click="blockSet = !blockSet" class="blockClass">Blok čas</b-button>
                                    <select v-model="blockNum" v-if="blockSet" style="max-width: 100px; ">
                                        <option v-for="num in blockClassesNum" :key="num">{{num}}</option>
                                    </select>
                            </div>
                            <div class="row">
                                <output>Vrsta časa</output>
                            </div>
                            <div class="row">
                                <div style="display: flex;  flex-wrap: wrap; gap: 10px;">                           
                                    <b-button :class="toggledType(t.id)" class="typeClass" v-for="t in classTypes" :key="t.id" @click="toggleType(t.id)">{{t.name}}</b-button>                            
                                </div>
                            </div>
                            <div class="row" style="display: grid; margin-top: 2rem; margin-bottom: 2rem;">
                                <b-button @click="missingStudents" class="fwdClass">Dalje</b-button>
                                <span style="color: coral;">{{message}}</span>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.fwdClass {
    background-color: #6482AD;
    color: #bbdefb;
    margin-left: 0.75rem;
    margin-right: 0.75rem;
    padding: 0.25rem 0.25rem;
    border-radius: 4px;
    max-width: 100px;    
}

.fwdClass:hover {
    background-color: #bbdefb;
    color: #6482AD;   
}
.abort {
    background-color: #0a3d70;
    color: #bbdefb;
    border: #6482AD;
    margin-left: 0.75rem;
    margin-right: 0.75rem;
    padding: 0.25rem 1rem 0.25rem 1rem;
    border-radius: 4px;
    max-width: 100px;
    font-size: small;
}

.abort:hover {
    background-color: #bbdefb;
    color: #0a3d70;
    border: #6482AD;
    margin-left: 0.75rem;
    margin-right: 0.75rem;
    padding: 0.25rem 1rem 0.25rem 1rem;
    border-radius: 4px;
    max-width: 100px;
    font-size: small;
}
output {
    text-align: left;
    width: auto;
}
.typeClass {
    background-color: #0a3d70;
    color: #bbdefb;
    border: #6482AD;
    margin: 0.25rem;
    padding: 0.125rem 1rem 0.125rem 1rem;
    border-radius: 4px;
   /* display: inline-table;*/
   cursor: pointer;
}
.typeClass:hover  {
    background-color: #bbdefb;
    color: #0a3d70;
    border: #6482AD;
    margin: 0.25rem;
    padding: 0.125rem 1rem 0.125rem 1rem;
}

.blockClass:hover
{
    background-color: #bbdefb;
    color: #0a3d70;
    border: #6482AD;
    margin-left: 0.75rem;
    margin-right: 0.75rem;
    padding: 0 1rem 0 1rem;
}
.blockClass{
    background-color: #0a3d70;
    color: #bbdefb;
    border: #6482AD;
    margin-left: 0.75rem;
    margin-right: 0.75rem;
    padding: 0 1rem 0 1rem;
    border-radius: 4px;
    max-width: 100px;
}
textarea {
    min-width: 100%;
    min-height: 100px;
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

.active {
    background-color: #bbdefb;
    color: #0a3d70;
}
.active:hover {
    background-color: #bbdefb;
    color: #0a3d70;
    font-weight: bolder;
}
</style>

<script>
import axios from 'axios'
// import twas from '../../models/twas.ts'
import '@fortawesome/fontawesome-free/css/all.min.css';
// import { VueToggles, VueTogglesProps } from "vue-toggles";
import {useSharedData} from '../sharedUserData'
const {sharedData, classData} = useSharedData()
export default {
  components: {  },
    name: 'AddClass',
    data() {
        return {
            today: null,
            workingWeek: null,
            showDate:null,
            // showDateDate: null,
            // showDateMonth: null,
            // showDateYear: null,
            uri: 'http://localhost:4000',
            message: '',
            userData: null,
            teachingDay: true,
            classNumbersInDay: [-5, -4, -3, -2, -1, 0, 1 ,2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
            classNum: 1,
            blockClassesNum: [2, 3, 4, 5, 6, 7, 8],
            blockNum: 2,
            blockSet: false,
            classTypes: null,
            note: '',
            lesson: null,
            checkedTypesOfClass: null,
            previousLesson: '',
            shifts: ['prepodnevna', 'poslepodnevna', 'međusmena'],
            shift: 'prepodnevna'
        }
    },
     created() {
//          app.post('/wclass/findPreviousLesson', db.findPreviousLesson)
        // this.userData = JSON.parse(localStorage.getItem('userData'))
        // this.leftNavbarDataSelection = JSON.parse(localStorage.getItem('leftNavbarDataSelection'))
        this.userData = sharedData.value
        console.log("userDAata from addclass: " + this.userData.classId)
        this.showDate = JSON.parse(localStorage.getItem('showDate'))
        this.getClassTypes();
        this.findPreviousLesson()
    },

    methods: {
        async findPreviousLesson() {
            console.log("find previous lesson: " + "idSchYear: " + this.userData.schYearId +", idClass:" +  this.userData.classId + ", idSubject:" + this.userData.subjectId)
            try {
                const response = await axios.post(`${this.uri}/wclass/findPreviousLesson`, {idSchYear: this.userData.schYearId,
                    idClass: this.userData.classId, idSubject: this.userData.subjectId, date: this.showDate})
                //
                console.log(response.data)
                if(response.data.length != 0)
                    this.previousLesson = response.data[0]
                console.log(this.previousLesson)
            } catch(error) {
                this.message = error.response?.data.message || 'An error occurred during findPreviousLesson.';
                console.error('Error during findPreviousLesson:', error);
            }
        },
        abort() {
            this.$router.push({name: 'gradelog'})
        },
        toggleType(id) {
           const ind = this.checkedTypesOfClass.findIndex((element) => element.id == id)
           this.checkedTypesOfClass[ind].checked = !this.checkedTypesOfClass[ind].checked
        },
        async getClassTypes() {
            try {
            const response = await axios.get(`${this.uri}/wclass/getClassTypes`)
            //
            this.classTypes = response.data
            this.checkedTypesOfClass = []
            this.classTypes.forEach(element => {
                this.checkedTypesOfClass.push({id:element.id, checked: false})
            });
            // console.log(this.classTypes[0])
            } catch(error) {
                this.message = error.response?.data.message || 'An error occurred during getClassTypes.';
                console.error('Error during getClassTypes:', error);
            }
        },
        switchBlock() {
            this.blockSet = !this.blockSet
        },
        async missingStudents() {
            // req.body.idSchYear, req.body.number, req.body.date, req.body.idSubject, req.body.idTeacher, 
            // req.body.idClass, req.body.lecture, req.body.currDate, req.body.type, req.type.note
            if(this.userData.schYearId == null || this.classNum == null || this.showDate == null || 
                this.userData.subjectId == null ||  this.lesson == null ) {
                return
            }
            this.message = ''
            let typesForDB = []
            this.checkedTypesOfClass.forEach(element => {
                if(element.checked == true) {
                    typesForDB.push(element.id)
                }
            })
            console.log("idSchYear: " + this.userData.schYearId + ", ord num of class in day: " + this.classNum + ", date" +
                     this.showDate + ", idSubject: " + this.userData.subjectId + ", idTeacher: " + this.userData.user.id +
                     ", idClass: " + this.userData.classId + ", lecture: " + this.lesson + ", currdate: " + (new Date()).toISOString().split('T')[0] +
                     ", note: " + this.note + ", types:" + typesForDB)    
            
             // forward to missing students page
            sharedData.value = this.userData;
            classData.value = {idSchYear: this.userData.schYearId,
            number: this.classNum,
            date: this.showDate,
            idSubject: this.userData.subjectId,
                idTeacher: this.userData.user.id,
                idClass: this.userData.classId,
                lecture: this.lesson,
                currDate: (new Date()).toISOString().split('T')[0],
                type: typesForDB,
                note: this.note,
                blockNum: this.blockSet ? this.blockNum : 0,
                missStud: [],
                notesOnGov: [],
                shift: this.shift
            }
            console.log("shared data from grade log:" + sharedData.value)
            this.$router.push({path: '/homePage/missingstudents'})
                          
        }
        // async showClassesForPickedDay(dayNum) {
        //     if(this.userData.schoolId == null || this.userData.schYearId == null || this.userData.classId == null) {
        //         this.message = 'Izaberite prvo školu, školsku godinu i odeljenje.'
        //         return
        //     }
        //     this.message = ''
        //     this.showDate = this.workingWeek[dayNum]
        //     this.showDateDate = this.showDate.getDate()
        //     this.showDateMonth = this.showDate.getMonth() + 1
        //     this.showDateYear = this.showDate.getFullYear()
        //     // const dateForDb = this.showDateYear + '-' + this.showDateMonth + '-' + this.showDateDate;
        //     const dateForDb = this.showDate.toISOString().split('T')[0];
        //     try {
        //     const response = await axios.post(`${this.uri}/wdays/getWDay`, { idSchYear:this.userData.schYearId, date: dateForDb})
        //     // !!!
        //     this.teachingDay = response.data.teachingDay
        //     console.log('teachingday: ' + this.teachingDay)
        //     } catch(error) {
        //         this.message = error.response?.data.message || 'An error occurred during showClassesForPickedDay.';
        //         console.error('Error during showClassesForPickedDay:', error);
        //     }

        // },
        // async toggleTeachingDay() {
        //     try {
        //     const response = await axios.post(`${this.uri}/wdays/toggleTeachingDay`, { idSchYear:this.userData.schYearId, date: this.showDate.toISOString().split('T')[0]})
        //     //
        //     this.teachingDay = !this.teachingDay
        //     } catch(error) {
        //         this.message = error.response?.data.message || 'An error occurred during toggleTeachingDay.';
        //         console.error('Error during toggleTeachingDay:', error);
        //     }
        // }
    }, computed: {
        toggledType() {
            return (id) => {
               return { active: this.checkedTypesOfClass[this.checkedTypesOfClass.findIndex((element) => element.id == id)].checked }
            }
        },
        toggledBlock() {
            return {
                active: this.blockSet
            }
        }
    }
}
</script>
