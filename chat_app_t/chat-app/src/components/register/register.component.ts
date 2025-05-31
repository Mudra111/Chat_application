import { Component, inject, OnInit } from '@angular/core';
import { OnIdentifyEffects } from '@ngrx/effects';
import { register } from '../../store/actions/auth.action';
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
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import {
  selectError,
  selectIsRegistered,
} from '../../store/selectors/auth.selector';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  password: String = '';
  restictedName: String = 'Mudra';
  email: String = '';
  name: String = '';
  registerForm!: FormGroup;
  data: any;
  phone: String = '';

  router: Router = inject(Router);
  // authService: AuthService = inject(AuthService);
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  store: Store = inject(Store);

  ngOnInit(): void {
    //create form group manually
    this.registerForm = new FormGroup({
      email: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [
        Validators.required,
        this.isStrongPassword,
      ]),
      name: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [
        Validators.required,
        Validators.maxLength(10),
        Validators.minLength(10),
      ]),
    });
  }

  isStrongPassword(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasMinLenth = value.length >= 6;
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[\d]/.test(value);
    const hasSpecialChar = /[@#$%&*?!]/.test(value);
    // console.log(`uppercase : ${hasUpperCase}`);
    // console.log(`uppercase : ${hasLowerCase}`);
    // console.log(`uppercase : ${hasNumber}`);
    // console.log(`uppercase : ${hasSpecialChar}`);

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

  register = () => {
    // console.log('register called');

    this.email = this.registerForm.value.email;
    this.password = this.registerForm.value.password;
    this.name = this.registerForm.value.name;
    this.phone = this.registerForm.value.phone;

    const endPoint = 'auth/signup';
    const body = {
      email: this.email,
      password: this.password,
      name: this.name,
      phone_number: this.phone,
    };

    this.store.dispatch(register({ endPoint: endPoint, body: body }));

    this.store.select(selectError).subscribe((error) => {
      if (error) {
        this.registerForm.reset();
      } else {
        this.store.select(selectIsRegistered).subscribe((isRegistered) => {
          if (isRegistered) {
            this.router.navigate(['/login']);
          }
        });
      }
    });
  };
}
