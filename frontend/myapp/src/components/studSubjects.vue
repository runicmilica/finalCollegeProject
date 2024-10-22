<template>
    <div class="container" style="margin-left: 0; padding-left: 0;">
        <div class="row">
            <div class="card">
                <div class="nogTitle" style="margin-top: 1rem;">Predmeti koje učenik sluša</div>
                    <table class="table table-hover">
                        <thead class="tableHeadStyle">
                        <tr class="tableHeadStyle">
                            <th scope="col">Predmet</th>
                            <th scope="col">Opis</th>
                            <th scope="col">Nastavnik</th>
                            <th scope="col">Ukloni predmet</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="s in subjTeachArray" :key="s">
                            <td>{{ s.name }}  </td>
                            <td>{{ s.description }}</td>
                            <td>{{ s.firstname }} {{ s.lastname }}</td>
                            <td>
                                <button v-if="studentInfo.showButtonsForChange" type="button" class="btn btn-sm status" @click="deleteFromListens(s)"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <span><button v-if="studentInfo.showButtonsForChange" type="button" class="btn  status"  data-toggle="modal" data-target="#subjectModal" @click="getSubjectsInSchYear()">Dodaj predmet</button></span>
                    
                    
                <div class="modal fade" id="subjectModal" tabindex="-1" role="dialog" aria-labelledby="subjectModalTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content" style="background-color: #e3f2fd; color: #0a3d70;">
                            <div class="modal-header">
                                <h5 class="modal-title" id="subjectModalLongTitle">Dodavanje predmeta</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="clearFields()">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body w-100 d-flex flex-column align-items-center">
                                <div class="d-flex flex-column align-items-center">
                                    <div>
                                        <span>Predmet: </span>
                                        <select v-model="subject" @change="getTeachersThatTeachesSubj()">
                                            <option v-for="s in subjectsArray" :key="s.id" :value="s" class="opti">
                                                {{ s.name }} <span v-if="s.description != null"> / {{ s.description }}</span>
                                            </option>
                                        </select>
                                    </div>
                                    <!--  -->
                                    <div>
                                        <span>Nastavnik: </span>
                                        <select v-model="teacher" @change="getGradingTypeForAddingSubj()">
                                            <option v-for="t in teachersArray" :key="t.id" :value="t" class="opti">
                                                {{ t.firstname }}  {{ t.lastname }} 
                                            </option>
                                        </select>
                                    </div>
                                    <!--  -->
                                    
                                    <div>
                                        <span>Način ocenjivanja: </span>
                                        <br>
                                        <select v-model="grading_type" class="s1">
                                            <option v-for="g in gradingTypeArray" :key="g.id" :value="g" class="opti">
                                                {{ g.description }}
                                            </option>
                                        </select>
                                    </div>
                                    <div style="color: coral; font-style: italic; font-size: small;">{{message}}</div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-sm change" data-dismiss="modal" @click="clearFields()">Odustani</button>
                                    <button type="button" class="btn btn-sm change" @click="insertListens">Sačuvaj</button>
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
import '@/assets/styles.css'

export default {
    name: 'StudentSubjects',
    // getSubjectsAndTeachersForStudent
    props: {
        userData: {
            type: Object,
            required: true
        },
        studentInfo: {
            type: Object,
            required: true
        }
    },
    data() {
            return {
                uri: 'http://localhost:4000',
                message: '',
                subjTeachArray: [],
                subject: null,
                teacher: null,
                grading_type: null,
                subjectsArray: [],
                teachersArray: [],
                gradingTypeArray: [],
                allGradingTypes: [],
                gradingTypeExists: false
            }
        },
        created() {
            // 
            this.getAllGradingTypes()
            this.getSubjectsAndTeachersForStudent()
        },
        methods: {
            clearFields() {
                this.subject = null
                this.teacher = null
                this.grading_type = null
                this.subjectsArray = []
                this.teachersArray = []
                this.gradingTypeArray = []
                this.allGradingTypes = []
            },
            async getSubjectsAndTeachersForStudent() {
                try {
                    const response = await axios.post(`${this.uri}/student/getSubjectsAndTeachersForStudent`, {jmbg: this.studentInfo.jmbg, idSchYear: this.userData.schYearId})
                    this.subjTeachArray = response.data
                } catch(error) {
                    this.message = error.response?.data.message || 'An error occurred during getSubjectsAndTeachersForStudent.';
                    console.error('Error during getSubjectsAndTeachersForStudent:', error);
                }
            },
            // getAllGradingTypes
            // app.post('/student/getSubjectsInSchYear', db.getSubjectsInSchYear)                req.body.idSchYear
            // app.post('/student/getTeachersThatTeachesSubj', db.getTeachersThatTeachesSubj)    req.body.idSubject
            // app.post('/student/getGradingTypeForAddingSubj', db.getGradingTypeForAddingSubj)  req.body.idTeacher, req.body.idSubject, req.body.idClass
            async getAllGradingTypes() {
                try {
                    const response = await axios.get(`${this.uri}/student/getAllGradingTypes`)
                    return response.data
                } catch(error) {
                    this.message = error.response?.data.message || 'An error occurred during getAllGradingTypes.';
                    console.error('Error during getAllGradingTypes:', error);
                }
            },
            async getSubjectsInSchYear() {
                try {
                    const response = await axios.post(`${this.uri}/student/getSubjectsInSchYear`, { idSchYear: this.userData.schYearId })
                    this.subjectsArray = response.data
                } catch(error) {
                    this.message = error.response?.data.message || 'An error occurred during getSubjectsInSchYear.';
                    console.error('Error during getSubjectsInSchYear:', error);
                }
            },
            async getTeachersThatTeachesSubj() {
                if(this.subject == null) {
                    this.message = 'Odaberite prvo predmet.'
                    return
                }
                this.message = ''
                try {
                    const response = await axios.post(`${this.uri}/student/getTeachersThatTeachesSubj`, { idSubject: this.subject.id })
                    this.teachersArray = response.data
                    if(this.subject.name === 'vladanje') {
                        this.teachersArray = this.teachersArray.filter(element => element.id == this.studentInfo.headTeacher.id)
                    }
                } catch(error) {
                    this.message = error.response?.data.message || 'An error occurred during getTeachersThatTeachesSubj.';
                    console.error('Error during getTeachersThatTeachesSubj:', error);
                }
            },
            async getGradingTypeForAddingSubj() {
                if(this.teacher == null || this.subject == null) {
                    this.message = 'Odaberite prvo predmet i nastavnika.'
                    return
                }
                this.message = ''
                try {
                    const response = await axios.post(`${this.uri}/student/getGradingTypeForAddingSubj`, { idSubject: this.subject.id, idTeacher: this.teacher.id, idClass: this.studentInfo.idClass })
                    this.gradingTypeArray = response.data
                    if(this.gradingTypeArray.length === 0) {
                        this.gradingTypeArray = await this.getAllGradingTypes()
                    } else {
                        this.gradingTypeExists = true
                        this.grading_type = this.gradingTypeArray[0]
                    }
                    this.gradingTypeArray = this.gradingTypeArray.filter(el => el.name != 'oslobođen')
                } catch(error) {
                    this.message = error.response?.data.message || 'An error occurred during getGradingTypeForAddingSubj.';
                    console.error('Error during getGradingTypeForAddingSubj:', error);
                }
            },
            async insertListens() {
                if(this.subject == null) {
                    this.message = 'Odaberite predmet.'; return;
                } else if(this.teacher == null) {
                    this.message = 'Odaberite nastavnika.'; return;
                } else if(this.grading_type == null) {
                    this.message = 'Odaberite način ocenjivanja.'; return;
                }
                try {   // [ req.body.idTeacher, req.body.idSubject, req.body.jmbg ]
                    const response = await axios.post(`${this.uri}/student/insertIntoListens`, { idTeacher: this.teacher.id, idSubject: this.subject.id, jmbg: this.studentInfo.jmbg })
                    if(response.status === 400) {
                        this.message = response.message
                        return
                    }
                    if(!this.gradingTypeExists) {
                        await this.insertIntoSubjGradType();
                    }
                    this.message = 'Predmet je uspešno dodat.'
                    await this.getSubjectsAndTeachersForStudent()
                } catch(error) {
                    // console.log(JSON.stringify(error, null, 2))
                    // if(error.constraint != null && error.constraint == 'listens_pkey') {
                    //     this.message = 'Učenik već sluša predmet: ' + this.subject.name + ' kod nastavnika: ' + this.teacher.firstname + ' ' + this.teacher.lastname
                    //     return
                    // }
                    this.message = error.response?.data.message || 'An error occurred during insertListens.';
                    console.error('Error during insertListens:', error);
                }
            }, 
            async insertIntoSubjGradType() {
                try {   // [ req.body.idClass, req.body.idSubject, req.body.idTeacher, req.body.idGradingType ]
                    await axios.post(`${this.uri}/student/insertIntoSubjGradType`, 
                        { 
                            idClass: this.studentInfo.idClass, 
                            idSubject: this.subject.id,
                            idTeacher: this.teacher.id, 
                            idGradingType: this.grading_type.id
                         })
                    
                } catch(error) {
                    this.message = error.response?.data.message || 'An error occurred during insertIntoSubjGradType.';
                    console.error('Error during insertIntoSubjGradType:', error);
                }
            }, 
            async deleteFromListens(s) {
                try {   // [ req.body.idClass, req.body.idSubject, req.body.idTeacher, req.body.idGradingType ]
                    await axios.post(`${this.uri}/student/deleteFromListens`, 
                        { 
                            idSubject: s.idSubject,
                            idTeacher: s.idTeacher, 
                            jmbg: this.studentInfo.jmbg
                         })
                    await this.getSubjectsAndTeachersForStudent()
                } catch(error) {
                    this.message = error.response?.data.message || 'An error occurred during deleteFromListens.';
                    console.error('Error during deleteFromListens:', error);
                }
            }
        }
}
</script>
<style scoped>
.absencesCount {
    margin: 1rem;
    font-size: large;
}

.card {
    background-color: #e3f2fd;
    color: #0a3d70;
}

.table th {
    color: #0a3d70
}

.table td {
    color: #0a3d70
}

.status {
    background-color: #bbdefb; /* Slightly darker blue on hover */
    color: #0d47a1;
    border-color: #0a3d70;
    max-width: 70%;
    margin-right: 0.25rem;
}

.status:hover {
    color: #bbdefb; /* Light blue dropdown items */
    background-color:  #748cad;
}

.nogTitle {
    font-size: large;
    font-weight: bold;
    text-decoration: underline;
}

.none {
    font-style: italic;
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
</style>

