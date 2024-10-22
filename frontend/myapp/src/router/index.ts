import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Login from '../views/Login.vue'
import AddClass from '@/views/AddClass.vue'
import StudentData from '@/views/StudentData.vue'
import GradeLog from '@/views/GradeLog.vue'
import MissingStudents from '@/views/MissingStudents.vue'
import HomePage from '@/views/HomePage.vue'
import StudentInfo from '@/views/StudentInfo.vue'
import ReportsPage from '@/views/ReportsPage.vue'
import SettingsPage from '@/views/SettingsPage.vue'
import PrincipalPage from '@/views/PrincipalPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/homePage',
    name: 'homePage',
    component: HomePage,
    children: [
      {
        path: 'studentdata',
        name: 'studentdata',
        component: StudentData
      },
      {
        path: 'gradelog',
        name: 'gradelog',
        component: GradeLog,
      },
      {
        path: 'addClass',
        name: 'addClass',
        component: AddClass
      },
      {
        path: 'missingstudents',
        name: 'missingstudents',
        component: MissingStudents
      },
      {
        path: 'studentinfo',
        name: 'studentinfo',
        component: StudentInfo
      },
      {
        path: 'reports',
        name: 'reports',
        component: ReportsPage
      },
      {
        path: 'settings',
        name: 'settings',
        component: SettingsPage
      },
    ]
  },
  {
    path: '/principalPage',
    name: 'principalPage',
    component: PrincipalPage
  }
  
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
