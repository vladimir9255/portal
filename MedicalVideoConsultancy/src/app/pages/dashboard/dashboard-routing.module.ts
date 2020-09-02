import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FullComponent} from "../layouts/full/full.component";
import {HealthProviderComponent} from "./health-provider/health-provider.component";
import {AdminComponent} from "./admin/admin.component";
import {SuperComponent} from "./super/super.component";
import {ProfileComponent} from "./profile/profile.component";
import {EditRoomComponent} from "./edit-room/edit-room.component";
import { HealthRoomComponent } from './health-room/health-room.component';
import { PatientChartsComponent } from './patient-charts/patient-charts.component';
import { PatientComponent } from './patient/patient/patient.component';


const routes:Routes = [{
  path: '',
  component: FullComponent,
  children: [
    {
      path: '',
      redirectTo: 'super',
      pathMatch: 'full'
    },

    {
      path: 'profile',
      component: ProfileComponent
    },
    {
      path: 'health-provider',
      component: HealthProviderComponent
    },

    {
      path: 'health-provider/edit-room',
      component: EditRoomComponent
    },
    {
      path: 'health-room/:patientId',
      component: HealthRoomComponent
    },

    {
      path: 'admin',
      component: AdminComponent
    },

    {
      path: 'super',
      component: SuperComponent,
    },
    {
      path: 'patient/:id',
      component: PatientComponent
    },
    {
      path: 'patient-charts',
      component: PatientChartsComponent
    },

  ]
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }