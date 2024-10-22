<template>
    <div class="container" style="margin-left: 0; padding-left: 0;">
        <!-- Modal for adding grade -->
        <div v-if="gradeToEdit != null" class="modal fade" id="editGradeModal" tabindex="-1" role="dialog" aria-labelledby="editGradeModalTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content" style="background-color: #e3f2fd; color: #0a3d70;">
                    <div class="modal-header">
                    <h5 class="modal-title" id="editGradeModalLongTitle">Izmena ocene</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="message = ''; gradeToEdit = null; newGrade = null;">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    </div>
                    <div class="modal-body w-100 d-flex flex-column align-items-center">
                        <div class="d-flex flex-column align-items-center">
                          <output>Ocena: <span style="font-weight: bold;">{{gradeToEdit.grade}}</span> </output>
                          <br>
                          <output>Nova ocena<span style="color: red;">*</span>:<br><span style="font-size: x-small;">[Dozvoljena je izmena samo u veću ocenu]</span></output>
                          <select v-model="newGrade" style="max-width: 100px; color: #0a3d70;">
                            <option v-for="grade in studentInfo.gradingType.values" :key="grade">
                                <span>{{ grade }}</span>
                            </option>
                          </select>
                          <!-- <br>
                          <output v-if="gradingType.id == 1">Vrsta ocene<span style="color: red;">* </span>:</output>
                          <select v-model="gradeType" style="max-width: 200px;" v-if="gradingType.id == 1">
                            <option v-for="g in gradeTypes" :key="g" :value="g.id">{{ g.value }}</option>
                          </select>
                          <br>
                          <output>Datum<span style="color: red;">*</span>:</output>
                          <div><input type="date" v-model="gradeDate"></div>
                          <br>
                          <output>Beleška:</output>
                          <div><textarea v-model="gradeNote"></textarea></div> -->
                          <output class="message">{{message}}</output>
                        </div>
                      </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn change" data-dismiss="modal" @click="message = ''; gradeToEdit = null; newGrade = null;">Odustani</button>
                        <button type="button" class="btn btn change" @click="editGrade">Sačuvaj</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- CONTENT -->
        <div class="row">
                <div class="card" :class="checkSem(m.num)" style="min-width: 8rem; max-width: 12rem; min-height: 5rem;" v-for="m in months" :key="m.num">
                    <div class="card-header">
                    {{ m.rom }}
                    </div>
                    <div v-for="g in grades" :key="g.id">
                        <span v-if="checkMonth(g) == m.num && g.finalGrade == 0" :class="wwCheck(g)">
                            <span :class="delReqCheck(g)">{{g.grade}}</span> 
                            <span :class="delReqCheck(g)" style="padding-left: 0.25rem; padding-right: 0.25rem; font-weight: bold;" v-if="g.gradeCorr != null"><i class="fas fa-arrow-right"></i>{{g.gradeCorr}}</span> 
                            <button type="button" class="btn btn-sm delete" v-if="g.idTeacher == userData.user.id && g.deletionReq === 0 && studentInfo.showButtonsForChange" @click="sendDeletionReq(g,0)">
                                <i class="fas fa-trash"></i>
                            </button>
                            <button type="button" class="btn btn-sm delete" v-if="g.idTeacher == userData.user.id && g.deletionReq === 0 && studentInfo.showButtonsForChange"
                                            data-toggle="modal" data-target="#editGradeModal" @click="gradeToEdit=g">
                                <i class="fas fa-pen"></i>
                            </button>
                            <br> 
                            <span :class="delReqCheck(g)" style="font-size: x-small;"> [{{g.firstname}} {{g.lastname}}]</span>
                        </span>
                    </div>
                    <!-- <span v-if="m.num == semEndMonth" class="vertical-line"></span> -->
                </div>
            
        </div>
        <div class="row" style="margin: 2rem 2rem;">
            <div class="card first" v-if="studentInfo.gradingType != null" 
                    style="width: 15rem; min-height: 5rem; margin-right: 2rem;">
                <div class="card-header">
                  1. polugodište
                </div>
                <div v-if="studentInfo.gradingType.id == 1">
                    <span> Prosek: {{averageGradeS1}}</span>
                </div>
                <div v-if="hasFinalGrade1" :class="delReqCheck(finalGrade1)">
                    <span>Zaključna ocena: {{finalGrade1.grade}}</span>
                    <button @click="sendDeletionReq(finalGrade1, 1)" type="button" class="btn btn-sm delete" v-if="finalGrade1.idTeacher == userData.user.id && finalGrade1.deletionReq === 0 && studentInfo.showButtonsForChange" >
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div v-else-if=" studentInfo.showButtonsForChange">
                    <!-- <div> -->
                    <button type="button" class="btn btn-sm addgrade" v-if="studentInfo.listen === true"
                        @click="addFinalGrade(1)">
                        Zaključi ocenu
                    </button> <br>
                    <button type="button" class="btn btn-sm addgrade" v-if="userData.subjectName != 'vladanje' && (studentInfo.listen === true || studentInfo.headTeacher.id === userData.user.id)"
                        @click="addFinalGrade(3)">
                        Oslobodi
                    </button>
                </div>
            </div>


            <div class="card third" v-if="studentInfo.gradingType != null" style="width: 15rem; min-height: 5rem;">
                <div class="card-header">
                  2. polugodište
                </div>
                <div v-if="studentInfo.gradingType.id == 1">
                    <span> Prosek: {{averageGradeS2}}</span>
                </div>
                <div v-if="hasFinalGrade2" :class="delReqCheck(finalGrade2)">
                    <span>Zaključna ocena: {{finalGrade2.grade}}</span>
                    <button @click="sendDeletionReq(finalGrade2, 2)" type="button" class="btn btn-sm delete" v-if="finalGrade2.idTeacher == userData.user.id && finalGrade2.deletionReq === 0 && studentInfo.showButtonsForChange" >
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div v-else-if="studentInfo.showButtonsForChange">
                    <!-- <div> -->
                    <button type="button" class="btn btn-sm addgrade2" v-if="studentInfo.listen === true"
                        @click="addFinalGrade(2)">
                        Zaključi ocenu
                    </button><br>
                    <button type="button" class="btn btn-sm addgrade2"
                        @click="addFinalGrade(4)"  v-if="userData.subjectName != 'vladanje' && (studentInfo.listen === true || studentInfo.headTeacher.id === userData.user.id)">
                        Oslobodi
                    </button>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
import axios from 'axios';

    export default{
        name: 'studGrades',
        props: {
            userData: {
                type: Object,
                required: true
            },
            studentInfo: {
                type: Object,
                required: true
            },
            newGradeUpdateGrades: {
                type: Object,
                required: true
            }
        },
        watch: {
            newGradeUpdateGrades: {
                handler() {
                    // console.log('refresh grades')
                    this.getStudentsGrades()
                    this.averageGradeYear();
                    this.averageGradeSem1();
                    this.averageGradeSem2();
                },
                deep: true
            }
        },
        data() {
            return {
                uri: 'http://localhost:4000',
                message: '',
                grades: [],
                months: [{ num: 9, rom: 'IX' },  { num: 10, rom: 'X' },  { num: 11, rom: 'XI' },  { num: 12, rom: 'XII' }, { num: 1, rom: 'I' },
                        { num: 2, rom: 'II' },  { num: 3, rom: 'III' },  { num: 4, rom: 'IV' },  { num: 5, rom: 'V' },  { num: 6, rom: 'VI' }],
                ww: 6, // as written work for visual differences
                averageGradeY: 0,
                averageGradeS1: 0,
                averageGradeS2: 0,
                dates: null,
                semEndMonth: 0,
                yearEndMonth: 0,
                fqEndMonth: 0,
                tqEndMonth: 0,
                hasFinalGrade1: false,
                hasFinalGrade2: false,
                finalGrade1: {},
                finalGrade2: {},
                gradeToEdit: null,
                newGrade: null
            }
        },
        async created() {
            await this.getStudentsGrades();
            this.averageGradeYear();
            this.averageGradeSem1();
            this.averageGradeSem2();
            this.getDatesInYearForClass()
            // console.log("CREATED: " + JSON.stringify(this.studentInfo, null, 2))
        },
        methods: {
            async editGrade() {
                if(this.newGrade == null || this.gradeToEdit == null || this.gradeToEdit.grade == null) {
                    this.message = 'Odaberite ocenu.'
                    return
                }
                this.message = ''
                let oldInd, newInd
                for (let index = 0; index < this.studentInfo.gradingType.values.length; index++) {
                    if(this.studentInfo.gradingType.values[index] === this.gradeToEdit.grade) oldInd = index
                    if(this.studentInfo.gradingType.values[index] === this.newGrade) newInd = index
                }
                // const oldInd = this.studentInfo.gradingType.values.findIndex(element => {element === this.gradeToEdit.grade})
                // const newInd = this.studentInfo.gradingType.values.findIndex(element => {element === this.newGrade})
                if(newInd <= oldInd) {
                    this.message = 'Dozvoljena je izmena samo u veću ocenu'
                    return
                }
                try {
                    const response = await axios.post(`${this.uri}/grade/updateGrade`, {id: this.gradeToEdit.id, newGrade: this.newGrade})
                    if(response.status === 200) {
                        this.gradeToEdit.gradeCorr = this.newGrade
                        this.message = 'Ocena je promenjena'
                        this.newGrade = ''
                    }
                } catch(error) {
                    this.message = error.response?.data.message || 'An error occurred during editGrade.';
                    console.error('Error during editGrade:', error);
                }
            },
            addFinalGrade(num) {
                this.$emit(`add-final-grade-${num}`)
            },
            async getDatesInYearForClass() {
                try {
                    const response = await axios.post(`${this.uri}/grade/getDatesInYearForClass`, {idClass: this.userData.classId})
                    if(response.data.length > 0) {
                        this.dates = response.data[0]
                        this.semEndMonth = this.dates.endOfFirstSem != null ?  Number(this.dates.endOfFirstSem.split('-')[1]) : 0
                        this.fqEndMonth =  this.dates.endOfFirstQ != null ?  Number(this.dates.endOfFirstQ.split('-')[1]) : 0
                        this.tqEndMonth =  this.dates.endOfThirdQ != null ?  Number(this.dates.endOfThirdQ.split('-')[1]) : 0
                        this.yearEndMonth = this.dates.endDate != null ?  Number(this.dates.endDate.split('-')[1]) : 0
                    }
                } catch(error) {
                    this.message = error.response?.data.message || 'An error occurred during getDatesInYearForClass.';
                    console.error('Error during getDatesInYearForClass:', error);
                }
            },
            // app.post('/grade/getStudGrades', db.getStudGrades) jmbg and idSubject
            async getStudentsGrades() {
                try {
                    const response = await axios.post(`${this.uri}/grade/getStudGrades`, {jmbg: this.studentInfo.jmbg, idSubject: this.userData.subjectId})
                    this.grades = response.data
                    this.grades.forEach(element => {
                        if(element.finalGrade === 1) {
                            this.hasFinalGrade1 = true;
                            this.finalGrade1 = element
                        }
                        if(element.finalGrade === 2) {
                            this.hasFinalGrade2 = true;
                            this.finalGrade2 = element
                        }
                    })
                } catch(error) {
                    this.message = error.response?.data.message || 'An error occurred during getStudentsGrades.';
                    console.error('Error during getStudentsGrades:', error);
                }
            },
            async averageGradeYear() {
                if(this.grades.length <= 0 || this.grades[0].idGradeType == null) {
                    // no grades or grades are not numeric type
                    return
                }
                try {
                    const response = await axios.post(`${this.uri}/grade/averageGradeYear`, {jmbg: this.studentInfo.jmbg, idSubject: this.userData.subjectId})
                    if(response.data != null && response.data.length > 0){
                        this.averageGradeY = response.data[0].average
                        // console.log("average: " + this.averageGradeY)
                    }
                } catch(error) {
                    this.message = error.response?.data.message || 'An error occurred during averageGradeYear.';
                    console.error('Error during averageGradeYear:', error);
                }
            },
            async averageGradeSem1() {
                if(this.grades.length <= 0 || this.grades[0].idGradeType == null) {
                    // no grades or grades are not numeric type
                    return
                }
                try {
                    const response = await axios.post(`${this.uri}/grade/averageGradeSem1`, {jmbg: this.studentInfo.jmbg, idSubject: this.userData.subjectId})
                    if(response.data != null && response.data.length > 0){
                        this.averageGradeS1 = response.data[0].average
                       //  console.log("averageGradeS1: " + this.averageGradeS1)
                    }
                } catch(error) {
                    this.message = error.response?.data.message || 'An error occurred during averageGradeSem1.';
                    console.error('Error during averageGradeSem1:', error);
                }
            },
            async averageGradeSem2() {
                if(this.grades.length <= 0 || this.grades[0].idGradeType == null) {
                    // no grades or grades are not numeric type
                    return
                }
                try {
                    const response = await axios.post(`${this.uri}/grade/averageGradeSem2`, {jmbg: this.studentInfo.jmbg, idSubject: this.userData.subjectId})
                    if(response.data != null && response.data.length > 0){
                        this.averageGradeS2 = response.data[0].average
                        // console.log("averageGradeS2: " + this.averageGradeS2)
                    }
                } catch(error) {
                    this.message = error.response?.data.message || 'An error occurred during averageGradeSem2.';
                    console.error('Error during averageGradeSem2:', error);
                }
            },
            checkMonth(g) {
                if(g == null || g.date == null) return
                const month = Number(g.date.split('-')[1])
                // console.log('month: ' + month)
                return month
            },
            async sendDeletionReq(g) {
                // sendDeletionReq
                try {
                    const response = await axios.post(`${this.uri}/grade/sendDeletionReq`, {id: g.id})
                    if(response.data.length > 0) {
                        g.deletionReq = response.data[0].deletionReq
                        
                    }
                    // console.log(JSON.stringify(this.grades, null, 2))
                } catch(error) {
                    this.message = error.response?.data.message || 'An error occurred during sendDeletionReq.';
                    console.error('Error during sendDeletionReq:', error);
                }
            }
        },
        computed: {
        //     toggleMiss() {
        //     return (jmbg) => {
        //        return { miss: this.missing[this.missing.findIndex((element) => element.jmbg == jmbg)].checked }
        //     }
        // }
            wwCheck() {
                return (g) => {
                    return {wwClass: g.idGradeType != null ? (g.idGradeType == 6 ? true : false) : false}
                }
            },
            checkSem() {
                return (num) => {
                    return {first: this.months.findIndex(el => el.num === num) <= this.months.findIndex(el => el.num === this.fqEndMonth),
                            second: this.months.findIndex(el => el.num === num) > this.months.findIndex(el => el.num === this.fqEndMonth) &&
                                    this.months.findIndex(el => el.num === num) <= this.months.findIndex(el => el.num === this.semEndMonth),
                            third: this.months.findIndex(el => el.num === num) > this.months.findIndex(el => el.num === this.semEndMonth) &&
                                    this.months.findIndex(el => el.num === num) <= this.months.findIndex(el => el.num === this.tqEndMonth)
                            
                    }
                }
            },
            delReqCheck() {
                return (g) => {
                    return {
                        delReq: g.deletionReq === 1
                    }
                }
            }

        }
    }
</script>

<style scoped>
.addgrade {
    color: #bbdefb; /* Light blue dropdown items */
    border-color: #0a3d70;
    background-color: #6482AD;
    max-width: 70%;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
}
.addgrade:hover {
    background-color: #bbdefb; /* Slightly darker blue on hover */
    color: #0d47a1;
}
.addgrade2 {
    background-color: #bbdefb; /* Slightly darker blue on hover */
    color: #0d47a1;
    border-color: #0a3d70;
    max-width: 70%;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
}
.addgrade2:hover {
    color: #bbdefb; /* Light blue dropdown items */
    background-color:  #748cad;
}
.vertical-line {
    width: 1px;              /* Line thickness */
    height: 100px;           /* Line height */
    background-color: black; /* Line color */
    display: inline-block;   /* Keeps it in line with other elements */
  }
.wwClass {
    border: 2px solid #0a3d70; /* Adjust the thickness and color as needed */
    padding: 1px 1px; /* Optional: adds space around the text */
    display: inline-block; /* Makes the span respect width/height */
}
.delete {
    padding: 3px 3px ;
    color: #bbdefb; /* Light blue dropdown items */
    border-color: #0a3d70;
    background-color: #6482AD;
    max-width: 25px;
    max-height: 25px;
    margin-right: 3px;
}

.delete:hover {
    background-color: #bbdefb; /* Slightly darker blue on hover */
    color: #0d47a1;
}
.card {
    background-color: #6482AD;
    color:#bbdefb;
    
}
.first {
    background-color: #bbdefb;
    color:#0a3d70;
    
}

.second {
    background-color: #91c2eb;
    color:#0a3d70;
   
}

.third {
    background-color: #748cad;
    color:#bbdefb;
}

.delReq {
    color: grey;
    font-weight: bolder;
}

.message {
    font-size: small;
    color: coral;
}
</style>