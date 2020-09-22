
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';
import { FullComponent } from "./layouts/full/full.component";
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppHeaderComponent } from './layouts/full/header/header.component';
import { AppSidebarComponent } from './layouts/full/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from './demo-material-module';
import { SharedModule } from './shared/shared.module';
import { SpinnerComponent } from './shared/spinner.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { DefaultComponent } from "./layouts/default/default.component";
import { ToolbarComponent } from './layouts/default/toolbar/toolbar.component';
import { MenubarComponent } from './layouts/default/menubar/menubar.component';
import { FooterComponent } from './layouts/default/footer/footer.component';
import { authInterceptorProviders } from "../_helpers/auth.interceptor";
import { MeetRoomComponent } from './meet-room/meet-room.component';
import { FormsModule , ReactiveFormsModule} from "@angular/forms";
import { MeetRoomService } from "../_services/meet-room.service";
import { VideoRoomComponent } from './video-room/video-room.component';
import { MeetCallComponent } from './pay-patient/meet-call/meet-call.component';
import { PayPatientComponent } from './pay-patient/pay-patient.component';

@NgModule({
  declarations: [
    AppComponent,
    FullComponent,
    AppHeaderComponent,
    SpinnerComponent,
    AppSidebarComponent,
    DefaultComponent,
    ToolbarComponent,
    MenubarComponent,
    FooterComponent,
    MeetRoomComponent,
    VideoRoomComponent,
    MeetCallComponent,
    PayPatientComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
    SharedModule,
    CKEditorModule,
    RouterModule.forRoot(
      AppRoutes,
      { useHash: true },
    ),
  ],
  providers: [
    authInterceptorProviders,
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    },
    MeetRoomService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
