<template>
    <div>
        <div class="container-fluid" style="padding-left: 120px;  padding-top: 1rem;">
            <div class="row">
                <div class="column col-6" style="text-align: left; font-size: x-large;">
                    <span>Dnevnik rada</span>
                </div>
                <div class="column col-6">
                    <!-- <button type="button" class="btn change" v-if="showDate != null && showButtonsForChange && teachingDay == true" @click="addClass">Dodaj čas</button>
                    <button type="button" class="btn change" v-if="showDate != null && showButtonsForChange && teachingDay == true" data-toggle="modal" data-target="#exampleModalCenter">Dodaj neodržan čas</button>
                    <button type="button" class="btn change" v-if="showDate != null && showButtonsForChange" data-toggle="modal" data-target="#exampleModalCenter2">Dodaj napomenu</button> -->
                    <button type="button" class="btn change" v-if="showDate != null  && teachingDay == true" @click="addClass">Dodaj čas</button>
                    <button type="button" class="btn change" v-if="showDate != null  && teachingDay == true" data-toggle="modal" data-target="#exampleModalCenter">Dodaj neodržan čas</button>
                    <button type="button" class="btn change" v-if="showDate != null " data-toggle="modal" data-target="#exampleModalCenter2">Dodaj napomenu</button>
                    <!-- Modal for not held class-->
                        <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered" role="document">
                                <div class="modal-content" style="background-color: #e3f2fd; color: #0a3d70;">
                                    <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLongTitle">Neodržan čas</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                    </div>
                                    <div class="modal-body">
                                        <output>Redni broj časa u danu<span style="color: red;">*</span>:</output>
                                        <select v-model="classNum" style="max-width: 100px; color: #0a3d70;">
                                            <option v-for="num in classNumbersInDay" :key="num">{{num}}</option>
                                        </select>
                                        <br>
                                        <output>Smena<span style="color: red;">* </span>:</output>
                                        <select v-model="shift" style="max-width: 200px; ">
                                            <option v-for="s in shifts" :key="s">{{s}}</option>
                                        </select>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn change" data-dismiss="modal">Odustani</button>
                                        <button type="button" class="btn btn change" @click="addNOClass" data-dismiss="modal">Sačuvaj</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Modal for working day note -->
                        <div class="modal fade" id="exampleModalCenter2" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered" role="document">
                                <div class="modal-content" style="background-color: #e3f2fd; color: #0a3d70;">
                                    <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLongTitle2">Napomena za {{showDate}}</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                    </div>
                                    <div class="modal-body">
                                        <textarea v-model="wdNote" placeholder="Napomena..."></textarea>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn change" data-dismiss="modal">Odustani</button>
                                        <button type="button" class="btn btn change" @click="addWDNote" data-dismiss="modal">Sačuvaj</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
            <hr>
            <div class="row">
                <!-- Working weeks in selected school year -->
                <div class="column col-6">
                    <div class="row" v-for="w in weeksInAYearSoFar" :key="w.number">
                    
                        <div class="card" style="background-color: whitesmoke;">
                            <div class="container-fluid">
                                <div class="row">
                                    <div class="week" style="padding-right: 3rem;"> {{w.number}}. radna nedelja <span style="font-size: small;">({{ w.startDate }} - {{ w.endDate }})</span></div>
                                </div>
                                <div class="row" v-for="o in orderlies" :key="o.number">
                                    <span v-if="o.number == w.number">
                                        <span class="shift">Redari: {{o.firstname1}} {{o.lastname1}}, {{o.firstname2}} {{o.lastname2}}</span>
                                    </span>
                                </div>
                                <div class="row" v-if="message != ''"><span style="color: coral; font-size: small; font-style: italic; padding-left: 1rem;">{{message}}</span></div>
                                <div class="row" style="padding-bottom: 0.5rem;">
                                    <div class="col-1"></div>
                                    <div class="col-2 wd" v-for="d in filteredDays(w.number)" :key="d">
                                        <button type="button" class="btn btn-sm days" @click="showClassesForPickedDay(d.date)">{{ translateDayName(d.day_of_week) }} <br> {{d.date.substr(0,2)}}. {{d.date.substr(3,2)}}.</button>
                                    </div>
                                    <div class="col-1"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Classes in picked day -->
                <div class="column col-6">
                    <div class="card" style="background-color: whitesmoke;" v-if="showDate != null">
                        <div class="container-fluid">
                            <div class="row" style="padding-top: 1rem; padding-bottom: 1rem;">
                                <div class="week">
                                    <span style="display: flex; justify-content: center; font-weight: bold;">{{showDate}}</span> 
                                    <div style="display: flex; justify-content: center; font-size: small; font-style: italic;">{{note}}</div>
                                </div> 
                            </div>
                            <div class="row">
                                <span class="workteachday" style="text-decoration: line-through;padding-right: 2rem;" v-if="teachingDay == false">Nastavni dan
                                    <button type="button" v-if="showButtonsForChange" class="btn btn-extra-sm changePen" @click="toggleTeachingDay"> <i class="fas fa-pen" style="color: aliceblue;"></i></button>
                                </span>
                                <span class="workteachday" v-else style="padding-right: 2rem;">Nastavni dan
                                    <button type="button" v-if="showButtonsForChange" class="btn btn-extra-sm changePen" @click="toggleTeachingDay"> <i class="fas fa-pen" style="color: aliceblue;"></i></button>
                                </span>
                            </div>
                            
                            <!-- CLASSES IN PICKED DAY -->
                            <div class="row" style="padding-top: 0.5rem; padding-bottom: 0.5rem;" v-for="c in classes" :key="c.id">
                                        <hr style="width: 87%; padding-left: 10%;"> 
                                        <div class="column col-2" style="color: #0a3d70;">
                                            {{ c.number }}. čas
                                        </div>
                                        <div class="column col-8" style="color: #0a3d70;">
                                            <span style="color: #6482AD;"> {{ c.name }} </span> <br> 
                                            <span style="font-style: italic; text-shadow: 1px;"> {{ c.lesson }} </span> <br>
                                            <span style="font-size: x-small;">{{c.shift}}</span> <br>
                                            <span class="typeClass" v-for="t in c.types" :key="t"> {{ classTypes.get(t) }}  </span> 
                                            <span v-if="c.held == false" style="font-style: italic;">Neodržan</span>
                                            
                                            <div style="color:grey; font-size: small; padding-left: 0; margin-left: 0;"> {{ c.firstname }} {{ c.lastname }} </div> 
                                        </div>

                                        <div class="column col-2"><button type="button" v-if="showButtonsForChange" class="btn btn-sm delete" @click="deleteClass(c)"><i class="fas fa-trash"></i></button></div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            
        </div>
    </div>
</template>

<style scoped>
.typeClass{
    padding: 0.2rem;
    color: #bbdefb;
}
.d {
    color: #6482AD;
    font-size: small;
}
.btn-extra-sm {
    padding: 0.2rem 0.4rem; /* Adjust padding to make it smaller */
  font-size: 0.75rem;      /* Adjust font size */
  line-height: 1;          /* Adjust line height */
}
.week {
    font-size: medium;
    padding-left: 1rem;
    color: #0a3d70;
}
.shift{
    font-size: small;
    padding-left: 1rem;
    color: #0a3d70;
}
.days{
    color: #6482AD;
    font-size: small;
    background-color: #bbdefb;
    margin: 0.05rem;
    width: 100%;
}

.days:hover {
    background-color: #bbdefb; /* Slightly darker blue on hover */
    color: #0d47a1;
    font-weight: bolder;
}

.change {
    color: #bbdefb; /* Light blue dropdown items */
    border-color: #0a3d70;
    background-color: #6482AD;
    margin: 0.25rem;
}

.change:hover {
    background-color: #bbdefb; /* Slightly darker blue on hover */
    color: #0d47a1;
}

.changePen {
    color: #bbdefb; /* Light blue dropdown items */
    border-color: #0a3d70;
    background-color: #6482AD;
    max-width: 30px;
}

.changePen:hover {
    background-color: #bbdefb; /* Slightly darker blue on hover */
    color: #0d47a1;
}

.delete {
    color: #bbdefb; /* Light blue dropdown items */
    border-color: #0a3d70;
    background-color: #6482AD;
    max-width: 30px;
    max-height: 30px;
}

.delete:hover {
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

.wd {
    padding: 0.125rem;
    
}
</style>

<script>
import axios from 'axios'
// Inside GradeLog.vue
import { useSharedData } from '../sharedUserData';

const { sharedData } = useSharedData();



export default {
    name: 'gradeLog',
    props: {
        userData: {
            type: Object,
            required: true,
            default: null
        }
    },
    watch: {
        userData: {
            deep: true,
        handler() {
            this.showDate = null
            this.getCurrentSchoolYear()
            this.getWeeksAndDays();
            this.getMonitorsForClass()
            this.message = ''
        }
        }
    },
    data() {
        return {
            today: null,
            workingWeek: null,
            showDate:null,
            uri: 'http://localhost:4000',
            classNumbersInDay: [-5, -4, -3, -2, -1, 0, 1 ,2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
            classNum: 1,
            message: '',
            currentYear: null,
            showButtonsForChange: false,
            teachingDay: true,
            note: '',
            classes: [],
            classTypes: new Map(),
            weeksAndDays: [],
            weeksInAYearSoFar: []   ,
            wdNote: null,
            shifts: ['prepodnevna', 'poslepodnevna', 'međusmena'],
            shift: 'prepodnevna',
            orderlies: []
            // userData: {
            //     user : null,
            //     schoolId: null,
            //     schoolName: '',
            //     schYearId:null,
            //     schYear: '',
            //     classId: null,
            //     classYear: '',
            //     classNumber: '',
            //     school_years_for_school: null,
            //     classes: null,
            //     subjects: null,
            //     subjectId: null,
            //     subjectName: ''
            // },   
        }
    },
     created() {
        // console.log(this.userData)
        this.today = new Date(); 
        // console.log("CREATED: " + this.writeUserData())
        // const dayOfWeek = this.today.getDay(); // (0 = Sunday, 1 = Monday, ..., 6 = Saturday)

        // // Calculate the difference from Monday (1)
        // const diffFromMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Sunday (0) should go back to the previous Monday

        // // Calculate the Monday of the current week
        // const monday = new Date(this.today);
        // monday.setDate(this.today.getDate() + diffFromMonday); // Set the date to the Monday of the current week

        // // Calculate the Friday of the current week
        // const friday = new Date(monday);
        // friday.setDate(monday.getDate() + 4); // Add 4 days to Monday to get Friday

        // // Create an array to hold the working week dates
        // this.workingWeek = [];
        // for (let i = 0; i < 5; i++) {
        //     const day = new Date(monday);
        //     day.setDate(monday.getDate() + i);
        //     this.workingWeek.push(day);
        // }
        this.getCurrentSchoolYear()
        this.getClassTypes()
        //app.post('/wclass/findClassesForDate', db.findClassesForDate)

        this.getWeeksAndDays();
        this.getMonitorsForClass();
    },

    methods: {
        async getMonitorsForClass() {
            console.log(this.userData.classId + " " + this.userData.schYearId)
            try {
            const response = await axios.post(`${this.uri}/student/getMonitorsForClass`, {idClass: this.userData.classId, idSchYear: this.userData.schYearId})
            //
            this.orderlies = response.data

            // console.log(this.classTypes[0])
            } catch(error) {
                this.message = error.response?.data.message || 'An error occurred during getMonitorsForClass.';
                console.error('Error during getMonitorsForClass:', error);
            }
        },
        writeUserData() {
            console.log(
                `User: ${this.userData.user}, 
                School ID: ${this.userData.schoolId}, 
                School Name: ${this.userData.schoolName}, 
                School Year ID: ${this.userData.schYearId}, 
                School Year: ${this.userData.schYear}, 
                Class ID: ${this.userData.classId}, 
                Class Year: ${this.userData.classYear}, 
                Class Number: ${this.userData.classNumber}, 
                School Years for School: ${this.userData.school_years_for_school}, 
                Classes: ${this.userData.classes}, 
                Subjects: ${this.userData.subjects}, 
                Subject ID: ${this.userData.subjectId}, 
                Subject Name: ${this.userData.subjectName}`
            );
        },
        getCurrentSchoolYear() {
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth(); // January is 0, December is 11

            // Assuming school year starts in September
            if (currentMonth >= 8) { // Months from September (8) to December (11)
                this.currentYear = `${currentYear}/${currentYear + 1}`;
                
            } else {
                // Months from January (0) to August (7)
                this.currentYear = `${currentYear - 1}/${currentYear}`;
            }
            if(this.userData != null && this.userData.school_years_for_school != null) {
                this.userData.school_years_for_school.forEach(element => {
                    if(element.id == this.userData.schYearId) {
                        if(element.startDate == this.currentYear.split('/')[0] && element.endDate == this.currentYear.split('/')[1]) {
                            this.showButtonsForChange = true
                        } else {
                            this.showButtonsForChange = false
                        }
                    }
                }) 
            }
        },
        filteredDays(week) {
            return this.weeksAndDays.filter(item => item.number === week)
        },
        // handleDataUpdate(updatedData) {
        //     console.log('handleDataUpdate: ' + updatedData)
        //     this.localUserData = updatedData
        //     console.log(this.localUserData)
        // },
        // handleDataSelectionUpdate(updatedData) {
        //     this.leftNavbarDataSelection = updatedData
        //     console.log(this.leftNavbarDataSelection)
        // },
        dateConv(date) {
            let startDay = Number(date.split('-')[2].split('T')[0]) + 1
            if(startDay < 10) startDay = '0' + String(startDay)
            return startDay
        },
        translateDayName(name) {
            switch (name) {
                case 'MON':
                    return "PON"
                case 'TUE':
                    return "UTO"
                case 'WED':
                    return "SRE"
                case 'THU':
                    return "ČET"
                case 'FRI':
                    return "PET"
                default:
                    return "?"
            }
        },
        async getWeeksAndDays() {
            if(this.userData == null || this.userData.schYearId == null) return
            try {
                const response = await axios.post(`${this.uri}/wweek/getWeeksAndDays`, { idSchYear:this.userData.schYearId})
                this.weeksAndDays = response.data
                // console.log(this.weeksAndDays)
                // this.weeksAndDays.forEach(element => {
                //     const d = element.date
                //     let day = Number(d.split('-')[2].split('T')[0]) + 1
                //     if(day < 10) day = '0' + String(day)
                //     element.date = day + '-' + d.split('-')[1] + '-' + d.split('-')[0]
                // })
                let i = 0;
                let week = 0;
                this.weeksInAYearSoFar = []
                this.classes = []
                for(let j = 0; j < this.weeksAndDays.length; j++) {
                    if(this.weeksAndDays[j].number != week) {
                        // const startDate = this.weeksAndDays[j].date
                        // const endDate = this.weeksAndDays.length > j + 4 ? this.weeksAndDays[j + 4].date : null
                        // let startDay = Number(startDate.split('-')[2].split('T')[0]) + 1
                        // if(startDay < 10) startDay = '0' + String(startDay)
                        // // console.log('startday: ' + startDay)
                        // let endDay
                        // if(this.weeksAndDays.length > j + 4) {
                        //     endDay = Number(endDate.split('-')[2].split('T')[0]) + 1
                        //     if(endDay < 10) endDay = '0' + String(endDay)
                        // }
                        // console.log(this.weeksAndDays[j].date)
                        this.weeksInAYearSoFar[i++] = {number: this.weeksAndDays[j].number, day_of_week: this.weeksAndDays[j].day_of_week, startDate: this.weeksAndDays[j].date, endDate: this.weeksAndDays.length > j + 4 ? this.weeksAndDays[j + 4].date : null};
                        // console.log("week: " + this.weeksInAYearSoFar[i-1].number + " " + this.weeksInAYearSoFar[i-1].startDate + " " + this.weeksInAYearSoFar[i-1].endDate)  
                        week = this.weeksAndDays[j].number
                    }
                    if(i > 0 && this.weeksInAYearSoFar[i - 1].endDate == null) {
                        // const endDate = this.weeksAndDays[j].date
                        // // console.log("endDAte: " + endDate)
                        // let endDay = Number(endDate.split('-')[2].split('T')[0]) + 1
                        // if(endDay < 10) endDay = '0' + String(endDay)
                        this.weeksInAYearSoFar[i - 1].endDate = this.weeksAndDays[j].date
                    }
                }

            } catch(error) {
                this.message = error.response?.data.message || 'An error occurred during getWeeksAndDays.';
                console.error('Error during getWeeksAndDays:', error);
            }
        },
        async getClassTypes() {
            try {
            const response = await axios.get(`${this.uri}/wclass/getClassTypes`)
            //
            response.data.forEach(element => {
                this.classTypes.set(element.id, element.name)
            });

            // console.log(this.classTypes[0])
            } catch(error) {
                this.message = error.response?.data.message || 'An error occurred during getClassTypes.';
                console.error('Error during getClassTypes:', error);
            }
        },
        async findClassesForDate() {
            console.log("findClassesForDate: " + "idSchYear:" +this.userData.schYearId+", date:"+ this.showDate+", idClass:" +this.userData.classId)
            try {
            const response = await axios.post(`${this.uri}/wclass/findClassesForDate`, { idSchYear:this.userData.schYearId, date: this.showDate, idClass: this.userData.classId})
            this.classes = response.data
            } catch(error) {
                this.message = error.response?.data.message || 'An error occurred during findClassesForDate.';
                console.error('Error during findClassesForDate:', error);
            }
        },
        async showClassesForPickedDay(dayNum) {
            if(this.userData == null || this.userData.schoolId == null || this.userData.schYearId == null || this.userData.classId == null) {
                this.message = 'Izaberite prvo školu, školsku godinu i odeljenje.'
                return
            }
            // let d = new Date()
            // console.log(dayNum.substr(0,2) + "." + dayNum.substr(3,2)+ "." + dayNum.substr(6,10))
            // d.setDate(dayNum.substr(0,2))
            // d.setDate(dayNum.substr(3,2))
            // d.setDate(dayNum.substr(6,10))
            
            // console.log("d: " + d)
            this.message = ''
            const dateForDb = dayNum.substr(6,10) + "-" + dayNum.substr(3,2) + "-" +  dayNum.substr(0,2) 
            this.showDate = dateForDb
            this.findClassesForDate()
            try {
            const response = await axios.post(`${this.uri}/wdays/getWDay`, { idSchYear:this.userData.schYearId, date: dateForDb})
            // !!!
            this.teachingDay = response.data.teachingDay
            this.note = response.data.note
           //  console.log('teachingday: ' + this.teachingDay)
            } catch(error) {
                this.message = error.response?.data.message || 'An error occurred during showClassesForPickedDay.';
                console.error('Error during showClassesForPickedDay:', error);
            }

        },
        async toggleTeachingDay() {
            try {
            await axios.post(`${this.uri}/wdays/toggleTeachingDay`, { idSchYear:this.userData.schYearId, date: this.showDate})
            //
            this.teachingDay = !this.teachingDay
            } catch(error) {
                this.message = error.response?.data.message || 'An error occurred during toggleTeachingDay.';
                console.error('Error during toggleTeachingDay:', error);
            }
        },
        checkDateBeforeCurrentDate(showDate) {
            const showDateObj = new Date(showDate)
            const currentDate = new Date();

            showDateObj.setHours(0, 0, 0, 0);
            currentDate.setHours(0, 0, 0, 0);
            console.log("HERE:" + showDateObj + ":" + currentDate + ":" + (showDateObj <= currentDate))
            return showDateObj <= currentDate
        },
        addClass() {
            if(this.userData.subjectId == null) {
                this.message = 'Odaberite predmet'
                return
            }
            if(this.checkDateBeforeCurrentDate(this.showDate) === false) {
                this.message = 'Ne možete uneti čas pre nego što je održan.'
                return
            }
            this.message = ''
            localStorage.setItem('userData', JSON.stringify(this.userData))
            // localStorage.setItem('leftNavbarDataSelection', JSON.stringify(this.leftNavbarDataSelection))
            localStorage.setItem('showDate', JSON.stringify(this.showDate))
            sharedData.value = this.userData;
            console.log("shared data from grade log:" + sharedData.value)
            this.$router.push({path: '/homePage/addClass'})
        },
        async deleteClass(c) {
            // delete class and also missing students from that class
            try {
                await axios.post(`${this.uri}/wclass/deleteMissStudAndWclass`, { id: c.id})
                this.classes = this.classes.filter(element => element.id !== c.id);
            } catch(error) {
                this.message = error.response?.data.message || 'An error occurred during deleteClass.';
                console.error('Error during deleteClass:', error);
            }
        },
        async addNOClass() {
            // delete class and also missing students from that class
            if(this.userData == null || this.userData.schoolId == null || this.userData.schYearId == null || this.userData.classId == null || this.userData.subjectId == null) {
                this.message = 'Izaberite prvo školu, školsku godinu, odeljenje i predmet.'
                return
            }
            if(this.checkDateBeforeCurrentDate(this.showDate) === false) {
                this.message = 'Ne možete uneti čas pre nego što je održan.'
                return
            }
            try {
                console.log("HERE 1")
                console.log(this.userData.schYearId + " " +
                    "number:" + this.classNum + " " +
                    "date:" + this.showDate+ " " +
                    "idSubject:"+ this.userData.subjectId+ " " +
                    "idTeacher:"+ this.userData.user.id+ " " +
                    "idClass: "+this.userData.classId+ " " +
                    "currDate:"+ (new Date()).toISOString().split('T')[0])
                 await axios.post(`${this.uri}/wclass/insertNotHeldClass`, {
                    idSchYear: this.userData.schYearId,
                    number: this.classNum,
                    date: this.showDate,
                    idSubject: this.userData.subjectId,
                    idTeacher: this.userData.user.id,
                    idClass: this.userData.classId,
                    currDate: (new Date()).toISOString().split('T')[0],
                    shift: this.shift
                })
                // dayNum.substr(6,10) + "-" + dayNum.substr(3,2) + "-" +  dayNum.substr(0,2)
                // this.classes.push(response.data)
                console.log("here: " + this.showDate.substr(8,2) + "-" + this.showDate.substr(5,2) + "-" +  this.showDate.substr(0,4))
                this.showClassesForPickedDay(this.showDate.substr(8,2) + "-" + this.showDate.substr(5,2) + "-" +  this.showDate.substr(0,4))
            } catch(error) {
                this.message = error.response?.data.message || 'An error occurred during addNOClass.';
                console.error('Error during addNOClass:', error);
            }
        },
        async addWDNote() {
            if(this.wdNote == null || this.userData.schYearId == null || this.showDate == null) {
                this.message = "Unesite napomenu, odaberite školsku godinu i datum."
                return
            }
            this.message = ''
            try {
                await axios.post(`${this.uri}/wdays/updateNote`, { idSchYear: this.userData.schYearId, date: this.showDate, note: this.wdNote})
                this.note = this.wdNote
                this.wdNote = null
            } catch(error) {
                this.message = error.response?.data.message || 'An error occurred during updateNote.';
                console.error('Error during updateNote:', error);
            }

        }
    }
}
</script>
