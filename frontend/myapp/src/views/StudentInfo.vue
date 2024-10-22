<template>
    <div>
        <!-- Modal for adding grade -->
        <div class="modal fade" id="gradeModal" tabindex="-1" role="dialog" aria-labelledby="gradeModalTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content" style="background-color: #e3f2fd; color: #0a3d70;">
                    <div class="modal-header">
                    <h5 class="modal-title" id="gradeModalLongTitle">Ocenjivanje</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    </div>
                    <div class="modal-body w-100 d-flex flex-column align-items-center">
                        <div class="d-flex flex-column align-items-center">
                          <output>Ocena<span style="color: red;">*</span>:</output>
                          <select v-model="grade" style="max-width: 100px; color: #0a3d70;">
                            <option v-for="grade in gradingType.values" :key="grade">{{ grade }}</option>
                          </select>
                          <br>
                          <output v-if="gradingType.id == 1">Vrsta ocene<span style="color: red;">* </span>:</output>
                          <select v-model="gradeType" style="max-width: 200px;" v-if="gradingType.id == 1">
                            <option v-for="g in gradeTypes" :key="g" :value="g.id">{{ g.value }}</option>
                          </select>
                          <br>
                          <output>Datum<span style="color: red;">*</span>:</output>
                          <div><input type="date" v-model="gradeDate"></div>
                          <br>
                          <output>Beleška:</output>
                          <div><textarea v-model="gradeNote"></textarea></div>
                          <output>{{message}}</output>
                        </div>
                      </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn change" data-dismiss="modal">Odustani</button>
                        <button type="button" class="btn btn change"  data-dismiss="modal" @click="addGrade">Sačuvaj</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="row" style=" padding-left: 120px;  padding-top: 1rem;">
            <div class="column col-6" style="text-align: left; font-size: x-large;">
                <span>Podaci o učeniku</span>
            </div>
            <div class="column col-6"></div>
        </div>
        <hr style="width: 90%; margin-left: 120px;">
        <div class="card" style="padding-left: 120px;  padding-top: 1rem; background-color: #F5EDED; border: 0;"> 
            <div class="container container-fluid">
                
                <div class="row">
                    <!-- LEFT PART OF THE CARD -->
                    <div class="column col-3"> 
                        <div class="row">
                            <div class="nopad" style="font-size: xx-large;">{{studentInfo.firstname}} {{studentInfo.lastname}} <br>
                                <span style="font-size: small;">[{{ studentInfo.jmbg }}]</span>
                            </div>
                        </div>
                        <div class="row">
                        <div class="nopad" style="margin-top: 1rem;"> 
                                <button v-if="studentInfo.listen && showButtonsForChange" type="button" class="btn btn-sm addgrade" data-toggle="modal" data-target="#gradeModal">Dodaj ocenu</button>
                                <span style="color:coral; font-style: italic; font-size: x-small;"><br>{{message}}</span>
                        </div>
                        </div>
                        
                    </div>
                    <!-- RIGHT PART OF THE CARD -->
                <div class="column col-9">
                    <div class="row">
                        <ul class="nav nav-tabs" id="myTab" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" id="grade-tab" data-toggle="tab" data-target="#grade-tab-pane" type="button" role="tab" aria-controls="grade-tab-pane" aria-selected="true">
                                    Ocene
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="absences-tab" data-toggle="tab" data-target="#absences-tab-pane" type="button" role="tab" aria-controls="absences-tab-pane" aria-selected="false">
                                    Izostanci
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="governance-tab" data-toggle="tab" data-target="#governance-tab-pane" type="button" role="tab" aria-controls="governance-tab-pane" aria-selected="false">
                                    Vladanje
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="contact-tab" data-toggle="tab" data-target="#contact-tab-pane" type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="false">
                                    Kontakti
                                </button>
                            </li>
                            <li class="nav-item" role="presentation" v-if="userData.user.id === studentInfo.headTeacher.id">
                                <button class="nav-link" id="subject-tab" data-toggle="tab" data-target="#subject-tab-pane" type="button" role="tab" aria-controls="subject-tab-pane" aria-selected="false">
                                    Predmeti
                                </button>
                            </li>
                            <li class="nav-item" role="presentation" v-if="userData.user.id === studentInfo.headTeacher.id">
                                <button class="nav-link" id="success-tab" data-toggle="tab" data-target="#success-tab-pane" type="button" role="tab" aria-controls="success-tab-pane" aria-selected="false">
                                    Uspeh
                                </button>
                            </li>
                            <li class="nav-item" role="presentation" v-if="userData.user.id === studentInfo.headTeacher.id">
                                <button class="nav-link" id="allgrades-tab" data-toggle="tab" data-target="#allgrades-tab-pane" type="button" role="tab" aria-controls="allgrades-tab-pane" aria-selected="false">
                                    Sve ocene
                                </button>
                            </li>
                          </ul>
                          <div class="tab-content" id="myTabContent">
                            <!-- GRADES TAB -->
                            <div class="tab-pane fade show active" id="grade-tab-pane" role="tabpanel" aria-labelledby="grade-tab" tabindex="0">
                                <stud-grades :studentInfo="studentInfo" :userData="userData" :newGradeUpdateGrades="newGradeUpdateGrades"
                                        @add-final-grade-1="addFinalGrade(1)" @add-final-grade-2="addFinalGrade(2)"
                                        @add-final-grade-3="addFinalGrade(3)" @add-final-grade-4="addFinalGrade(4)">
                                </stud-grades>
                            </div>
                            <div class="tab-pane fade" id="absences-tab-pane" role="tabpanel" aria-labelledby="absences-tab" tabindex="0">
                                <stud-absences :studentInfo="studentInfo" :userData="userData"></stud-absences>
                            </div>
                            <div class="tab-pane fade" id="governance-tab-pane" role="tabpanel" aria-labelledby="governance-tab" tabindex="0">
                                <stud-governance :studentInfo="studentInfo" :userData="userData"></stud-governance>
                            </div>
                            <div class="tab-pane fade" id="contact-tab-pane" role="tabpanel" aria-labelledby="contact-tab" tabindex="0">
                                <stud-contacts :studentInfo="studentInfo" :userData="userData" @update-student="updateStudent"></stud-contacts>
                            </div>
                            <div class="tab-pane fade" id="subject-tab-pane" role="tabpanel" aria-labelledby="subject-tab" tabindex="0">
                                <stud-subjects :studentInfo="studentInfo" :userData="userData" @update-student="updateStudent"></stud-subjects>
                            </div>
                            <div class="tab-pane fade" id="success-tab-pane" role="tabpanel" aria-labelledby="success-tab" tabindex="0">
                                <stud-success :studentInfo="studentInfo" :userData="userData"></stud-success>
                            </div>
                            <div class="tab-pane fade" id="allgrades-tab-pane" role="tabpanel" aria-labelledby="allgrades-tab" tabindex="0">
                                <stud-all-grades :studentInfo="studentInfo" :userData="userData"></stud-all-grades>
                            </div>
                          </div>
                    </div>
                </div>
            </div>
            </div>

        </div>
    </div>
</template>

<script>
import axios from 'axios';
import {useSharedData} from '../sharedUserData'
import StudGrades from '@/components/studGrades.vue';
import StudAbsences from '../components/studAbsences.vue';
import StudGovernance from '../components/studGovernance.vue';
import StudContacts from '../components/studContacts.vue';
import StudSubjects from '../components/studSubjects.vue';
import StudSuccess from '../components/studSuccess.vue';
import StudAllGrades from '../components/studAllGrades.vue';

const {studentData} = useSharedData()

export default {
    name: 'StudentInfo',
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
            this.$router.push({path: '/homePage/studentdata'})
            return
        }
        }
    },
    components: {
        StudGrades,
        StudAbsences,
        StudGovernance,
        StudContacts,
        StudSubjects,
        StudSuccess,
        StudAllGrades
    },
    data() {
        return {
            uri: 'http://localhost:4000',
            message: '',
            studentInfo: null,
            canGrade: false,
            gradingType: { values: [] },
            gradeTypes: null,
            grade: null,
            gradeDate: null,
            gradeNote: null,
            gradeType: null,
            newGradeUpdateGrades: {},
            // finalGradeAddition: false,
            finalGradeSemester: 0,
            showButtonsForChange: true
        }
    },
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
    created() {
        this.studentInfo = studentData.value
        console.log("student info created: " + JSON.stringify(this.userData, null, 2))
        this.getCurrentSchoolYear()
        // if(this.studentInfo) console.log("STUDENT INFO" + JSON.stringify(this.studentInfo, null, 2))
        // if(this.userData) console.log("USER INFO" + JSON.stringify(this.userData, null, 2))
        this.getGradingType()
        this.getGradeTypes()
        // this.getHeadTeacher()
        // console.log(this.gradingType.values[0])
    },
    methods: {
        updateStudent(data) {
            this.studentInfo = data
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
                            this.showButtonsForChange = true
                        }
                    }
                }) 
            }
        },
        addFinalGrade(num) {
            // 1 and 2 for final grades for semesters 1 and 2
            // 3 and 4 for final grades OSLOBODJEN for semesters 1 and 2
            this.finalGradeSemester = num
            if(num <= 2) window.$('#gradeModal').modal('show')
            else this.addGrade()
            // this.finalGradeAddition = true
            
        },
    //getGradingType
    async getGradingType() {
        if(this.userData.classId == null || this.userData.subjectId == null || this.userData.user == null || this.userData.user.id == null) {
            return
        }
        try {
                const response = await axios.post(`${this.uri}/student/getGradingType`, {
                    idClass: this.userData.classId,
                    idTeacher: this.userData.user.id,
                    idSubject: this.userData.subjectId
                })
                if(response.data.length > 0) {
                    // console.log(response.data.length)
                    this.gradingType = response.data[0]
                    this.studentInfo = {...this.studentInfo, gradingType: this.gradingType, showButtonsForChange: this.showButtonsForChange}
                    // ("student info after adding gradingType " + JSON.stringify(this.studentInfo, null, 2))
                }
                
        } catch(error) {
                this.message = error.response?.data.message || 'An error occurred during getGradingType.';
                console.error('Error during getGradingType:', error);
        }
    },
    //getGradeTypes
    async getGradeTypes() {
        try {
                const response = await axios.get(`${this.uri}/student/getGradeTypes`)
                this.gradeTypes = response.data
                // console.log(this.gradeTypes)
        } catch(error) {
                this.message = error.response?.data.message || 'An error occurred during getGradeTypes.';
                console.error('Error during getGradeTypes:', error);
        }
    },
    async addGrade() {
        // check if selected date is in current school year and it was a teaching day
        // check if there was a w_class for that class, held, held by that techer, from that subject
        // check dates if adding regular grade, not if adding final grade
        let result = this.finalGradeSemester == 0 ? await this.checkDateAndWClass() : 1
        if(this.userData.subjectName === 'vladanje') result = 2
        if(result < 0) {
            return
        } else {
            // date is ok
            if(this.finalGradeSemester == 3 || this.finalGradeSemester == 4 || this.userData.subjectName === 'vladanje') {
                // console.log("bez provere")
            } else if(this.grade == null  || (this.gradingType.id == 1 && this.gradeType == null)) {
                this.message = 'Nisu sva polja izabrana.'
                return
            }
            this.message = ''
            try {
                // const objData = {
                //     jmbg: this.studentInfo.jmbg,
                //     idClass: this.userData.classId,
                //     idSubject: this.userData.subjectId,
                //     idTeacher: this.userData.user.id,
                //     idGradingType: (this.finalGradeSemester === 3 || this.finalGradeSemester === 4) ? 4 : this.gradingType.id,
                //     grade: (this.finalGradeSemester === 3 || this.finalGradeSemester === 4) ? 'oslobođen' : this.grade,
                //     date: this.gradeDate,
                //     currDate: (new Date()).toISOString().split('T')[0],
                //     note: this.gradeNote,
                //     idGradeType: this.gradeType,
                //     finalGrade: (this.finalGradeSemester > 2) ? (this.finalGradeSemester - 2) : this.finalGradeSemester
                // }
                // console.log("data for insert: " + JSON.stringify(objData, null, 2))
                const response = await axios.post(`${this.uri}/grade/insertGrade`, {
                    jmbg: this.studentInfo.jmbg,
                    idClass: this.userData.classId,
                    idSubject: this.userData.subjectId,
                    idTeacher: this.userData.user.id,
                    idGradingType: (this.finalGradeSemester === 3 || this.finalGradeSemester === 4) ? 4 : this.gradingType.id,
                    grade: (this.finalGradeSemester === 3 || this.finalGradeSemester === 4) ? 'oslobođen' : this.grade,
                    date: this.gradeDate,
                    currDate: (new Date()).toISOString().split('T')[0],
                    note: this.gradeNote,
                    idGradeType: this.gradeType,
                    finalGrade: (this.finalGradeSemester > 2) ? (this.finalGradeSemester - 2) : this.finalGradeSemester
                })
                const gradeAdded = response.data
                // console.log("added grade: " + JSON.stringify(gradeAdded, null, 2))
                this.newGradeUpdateGrades = gradeAdded
                this.cleanGradeFields();
            } catch(error) {
                    this.message = error.response?.data.message || 'An error occurred during addGrade.';
                    console.error('Error during addGrade:', error);
            }
        }
        return
    },
    async checkDateAndWClass() {
        // /wclass/checkDateAndWClass
        // [req.body.date, req.body.idSchYear, req.body.idClass, req.body.idSubject, req.body.idTeacher]
        // console.log("gradeDAte: " + this.gradeDate + " condition: " + (this.gradeDate == null))
        // console.log(" condition: " + (this.gradeDate == null))
        // console.log(
        //     (this.gradeDate == null) + ":" + (this.userData == null) + ":" + (this.userData.schYearId == null) + ":" + (this.userData.classId == null) + ":" + (this.userData.subjectId == null) + ":" + (this.userData.user.id == null)
        // )
        if(this.gradeDate == null || this.userData == null ||  this.userData.schYearId == null || this.userData.classId == null || this.userData.subjectId == null || this.userData.user.id == null) {
            this.message = 'Nisu sva polja izabrana.'
            return -2
        }
        this.message = '';
        try {
                // console.log("data for checkDateAndWClass:" + JSON.stringify({
                //     date: this.gradeDate,
                //     idSchYear: this.userData.schYearId,
                //     idClass: this.userData.classId,
                //     idSubject: this.userData.subjectId,
                //     idTeacher: this.userData.user.id
                // }, null, 2))
                const response = await axios.post(`${this.uri}/wclass/checkDateAndWClass`, {
                    date: this.gradeDate,
                    idSchYear: this.userData.schYearId,
                    idClass: this.userData.classId,
                    idSubject: this.userData.subjectId,
                    idTeacher: this.userData.user.id
                })
                const dataCheck = response.data.length
                if(dataCheck <= 0) {
                    this.message = 'Datum nije odgovarajuci! Dan je nenastavni ili nije postojao čas tog dana.'
                    return -1
                } else return 0
        } catch(error) {
                this.message = error.response?.data.message || 'An error occurred during getGradeTypes.';
                console.error('Error during getGradeTypes:', error);
        }
    },
    cleanGradeFields() {
        this.grade = this.gradeDate = this.gradeNote = this.gradeType = null 
        // this.finalGradeAddition = false, 
        this.finalGradeSemester = 0
    }
}
}

</script>

<style scoped>
.nopad {
    padding: 0px;
    margin-left: 0px;
}
.addgrade {
    color: #bbdefb; /* Light blue dropdown items */
    border-color: #0a3d70;
    background-color: #6482AD;
    max-width: 50%;
}
.addgrade:hover {
    background-color: #bbdefb; /* Slightly darker blue on hover */
    color: #0d47a1;
}

.nav-link {
    background-color: #6482AD;
    color: #bbdefb;
}

.nav-link.active {
    color: #6482AD;
    background-color: #bbdefb;
}
</style>