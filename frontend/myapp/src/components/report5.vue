<template>
    <div>
        <table class="table table-hover table-bordered">
            <thead class="tableHeadStyle">
                <tr class="tableHeadStyle">
                    <th scope="col" class="rc"></th> 
                    <th scope="col" class="rc">1. polugodište </th> 
                    <th scope="col" class="rc">2. polugodište</th> 
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th class="rc">Opravdani</th>
                    <td class="grade"> {{ missings.opravdani1 }} </td>
                    <td class="grade"> {{ missings.opravdani2 }} </td>
                </tr>
                <tr>
                    <th class="rc">Neopravdani</th>
                    <td class="grade"> {{ missings.neopravdani1 }} </td>
                    <td class="grade"> {{ missings.neopravdani2 }} </td>
                </tr>
                <tr>
                    <th class="rc">Neregulisani</th>
                    <td class="grade"> {{ missings.neobradjeni1 }} </td>
                    <td class="grade"> {{ missings.neobradjeni2 }} </td>
                </tr>
            </tbody>
            </table>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'reportFive',
    props: {
        userData: {
            type: Object,
            required: true
        },
    },
    watch: {
        userData: {
            handler() {
                this.report5()
            },
            deep: true
        }
    },
    data() {
        return {
            uri: 'http://localhost:4000',
            missings: {},
            prec: '%'
        }
    },
    created() {
        this.report5()
    },
    methods: {
        async report5() {
            if(this.userData.schYearId == null ||  this.userData.user.id == null) return
            try {
                const results = await axios.post(`${this.uri}/class/report5`, { idSchYear: this.userData.schYearId, idTeacher: this.userData.user.id})
                this.missings = results.data[0]
                // console.log(JSON.stringify(this.subjNums, null, 2))
            } catch(error) {
                this.message = error.response?.data.message || 'An error occurred during report5.';
                console.error('Error during report5:', error);
            }
        }
    }
}
</script>

<style scoped>
.rc {
    color: #0a3d70;
}

.grade {
    font-weight: bold;
    color: #6482AD;
}
</style>

