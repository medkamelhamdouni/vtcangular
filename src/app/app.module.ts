import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

// Import BOTH form modules
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { HomeComponent } from './home/home.component';
import { PaymentComponent } from './payment/payment.component';
import { NavbarComponent } from './navbar/navbar.component';
// Correct the casing for EditTripComponent
import { BookingFormComponent } from './booking-form/booking-form.component';
import { DriverProfileComponent } from './driver-profile/driver-profile.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { CardInformationComponent } from './card-information/card-information.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BookingComponent } from './booking/booking.component';
import { AboutComponent } from './about/about.component';
import { ServicessComponent } from './servicess/servicess.component';
import { ContactComponent } from './contact/contact.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotpasswordComponent,
    HomeComponent,
    PaymentComponent,
   
    BookingFormComponent,
    CardInformationComponent,
    BookingComponent,
    AboutComponent,
    ServicessComponent,
    ContactComponent,
    
  ],
  imports: [
    BrowserModule,
    FormsModule, NavbarComponent,
    ReactiveFormsModule, // <-- Add this module
    HttpClientModule,    DriverProfileComponent,    CourseDetailComponent,


    AppRoutingModule,
      BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }