const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const db = require('./queries')
const port = 4000
app.use(cors({origin: 'http://localhost:8080'}))
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/getTeachers', db.getTeachers)
app.get('/schools', db.getSchools)
app.post('/teacher/login', db.login)
app.post('/teacher/getAllSchools', db.getAllSchools)
app.post('/teacher/getSchYearsForSchoolAndTeacher', db.getSchYearsForSchoolAndTeacher)
app.post('/schools/setEndDateOfFirstSem', db.setEndDateOfFirstSem)
app.post('/schools/setStartDateOfSecondSem', db.setStartDateOfSecondSem)
app.post('/schools/getClassesThatTeacherTeaches', db.getClassesThatTeacherTeaches)
app.post('/schools/getSubjectsThatTeacherTeachesToThatClass', db.getSubjectsThatTeacherTeachesToThatClass)

// class
app.post('/class/setEndOfFirstQ', db.setEndOfFirstQ)
app.post('/class/setEndOfThirdQ', db.setEndOfThirdQ)

app.post('/wweek/getWeeksAndDays', db.getWeeksAndDays)
app.post('/wdays/getWDay', db.getWDay)
app.post('/wdays/toggleTeachingDay', db.toggleTeachingDay)
app.post('/wdays/updateNote', db.updateNote)
app.post('/wclass/insertClass', db.insertClass)
app.post('/wclass/insertNotHeldClass', db.insertNotHeldClass)
app.get('/wclass/getClassTypes', db.getClassTypes)
app.post('/wclass/findClassesForDate', db.findClassesForDate)
app.post('/wclass/findPreviousLesson', db.findPreviousLesson)
app.post('/wclass/classNumInDateExists', db.classNumInDateExists)
app.post('/wclass/deleteMissStudAndWclass', db.deleteMissStudAndWclass)
app.post('/wclass/checkDateAndWClass', db.checkDateAndWClass)

// students
app.post('/student/getStudentsInClass', db.getStudentsInClass)
app.post('/student/getStudentsInClassListensSubj', db.getStudentsInClassListensSubj)
app.post('/student/getStudentsInClassOrder', db.getStudentsInClassOrder)
app.post('/student/getMonitorsForClass', db.getMonitorsForClass)
app.post('/student/getMissStudFromPreviousClass', db.getMissStudFromPreviousClass)
app.post('/student/getGradingType', db.getGradingType)
app.get('/student/getGradeTypes', db.getGradeTypes)
app.post('/student/studentsAbsences', db.studentsAbsences)
app.post('/student/studentsAbsencesStatusChange', db.studentsAbsencesStatusChange)
app.post('/student/studentsNoG', db.studentsNoG)
app.post('/student/addDisciplinaryMeasure', db.addDisciplinaryMeasure)
app.post('/student/getDisciplinaryMeasures', db.getDisciplinaryMeasures)
app.post('/student/getHeadTeacher', db.getHeadTeacher)
app.post('/student/updateStudentsInfo', db.updateStudentsInfo)
app.post('/student/getSubjectsAndTeachersForStudent', db.getSubjectsAndTeachersForStudent)
app.post('/student/getSubjectsInSchYear', db.getSubjectsInSchYear)
app.post('/student/getTeachersThatTeachesSubj', db.getTeachersThatTeachesSubj)
app.post('/student/getGradingTypeForAddingSubj', db.getGradingTypeForAddingSubj)
app.get('/student/getAllGradingTypes', db.getAllGradingTypes)
app.post('/student/insertIntoListens', db.insertIntoListens)
app.post('/student/insertIntoSubjGradType', db.insertIntoSubjGradType)
app.post('/student/deleteFromListens', db.deleteFromListens)
// reports for student
app.post('/class/isHeadTeacher', db.isHeadTeacher)
app.post('/student/getSuccess', db.getSuccess)
app.post('/student/getAllGrades', db.getAllGrades)
app.post('/class/report1', db.report1)
app.post('/class/report2', db.report2)
app.post('/class/report31', db.report31)
app.post('/class/report32', db.report32)
app.post('/class/report4', db.report4)
app.post('/class/report5', db.report5)

// settings
app.post('/school_year/getWeeksInSchYear', db.getWeeksInSchYear)
app.post('/school_year/getTeachersSubjectsInSchYear', db.getTeachersSubjectsInSchYear)
app.post('/school_year/getClassNums', db.getClassNums)
app.post('/school_year/setClassNums', db.setClassNums)


// grades
app.post('/grade/insertGrade', db.insertGrade)
app.post('/grade/getStudGrades', db.getStudGrades)
app.post('/grade/averageGradeYear', db.averageGradeYear)
app.post('/grade/averageGradeSem1', db.averageGradeSem1)
app.post('/grade/averageGradeSem2', db.averageGradeSem2)
app.post('/grade/getDatesInYearForClass', db.getDatesInYearForClass)
app.post('/grade/sendDeletionReq', db.sendDeletionReq)
app.post('/grade/updateGrade', db.updateGrade)

// admin
app.post('/admin/getSchoolAndSchoolYear', db.getSchoolAndSchoolYear)
app.post('/admin/getClassesAndHeadTeacher', db.getClassesAndHeadTeacher)
app.post('/admin/getDeletionReq', db.getDeletionReq)
app.post('/admin/deleteGrade', db.deleteGrade)
app.post('/admin/hasMonitors', db.hasMonitors)
app.post('/admin/report6', db.report6)

app.listen(port, () => {
console.log(`App running on port ${port}.`)
})