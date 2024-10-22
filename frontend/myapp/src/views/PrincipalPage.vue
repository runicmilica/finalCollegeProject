<template>
    <div>
        <principal-navbar :principalData="principalData" @update-data="handleDataUpdate"></principal-navbar>
        <div class="content">
        <table class="table table-hover" v-if="dataSelection.schAndSchYear != null">
            <thead class="tableHeadStyle">
                <tr>
                    <th>Škola</th>
                </tr>
              <tr class="tableHeadStyle">
                <th scope="col">Naziv</th>
                <th scope="col">Adresa</th>
                <th scope="col">Grad</th>
                <th scope="col">Datum početka</th>
                <th scope="col">Datum kraja</th>
                <th scope="col">Kraj 1. polugodišta 
                    <button type="button" class="btn btn-sm approve" v-if="showButtonsForChange" @click="dateToEdit = 'za kraj 1. polugodišta'" data-toggle="modal" data-target="#editDate">
                        <i class="fas fa-edit"></i>
                    </button>
                </th>
                <th scope="col">Početak 2. polugodišta 
                    <button type="button" class="btn btn-sm approve" v-if="showButtonsForChange" @click="dateToEdit = 'za početak 2. polugodišta'" data-toggle="modal" data-target="#editDate">
                        <i class="fas fa-edit"></i> 
                    </button>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{dataSelection.schAndSchYear.name}}</td>
                <td>{{dataSelection.schAndSchYear.address}}</td>
                <td>{{dataSelection.schAndSchYear.city}}</td>
                <td>{{dataSelection.schAndSchYear.startDate}}</td>
                <td>{{dataSelection.schAndSchYear.endDate}}</td>
                <td>{{dataSelection.schAndSchYear.endOfFirstSem}}</td>
                <td>{{dataSelection.schAndSchYear.startOfSecondSem}}</td>
              </tr>
            </tbody>
          </table>

          <table class="table table-hover" v-if="dataSelection.classAndHeadT != null">
            <thead class="tableHeadStyle">
                <tr>
                    <th>Odeljenje</th>
                    <th>
                        <button v-if="hasClassMonitors == false" class="btn btn-sm change" type="button" @click="addClassMonitors()">Dodeli redare</button>
                        <span v-else>Redari su dodeljeni</span>
                    </th>
                </tr>
              <tr class="tableHeadStyle">
                <th scope="col">Godina</th>
                <th scope="col">Broj</th>
                <th scope="col">Razredni strešina</th>
                <th scope="col">Kraj 1. tromesečja 
                    <button type="button" class="btn btn-sm approve" v-if="showButtonsForChange" @click="dateToEdit = 'za kraj 1. tromesečja'" data-toggle="modal" data-target="#editDate">
                        <i class="fas fa-edit"></i>
                    </button>
                </th>
                <th scope="col">Kraj 3. tromesečja 
                    <button type="button" class="btn btn-sm approve" v-if="showButtonsForChange" @click="dateToEdit = 'za kraj 3. tromesečja'" data-toggle="modal" data-target="#editDate">
                        <i class="fas fa-edit" ></i>
                    </button>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{dataSelection.classAndHeadT.year}}</td>
                <td>{{dataSelection.classAndHeadT.number}}</td>
                <td>{{dataSelection.classAndHeadT.firstname}} {{dataSelection.classAndHeadT.lastname}}</td>
                <td>{{dataSelection.classAndHeadT.endOfFirstQ}}</td>
                <td>{{dataSelection.classAndHeadT.endOfThirdQ}}</td>
              </tr>
            </tbody>
          </table>
          <!-- deletion requests -->
          <table class="table table-hover" v-if="dataSelection.classAndHeadT != null">
            <thead class="tableHeadStyle">
                <tr>
                    <th>Zahtevi za brisanje ocene</th>
                </tr>
              <tr class="tableHeadStyle">
                <th scope="col">Učenik</th>
                <th scope="col">Nastavnik</th>
                <th scope="col">Ocena</th>
                <th scope="col">Predmet</th>
                <th scope="col">Odobri</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="d in dataSelection.deletionRequests" :key="d.id">
                <td>{{d.firstnamestudent}} {{d.lastnamestudent}} <span style="font-size: x-small;">[{{d.jmbg}}]</span> </td>
                <td>{{d.firstnameteacher}} {{d.lastnameteacher}}</td>
                <td>{{d.grade}}</td>
                <td>{{d.name}}</td>
                <td>
                    <button type="button" class="btn btn-sm approve" @click="deleteGrade(d)">
                        <i class="fa fa-check"></i>
                    </button>
                </td>
              </tr>
            </tbody>
          </table>
        <!-- Modal for not held class-->
        <div class="modal fade" id="editDate" tabindex="-1" role="dialog" aria-labelledby="editDateTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content" style="background-color: #e3f2fd; color: #0a3d70;">
                    <div class="modal-header">
                    <h5 class="modal-title" id="editDateLongTitle">Izmena datuma {{dateToEdit}}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="message = '';this.dateToEdit = '';   this.newDate = null;">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    </div>
                    <div class="modal-body">
                        Datum: 
                        <input type="date" v-model="newDate">
                        <div style="color:coral; font-style: italic; font-size: small;">{{message}}</div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn change" data-dismiss="modal" @click="message = '';this.dateToEdit = '';   this.newDate = null;">Odustani</button>
                        <button type="button" class="btn btn change" @click="saveNewDate()">Sačuvaj</button>
                    </div>
                </div>
            </div>
        </div>

        <div>
            <button v-if="dataSelection.schAndSchYear != null && !showReports" type="button" class="btn change" @click="showReports = true">Prikaži izveštaje</button>
            <button v-if="dataSelection.schAndSchYear != null && showReports" type="button" class="btn change" @click="showReports = false">Sakrij izveštaje</button>
        </div>

        <table class="table table-hover table-bordered" v-if="dataSelection.schAndSchYear != null && showReports">
            <thead>
                <tr>
                    <th class="text-center align-middle">Nastavnik</th>
                    <th class="text-center align-middle">Predmet i odeljenje</th>
                    <th class="text-center align-middle">E-mail</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="t in teachers" :key="t.id">
                    <!-- Teacher's Name -->
                    <td class="align-middle text-center"> 
                        {{ t.firstname }} {{ t.lastname }} 
                    </td>
                    
                    <!-- Subjects and Classes -->
                    <td>
                        <ul class="list-unstyled mb-0">
                            <li v-for="(s, index) in t.subjects" :key="index" class="mb-2">
                                [{{ s.year }} / {{ s.number }}] {{ s.name }} 
                                <strong v-if="s.idHeadTeacher == t.id">Razredni starešina</strong> 
                                <em v-else>Nastavnik</em>
                            </li>
                        </ul>
                    </td>
                    
                    <!-- Email Column (empty for now) -->
                    <td class="align-middle text-center">
                        {{ t.username }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    </div>
</template>

<script>
import PrincipalNavbar from '@/components/principalNavbar.vue';
import axios from 'axios';

export default {
    name: 'PrincipalPage',
    components: {
        PrincipalNavbar
    },
    data() {
        return {
            principalData: {},
            uri: 'http://localhost:4000',
            message: '',
            dataSelection: {
                schAndSchYear: null,
                classAndHeadT: null,
                deletionRequests: []
            },
            dateToEdit: '',
            newDate: null,
            showButtonsForChange: false,
            hasClassMonitors: false,
            showReports: false,
            teachersAndSubjArr: [],
            teachers: []
            // deletionRequests:[]
        }
    },
    created() {
        this.principalData = JSON.parse(localStorage.getItem('principal'))
        this.getCurrentSchoolYear()
        this.hasMonitors()
        // this.getDeletionReq()
    },
    methods: {
        async addClassMonitors() {  
            try {  
                const response = await axios.post(`${this.uri}/student/getStudentsInClassOrder`, { idClass: this.dataSelection.classAndHeadT.idClass});
                if(response.status == 200) {
                    if(response.data.message === 'monitors assigned') {
                        this.hasClassMonitors = true;
                    }
                }
            } catch (error) {
                this.message = error.response?.data.message || 'An error occurred during addClassMonitors.';
                console.error('Error during addClassMonitors:', error);
            }
        },
        async hasMonitors() {
            if(this.dataSelection == null || this.dataSelection.classAndHeadT == null) return
            try {   // idClass
                const response = await axios.post(`${this.uri}/admin/hasMonitors`, { idClass: this.dataSelection.classAndHeadT.idClass});
                if(response.status == 200) {
                    if(response.data.length > 0) this.hasClassMonitors = true
                    else this.hasClassMonitors = false
                }
            } catch (error) {
                this.message = error.response?.data.message || 'An error occurred during hasMonitors.';
                console.error('Error during hasMonitors:', error);
            }
        },
        handleDataUpdate(newData) {
            this.dataSelection = newData
            console.log(JSON.stringify(this.dataSelection, null, 2))
            this.getCurrentSchoolYear()
            this.hasMonitors()
            this.report6()
        },
        async saveNewDate() {
            console.log(this.dateToEdit + ":" + this.newDate)
            console.log(JSON.stringify(this.dataSelection, null, 2))
            switch (this.dateToEdit) {
                case 'za kraj 1. polugodišta':
                    try {   // date, id (school year)
                        const response = await axios.post(`${this.uri}/schools/setEndDateOfFirstSem`, { 
                            id:  this.dataSelection.schAndSchYear.idSchYear, 
                            date: this.newDate 
                        });
                    console.log ( "novi datum iz baze: " + response.data.endOfFirstSem)
                       this.dataSelection.schAndSchYear.endOfFirstSem = response.data.updatedEndOfFirstSem
                       
                       console.log(response.status)
                       if(response.status === 400 || response.status === 200) {
                        this.message = response.data.message
                       } else {
                        this.message = ''
                        this.dateToEdit = '';   this.newDate = null;
                       }
                    } catch (error) {
                        this.message = error.response?.data.message || 'An error occurred during saveNewDate.';
                        console.error('Error during saveNewDate:', error);
                    }
                    break;
                case 'za početak 2. polugodišta':
                    try {   // date, id (school year)
                        const response = await axios.post(`${this.uri}/schools/setStartDateOfSecondSem`, { 
                            id:  this.dataSelection.schAndSchYear.idSchYear, 
                            date: this.newDate 
                        });
                       this.dataSelection.schAndSchYear.startOfSecondSem = response.data.updatedStartOfSecondSem
                       
                       console.log(response.status)
                       if(response.status === 400 || response.status === 200) {
                        this.message = response.data.message
                       } else {
                        this.message = ''
                        this.dateToEdit = '';   this.newDate = null;
                       }
                    } catch (error) {
                        this.message = error.response?.data.message || 'An error occurred during saveNewDate.';
                        console.error('Error during saveNewDate:', error);
                    }
                    break;
                // app.post('/class/setEndOfFirstQ', db.setEndOfFirstQ)
                // const currentEndOfFirstQ = req.body.endOfFirstQ
                // const values = [req.body.date, req.body.idClass]    
                // updatedEndOfFirstQ
                case 'za kraj 1. tromesečja':
                    try {   // date, id (school year)
                        const response = await axios.post(`${this.uri}/class/setEndOfFirstQ`, { 
                            idClass:  this.dataSelection.classAndHeadT.idClass, 
                            date: this.newDate,
                            endOfFirstQ:  this.dataSelection.classAndHeadT.endOfFirstQ 
                        });
                       this.dataSelection.classAndHeadT.endOfFirstQ = response.data.updatedEndOfFirstQ
                       
                       console.log(response.status)
                       if(response.status === 400 || response.status === 200) {
                        this.message = response.data.message
                       } else {
                        this.message = ''
                        this.dateToEdit = '';   this.newDate = null;
                       }
                    } catch (error) {
                        this.message = error.response?.data.message || 'An error occurred during saveNewDate.';
                        console.error('Error during saveNewDate:', error);
                    }
                    break;
                case 'za kraj 3. tromesečja':
                    try {   // date, id (school year)
                        const response = await axios.post(`${this.uri}/class/setEndOfThirdQ`, { 
                            idClass:  this.dataSelection.classAndHeadT.idClass, 
                            date: this.newDate,
                            endOfThirdQ:  this.dataSelection.classAndHeadT.endOfThirdQ
                        });
                       this.dataSelection.classAndHeadT.endOfThirdQ = response.data.updatedEndOfThirdQ
                       
                       console.log(response.status)
                       if(response.status === 400 || response.status === 200) {
                        this.message = response.data.message
                       } else {
                        this.message = ''
                        this.dateToEdit = '';   this.newDate = null;
                       }
                    } catch (error) {
                        this.message = error.response?.data.message || 'An error occurred during saveNewDate.';
                        console.error('Error during saveNewDate:', error);
                    }
                    break;
                default:
                    break;
            }
        },
        getCurrentSchoolYear() {
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth(); // January is 0, December is 11

            // Assuming school year starts in September
            if (currentMonth >= 8) { // Months from September (8) to December (11)
                this.currentYear = `${currentYear}/${currentYear + 1}`;
                
            } else {
                // Months from January (0) to August (7)
                this.currentYear = `${currentYear - 1}/${currentYear}`;
            }
            if(this.dataSelection.schAndSchYear != null && this.dataSelection.schAndSchYear.startDate != null
                && this.dataSelection.schAndSchYear.endDate != null) {
                        if(this.dataSelection.schAndSchYear.startDate.split('-')[2] == this.currentYear.split('/')[0] && this.dataSelection.schAndSchYear.endDate.split('-')[2] == this.currentYear.split('/')[1]) {
                            this.showButtonsForChange = true
                        } else {
                            this.showButtonsForChange = false
                        }
            }
        },
        // // getDeletionReq
        async deleteGrade(d) {
           //  console.log("this.dataSelection.classAndHeadT: " + JSON.stringify(this.dataSelection.classAndHeadT, null, 2))
            try {   // date, id (school year)
                const response = await axios.post(`${this.uri}/admin/deleteGrade`, { id:  d.id});
                if(response.status == 200) {
                    this.dataSelection.deletionRequests = this.dataSelection.deletionRequests.filter(el => el.id != d.id)
                }
            } catch (error) {
                this.message = error.response?.data.message || 'An error occurred during deleteGrade.';
                console.error('Error during deleteGrade:', error);
            }
        },
        async report6() {  // /student/getStudentsInClassOrder
            try {   // idClass
                const response = await axios.post(`${this.uri}/admin/report6`, { idSchYear: this.dataSelection.schAndSchYear.idSchYear});
                console.log("Response data:", JSON.stringify(response.data, null, 2));

                this.teachersAndSubjArr = response.data
                const groupedById = this.teachersAndSubjArr.reduce((acc, current) => {
                    const studentId = current.id;
                    
                    // Check if the student already exists in the accumulator
                    if (!acc[studentId]) {
                        acc[studentId] = {
                            id: studentId,
                            firstname: current.firstname,
                            lastname: current.lastname,
                            username: current.username,
                            subjects: []
                        };
                    }
                    
                    // Add subjects and their corresponding classes
                    acc[studentId].subjects.push({
                        idSubject: current.idSubject,
                        name: current.name,
                        idClass: current.idClass,
                        year: current.year,
                        number: current.number,
                        idHeadTeacher: current.idHeadTeacher
                    });
                    
                    return acc;
                }, {});

                this.teachers = Object.values(groupedById)
                console.log(JSON.stringify(this.teachers, null, 2));
                
            } catch (error) {
                this.message = error.response?.data.message || 'An error occurred during report6.';
                console.error('Error during report6:', error);
            }
        },
    },
}
</script>

<style scoped>

.table td, .table th {
    vertical-align: middle; /* Center content vertically */
}

ul.list-unstyled {
    padding-left: 0; /* Remove default padding for ul */
}

li.mb-2 {
    margin-bottom: 0.5rem; /* Add space between each subject entry */
}

td, th {
    padding: 12px; /* Increase padding for readability */
}
.table th  {
    background-color: #6482AD;
    color: #e3f2fd;
}

.table td  {
    background-color: #e3f2fd;
    color: #0a3d70;
}

.edit {
    padding: 0px;
}

.edit:hover {
    background-color: #e3f2fd;
    color: #6482AD;
}

.change {
    color: #bbdefb; /* Light blue dropdown items */
    border-color: #0a3d70;
    background-color: #6482AD;
    margin: 0.25rem;
}

.change:hover {
    background-color: #bbdefb; /* Slightly darker blue on hover */
    color: #0d47a1;
}

.approve {
    padding: 3px 3px ;
    color: #bbdefb; /* Light blue dropdown items */
    border-color: #0a3d70;
    background-color: #6482AD;
    max-width: 25px;
    max-height: 25px;
    margin-right: 3px;
}

.approve:hover {
    background-color: #bbdefb; /* Slightly darker blue on hover */
    color: #0d47a1;
}

.content {
    overflow-x: hidden;
    padding-top: 70px;
    position: fixed;
    z-index: 1;
    top: 10;
    left: 0;
    padding-left: 5%;
}
</style>