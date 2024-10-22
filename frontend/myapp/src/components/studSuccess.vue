<template>
    <div class="container" style="margin-left: 0; padding-left: 0;">
        <div class="row">
            <div class="card">
                <div class="nogTitle" style="margin-top: 1rem;">Uspeh učenika</div>
                    <table class="table table-hover">
                        <thead class="tableHeadStyle">
                        <tr class="tableHeadStyle">
                            <th scope="col" rowspan="2">Predmet</th>
                            <th scope="col" colspan="3">Zaključne ocene</th>
                        </tr>
                        <tr>
                            <th scope="col">1. polugodište</th>
                            <th scope="col">2. polugodište</th>
                            <th scope="col">Kraj školske god.</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr v-for="s in successArray" :key="s">
                                <td>{{ s.name }}</td>
                                <td v-if="s.grades[0].grade">{{ s.grades[0].grade }} </td>
                                <td v-else></td>
                                <td v-if="s.grades[1].grade">{{ s.grades[1].grade }} </td>
                                <td v-else></td>
                                <td v-if="s.grades[1].grade">{{ s.grades[1].grade }} </td>
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
import '@/assets/styles.css'

export default {
    name: 'StudentSuccess',
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
                subjSuccMap: null
            }
        },
        created() {
            // 
            this.getSuccess()
        },
        methods: {

            async getSuccess() {
                try {
                    const response = await axios.post(`${this.uri}/student/getSuccess`, {jmbg: this.studentInfo.jmbg, idSchYear: this.userData.schYearId})
                    console.log(`response.data: ` + JSON.stringify(response.data, null, 2))
                    for (const [key, value] of Object.entries(response.data)) {
                        // Parse the key back into an object
                        const parsedKey = JSON.parse(key);
                        let grades = new Array(2)
                        if(value.length === 2) grades = value
                        else if(value.length === 1) {
                            if(value[0].finalGrade === 1) { grades[0] = value[0]; grades[1] = {} }
                            else { grades[1] = value[0]; grades[0] = {} }
                        } else {
                            grades[0] = {}; grades[1] = {}
                        }
                        // Assign the parsed key as the new key in the parsedData object
                        this.successArray[parsedKey.id] = {grades: grades, name: parsedKey.name};
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

