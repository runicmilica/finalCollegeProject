<template>
<div>
    <!-- FINAL GRADES -->
    <table class="table table-hover table-bordered" v-if="dataArray2.length > 0">
    <thead class="tableHeadStyle">
        <tr class="tableHeadStyle">
        <th scope="col"></th> 
        <th scope="col" class="rc" v-for="subject in uniqueSubjectsArr2" :key="subject.id">{{ subject.name }}</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="(student, jmbg) in groupedByStudentArr2" :key="jmbg" >
        <!-- Display student's firstname and lastname instead of jmbg -->
        <td class="rc">{{ student.firstname }} {{ student.lastname }}<br> <span style="font-size: small; color: gray;">[{{ jmbg }}]</span></td>
        <td class="grade" v-for="subject in uniqueSubjectsArr2" :key="subject.id">
            <!-- Display grade or 'N/A' if no grade -->
            {{ student[subject.id] ? student[subject.id].grade || '' : '' }}
        </td>
        </tr>
        <tr v-for="c in countsTitles" :key="c">
            <td style="background-color: #e3f2fd;" class="rc">{{ c }}</td>
            <td style="background-color: #e3f2fd;" class="grade" v-for="subject in uniqueSubjectsArr2" :key="subject.id">
                {{ counts[c][subject.id]  }}
            </td>
        </tr>
        
    </tbody>
    </table>
</div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'reportTwo',
    props: {
        userData: {
            type: Object,
            required: true
        },
    },
    data() {
        return {
            uri: 'http://localhost:4000',
            dataArray2: [],
            uniqueSubjectsArr2: [],
            groupedByStudentArr2: [],
            counts: [],
            countsTitles: ['Srednja ocena', 'Odličnih', 'Vrlo dobrih', 'Dobrih', 'Dovoljnih', 'Nedovoljnih', 'Neocenjeni', 'Oslobođeni']
        }
    },
    created() {
        this.report2()
    },
    methods: {
        async report2() {
            try {
                const results = await axios.post(`${this.uri}/class/report2`, { idSchYear: this.userData.schYearId, idTeacher: this.userData.user.id})
                this.dataArray2 = results.data
                this.uniqueSubjects(2);
                this.groupedByStudent(2);
                // this.groupedByStudent();
                this.calculateCounts();
                
            } catch(error) {
                this.message = error.response?.data.message || 'An error occurred during report2.';
                console.error('Error during report2:', error);
            }
        },
        uniqueSubjects(num) {
            if(num === 1) {
                const subjects = {};
                this.dataArray.forEach(item => {
                    subjects[item.idSubject] = { id: item.idSubject, name: item.name };
                });
                this.uniqueSubjectsArr =  Object.values(subjects);
            } else {
                const subjects = {};
                this.dataArray2.forEach(item => {
                    subjects[item.idSubject] = { id: item.idSubject, name: item.name };
                });
                this.uniqueSubjectsArr2 =  Object.values(subjects);
            }
        },

        // Group data by student (JMBG)
        groupedByStudent(num) {
            if(num === 1) {
                const grouped = {};
                this.dataArray.forEach(item => {
                    if (!grouped[item.jmbg]) {
                    // Add student's firstname and lastname to the grouped data
                    grouped[item.jmbg] = {
                        firstname: item.firstname, // Store firstname
                        lastname: item.lastname     // Store lastname
                    };
                    }
                    // Store subject-related data by idSubject
                    grouped[item.jmbg][item.idSubject] = item;
                });
                this.groupedByStudentArr = grouped;
            } else {
                const grouped = {};
                this.dataArray2.forEach(item => {
                    if (!grouped[item.jmbg]) {
                    // Add student's firstname and lastname to the grouped data
                    grouped[item.jmbg] = {
                        firstname: item.firstname, // Store firstname
                        lastname: item.lastname     // Store lastname
                    };
                    }
                    // Store subject-related data by idSubject
                    grouped[item.jmbg][item.idSubject] = item;
                });
                this.groupedByStudentArr2 = grouped;
            }
        },
        calculateCounts() {
        const counts = {
            'Srednja ocena': {},
            'Odličnih': {},
            'Vrlo dobrih': {},
            'Dobrih': {},
            'Dovoljnih': {},
            'Nedovoljnih': {},
            'Neocenjeni': {},
            'Oslobođeni': {}
        };
        this.uniqueSubjectsArr2.forEach(subject => {
            const subjectId = subject.id;
            // Initialize counts for each category and subject
            counts['Odličnih'][subjectId] = 0;
            counts['Vrlo dobrih'][subjectId] = 0;
            counts['Dobrih'][subjectId] = 0;
            counts['Dovoljnih'][subjectId] = 0;
            counts['Nedovoljnih'][subjectId] = 0;
            counts['Neocenjeni'][subjectId] = 0;
            counts['Oslobođeni'][subjectId] = 0;

            let totalGrade = 0;
            let gradeCount = 0;
            
            Object.values(this.groupedByStudentArr2).forEach(student => {
                const grade = student[subjectId]?.grade;
                // const finalGrade = student[subjectId]?.finalGrade;

                if (grade !== undefined && grade !== null) {
                    totalGrade += Number(grade) || 0;
                    if(grade != null && grade != 'oslobođen')
                        gradeCount += grade ? 1 : 0;
                    // console.log(typeof(grade))
                    switch (grade) {
                        case "5": counts['Odličnih'][subjectId]++; break;
                        case "4": counts['Vrlo dobrih'][subjectId]++; break;
                        case "3": counts['Dobrih'][subjectId]++; break;
                        case "2": counts['Dovoljnih'][subjectId]++; break;
                        case "1": counts['Nedovoljnih'][subjectId]++; break;
                        case "oslobođen": counts['Oslobođeni'][subjectId]++; break;
                        default: counts['Neocenjeni'][subjectId]++; break;
                    }
                } else {
                    counts['Neocenjeni'][subjectId]++;
                }
            });

            // Calculate average grade
            counts['Srednja ocena'][subjectId] = gradeCount > 0 ? (totalGrade / gradeCount).toFixed(2) : 0;
            if(isNaN(counts['Srednja ocena'][subjectId])) counts['Srednja ocena'][subjectId] = 0
        });
        this.counts = counts;
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