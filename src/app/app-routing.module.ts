import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PaymentComponent } from './payment/payment.component';
import { BookingFormComponent } from './booking-form/booking-form.component';
import { DriverProfileComponent } from './driver-profile/driver-profile.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';

const routes: Routes = [
  { path: 'createtrip', component: BookingFormComponent }, // <app-home>
  { 
    path: 'course/:id', // <-- Changed from 'b' to include a dynamic ID
    component: CourseDetailComponent 
  }, 
  
  { path: 'c', component: PaymentComponent }, // <app-home>
  { path: 'chauffeurs', component: DriverProfileComponent }, // <app-home>
  
  { path: 'home', component: HomeComponent }, // <app-home>
 
  { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },

 //{ path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
