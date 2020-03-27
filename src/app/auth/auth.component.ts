import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService} from './auth.service';
import { onErrorResumeNext, Observable, Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})

// This component handles the login page
export class AuthComponent implements OnInit {


  constructor(

  ) { }

  ngOnInit() {

  }


}
