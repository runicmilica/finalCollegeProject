<template>
    <div class="container" style="margin-left: 0; padding-left: 0;">
        <div class="row">
            <div class="card">
                        <div class="nogTitle">Beleške o vladanju tokom časa</div>
                        <span v-if="nogArray.length > 0">
                            <table class="table table-hover">
                                <thead class="tableHeadStyle">
                                <tr class="tableHeadStyle">
                                    <th scope="col">Datum</th>
                                    <th scope="col">Čas</th>
                                    <th scope="col">Nastavnik</th>
                                    <th scope="col">Predmet</th>
                                    <th scope="col">Lekcija</th>
                                    <th scope="col">Beleška</th>
                                </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="a in nogArray" :key="a">
                                        <td>{{ a.date }}  </td>
                                        <td>{{ a.number }}</td>
                                        <td>{{ a.firstname1 }} {{ a.lastname1 }}</td>
                                        <td>{{ a.name }}</td>
                                        <td>{{ a.lesson }}</td>
                                        <!-- <td>{{ a.note }}</td> -->
                                        <td>
                                            <span v-for="adnote in a.additionalNote" :key="adnote">{{adnote}} 
                                                <span v-if="adnote != null"> </span> 
                                            </span>
                                            <span>{{a.note}}
                                                <span v-if="a.note != null"> </span>
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </span>
                        <span v-else class="none">Ne postoji nijedan podatak.</span>
                        <!-- Disciplinary measures and praises -->
                        <div class="nogTitle" style="margin-top: 1rem;">Pohvale</div>
                        <span v-if="pArray.length > 0">
                            <table class="table table-hover">
                                <thead class="tableHeadStyle">
                                <tr class="tableHeadStyle">
                                    <th scope="col">Datum</th>
                                    <th scope="col">Pohvala</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="a in pArray" :key="a">
                                    <td>{{ a.date }}  </td>
                                    <td>{{ a.title }}</td>
                                </tr>
                                </tbody>
                            </table>
                        </span>
                        <span v-else class="none">Ne postoji nijedan podatak.</span>

                        <div class="nogTitle" style="margin-top: 1rem;">Disciplinske mere</div>
                        <span v-if="dArray.length > 0">
                            <table class="table table-hover">
                                <thead class="tableHeadStyle">
                                <tr class="tableHeadStyle">
                                    <th scope="col">Datum</th>
                                    <th scope="col">Disciplinska mera</th>
                                    <th scope="col">Posledica</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="a in dArray" :key="a">
                                    <td>{{ a.date }}  </td>
                                    <td>{{ a.title }}</td>
                                    <td>{{ a.effect }}</td>
                                </tr>
                                </tbody>
                            </table>
                        </span>
                        <span v-else class="none">Ne postoji nijedan podatak.</span>
                        <span style="margin-top: 2rem;">
                            <button v-if="userData.user.id == studentInfo.headTeacher.id && studentInfo.showButtonsForChange" class="btn status" type="button" data-toggle="modal" data-target="#pdModal" @click="setModalTitle(1)">Dodaj pohvalu</button>
                            <button v-if="userData.user.id == studentInfo.headTeacher.id && studentInfo.showButtonsForChange" class="btn status" type="button" data-toggle="modal" data-target="#pdModal" @click="setModalTitle(2)">Dodaj disciplinsku meru</button>
                        </span>
                        
                        <!-- Modal for adding grade -->
                        <div class="modal fade" id="pdModal" tabindex="-1" role="dialog" aria-labelledby="pdModalTitle" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered" role="document">
                                <div class="modal-content" style="background-color: #e3f2fd; color: #0a3d70;">
                                    <div class="modal-header">
                                    <h5 class="modal-title" id="pdModalLongTitle">{{modalTitle}}</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="cleanFields">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                    </div>
                                    <div class="modal-body w-100 d-flex flex-column align-items-center">
                                        <div class="d-flex flex-column align-items-center">
                                        
                                        <output>Datum<span style="color: red;">*</span>:</output>
                                        <div><input type="date" v-model="date"></div>
                                        <br>

                                        <output>Beleška:</output>
                                        <div><textarea v-model="title"></textarea></div>
                                        <br>

                                        <output v-if="modalTitle === 'Disciplinska mera'">Posledica:</output>
                                        <div v-if="modalTitle === 'Disciplinska mera'"><textarea v-model="effectNote"></textarea></div>
                                        <br>

                                        <output>{{message}}</output>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-sm change" data-dismiss="modal" @click="cleanFields">Odustani</button>
                                        <button type="button" class="btn btn-sm change"  data-dismiss="modal" @click="addDisciplinaryMeasure">Sačuvaj</button>
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

    export default{
        name: 'studGovernance',
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
                nogArray:[],
                idHeadTeacher: null,
                date: null,
                title: null,
                p_or_d: false,
                effectNote: null,
                pArray: [],
                dArray: [],
                modalTitle: null
            }
        },
        created() {
            this.studentNoG()
            this.getDisciplinaryMeasures()
        },
        methods: {
            setModalTitle(num) {
                this.modalTitle = num === 1 ? 'Pohvala' : 'Disciplinska mera'
                this.p_or_d = num === 1 ? true : false
            },
            cleanFields() {
                this.date= null
                this.title = null
                this.p_or_d = false
                this.effectNote = null
                this.modalTitle = null
            },
            async studentNoG() {
                try {
                    const response = await axios.post(`${this.uri}/student/studentsNoG`, {jmbg: this.studentInfo.jmbg})
                    this.nogArray = response.data
                    // if(this.userData.user.id != this.studentInfo.headTeacher.id) {  // regular teacher, not head teacher
                    //     // show notes given by that teacher only
                    //     this.nogArray = this.nogArray.filter(element => {element.idTeacher === this.userData.user.id})
                    // }
                    // if (this.userData?.user?.id != null && this.studentInfo?.headTeacher?.id != null && this.userData.user.id != this.studentInfo.headTeacher.id) {
                    //     // regular teacher, not head teacher
                    //     this.nogArray = this.nogArray.filter(element => element.idTeacher === this.userData.user.id);
                    // }

                    
                    // this.idHeadTeacher = response.data.length > 0 ? response.data[0].idHeadTeacher : null
                } catch(error) {
                    this.message = error.response?.data.message || 'An error occurred during studentNoG.';
                    console.error('Error during studentNoG:', error);
                }
            },
            async getDisciplinaryMeasures() {
                try {
                    const response = await axios.post(`${this.uri}/student/getDisciplinaryMeasures`, 
                    {   jmbg: this.studentInfo.jmbg,
                        idSchYear: this.userData.schYearId
                    })
                    if(response.data.length > 0) {
                        for (let index = 0; index < response.data.length; index++) {
                            const element = response.data[index]
                            if(element.p_or_d === true) this.pArray.push(element)
                            else this.dArray.push(element)
                            
                        }
                    }
                } catch(error) {
                    this.message = error.response?.data.message || 'An error occurred during getDisciplinaryMeasures.';
                    console.error('Error during getDisciplinaryMeasures:', error);
                }
            },
            // [ req.body.jmbg , req.body.idSchYear, 
            // req.body.date, req.body.title, 
            // req.body.p_or_d, req.body.effect];
            // addDisciplinaryMeasure
            async addDisciplinaryMeasure() {
                try {
                    const response = await axios.post(`${this.uri}/student/addDisciplinaryMeasure`, {
                        jmbg: this.studentInfo.jmbg,
                        idSchYear: this.userData.schYearId,
                        date: this.date, 
                        title: this.title,
                        p_or_d: this.p_or_d,
                        effect: this.effectNote
                    })
                    if(response.status === 200) {
                        this.getDisciplinaryMeasures()
                    }
                    
                } catch(error) {
                    this.message = error.response?.data.message || 'An error occurred during addDisciplinaryMeasure.';
                    console.error('Error during addDisciplinaryMeasure:', error);
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

.status {
    background-color: #bbdefb; /* Slightly darker blue on hover */
    color: #0d47a1;
    border-color: #0a3d70;
    max-width: 70%;
    margin: 1rem;
}

.status:hover {
    color: #bbdefb; /* Light blue dropdown items */
    background-color:  #748cad;
}

</style>