<template>
    <div>
        <nav class="navbar navbar-expand-lg custom-navbar" id="fixPos">
            <a class="navbar-brand custom-navbar-brand" href="#"></a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavDropdown">
                <ul class="navbar-nav">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle custom-nav-link" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Škola
                        </a>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                            <button class="dropdown-item" v-for="s in localData.twas" :key="s.id" :value="s.id" @click="handleSchoolChange(s.id, s.name)">{{ s.name }}</button>
                        </div>
                    </li>
                    <li><span class="nav-link custom-nav-link" style="font-style: italic;">{{ localData.schoolName }}</span></li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle custom-nav-link" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                           Šk.god.
                        </a>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                            <button class="dropdown-item" v-for="s in localData.school_years_for_school" :key="s.id" :value="s.id" @click="handleSchYearChange(s.id, s.startDate, s.endDate)">{{ s.startDate }}/{{ s.endDate }}</button>
                        </div>
                    </li>
                    <li><span class="nav-link custom-nav-link" style="font-style: italic;">{{ localData.schYear }}</span></li>
                    <li class="nav-item dropdown">
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
                            <span v-for="s in localData.subjects" :key="s.id" >
                            <!-- <button class="dropdown-item" v-if="s.name != 'vladanje'" :value="s.id" @click="handleSubjectChange(s.id, s.name)">{{ s.name }}</button> -->
                            <button class="dropdown-item"  :value="s.id" @click="handleSubjectChange(s.id, s.name)">{{ s.name }}</button>
                                
                            </span>
                        </div>
                    </li>
                    <li><span class="nav-link custom-nav-link" style="font-style: italic;">{{ localData.subjectName }}</span></li>
                    <li class="nav-item">
                        <button @click="logout" type="button" class="nav-link custom-nav-link">Odjavi se</button>
                    </li>
                    <li style="position: absolute;  right: 0px;">
                        <span class="nav-link custom-nav-link user">{{ localData.user.firstname }} {{ localData.user.lastname }} [{{ classHeadTeacher.year }}/ {{ classHeadTeacher.number }}]</span>
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
    z-index: 1000; /* Ensure it is above other content */
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
.user {
    font-weight: bold;
    border-color: #0a3d70;
    border: 3px;
}
</style>

<script>
import axios from 'axios';

export default {
    name: 'TopNavbar',
    props: {
        userData: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            uri: 'http://localhost:4000',
            message: '',
            localData: {
                user: null,
                twas: null,
                schoolId: null,
                schoolName: '',
                schYearId: null,
                schYear: '',
                classId: null,
                classYear: '',
                classNumber: '',
                school_years_for_school: null,
                classes: null,
                subjects: null,
                subjectId: null,
                subjectName: ''
            },
            classHeadTeacher: {
                year: null,
                number: null
            }
        };
    },
    created() {
        this.localData.user = JSON.parse(localStorage.getItem('teacher'));
        // console.log(this.user);
        this.getAllSchools();
    },
    methods: {
        updateUser() {
            console.log('update user from navbar')
            this.$emit('update-user', this.localData);
        },
        logout() {
            localStorage.removeItem('teacher');
            this.$router.push("/");
        },
        async getAllSchools() {
            try {
                // console.log("user id" + this.user.id);
                const response = await axios.post(`${this.uri}/teacher/getAllSchools`, { id: this.localData.user.id });
                this.localData.twas = response.data;
                // console.log("schools: " + this.localData.twas[0].name);
            } catch (error) {
                this.message = error.response?.data.message || 'An error occurred during getAllSchools.';
                console.error('Error during getAllSchools:', error);
            }
        },
        async handleSchoolChange(id, name) {
            this.localData.schoolId = id;
            this.localData.schoolName = name;
            this.localData.schYear = this.localData.schYearId = null;
            this.localData.classId = this.localData.classYear = this.localData.classNumber = null;
            this.localData.subjectId = this.localData.subjectName = null;
            this.localData.school_years_for_school = this.localData.classes = this.localData.subjects = null;
            this.classHeadTeacher = { year: null, number: null }
            try {
                const response = await axios.post(`${this.uri}/teacher/getSchYearsForSchoolAndTeacher`, { idSchool: this.localData.schoolId, idTeacher: this.localData.user.id });
                this.localData.school_years_for_school = response.data;
                console.log(this.localData.school_years_for_school)
                this.localData.school_years_for_school.forEach(element => {
                    element.startDate = new Date(element.startDate).getFullYear();
                    element.endDate = new Date(element.endDate).getFullYear();
                });
                this.updateUser();
            } catch (error) {
                this.message = error.response?.data.message || 'An error occurred during handleSchoolChange.';
                console.error('Error during handleSchoolChange:', error);
            }
        },
        async handleSchYearChange(id, startDate, endDate) {
            this.localData.schYearId = id;
            this.localData.schYear = startDate + '/' + endDate;
            this.localData.classId = this.localData.classYear = this.localData.classNumber = null;
            this.localData.subjectId = this.localData.subjectName = null;
            this.localData.classes = this.localData.subjects = null;
            this.classHeadTeacher = { year: null, number: null }
            try {
                const response = await axios.post(`${this.uri}/schools/getClassesThatTeacherTeaches`, { idTeacher: this.localData.user.id, idSchYear: id });
                this.localData.classes = response.data;
                // this.localData.classes.forEach(element => {
                //     console.log("id: " + element.id + " year:" + element.year + " number:" + element.number);
                // });
                for (let index = 0; index < response.data.length; index++) {
                    const element = response.data[index];
                    if(element.idTeacher === this.userData.user.id) {
                        this.classHeadTeacher = element
                    }
                }
                this.updateUser();
            } catch (error) {
                this.message = error.response?.data.message || 'An error occurred during handleSchYearChange.';
                console.error('Error during handleSchYearChange:', error);
            }
        },
        async handleClassChange(id, year, number) {
            this.localData.classId = id;
            this.localData.classNumber = number;
            this.localData.classYear = year;
            this.localData.subjectId = this.localData.subjectName = null;
            this.localData.subjects = null;
            try {
                const response = await axios.post(`${this.uri}/schools/getSubjectsThatTeacherTeachesToThatClass`, { idTeacher: this.localData.user.id, idSchYear: this.localData.schYearId, idClass: this.localData.classId });
                this.localData.subjects = response.data;
                this.updateUser();
            } catch (error) {
                this.message = error.response?.data.message || 'An error occurred during handleClassChange.';
                console.error('Error during handleClassChange:', error);
            }
        },
        handleSubjectChange(id, name) {
            this.localData.subjectId = id;
            this.localData.subjectName = name;
            this.updateUser();
            this.showGradeLog();
        },
        showGradeLog() {
            return;
        }
    },
    watch: {
        userData: {
            handler(newData) {
                console.log('watch')
                // Update localData when the userData prop changes
                this.localData = { ...this.localData, ...newData };
            },
            deep: true
        }
    }
};
</script>
