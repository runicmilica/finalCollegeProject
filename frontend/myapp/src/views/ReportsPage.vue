<template>
    <div class="container-fluid" style="padding-left: 120px; padding-top: 1rem;">
        <div class="row">
            <div class="column col-6" style="text-align: left; font-size: x-large;">
                <span>Izveštaj</span>
            </div>
            <div class="column col-6"></div>
        </div>
        <hr>
        <div class="row" v-if="userData.schYearId != null && idClass != null" >
            <ul class="nav nav-tabs" id="myTab" role="tablist" style="padding-left: 12px;">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="report1-tab" data-toggle="tab" data-target="#report1-tab-pane" type="button" role="tab" aria-controls="report1-tab-pane" aria-selected="true">
                        Sve ocene
                    </button>
                </li>
                 <li class="nav-item" role="presentation">
                    <button class="nav-link" id="report2-tab" data-toggle="tab" data-target="#report2-tab-pane" type="button" role="tab" aria-controls="report2-tab-pane" aria-selected="false">
                        Zaključne ocene
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="report3-tab" data-toggle="tab" data-target="#report3-tab-pane" type="button" role="tab" aria-controls="report3-tab-pane" aria-selected="false">
                        Struktura uspeha
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="report4-tab" data-toggle="tab" data-target="#report4-tab-pane" type="button" role="tab" aria-controls="report4-tab-pane" aria-selected="false">
                        Pregled časova
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="report5-tab" data-toggle="tab" data-target="#report5-tab-pane" type="button" role="tab" aria-controls="report5-tab-pane" aria-selected="false">
                        Izostanci
                    </button>
                </li>
                <!--<li class="nav-item" role="presentation" v-if="userData.user.id === studentInfo.headTeacher.id">
                    <button class="nav-link" id="success-tab" data-toggle="tab" data-target="#success-tab-pane" type="button" role="tab" aria-controls="success-tab-pane" aria-selected="false">
                        Uspeh
                    </button>
                </li>
                <li class="nav-item" role="presentation" v-if="userData.user.id === studentInfo.headTeacher.id">
                    <button class="nav-link" id="allgrades-tab" data-toggle="tab" data-target="#allgrades-tab-pane" type="button" role="tab" aria-controls="allgrades-tab-pane" aria-selected="false">
                        Sve ocene
                    </button>
                </li> -->
              </ul>
              <div class="tab-content" id="myTabContent">
                <!-- GRADES TAB -->
                <div class="tab-pane fade show active" id="report1-tab-pane" role="tabpanel" aria-labelledby="report1-tab" tabindex="0">
                    <report-1 :userData="userData"></report-1>
                </div>
                <div class="tab-pane fade" id="report2-tab-pane" role="tabpanel" aria-labelledby="report2-tab" tabindex="0">
                    <report-2 :userData="userData"></report-2>
                </div>
                <div class="tab-pane fade" id="report3-tab-pane" role="tabpanel" aria-labelledby="report3-tab" tabindex="0">
                    <report-3 :userData="userData"></report-3>
                </div>
                <div class="tab-pane fade" id="report4-tab-pane" role="tabpanel" aria-labelledby="report4-tab" tabindex="0">
                    <report-4 :studentInfo="studentInfo" :userData="userData"></report-4>
                </div>
                <div class="tab-pane fade" id="report5-tab-pane" role="tabpanel" aria-labelledby="report5-tab" tabindex="0">
                    <report-5 :studentInfo="studentInfo" :userData="userData" @update-student="updateStudent"></report-5>
                </div>
                <!--<div class="tab-pane fade" id="subject-tab-pane" role="tabpanel" aria-labelledby="subject-tab" tabindex="0">
                    <stud-subjects :studentInfo="studentInfo" :userData="userData" @update-student="updateStudent"></stud-subjects>
                </div>
                <div class="tab-pane fade" id="success-tab-pane" role="tabpanel" aria-labelledby="success-tab" tabindex="0">
                    <stud-success :studentInfo="studentInfo" :userData="userData"></stud-success>
                </div>
                <div class="tab-pane fade" id="allgrades-tab-pane" role="tabpanel" aria-labelledby="allgrades-tab" tabindex="0">
                    <stud-all-grades :studentInfo="studentInfo" :userData="userData"></stud-all-grades>
                </div> -->
              </div>
        </div>
        <div class="row t" v-if="userData.schYearId == null">Odaberite prvo školu i školsku godinu</div>
        <div class="row t" v-if="userData.schYearId != null && idClass == null">Nema podataka.</div>
    </div>
  </template>


<script>
import axios from 'axios';
import report1 from '../components/report1.vue';
import Report2 from '../components/report2.vue';
import Report3 from '../components/report3.vue';
import Report4 from '../components/report4.vue';
import Report5 from '../components/report5.vue';

export default {
  components: { report1, Report2, Report3, Report4, Report5 },
    name: 'ReportsPage',
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
                this.isHeadTeacher()
            }
        }
    },
    data() {
        return {
            message: '',
            idClass: null,
            uri: 'http://localhost:4000'
        };
    },
    created() {
        this.isHeadTeacher()
    },
    methods: {
        async isHeadTeacher() {
            try {
                const results = await axios.post(`${this.uri}/class/isHeadTeacher`, { idSchYear: this.userData.schYearId, idTeacher: this.userData.user.id})
                if(results.data != null && results.data.length > 0) {
                    this.idClass = results.data[0].id
                } else {
                    this.idClass = null
                }
                // console.log(JSON.stringify(this.subjNums, null, 2))
            } catch(error) {
                this.message = error.response?.data.message || 'An error occurred during isHeadTeacher.';
                console.error('Error during isHeadTeacher:', error);
            }
        }
    }
};
</script>

<style scoped>
.rc {
    color: #0a3d70;
}

.grade {
    font-size: small;
    color: #6482AD;
}
.t {
    margin: 2rem;
    font-size: x-large;
    color: #0a3d70;
    text-decoration: underline;
}

.nav-link {
    background-color: #6482AD;
    color: #bbdefb;
}

.nav-link.active {
    color: #6482AD;
    background-color: #bbdefb;
}
</style>