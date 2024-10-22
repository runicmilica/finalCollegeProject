<template>
<div>
    <table class="table table-hover table-bordered" v-if="dataArray.length > 0">
        <thead class="tableHeadStyle">
          <tr class="tableHeadStyle">
            <th scope="col"></th> 
            <th scope="col" class="rc" v-for="subject in uniqueSubjectsArr" :key="subject.id">
                {{ subject.name }}
            </th>
          </tr>
        </thead>
  
        <!-- Table Body -->
        <tbody>
          <tr v-for="(student, jmbg) in groupedByStudentArr" :key="jmbg" >
            <!-- Display student's jmbg, firstname and lastname -->
            <td class="rc">{{ student.firstname }} {{ student.lastname }} <br> 
                <span style="font-size: small; color: gray;">[{{ jmbg }}]</span>
            </td>
            <td class="grade" v-for="subject in uniqueSubjectsArr" :key="subject.id">
              <!-- Display grade -->
               <span v-if="student[subject.id] != null && student[subject.id].grades != null">
                    <span v-for="g in student[subject.id].grades" :key="g">{{g}}&nbsp;</span>
               </span>
            </td>
          </tr>
        </tbody>
      </table>
</div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'reportOne',
    props: {
        userData: {
            type: Object,
            required: true
        },
    },
    data() {
        return {
            uri: 'http://localhost:4000',
            dataArray: [],
            uniqueSubjectsArr: [],
            groupedByStudentArr: [],
        }
    },
    created() {
        this.report1()
    },
    methods: {
        async report1() {
            try {
                const results = await axios.post(`${this.uri}/class/report1`, { idSchYear: this.userData.schYearId, idTeacher: this.userData.user.id})
                this.dataArray = results.data
                this.uniqueSubjects();
                this.groupedByStudent();
            } catch(error) {
                this.message = error.response?.data.message || 'An error occurred during report1.';
                console.error('Error during report1:', error);
            }
        },
        uniqueSubjects() {
            const subjects = {};
            this.dataArray.forEach(item => {
                subjects[item.idSubject] = { id: item.idSubject, name: item.name };
            });
            this.uniqueSubjectsArr =  Object.values(subjects);
        },
        // Group data by student (JMBG)
        groupedByStudent() {
            const grouped = {};
            this.dataArray.forEach(item => {
                if (!grouped[item.jmbg]) {
                    // Add student's firstname and lastname to the grouped data
                    grouped[item.jmbg] = {
                        firstname: item.firstname, 
                        lastname: item.lastname    
                    };
                }
                if (!grouped[item.jmbg][item.idSubject]) {
                    grouped[item.jmbg][item.idSubject] = { grades: [] };
                }
                // Store subject-related data by idSubject
                if(item.grade != null) grouped[item.jmbg][item.idSubject].grades.push(item.grade)
            });
            this.groupedByStudentArr = grouped;
        }
    }
}
</script>

<style scoped>
.rc {
    color: #0a3d70;
}

.grade {
    font-size: small;
    color: #6482AD;
}
</style>