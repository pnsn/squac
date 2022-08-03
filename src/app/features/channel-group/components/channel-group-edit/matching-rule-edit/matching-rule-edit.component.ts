import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { MatchingRule } from "@features/channel-group/models/matching-rule";

@Component({
  selector: "channel-group-matching-rule-edit",
  templateUrl: "./matching-rule-edit.component.html",
  styleUrls: ["./matching-rule-edit.component.scss"],
})
export class MatchingRuleEditComponent implements OnInit, OnChanges {
  @Input() matchingRules: MatchingRule[];
  @Output() matchingRulesChange = new EventEmitter<MatchingRule[]>();

  constructor(private formBuilder: FormBuilder) {}

  matchingRulesForm = this.formBuilder.group({
    rules: this.formBuilder.array([]),
  });

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes.matchingRules) {
      this.initForm();
    }
  }
  //uppercase everything

  makeRuleForm(rule?: MatchingRule) {
    return this.formBuilder.group({
      isInclude: rule.isInclude || true,
      networkRegex: [
        rule.networkRegex || "nothing",
        { validators: [regexValidator(), Validators.required] },
      ],
      stationRegex: rule.stationRegex || "",
      locationRegex: rule.locationRegex || "",
      channelRegex: rule.channelRegex || "",
    });
  }

  // // Access triggers
  get rules(): FormArray {
    return this.matchingRulesForm.get("rules") as FormArray;
  }

  validateRule(values, ruleFormGroup) {}
  addRule(rule?: MatchingRule) {
    const ruleFormGroup = this.makeRuleForm(rule);
    ruleFormGroup.valueChanges.subscribe((value) => {
      this.validateRule(value, ruleFormGroup);
    });
    this.rules.push(ruleFormGroup);
  }

  initForm() {
    this.matchingRules.forEach((rule) => {
      this.addRule(rule);
    });
  }
}
export function regexValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let isValid = true;
    try {
      new RegExp(control.value);
    } catch (e) {
      isValid = false;
    }
    return isValid ? null : { inValidRegex: { value: control.value } };
  };
}
