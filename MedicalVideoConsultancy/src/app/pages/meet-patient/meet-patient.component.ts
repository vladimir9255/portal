import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from "../../../environments/environment";
import { constant } from "../../_config/constant";
import { Patient } from '../../_model/user';
import { ContentBlogService } from '../../_services/content-blog.service';
import { MeetRoomService } from '../../_services/meet-room.service';
import { ProviderService } from '../../_services/provider.service';
import { UserService } from '../../_services/user.service';
import { AuthPatientService } from '../../_services/auth.patient.service';

@Component({
  selector: 'app-meet-patient',
  templateUrl: './meet-patient.component.html',
  styleUrls: ['./meet-patient.component.css']
})
export class MeetPatientComponent implements OnInit {

  private roomName: string;
  public providerData: any;
  public patientData: Object;
  public image: string;

  public step = 0;
  public step_waiting_page = 1;
  public step_payment_page = 2;
  public step_attetion_page = 3;
  public step_feeback_page = 4;

  identify = null;
  identify_patient = 'OK';
  no_identify_patient = 'NOK';

  constructor(
    private route: ActivatedRoute,
    private meetRoomService: MeetRoomService,
    private providerService: ProviderService,
    private authPatientService: AuthPatientService,
    private _router: Router) {
    this.patientData = this.authPatientService.getCurrentUser
    console.log("MeetPatientComponent this.patientData");
    console.log(this.patientData);
    //this.patientData = localStorage.getItem('patient');
    this.identify = localStorage.getItem('patient_auth');
    this.providerData = JSON.parse(localStorage.getItem('provider'));

    this.patientData['providerId'] =  this.providerData._id;
    this.patientData['room'] = this.providerData.room;
    this.patientData['providerId'] = this.providerData._id;

    this.providerService.updatePatient(this.patientData).subscribe((patientUpdated: Patient) => {
      this.meetRoomService.confirmConnectPatient(patientUpdated);
      this.patientData = patientUpdated;
    });

    this.route.paramMap.subscribe(params => {
      this.roomName = params.get('roomName');
    });

  }

  ngOnInit() {
    if (this.no_identify_patient == this.identify) {
      this._router.navigateByUrl('/auth/sign-in-patient');
      this.clean();
      return;
    }
    if (this.patientData == undefined || this.providerData == undefined) {
      this._router.navigateByUrl('/auth/sign-in-patient');
      this.clean();
      return;
    }

    this.meetRoomService.connectioProvider().subscribe(providerStatus => {
      this.providerData.connection = true
    });
    this.meetRoomService.disconnectioProvider().subscribe(providerStatus => {
      this.providerData.connection = false
    });

    let step_cache = localStorage.getItem('step_attetion');
    if (step_cache) {
      this.step = parseInt(step_cache);
    } else {
      this.providerService.checkRoomExist(this.roomName)
        .subscribe(result => {
          this.providerData = result;
          this.step = this.step_waiting_page;
        });
    }
    this.meetRoomService.providerEntered().subscribe(data => {
      if (data) {
        this.providerService.checkRoomExist(this.roomName)
          .subscribe(result => {
            this.providerData = result;
            this.step = this.step_payment_page;
            localStorage.setItem('step_attetion', this.step.toString());
          });
      }
    });
    this.meetRoomService.receiveConfirmProvider().subscribe(confirmProvider => {
      if (confirmProvider) {
        this.providerService.checkRoomExist(this.roomName)
          .subscribe(result => {
            this.providerData = result;
            this.step = this.step_attetion_page;
            localStorage.setItem('step_attetion', this.step.toString());
          });
      }
    });

    this.meetRoomService.receiveEndCall()
      .subscribe(async (text) => {
        if (text === 'endCall') {
          this.meetRoomService.endCall(this.providerData.socketId, 'acceptEnd');
          this.meetRoomService.stopVideoAudio();
          this.step = this.step_feeback_page;
          localStorage.setItem('step_attetion', this.step.toString());
        }
      });
  }

  clean() {
    this.providerData = null;
    localStorage.removeItem("patient_dni")
    localStorage.removeItem("patient_auth")
  }

  closeinstanceSession() {
    this.clean();
    this._router.navigateByUrl('/');
  }

}
