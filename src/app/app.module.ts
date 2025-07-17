import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

// Import BOTH form modules
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { DetailcourseComponent } from './detailcourse/detailcourse.component';
import { DetailchauffeurComponent } from './detailchauffeur/detailchauffeur.component';
import { HomeComponent } from './home/home.component';
import { PaymentComponent } from './payment/payment.component';
import { NavbarComponent } from './navbar/navbar.component';
// Correct the casing for EditTripComponent
import { EditTripComponent } from './edittrip/edittrip.component';
import { BookingFormComponent } from './booking-form/booking-form.component';
import { DriverProfileComponent } from './driver-profile/driver-profile.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotpasswordComponent,
    DetailcourseComponent,
    DetailchauffeurComponent,
    HomeComponent,
    PaymentComponent,
   
    // Ensure the name here matches the imported class name
    EditTripComponent,
    BookingFormComponent,
    
  ],
  imports: [
    BrowserModule,
    FormsModule, NavbarComponent,
    ReactiveFormsModule, // <-- Add this module
    HttpClientModule,    DriverProfileComponent,    CourseDetailComponent,


    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }