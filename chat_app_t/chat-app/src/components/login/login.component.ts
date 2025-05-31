import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
// import { AuthService } from '../../utils/services/auth.service';
import { login } from '../../store/actions/auth.action';
import { Store } from '@ngrx/store';
import { selectError, selectUser } from '../../store/selectors/auth.selector';
import { filter, Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private destroy$ = new Subject<void>();
  password: String = '';
  restictedName: String = 'Mudra';
  email: String = '';
  loginForm!: FormGroup;
  data: any;

  router: Router = inject(Router);
  // authService: AuthService = inject(AuthService);
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  store: Store = inject(Store);

  ngOnInit(): void {
    //create form group manually
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      hobbies: new FormArray([]),
    });
  }

  isStrongPassword(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasMinLenth = value.length >= 8;
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[\d]/.test(value);
    const hasSpecialChar = /[@#$%&*?!]/.test(value);
    console.log(`uppercase : ${hasUpperCase}`);
    console.log(`uppercase : ${hasLowerCase}`);
    console.log(`uppercase : ${hasNumber}`);
    console.log(`uppercase : ${hasSpecialChar}`);

    if (
      !hasLowerCase ||
      !hasNumber ||
      !hasSpecialChar ||
      !hasUpperCase ||
      !hasMinLenth
    ) {
      return { weakPassword: true };
    }

    return null;
  }

  login = () => {
    this.email = this.loginForm.value.email;
    this.password = this.loginForm.value.password;

    const endPoint = 'auth/login';
    const body = { email: this.email, password: this.password };

    this.store.dispatch(login({ endPoint: endPoint, body: body }));
    console.log('method dispatched');

    // this.store.select(selectError).subscribe((error) => {
    //   if (error) {
    //     console.log(error);
    //     this.loginForm.reset();
    //   } else {
    this.store
      .select(selectUser)
      .pipe(take(1))
      .subscribe((userData) => {
        if (userData) {
          this.data = userData;
        }
      });

    // }
    // });
  };
}
