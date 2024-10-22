<template>
<div>
        <!-- Modal for behaviour -->
        <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content" style="background-color: #e3f2fd; color: #0a3d70;">
                    <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle">Beleška o vladanju</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="cleanFields">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    </div>
                    <div class="modal-body">
                        <h3>{{studentFirstname}} {{studentLastname}}</h3>
                        <div class="form-check form-switch">
                            <input v-model="beh1" :value="true" class="form-check-input" type="checkbox" id="flexSwitchCheckDefault1">
                            <label class="form-check-label" for="flexSwitchCheckDefault1">Ometa čas</label>
                        </div>
                        <div class="form-check form-switch">
                            <input v-model="beh2" :value="true" class="form-check-input" type="checkbox" id="flexSwitchCheckChecked2">
                            <label class="form-check-label" for="flexSwitchCheckChecked2">Nema pribor</label>
                        </div>
                        <div class="form-check form-switch">
                            <input v-model="beh3" :value="true" class="form-check-input" type="checkbox" id="flexSwitchCheckDefault3">
                            <label class="form-check-label" for="flexSwitchCheckDefault3">Kasni 5 minuta</label>
                        </div>
                        <div class="form-check form-switch">
                            <input v-model="beh4" :value="true" class="form-check-input" type="checkbox" id="flexSwitchCheckChecked4">
                            <label class="form-check-label" for="flexSwitchCheckChecked4">Vredan/na i primeren/a na času</label>
                        </div>
                        
                        <br>
                        <textarea v-model="studentBehaviour"></textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn change" data-dismiss="modal" @click="cleanFields">Odustani</button>
                        <button type="button" class="btn btn change" @click="addBehaviour()" data-dismiss="modal">Sačuvaj</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Modal for not being present-->
        <div class="modal fade" id="exampleModalCenter2" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content" style="background-color: #e3f2fd; color: #0a3d70;">
                    <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle">Beleška o izostanku</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="cleanFields">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    </div>
                    <div class="modal-body">
                        <h3>{{studentFirstname}} {{studentLastname}}</h3>
                        <textarea v-model="studentComment"></textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn change" data-dismiss="modal" @click="cleanFields">Odustani</button>
                        <button type="button" class="btn btn change" @click="addBehaviour()" data-dismiss="modal">Sačuvaj</button>
                    </div>
                </div>
            </div>
        </div>

    <div class="container-fluid" style="padding-left: 120px;  padding-top: 1rem;">
        <div class="row">
            <div class="card missstudentcard" style="width: 90%;">
                <div class="card-body">
                    <span>Odsutni učenici sa prethodno održanog časa:</span>
                  <div v-for="s in prevMissStud" :key="s.jmbg">{{s.firstname}} {{s.lastname}} <span style="color:grey; font-size: x-small;">({{s.jmbg}})</span></div>
                  <button type="button" class="btn btn-sm option" @click="copyMissStudents()">Kopiraj</button>
                </div>
              </div>
        </div>
        <div class="row">
            <div class="card studentcard" :class="toggleMiss(s.jmbg)" style="width: 18rem;" v-for="s in students" :key="s.jmbg">
                <div class="card-body">
                  <h5 class="card-title"><i class="fas fa-user-circle" title="User Photo"></i>{{s.firstname}} {{s.lastname}}</h5>
                  <!-- <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> -->
                  <button type="button" class="btn btn-sm option" :class="toggleMiss(s.jmbg)" @click="toggleMissing(s.jmbg)"><i class="fas fa-user-times" title="Absent"></i></button>
                  <button v-if="missing.some(element => element.jmbg === s.jmbg && element.checked === true)" 
                            data-toggle="modal" data-target="#exampleModalCenter2" 
                            type="button" class="btn btn-sm option" 
                            :class="toggleMiss(s.jmbg)" @click="studentClick(s)">
                            <i class="fas fa-comment" title="Comment"></i>
                  </button>
                  <!-- <button type="button" class="btn btn-sm option" :class="toggleMiss(s.jmbg)">5</button> -->
                  <button v-else type="button" class="btn btn-sm option" 
                            :class="toggleMiss(s.jmbg)"  @click="studentClick(s)"
                            data-toggle="modal" data-target="#exampleModalCenter"><i class="fas fa-smile"></i></button>
                </div>
              </div>
        </div>
        <div class="row" style="display: flex; justify-content: center;">
            <button type="button" class="btn add" @click="addClass">Sačuvaj čas</button>
        </div>
    </div>
</div>
</template>
<script>
import axios from 'axios';
import {useSharedData} from '../sharedUserData'
const {sharedData, classData} = useSharedData()

export default {
    name: 'missingStudents',
    data() {
        return {
            uri: 'http://localhost:4000',
            message: '',
            students: [],
            userData: null,
            missing: [],
            classInfo: null,
            prevMissStud: [],
            studentFirstname: null,
            studentLastname: null,
            studentJmbg: null,
            studentBehaviour: null,
            studentComment: null,
            // studentsComments: [],
            // studentsBehaviour: [],
            beh1: null, beh2: null, beh3: null, beh4: null,
            studentsData: {
                jmbg: null,
                firstname: null,
                lastname: null,
                behaviour: null,
                comment: null,
                beh1: null, beh2: null, beh3: null, beh4: null
            },
            studentsDataArr: []
        }
    },
    created() {
        this.userData = sharedData.value
        this.classInfo = classData.value
        this.getStudentInClass();
        this.getMissStudFromPrevClass();
    },
    methods: {
        copyMissStudents() {
            this.prevMissStud.forEach(element => {
                this.toggleMissing(element.jmbg)
            });
        },
        async getStudentInClass() {
            try {
                const response = await axios.post(`${this.uri}/student/getStudentsInClassListensSubj`, {idClass: this.userData.classId, idSubject: this.userData.subjectId, idTeacher: this.userData.user.id})
                this.students = response.data
                this.missing = []
                this.students.forEach(element => {
                    this.missing.push({jmbg:element.jmbg, checked: false})
                });
            } catch(error) {
                this.message = error.response?.data.message || 'An error occurred during getStudentInClass.';
                console.error('Error during getStudentInClass:', error);
            }
        },
        async getMissStudFromPrevClass() {
            try {
                const response = await axios.post(`${this.uri}/student/getMissStudFromPreviousClass`, {idClass: this.userData.classId, date: this.classInfo.date, number: this.classInfo.number})
                this.prevMissStud = response.data
            } catch(error) {
                this.message = error.response?.data.message || 'An error occurred during getStudentInClass.';
                console.error('Error during getStudentInClass:', error);
            }
        },
        toggleMissing(jmbg) {
           const ind = this.missing.findIndex((element) => element.jmbg == jmbg)
           console.log("ind:" + ind)
           if(ind >= 0 && ind < this.missing.length) {
            this.missing[ind].checked = !this.missing[ind].checked
           }
           
        },
        async addClass() {
            console.log("studentsDataArr: " + JSON.stringify(this.studentsDataArr, null, 2))

             // Ensure this.missing is defined and is an array
            if (!Array.isArray(this.missing)) {
                console.error("`this.missing` is not defined or not an array.");
                return;
            }

            // Ensure this.classInfo is properly initialized
            if (!this.classInfo) {
                this.classInfo.missStud = []
                this.classInfo.notesOnGov = []
            }


            this.missing.forEach(element => {
                if(element && element.checked) {
                    let student;
                    if((student = this.studentsDataArr.find(st => st.jmbg === element.jmbg)) == null)
                        this.classInfo.missStud.push({jmbg: element.jmbg, note: null})
                    else {
                        this.classInfo.missStud.push({jmbg: element.jmbg, note: student.comment})
                    }
                }
            });
            this.studentsDataArr.forEach(element => {
                if(element.behaviour != null || element.beh1 != null || element.beh2 != null ||  element.beh3 != null || element.beh4 != null) {
                    let arrNote = [element.beh1 != null ? 'Ometa čas' : null, 
                    element.beh2 != null ? 'Nema pribor' : null, 
                    element.beh3 != null ? 'Kasni 5 minuta' : null, 
                    element.beh4 != null ? 'Vredan/na i primeren/a na času' : null, 
                    ]
                    this.classInfo.notesOnGov.push({jmbg: element.jmbg, note: element.behaviour, additionalNote: arrNote})
                }
            })
            console.log("class info before insert: " + JSON.stringify(this.classInfo, null, 2))
            try {
                await axios.post(`${this.uri}/wclass/insertClass`, this.classInfo)
                // this.cleanFields();
                // this.missing = this.prevMissStud = []
                // classData.value = null
                this.$router.push({path: '/homePage/gradelog'})
            } catch(error) {
                this.message = error.response?.data.message || 'An error occurred during addClass.';
                console.error('Error during addClass:', error);
            }
        },
        studentClick(s) {
            this.studentFirstname = s.firstname; this.studentLastname = s.lastname; this.studentJmbg = s.jmbg;
            const student = this.studentsDataArr.find(student => student.jmbg === s.jmbg);
            if(student == null) {   // null or undefined
                console.log("student click doesnt exist: ")
                return
            } else {    // some comment or behaviour has already been set
                console.log("student click exists: ")
                this.beh1 = student.beh1; this.beh2 = student.beh2;
                this.beh3 = student.beh3; this.beh4 = student.beh4;
                this.studentBehaviour = student.behaviour;
                this.studentComment = student.comment;
            }
        },
        addBehaviour() {
            console.log(this.beh1 + " : " + this.beh2 + " : " + this.beh3 + " : " + this.beh4 + " : " + this.studentBehaviour + " : " + this.studentComment)
            // save behaviour
            // check if student is already in array
            const student = this.studentsDataArr.find(student => student.jmbg === this.studentJmbg);
            if(student == null) {   // null or undefined
                this.studentsDataArr.push({
                    jmbg: this.studentJmbg,
                    firstname: this.studentFirstname,
                    lastname: this.studentLastname,
                    behaviour: this.studentBehaviour,
                    comment: this.studentComment,
                    beh1: this.beh1, beh2: this.beh2, beh3: this.beh3, beh4: this.beh4
                })
                const stud = this.studentsDataArr.find(student => student.jmbg === this.studentJmbg);
                console.log(stud)
            } else {
                const ind = this.studentsDataArr.findIndex(student => student.jmbg === this.studentJmbg)
                this.studentsDataArr[ind] = {
                    jmbg: this.studentJmbg,
                    firstname: this.studentFirstname,
                    lastname: this.studentLastname,
                    behaviour: this.studentBehaviour,
                    comment: this.studentComment,
                    beh1: this.beh1, beh2: this.beh2, beh3: this.beh3, beh4: this.beh4
                }
                console.log(this.studentsDataArr[ind])
            }
            this.cleanFields()
            return
        },
        // addComment() {
        //     console.log(this.studentComment)
        //     this.cleanFields()
        //     return
        // },
        cleanFields() {
            this.studentFirstname = this.studentLastname = this.studentJmbg = this.studentBehaviour = this.studentComment = null            
            this.beh1 = this.beh2 = this.beh3 = this.beh4 = null
        }
    },computed: {
        toggleMiss() {
            return (jmbg) => {
               return { miss: this.missing[this.missing.findIndex((element) => element.jmbg == jmbg)].checked }
            }
        }
    }
}
</script>

<style scoped>
.option {
    background-color: #bbdefb;
    margin: 0.25rem;
    min-width: 35px;
    padding: none;
}

.add {
    background-color: #bbdefb;
    margin: 0.25rem;
    max-width: 100px;
    padding: none;
}

.studentcard {
    margin: 1rem;
    padding: 1rem;
}

.miss {
    color: grey;
    background-color: #bbdefb;
}
  
</style>