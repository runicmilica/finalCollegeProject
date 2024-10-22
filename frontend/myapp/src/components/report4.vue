<template>
    <div>
        <table class="table table-hover table-bordered" v-if="subjNums.length > 0">
            <thead class="tableHeadStyle">
                <tr class="tableHeadStyle">
                    <th scope="col" rowspan="2" class="rc">Nastavni predmet</th> 
                    <th scope="col" colspan="3" class="rc">Održano / Planirano</th> 
                    <th scope="col" colspan="3" class="rc">Neodržano</th> 
                </tr>
                <tr class="tableHeadStyle">
                    <th scope="col" class="rc">Prvo</th> 
                    <th scope="col" class="rc">Drugo</th> 
                    <th scope="col" class="rc">Ukupno</th>
                    <th scope="col" class="rc">Prvo</th> 
                    <th scope="col" class="rc">Drugo</th> 
                    <th scope="col" class="rc">Ukupno</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="s in subjNums" :key="s.subject?.idSubject">
                    <td  class="rc"> {{ s.subject?.name }} </td>
                    <td class="grade"> {{ s.classes?.numHeld1 }} /  {{ s.classes?.numPlanned1 }} <br> {{(Number(s.classes?.numHeld1)/(s.classes?.numPlanned1 == 0 ? 1 : s.classes?.numPlanned1)*100).toFixed(0)}}{{ prec }} </td>
                    <td class="grade"> {{ s.classes?.numHeld2 }} /  {{ s.classes?.numPlanned2 }} <br> {{(Number(s.classes?.numHeld2)/(s.classes?.numPlanned2 == 0 ? 1 : s.classes?.numPlanned2)*100).toFixed(0)}}{{ prec }} </td>
                    <td class="grade"> {{ s.classes?.numHeldTot }} /  {{ (s.classes?.numPlanned1 || 0) + (s.classes?.numPlanned2 || 0) }}   <br>
                                                {{(Number(s.classes?.numHeldTot)/((s.classes?.numPlanned1 + s.classes?.numPlanned2) == 0 ? 1 : (s.classes?.numPlanned1 + s.classes?.numPlanned2))*100).toFixed(0)}}{{ prec }} 
                    </td>
                    <td class="grade"> {{ s.classes?.numPlanned1 - Number(s.classes?.numHeld1) }} </td>
                    <td class="grade"> {{ s.classes?.numPlanned2 - Number(s.classes?.numHeld2) }} </td>
                    <td class="grade">  {{ s.classes?.numPlanned1 + s.classes?.numPlanned2 - Number(s.classes?.numHeldTot) }} </td>
                </tr>
            </tbody>
            </table>
    </div>
</template>

<style scoped>
.rc {
    color: #0a3d70;
}

.grade {
    font-weight: bold;
    color: #6482AD;
}
</style>

<script>
import axios from 'axios';

export default {
    name: 'reportFour',
    props: {
        userData: {
            type: Object,
            required: true
        },
    },
    watch: {
        userData: {
            handler() {
                this.report4()
            },
            deep: true
        }
    },
    data() {
        return {
            uri: 'http://localhost:4000',
            subjNums: [],
            prec: '%'
        }
    },
    created() {
        this.report4()
    },
    methods: {
        async report4() {
            if(this.userData.schYearId == null ||  this.userData.user.id == null) return
            try {
                const results = await axios.post(`${this.uri}/class/report4`, { idSchYear: this.userData.schYearId, idTeacher: this.userData.user.id})
                this.subjNums = results.data
                // console.log(JSON.stringify(this.subjNums, null, 2))
            } catch(error) {
                this.message = error.response?.data.message || 'An error occurred during report4.';
                console.error('Error during report4:', error);
            }
        }
    }
}
</script>

