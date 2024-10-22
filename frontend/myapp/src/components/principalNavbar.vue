<template>
    <div>
        <nav class="navbar navbar-expand-lg custom-navbar">
            <a class="navbar-brand custom-navbar-brand" href="#"></a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavDropdown">
                <ul class="navbar-nav">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle custom-nav-link" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Škola i šk.god.
                        </a>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                            <button class="dropdown-item" v-for="s in schAndSchYear" :key="s.idSchool" @click="handleSchoolChange(s)">{{ s.name }} {{s.startDate.split('-')[2]}}/{{s.endDate.split('-')[2]}}</button>
                        </div>
                        <span class="nav-link custom-nav-link" style="font-style: italic;">{{nameAndYears}}</span>
                    </li>
                    <!-- <li><span class="nav-link custom-nav-link" style="font-style: italic;">{{nameAndYears}}</span></li> -->
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle custom-nav-link" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                           Odeljenje
                        </a>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                            <button class="dropdown-item" v-for="s in classesAndHeadT" :key="s.idClass" @click="handleClassChange(s)">{{ s.year }}/{{ s.number }} <span style="font-size: small;">[{{ s.firstname }} {{ s.lastname }}]</span></button>
                        </div>
                        <span class="nav-link custom-nav-link" style="font-style: italic;">{{ classAndHeadT }}</span>
                    </li>
                    <!-- <li><span class="nav-link custom-nav-link" style="font-style: italic;">{{ classAndHeadT }}</span></li> -->
                    <!-- <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle custom-nav-link" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Odeljenje
                        </a>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                            <button class="dropdown-item" v-for="c in localData.classes" :key="c.id" :value="c.id" @click="handleClassChange(c.id, c.year, c.number)">{{ c.year }}/{{ c.number }}</button>
                        </div>
                    </li>
                    <li><span class="nav-link custom-nav-link" style="font-style: italic;" v-if="localData.classId !== null">{{ localData.classYear }}/{{ localData.classNumber }}</span></li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle custom-nav-link" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Predmet
                        </a>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                            <button class="dropdown-item" v-for="s in localData.subjects" :key="s.id" :value="s.id" @click="handleSubjectChange(s.id, s.name)">{{ s.name }}</button>
                        </div>
                    </li>
                    <li><span class="nav-link custom-nav-link" style="font-style: italic;">{{ localData.subjectName }}</span></li> -->
                    <li class="nav-item">
                        <button @click="logout" type="button" class="nav-link custom-nav-link">Odjavi se</button>
                    </li>
                </ul>
            </div>
        </nav>
    </div>
</template>

<style scoped>
.custom-navbar {
    background-color: #e3f2fd; /* Light blue background */
    border-bottom: 2px solid #E2DAD6; /* Slightly darker blue border */
    position: fixed; /* Fixed position to stay at the top */
    top: 0; /* Align to the top of the viewport */
    left: 0;
    width: 100%; /* Full width */
    z-index: 1000;
}

.custom-navbar-brand {
    color: #6482AD; /* Darker blue color for the brand */
    font-weight: bold;
    font-size: 1.5rem;
}

.navbar-toggler-icon {
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba%280, 0, 0, 0.5%29' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E");
}

.custom-nav-link {
    color: #7FA1C3; /* Light blue for nav links */
}

.custom-nav-link:hover {
    color: #6482AD; /* Darker blue on hover */
}

.dropdown-menu {
    background-color: #7FA1C3; /* Light blue dropdown */
    border: none;
}

.dropdown-item {
    color: #0a3d70; /* Light blue dropdown items */
}

.dropdown-item:hover {
    background-color: #bbdefb; /* Slightly darker blue on hover */
    color: #0d47a1;
}
/* New styles for the <select> element */
    .custom-select {
        background-color: #e3f2fd; /* Same light blue as the navbar */
        border: 1px solid #E2DAD6; /* Border color similar to the navbar */
        color: #6482AD; /* Text color similar to navbar brand */
        padding: 0.375rem 1.75rem 0.375rem 0.75rem; /* Add padding-right for the dropdown arrow */
        font-size: 1rem;
        border-radius: 0.25rem;
        transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        appearance: none; /* Remove default styling to control appearance */
        position: relative;
    }
    
    /* Custom arrow styling */
    .custom-select::after {
        content: '▼'; /* Custom arrow character */
        position: absolute;
        right: 1rem; /* Position the arrow inside the right padding */
        pointer-events: none; /* Ensure the arrow doesn't interfere with clicks */
        color: #6482AD; /* Arrow color matching the theme */
        font-size: 0.8rem; /* Adjust the arrow size */
        top: 50%;
        transform: translateY(-50%);
    }
    
    .custom-select:focus {
        border-color: #6482AD; /* Darker blue for focus */
        outline: none;
        box-shadow: 0 0 0 0.2rem rgba(100, 130, 173, 0.25);
    }
    
    .custom-select option {
        color: #0a3d70; /* Text color for options */
    }
    
    .custom-select:hover {
        background-color: #bbdefb; /* Slightly darker blue on hover */
    }

    .text-style-class{
        font-size: 1.125rem;
        padding: 1rem;
        color: #0a3d70;
        font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    }
</style>

<script>
import axios from 'axios';

export default {
    name: 'TopNavbar',
    props: {
        principalData: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            uri: 'http://localhost:4000',
            message: '',
            schAndSchYear: [],
            nameAndYears: '',
            pickedSchAndSchYear: null,
            classesAndHeadT: [],
            classAndHeadT: '',
            pickedclassAndHeadT: null,
            idSchYear: null,
            deletionRequests: []
        };
    },
    created() {
        // console.log(this.user);
        this.getSchoolAndSchYear();
    },
    methods: {
        updateData() {
             console.log('update data from admin navbar')
             this.$emit('update-data', {schAndSchYear: this.pickedSchAndSchYear, classAndHeadT: this.pickedclassAndHeadT, deletionRequests: this.deletionRequests});
        },
        logout() {
            localStorage.removeItem('principal');
            this.$router.push("/");
        },
        async getSchoolAndSchYear() {
            try {
                // console.log("user id" + this.user.id);
                const response = await axios.post(`${this.uri}/admin/getSchoolAndSchoolYear`, { id: this.principalData.id });
                this.schAndSchYear = response.data;
                // console.log("schools: " + this.localData.twas[0].name);
            } catch (error) {
                this.message = error.response?.data.message || 'An error occurred during getSchoolAndSchYear.';
                console.error('Error during getSchoolAndSchYear:', error);
            }
        },
        async handleSchoolChange(s) {
            this.nameAndYears = s.name + " " + s.startDate.split('-')[2] + "/" + s.endDate.split('-')[2]
            this.idSchYear = s.idSchYear
            this.pickedSchAndSchYear = s
            this.pickedclassAndHeadT = null
            this.classesAndHeadT = []
            this.classAndHeadT = ''
            try {
                const response = await axios.post(`${this.uri}/admin/getClassesAndHeadTeacher`, { idSchYear:  s.idSchYear});
                this.classesAndHeadT = response.data
                this.updateData()
            } catch (error) {
                this.message = error.response?.data.message || 'An error occurred during handleSchoolChange.';
                console.error('Error during handleSchoolChange:', error);
            }
        },
        async handleClassChange(c) {
            this.classAndHeadT = c.year + "/" + c.number + " [" + c.firstname + " " + c.lastname + "]" 
            this.pickedclassAndHeadT = c
            
            // getDeletionReq
            try {   // date, id (school year)
                const response = await axios.post(`${this.uri}/admin/getDeletionReq`, { idClass:  this.pickedclassAndHeadT.idClass});
                this.deletionRequests = response.data
                this.updateData()
            } catch (error) {
                this.message = error.response?.data.message || 'An error occurred during getDeletionReq.';
                console.error('Error during getDeletionReq:', error);
            }
        },
        // handleSubjectChange(id, name) {
        //     this.localData.subjectId = id;
        //     this.localData.subjectName = name;
        //     this.updateUser();
        //     this.showGradeLog();
        // },
        // showGradeLog() {
        //     return;
        // }
    },
    // watch: {
    //     userData: {
    //         handler(newData) {
    //             console.log('watch')
    //             // Update localData when the userData prop changes
    //             this.localData = { ...this.localData, ...newData };
    //         },
    //         deep: true
    //     }
    // }
};
</script>