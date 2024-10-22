<template>
    <div class="container-fluid" style="padding-left: 120px;  padding-top: 1rem;">
        <div class="row">
            <div class="column col-6" style="text-align: left; font-size: x-large;">
                <span>Upravljanje</span>
            </div>
            <div class="column col-6"></div>
        </div>
        <hr>
        <div class="row br">Broj planiranih časova za svaku nedelju</div>
        <div class="row">
            <div class="row br">Odaberite predmet i odeljenje</div>
            <select v-model="selectedSubject" class="slct" @change="getClassNums()">
                <option v-for="s in subjects" :key="s.id" :value="s"> {{s.name}} [{{s.year}}/{{s.number}}]</option>
            </select>
                <div class="row" v-if="selectedSubject != null">
                    <!-- 1. semester -->
                    <div class="card semcard">
                        <div class="card-body">
                            <div class="form-group">
                                <label class="lbl">1. polugodište</label>
                                <input class="form-control" v-model="classCount[0]" type="number">
                            </div>
                        </div>
                    </div>
                    <!-- 2. semester -->
                    <div class="card semcard">
                        <div class="card-body">
                            <div class="form-group">
                                <label class="lbl">2. polugodište</label>
                                <input class="form-control" v-model="classCount[1]" type="number">
                            </div>
                        </div>
                    </div>
                    <div>
                        <button type="button" class="btn btn-sm save" @click="setClassNums()">Sačuvaj</button>
                    </div>
                </div>
        </div>
    </div>
  </template>

<script>
import axios from 'axios';

export default {
    name: 'SettingsPage',
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
                // this.getWeeksInSchYear()
                this.getTeachersSubjectsInSchYear()
            }
        }
    },
    data() {
        return {
            uri: 'http://localhost:4000',
            weeks: [],
            subjects: [],
            message: '',
            selectedSubject: null,
            classCount: new Array(2)
        };
    },
    created() {
        // this.getWeeksInSchYear()
        this.getTeachersSubjectsInSchYear()
    },
    methods: {
        // app.post('/school_year/getWeeksInSchYear', db.getWeeksInSchYear)
        // app.post('/school_year/getTeachersSubjectsInSchYear', db.getTeachersSubjectsInSchYear)
        // async getWeeksInSchYear() {
        //     if(this.userData.schYearId == null) return
        //     try {
        //         const results = await axios.post(`${this.uri}/school_year/getWeeksInSchYear`, { idSchYear: this.userData.schYearId})
        //         this.weeks = results.data
        //         this.classCount = new Array(this.weeks.length)
        //         this.weeks.forEach(el => {
        //             this.classCount[Number(el.number) - 1] = 0
        //         })
        //     } catch(error) {
        //         this.message = error.response?.data.message || 'An error occurred during getWeeksInSchYear.';
        //         console.error('Error during getWeeksInSchYear:', error);
        //     }
        // },
        async getTeachersSubjectsInSchYear() {
            if(this.userData.schYearId == null) return
            try {
                const results = await axios.post(`${this.uri}/school_year/getTeachersSubjectsInSchYear`, { idSchYear: this.userData.schYearId, idTeacher: this.userData.user.id})
                this.subjects = results.data                
            } catch(error) {
                this.message = error.response?.data.message || 'An error occurred during getTeachersSubjectsInSchYear.';
                console.error('Error during getTeachersSubjectsInSchYear:', error);
            }
        },
        async getClassNums() {
            //
            if(this.selectedSubject == null) return
            // this.weeks.forEach(el => {
            //     this.classCount[Number(el.number) - 1] = 0
            // })
            this.classCount[0] = 0; this.classCount[1] = 0;
            try {
                const results = await axios.post(`${this.uri}/school_year/getClassNums`, { 
                    idSchYear: this.userData.schYearId, 
                    idTeacher: this.userData.user.id,
                    idSubject: this.selectedSubject.id,
                    idClass: this.selectedSubject.idClass
                    })  
                switch (results.data.length) {
                    case 2:
                        this.classCount[0] = results.data[0].num
                        this.classCount[1] = results.data[1].num
                        break;
                    case 1:
                        if(Number(results.data[0].semester) == 1) {
                            this.classCount[0] = results.data[0].num
                        } else {
                            this.classCount[1] = results.data[0].num
                        }
                        break;
                    default:
                        break;
                }
                // this.classCount = results.data
                console.log(JSON.stringify(this.classCount, null, 2))             
            } catch(error) {
                this.message = error.response?.data.message || 'An error occurred during getClassNums.';
                console.error('Error during getClassNums:', error);
            }
        },
        async setClassNums() {
            try {
                 await axios.post(`${this.uri}/school_year/setClassNums`, { 
                    idSchYear: this.userData.schYearId, 
                    idTeacher: this.userData.user.id,
                    idSubject: this.selectedSubject.id,
                    idClass: this.selectedSubject.idClass,
                    numbers: this.classCount
                    })               
            } catch(error) {
                this.message = error.response?.data.message || 'An error occurred during setClassNums.';
                console.error('Error during setClassNums:', error);
            }
        }
    }
};
</script>
<style scoped>
.slct {
    max-width: 200px;
    margin-left: 1.3rem;
}
.save {
    color: #bbdefb; /* Light blue dropdown items */
    border-color: #0a3d70;
    background-color: #6482AD;
    max-width: 100px;
}
.save:hover {
    background-color: #bbdefb; /* Slightly darker blue on hover */
    color: #0d47a1;
}
.br {
    font-size: large;
    color: #0a3d70;
    margin: 0.5rem;
}
.title {
    font-size: x-large;
    color: #0a3d70;
    text-decoration: underline;
}
.subj {
    margin: 1rem;
}
.inputNum {
    width: 50px; 
    height: 30px; 
    margin-left: 10px; 
    font-size: small;
}
.card-title {
    color: #0a3d70;
}
.semcard {
    width: 200px; /* Slightly larger card width */
    height: 90px; /* Increase height for better input fit */
    margin: 0.25rem;
    background-color: #e3f2fd;
    display: flex;
    align-items: center; /* Center content vertically */
}
.lbl {
    font-size: medium;
    color: #0a3d70;
    margin-right: 5px;
    margin-right: 10px; 
    margin-top: 20px;
}
.card-body {
    padding: 2px;
}
.form-group {
    display: flex; 
    align-items: center;
}
</style>


<style scoped>
.rc {
    color: #0a3d70;
}

.grade {
    font-size: small;
    color: #6482AD;
}
</style>