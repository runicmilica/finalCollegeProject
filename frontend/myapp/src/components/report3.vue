<template>
    <div>
        <table class="table table-hover table-bordered">
            <thead class="tableHeadStyle">
                <tr class="tableHeadStyle">
                <th scope="col" class="rc">Presek stanja</th> 
                <th scope="col" class="rc">Ukupan broj učenika</th>
                <th scope="col" class="rc">Pozitivni</th> 
                <th scope="col" class="rc">Odličnih</th>
                <th scope="col" class="rc">Vrlo dobrih</th> 
                <th scope="col" class="rc">Dobrih</th>
                <th scope="col" class="rc">Dovoljnih</th> 
                <th scope="col" class="rc">Nedovoljnih</th>
                <th scope="col" class="rc">Neocenjeni</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td  class="rc">1. Polugodište</td>
                    <td class="grade">{{nums1.numTotal}}</td>
                    <td class="grade">{{Number(nums1.numTotal) - Number(nums1.numNotEnough)}}</td>
                    <td class="grade">{{nums1.numExcellent}}</td>
                    <td class="grade">{{nums1.numVeryGood}}</td>
                    <td class="grade">{{nums1.numGood}}</td>
                    <td class="grade">{{nums1.numEnough}}</td>
                    <td class="grade">{{nums1.numNotEnough}}</td>
                    <td class="grade">0</td>
                </tr>
                <tr>
                    <td class="rc">2. Polugodište</td>
                    <td class="grade">{{nums2.numTotal}}</td>
                    <td class="grade">{{nums2.numTotal - nums2.numNotEnough}}</td>
                    <td class="grade">{{nums2.numExcellent}}</td>
                    <td class="grade">{{nums2.numVeryGood}}</td>
                    <td class="grade">{{nums2.numGood}}</td>
                    <td class="grade">{{nums2.numEnough}}</td>
                    <td class="grade">{{nums2.numNotEnough}}</td>
                    <td class="grade">0</td>
                </tr>
                <tr>
                    <td class="rc">Cela godina</td>
                    <td class="grade">{{nums2.numTotal}}</td>
                    <td class="grade">{{nums2.numTotal - nums2.numNotEnough}}</td>
                    <td class="grade">{{nums2.numExcellent}}</td>
                    <td class="grade">{{nums2.numVeryGood}}</td>
                    <td class="grade">{{nums2.numGood}}</td>
                    <td class="grade">{{nums2.numEnough}}</td>
                    <td class="grade">{{nums2.numNotEnough}}</td>
                    <td class="grade">0</td>
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
    color: #6482AD;
    font-weight: bold;
}
</style>

<script>
import axios from 'axios';

export default {
    name: "reportThree",
    props: {
        userData: {
            type: Object,
            required: true
        },
    },
    data() {
        return {
            uri: 'http://localhost:4000',
            nums1: [],
            nums2: []
        }
    },
    created() {
        this.report31()
        this.report32()
    },
    methods: {
        async report31() {
            try {
                const results = await axios.post(`${this.uri}/class/report31`, { idSchYear: this.userData.schYearId, idTeacher: this.userData.user.id})
                this.nums1 = results.data[0]
                
            } catch(error) {
                this.message = error.response?.data.message || 'An error occurred during report2.';
                console.error('Error during report2:', error);
            }
        },
        async report32() {
            try {
                const results = await axios.post(`${this.uri}/class/report32`, { idSchYear: this.userData.schYearId, idTeacher: this.userData.user.id})
                this.nums2 = results.data[0]
                
            } catch(error) {
                this.message = error.response?.data.message || 'An error occurred during report2.';
                console.error('Error during report2:', error);
            }
        },
    }
}
</script>