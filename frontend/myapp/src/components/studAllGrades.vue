<template>
    <div class="container" style="margin-left: 0; padding-left: 0;">
        <div class="row">
            <div class="card">
                <div class="nogTitle" style="margin-top: 1rem;">Ocene iz svih predmeta</div>
                <div>
                    <select v-model="selectedPeriod" style="margin: 0.5rem;" @change="getAllGrades()">
                        <option v-for="p in periods" :key="p">{{p}}</option>
                    </select>
                </div>
                    <table class="table table-hover">
                        <thead class="tableHeadStyle">
                        <tr class="tableHeadStyle">
                            <th scope="col">Predmet</th>
                            <th scope="col">Ocene</th>
                            <th scope="col">Period</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr v-for="s in successArray" :key="s">
                                <td>{{ s.name }}</td>
                                <td><span style="white-space: pre;" v-for="g in s.grades" :key="g.id">  {{g.grade}} &nbsp; </span></td>
                                <td>{{selectedPeriod}}</td>
                              </tr> 
                        </tbody>
                    </table>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import '@/assets/styles.css'

export default {
    name: 'StudentsAllGrades',
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
                successArray: {},
                subjSuccMap: null,
                periods: ['1. tromesečje', '1. polugodište', '3. tromesečje', '2. polugodište', 'Cela godina'],
                selectedPeriod: 'Cela godina'
            }
        },
        created() {
            // 
            this.getAllGrades()
        },
        methods: {

            async getAllGrades() {
                try {
                    const response = await axios.post(`${this.uri}/student/getAllGrades`, {jmbg: this.studentInfo.jmbg, idSchYear: this.userData.schYearId, period: this.selectedPeriod, idClass: this.studentInfo.idClass})
                    console.log(`response.data: ` + JSON.stringify(response.data, null, 2))
                    for (const [key, value] of Object.entries(response.data)) {
                        // Parse the key back into an object
                        const parsedKey = JSON.parse(key);
                        this.successArray[parsedKey.id] = {grades: value, name: parsedKey.name};
                    }
                    console.log(`successArray: ` + JSON.stringify(this.successArray, null, 2))
                } catch(error) {
                    this.message = error.response?.data.message || 'An error occurred during getSuccess.';
                    console.error('Error during getSuccess:', error);
                }
            },
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


