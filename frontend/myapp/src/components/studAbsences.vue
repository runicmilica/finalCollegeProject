<template>
    <div class="container" style="margin-left: 0; padding-left: 0;">
        <div class="row">
            <div class="card">
                        <div class="absencesCount">Ukupan broj izostanaka: {{absencesArray.length}}</div>
                        <table class="table table-hover">
                            <thead class="tableHeadStyle">
                              <tr class="tableHeadStyle">
                                <th scope="col">Datum</th>
                                <th scope="col">Čas</th>
                                <th scope="col">Nastavnik</th>
                                <th scope="col">Predmet</th>
                                <th scope="col">Lekcija</th>
                                <th scope="col">Beleška</th>
                                <th scope="col">Status</th>
                                <th v-if="idHeadTeacher != null && idHeadTeacher == userData.user.id">Opravdaj</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="a in absencesArray" :key="a">
                                <td>{{ a.date }}  </td>
                                <td>{{ a.number }}</td>
                                <td>{{ a.firstname1 }} {{ a.lastname1 }}</td>
                                <td>{{ a.name }}</td>
                                <td>{{ a.lesson }}</td>
                                <td>{{ a.note }}</td>
                                <td>
                                    <span v-if="a.excusedAbsence === 0">Neobrađen</span> 
                                    <span v-if="a.excusedAbsence === 1">Opravdan</span>
                                    <span v-if="a.excusedAbsence === 2">Neopravdan</span>
                                </td>
                                <td v-if="idHeadTeacher != null && idHeadTeacher == userData.user.id && studentInfo.showButtonsForChange">
                                    <button type="button" class="btn btn-sm status" @click="studentsAbsencesStatusChange(1, a)"><i class="fas fa-check"></i></button>
                                    <button type="button" class="btn btn-sm status" @click="studentsAbsencesStatusChange(2, a)"><i class="fas fa-ban"></i></button>
                                </td>
                                <td v-else></td>
                              </tr>
                            </tbody>
                        </table>
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
        data() {
            return {
                uri: 'http://localhost:4000',
                message: '',
                absencesArray:[],
                idHeadTeacher: null
            }
        },
        created() {
            this.studentAbsences()
        },
        methods: {
            async studentAbsences() {
                try {
                    const response = await axios.post(`${this.uri}/student/studentsAbsences`, {jmbg: this.studentInfo.jmbg})
                    // wc.id as idWClass, wc."idTeacher", t1.firstname as firstname1, t1.lastname as lastname1,
                    // to_char(wc.date, 'DD-MM-YYYY') as date, lesson, wc.number, wc."idSubject", su.name,
                    // ms."excusedAbsence", ms.note, 
                    // c."idTeacher" as "idHeadTeacher", t2.firstname as "firstnameHead", t2.lastname as "lastnameHead"
                    this.absencesArray = response.data
                    this.idHeadTeacher = response.data.length > 0 ? response.data[0].idHeadTeacher : null
                   //  console.log(JSON.stringify(this.absencesArray, null, 2))
                } catch(error) {
                    this.message = error.response?.data.message || 'An error occurred during studentAbsences.';
                    console.error('Error during studentAbsences:', error);
                }
            },
            // student/studentsAbsencesStatusChange'
            async studentsAbsencesStatusChange(status, a) {
                try {
                   //  console.log(JSON.stringify(a, null, 2))
                    // console.log("excusedAbsence: " +  status + ",jmbg: " + this.studentInfo.jmbg + ",idClass: " + a.idwclass)
                    const response = await axios.post(`${this.uri}/student/studentsAbsencesStatusChange`, {
                        excusedAbsence: status, jmbg: this.studentInfo.jmbg, 
                        idClass: a.idwclass})
                    // console.log("response status change" + JSON.stringify(response.data, null, 2))
                    if(response.status === 200) 
                        a.excusedAbsence = status
                    // console.log(JSON.stringify(this.absencesArray, null, 2))
                } catch(error) {
                    this.message = error.response?.data.message || 'An error occurred during studentsAbsencesStatusChange.';
                    console.error('Error during studentsAbsencesStatusChange:', error);
                }
            }
        }
    }
</script>

<style scoped>
.absencesCount {
    margin: 1rem;
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
</style>