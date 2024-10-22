<template>
    <div class="container" style="margin-left: 0; padding-left: 0;">
        <div class="row">
            <div class="card">
                        <div class="nogTitle" style="margin-top: 1rem;">Podaci o učeniku</div>
                            <table class="table table-hover">
                                <thead class="tableHeadStyle">
                                <tr class="tableHeadStyle">
                                    <th scope="col">Adresa</th>
                                    <th scope="col">E-mail</th>
                                    <th scope="col">Telefon</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>{{ studentInfo.address }}  </td>
                                    <td>{{ studentInfo.email }}</td>
                                    <td>{{ studentInfo.phone }}</td>
                                </tr>
                                </tbody>
                            </table>


                        <div style="margin-top: 1rem;" class="nogTitle">Podaci o staratelju 1</div>
                            <table class="table table-hover">
                                <thead class="tableHeadStyle">
                                <tr class="tableHeadStyle">
                                    <th scope="col">Ime</th>
                                    <th scope="col">Prezime</th>
                                    <th scope="col">E-mail</th>
                                    <th scope="col">Telefon</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>{{ studentInfo.parent1_firstname }} </td>
                                    <td>{{ studentInfo.parent1_lastname }}</td>
                                    <td>{{ studentInfo.parent1_email }}</td>
                                    <td>{{ studentInfo.parent1_phone }}</td>
                                </tr>
                                </tbody>
                            </table>

                        <div style="margin-top: 1rem;" class="nogTitle">Podaci o staratelju 2</div>
                            <table class="table table-hover">
                                <thead class="tableHeadStyle">
                                <tr class="tableHeadStyle">
                                    <th scope="col">Ime</th>
                                    <th scope="col">Prezime</th>
                                    <th scope="col">E-mail</th>
                                    <th scope="col">Telefon</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>{{ studentInfo.parent2_firstname }} </td>
                                    <td>{{ studentInfo.parent2_lastname }}</td>
                                    <td>{{ studentInfo.parent2_email }}</td>
                                    <td>{{ studentInfo.parent2_phone }}</td>
                                </tr>
                                </tbody>
                            </table>

                            <span style="margin-top: 2rem; margin-bottom: 1rem;">
                                <button v-if="userData.user.id === studentInfo.headTeacher.id && studentInfo.showButtonsForChange" class="btn addpd" type="button" data-toggle="modal" data-target="#contactModal" @click="setFields()">Izmeni podatke</button>
                            </span>
                        <!-- Disciplinary measures and praises -->
                                                
                        <div class="modal fade" id="contactModal" tabindex="-1" role="dialog" aria-labelledby="contactModalTitle" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered" role="document">
                                <div class="modal-content" style="background-color: #e3f2fd; color: #0a3d70;">
                                    <div class="modal-header">
                                    <h5 class="modal-title" id="contactModalLongTitle">Podaci o učeniku</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                    </div>
                                    <div class="modal-body w-100 d-flex flex-column align-items-center">
                                        <div class="d-flex flex-column align-items-center">
                                            <form>
                                                <div>Učenik</div>
                                                <div class="form-group"  style="display: flex; align-items: center;">
                                                    <label for="firstname" style="margin-right: 10px;">Ime:</label>
                                                    <input v-model="studInfo.firstname" class="form-control" id="firstname" placeholder="Ime" style="flex: 1;">
                                                </div>
                                                <div class="form-group"  style="display: flex; align-items: center;">
                                                    <label for="lastname" style="margin-right: 10px;">Prezime:</label>
                                                    <input v-model="studInfo.lastname" class="form-control" id="lastname" placeholder="Prezime" style="flex: 1;">
                                                </div>
                                                <div class="form-group"  style="display: flex; align-items: center;">
                                                  <label for="email" style="margin-right: 10px;">E-mail:</label>
                                                  <input v-model="studInfo.email" type="email" class="form-control" id="email" placeholder="E-mail" style="flex: 1;">
                                                </div>
                                                <div class="form-group"  style="display: flex; align-items: center;">
                                                    <label for="phone" style="margin-right: 10px;">Telefon:</label>
                                                    <input v-model="studInfo.phone" type="tel" class="form-control" placeholder="Telefon" id="phone" style="flex: 1;">
                                                </div>
                                                <div class="form-group"  style="display: flex; align-items: center;">
                                                    <label for="address" style="margin-right: 10px;">Adresa:</label>
                                                    <input v-model="studInfo.address" class="form-control" id="address" placeholder="Adresa" style="flex: 1;">
                                                </div>
                                                <!-- Parent 1 -->
                                                <hr>
                                                <div>Staratelj 1</div>
                                                <div class="form-group"  style="display: flex; align-items: center;">
                                                    <label for="parent1_firstname" style="margin-right: 10px;">Ime:</label>
                                                    <input v-model="studInfo.parent1_firstname" class="form-control" id="parent1_firstname" placeholder="Ime" style="flex: 1;">
                                                </div>
                                                <div class="form-group"  style="display: flex; align-items: center;">
                                                    <label for="parent1_lastname" style="margin-right: 10px;">Prezime:</label>
                                                    <input v-model="studInfo.parent1_lastname" class="form-control" id="parent1_lastname" placeholder="Prezime" style="flex: 1;">
                                                </div>
                                                <div class="form-group"  style="display: flex; align-items: center;">
                                                    <label for="parent1_email" style="margin-right: 10px;">E-mail:</label>
                                                    <input v-model="studInfo.parent1_email" type="email" class="form-control" id="parent1_email" placeholder="E-mail" style="flex: 1;">
                                                </div>
                                                <div class="form-group"  style="display: flex; align-items: center;">
                                                      <label for="parent1_phone" style="margin-right: 10px;">Telefon:</label>
                                                      <input v-model="studInfo.parent1_phone" type="tel" class="form-control" placeholder="Telefon" id="parent1_phone" style="flex: 1;">
                                                </div>
                                                <!-- Parent 2 -->
                                                <hr>
                                                <div>Staratelj 2</div>
                                                <div class="form-group"  style="display: flex; align-items: center;">
                                                    <label for="parent2_firstname" style="margin-right: 10px;">Ime:</label>
                                                    <input v-model="studInfo.parent2_firstname" class="form-control" id="parent2_firstname" placeholder="Ime" style="flex: 1;">
                                                </div>
                                                <div class="form-group"  style="display: flex; align-items: center;">
                                                    <label for="parent2_lastname" style="margin-right: 10px;">Prezime:</label>
                                                    <input v-model="studInfo.parent2_lastname" class="form-control" id="parent2_lastname" placeholder="Prezime" style="flex: 1;">
                                                </div>
                                                <div class="form-group"  style="display: flex; align-items: center;">
                                                    <label for="parent2_email" style="margin-right: 10px;">E-mail:</label>
                                                    <input v-model="studInfo.parent2_email" type="email" class="form-control" id="parent2_email" placeholder="E-mail" style="flex: 1;">
                                                </div>
                                                <div class="form-group"  style="display: flex; align-items: center;">
                                                      <label for="parent2_phone" style="margin-right: 10px;">Telefon:</label>
                                                      <input v-model="studInfo.parent2_phone" type="tel" class="form-control" placeholder="Telefon" id="parent2_phone" style="flex: 1;">
                                                </div>
                                            </form>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn change" data-dismiss="modal">Odustani</button>
                                        <button type="button" class="btn btn change"  data-dismiss="modal" @click="updateStudent()">Sačuvaj</button>
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


    export default{
        name: 'studAbsences',
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
        // watch: {
        //     studentInfo: {
        //         handler() {
        //             this.headTeacher = this.studentInfo.headTeacher
        //         },
        //     deep: true
        // }
        // },
        data() {
            return {
                uri: 'http://localhost:4000',
                message: '',
                idHeadTeacher: null,
                firstname:null,
                lastname: null,
                email: null,
                phone: null,
                address: null,
                parent1_firstname: null,
                parent1_lastname: null,
                parent1_email: null,
                parent1_phone: null, 
                parent2_firstname: null,
                parent2_lastname: null,
                parent2_email: null,
                parent2_phone: null, 
                studInfo: {},
                headTeacher: null
            }
        },
        created() {
            // 
            this.studInfo = this.studentInfo
            // this.headTeacher = this.studentInfo.headTeacher
            // console.log("HEAD TEACHER: " + JSON.stringify(this.headTeacher, null, 2))
        },
        methods: {
            setFields() {
                // this.email = this.studentInfo.email
            },
            async updateStudent() {
                try {
                    const response = await axios.post(`${this.uri}/student/updateStudentsInfo`, this.studInfo)
                    if(response.status === 200) {
                        this.$emit('update-student', this.studInfo)
                    }
                } catch(error) {
                    this.message = error.response?.data.message || 'An error occurred during updateStudentsInfo.';
                    console.error('Error during updateStudentsInfo:', error);
                }
            }
            // setModalTitle(num) {
            //     this.modalTitle = num === 1 ? 'Pohvala' : 'Disciplinska mera'
            //     this.p_or_d = num === 1 ? true : false
            // },
            // cleanFields() {
            //     this.date= null
            //     this.title = null
            //     this.p_or_d = false
            //     this.effectNote = null
            //     this.modalTitle = null
            // },
            // async studentNoG() {
            //     try {
            //         const response = await axios.post(`${this.uri}/student/studentsNoG`, {jmbg: this.studentInfo.jmbg})
            //         this.nogArray = response.data
            //         this.idHeadTeacher = response.data.length > 0 ? response.data[0].idHeadTeacher : null
            //     } catch(error) {
            //         this.message = error.response?.data.message || 'An error occurred during studentNoG.';
            //         console.error('Error during studentNoG:', error);
            //     }
            // },
            // async getDisciplinaryMeasures() {
            //     try {
            //         const response = await axios.post(`${this.uri}/student/getDisciplinaryMeasures`, 
            //         {   jmbg: this.studentInfo.jmbg,
            //             idSchYear: this.userData.schYearId
            //         })
            //         if(response.data.length > 0) {
            //             for (let index = 0; index < response.data.length; index++) {
            //                 const element = response.data[index]
            //                 if(element.p_or_d === true) this.pArray.push(element)
            //                 else this.dArray.push(element)
                            
            //             }
            //         }
            //     } catch(error) {
            //         this.message = error.response?.data.message || 'An error occurred during getDisciplinaryMeasures.';
            //         console.error('Error during getDisciplinaryMeasures:', error);
            //     }
            // },
            // // [ req.body.jmbg , req.body.idSchYear, 
            // // req.body.date, req.body.title, 
            // // req.body.p_or_d, req.body.effect];
            // // addDisciplinaryMeasure
            // async addDisciplinaryMeasure() {
            //     try {
            //         const response = await axios.post(`${this.uri}/student/addDisciplinaryMeasure`, {
            //             jmbg: this.studentInfo.jmbg,
            //             idSchYear: this.userData.schYearId,
            //             date: this.date, 
            //             title: this.title,
            //             p_or_d: this.p_or_d,
            //             effect: this.effectNote
            //         })
            //         if(response.status === 200) {
            //             this.getDisciplinaryMeasures()
            //         }
                    
            //     } catch(error) {
            //         this.message = error.response?.data.message || 'An error occurred during addDisciplinaryMeasure.';
            //         console.error('Error during addDisciplinaryMeasure:', error);
            //     }
            // }
        
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

.addpd {
    color: #bbdefb; /* Light blue dropdown items */
    border-color: #0a3d70;
    background-color: #6482AD;
    max-width: 200px;
    margin: 0.25rem;
}
.addpd:hover {
    background-color: #bbdefb; /* Slightly darker blue on hover */
    color: #0d47a1;
}
</style>