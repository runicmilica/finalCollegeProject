<template>
    <div id="outer">
        <div class="card">
            <h2 class="edn">eDnevnik</h2>
            <form>
                <div class="form-group">
                    <label for="exampleInputEmail1">Korisničko ime</label>
                    <input required v-model="username" type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Korisničko ime">
                    <small id="emailHelp" class="form-text text-muted"></small>
                </div>
                <div class="form-group">
                    <label for="exampleInputPassword1">Lozinka</label>
                    <input required v-model="password" type="password" class="form-control" id="exampleInputPassword1" placeholder="Lozinka">
                </div>
                <!-- <div class="form-group form-check">
                    <input type="checkbox" class="form-check-input" id="exampleCheck1">
                    <label class="form-check-label" for="exampleCheck1">Check me out</label>
                </div>-->
                <button type="button" class="btn btn-primary" @click="login()">Prijavite se</button>
                <span style="font-size: small; color: crimson;">{{message}}</span>
            </form>
        </div>
    </div>
</template>



<script>

// import { Teacher } from 'models/teacher';
import axios from 'axios';
    export default {
        name: 'UserLogin',
        data() {
            return {
                username: '',
                password: '',
                message: '',
                uri: 'http://localhost:4000',
                teacher: null,
                teachers: null
            }
        },
        created() {
            this.getTeachers()
        },
        methods: {
            async login() {
                if(this.username === '' || this.password === '') {
                    this.message = 'Unesite korisničko ime i lozinku.'
                    return
                } 
                try {
                    // Send a POST request to the backend with the form data
                    const response = await axios.post(`${this.uri}/teacher/login`, {
                        username: this.username, password: this.password
                    });
                        if(response.data.length === 1) {
                            this.message = ''
                            this.teacher = response.data[0]
                            if(this.teacher.type === 1) {
                                localStorage.setItem('teacher', JSON.stringify(this.teacher))
                                this.$router.push('/homePage');
                            } else if(this.teacher.type === 0) {
                                localStorage.setItem('principal', JSON.stringify(this.teacher))
                                this.$router.push('/principalPage');
                            }
                        } else if(response.data.length === 0) {
                            this.message = 'Nesipravni podaci.'
                        }
                        
                } catch (error) {
                    // Handle errors
                    this.message = error.response?.data.message || 'An error occurred during login.';
                    console.error('Error during login:', error);
                }
            },
            async getTeachers() {
                try {
                    const response = await axios.get(`${this.uri}/getTeachers`);
                    this.teachers = response.data
                } catch (error) {
                    this.message = error.response?.data.message || 'An error occurred during getTeachers.';
                    console.error('Error during getTeachers:', error);
                }
            }
        }
    }
</script>

<style scoped>
.edn {
    color:#6482ad;
    margin-bottom: 2rem;
}

label {
    color:#6482ad;
}
#outer {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}

.card {
  background-color: #e2dad6;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  max-width: 400px;
  width: 100%;
  box-sizing: border-box;
}

.login-title {
  text-align: center;
  font-size: 24px;
  color: #6482ad;
  margin-bottom: 20px;
  font-weight: bold;
}

.card .form-group {
  margin-bottom: 15px;
}

.card .form-group label {
  margin-bottom: 5px;
  display: block;
  font-weight: 500;
}

.card .form-control {
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #6482ad;
  box-sizing: border-box;
}

.card .btn-primary {
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: none;
  background-color: #7fa1c3;
  color: #6482ad;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.card .btn-primary:hover {
  background-color: #6482ad;
  color: #e2dad6;
}

.card .form-text {
  font-size: 12px;
  color: #f5eded;
}
</style>