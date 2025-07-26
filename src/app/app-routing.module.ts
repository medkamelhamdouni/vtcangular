import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PaymentComponent } from './payment/payment.component';
import { BookingFormComponent } from './booking-form/booking-form.component';
import { DriverProfileComponent } from './driver-profile/driver-profile.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { BookingComponent } from './booking/booking.component';
import { ReclamationComponent } from './reclamation/reclamation.component';
import { DriverListComponent } from './driver-list/driver-list.component';
import { EditCourseComponent } from './edit-course/edit-course.component';

const routes: Routes = [
  { path: 'createtrip', component: BookingFormComponent }, // <app-home>
  { path: 'forgetpassword', component: ForgotpasswordComponent }, // <app-home>
  { path: 'book', component: BookingComponent }, // <app-home>
  { path: 'reclamation', component: ReclamationComponent }, // <app-home>
  { path: 'chauffeurs', component: DriverListComponent }, // <app-home>
  {
  path: 'edit-course/:id',
  component: EditCourseComponent,
},
{ 
    path: 'chauffeur/:id', // <-- Changed from 'b' to include a dynamic ID
    component: DriverProfileComponent 
  }, 
  
  { 
    path: 'course/:id', // <-- Changed from 'b' to include a dynamic ID
    component: CourseDetailComponent 
  }, 
  
  { path: 'pay/:id', component: PaymentComponent }, // <app-home>
  
  { path: 'admin', component: HomeComponent }, // <app-home>
 
  { path: '', redirectTo: '/book', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },

 //{ path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
