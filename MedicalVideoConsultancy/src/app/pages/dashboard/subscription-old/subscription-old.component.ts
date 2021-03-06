import { Component, OnInit } from '@angular/core';
import { ProviderService } from './../../../_services/provider.service';
import { UserService } from './../../../_services/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-subscription-old',
  templateUrl: './subscription-old.component.html',
  styleUrls: ['./subscription-old.component.css']
})
export class SubscriptionOldComponent implements OnInit {
  providerData: any;
  planData: any;
  cardData:any;
  currentPlan: any;
  otherPlan = [];
  newCardVal: any;
  newPlanVal: any;
  updateKey = false;
  iteralData = [];
  constructor(
    private providerService: ProviderService,
    private userService: UserService,
    private router:Router
  ) {
    this.providerData = JSON.parse(localStorage.getItem('currentUser'));


  }

  ngOnInit(): void {
    if (this.providerData.planId)
      this.providerService.getPlans()
        .subscribe(res => {
          this.planData = res;
          this.planData.forEach(element => {
            if (this.providerData.planId === element._id)
              this.currentPlan = element;
            else
              this.otherPlan.push(element)
          });

          this.providerService.getCard(this.providerData.id)
            .subscribe(res => {
              this.cardData=res;
            })

        })

  }
  Delete() {
   
  }
  addCard() {
    const sendData={
      key:'update',
      val:this.currentPlan._id
    }
    this.router.navigateByUrl('/dashboard/subscription-new/'+JSON.stringify(sendData));
  }
  Upgrade(item) {
    // this.newPlanVal=item;
    // if(this.newCardVal && this.newPlanVal)
    // this.updateKey=true;
    this.currentPlan = item;
  }
  Save() {

    if (this.cardData.length > 1)
      Swal.fire('cardNumder is only one.')

    this.currentPlan.id = this.providerData.planId;
    this.cardData[0].providerId = this.providerData.id

    this.userService.updateUserPlanId({ providerId: this.providerData.id, planId: this.currentPlan._id })
      .subscribe(res => {
        if (res) {
          this.providerService.updateCard(this.cardData[0]).subscribe(res2 => {
            if (res2)
              Swal.fire('Updated successfully!')
          })
          this.providerService.getPlans()
            .subscribe(res => {
              this.planData = res;
              this.planData.forEach(element => {
                if (this.currentPlan._id === element._id)
                  this.currentPlan = element;
                else{
                  this.otherPlan=[];
                  this.otherPlan.push(element)
                }
                  
              });
            })
        }
      })
  }
  cancelSubscription(){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.providerService.removeCard(this.cardData._id)
        .subscribe(res=>{
          if(res){
            this.userService.changeUserSubscriptionStatus(this.providerData.id).subscribe(res2=>{
              Swal.fire('Deleted successfully');
              localStorage.setItem('currentUser', JSON.stringify(res2));
              this.router.navigateByUrl('/dashboard/subscription-plan');
            })
           
          }
        })
      }
    })
    
  }

}
