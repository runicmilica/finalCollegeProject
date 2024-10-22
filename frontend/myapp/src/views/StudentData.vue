<template>

    <div class="container-fluid" style="padding-left: 120px;  padding-top: 1rem;">
        <div class="row">
            <div class="column col-6" style="text-align: left; font-size: x-large;">
                <span>Imenik</span>
            </div>
            <div class="column col-6"></div>
        </div>
        <hr>
        <div class="row">
            <div :class="listens(s.jmbg)" class="card studentcard" style="width: 18rem;" v-for="s in students" :key="s.jmbg">
                <div class="card-body">
                  <h5 class="card-title">{{s.firstname}} {{s.lastname}}</h5>
                  <div class="card-title" style="font-size: small;">[{{s.jmbg}}]</div>
                  <!-- <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> -->
                  <!-- <button type="button" class="btn btn-sm option">5</button> -->
                  <button :class="listens(s.jmbg)" type="button" class="btn btn-sm option" @click="additionalData(s)"><i class="fas fa-info-circle"></i></button>
                </div>
              </div>
        </div>
        
    </div>

</template>
<script>
import axios from 'axios';
import { useSharedData } from '../sharedUserData';
const {studentData} = useSharedData()

export default {
    name: 'studentData',
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
                this.getStudentInClass()
                this.getStudentsInClassListensSubj()
            }
        }
    },
    data() {
        return {
            uri: 'http://localhost:4000',
            message: '',
            students: [],
            studentsListens: []
        }
    },
    created() {
        this.getStudentInClass();
        this.getStudentsInClassListensSubj();
    },
    computed: {
        listens() {
            return (jmbg) => {
               return { notListening: this.studentsListens.findIndex((element) => element.jmbg == jmbg) < 0 }
            }
        }
    },
    methods: {
        async getStudentInClass() {
            if(this.userData == null || this.userData.classId == null) return
            try {
                const response = await axios.post(`${this.uri}/student/getStudentsInClass`, {idClass: this.userData.classId})
                this.students = response.data
                // console.log(this.students)
            } catch(error) {
                this.message = error.response?.data.message || 'An error occurred during getStudentInClass.';
                console.error('Error during getStudentInClass:', error);
            }
        },
        async getStudentsInClassListensSubj() {
            if(this.userData && this.userData.classId && this.userData.subjectId && this.userData.user && this.userData.user.id) {
                try {
                    // [req.body.idClass, req.body.idSubject, req.body.idTeacher]
                    const response = await axios.post(`${this.uri}/student/getStudentsInClassListensSubj`, {
                        idClass: this.userData.classId,
                        idSubject: this.userData.subjectId,
                        idTeacher: this.userData.user.id,
                    })
                    this.studentsListens = response.data
                    // console.log("students who listens to subject " + this.userData.subjectId + JSON.stringify(this.studentsListens))
                } catch(error) {
                    this.message = error.response?.data.message || 'An error occurred during getStudentsInClassListensSubj.';
                    console.error('Error during getStudentsInClassListensSubj:', error);
                }
            }
        },
        async additionalData(s) {
            try {
                const response = await axios.post(`${this.uri}/student/getHeadTeacher`, {jmbg: s.jmbg})
                const ind = this.studentsListens.findIndex(student => student.jmbg === s.jmbg)
                const listen = ind >= 0? true: false
                if(response.data.length > 0) {
                    // this.studentInfo = {...this.studentInfo, headTeacher: response.data[0]}
                    studentData.value = {...s, listen, headTeacher: response.data[0]};
                }
                else {
                    studentData.value = {...s, listen}
                }
                console.log("students data: " + JSON.stringify(studentData.value, null, 2))
                this.$router.push({path: '/homePage/studentinfo'})
            } catch(error) {
                    this.message = error.response?.data.message || 'An error occurred during additionalData.';
                    console.error('Error during additionalData:', error);
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

.studentcard {
    margin: 1rem;
    padding: 1rem;
}

.notListening {
    color: grey;
    background-color: #bbdefb;
}

button.notListening {
    background-color: #ffffff;
}
  
</style>