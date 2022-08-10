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
  @Input() channelGroupId: number;
  @Output() matchingRulesChange = new EventEmitter<MatchingRule[]>();
  @Output() previewRules = new EventEmitter<MatchingRule[]>();
  removeRuleIds = [];
  constructor(private formBuilder: FormBuilder) {}

  matchingRulesForm = this.formBuilder.group({
    rules: this.formBuilder.array([]),
  });

  ngOnInit(): void {
    const rulesSub = this.rules.valueChanges.subscribe((values) => {
      if (this.rules.valid) {
        this.matchingRules = values;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log(changes);
    if (changes.matchingRules) {
      console.log("rules changed");
      this.initForm();
    }
  }
  //uppercase everything

  makeRuleForm(rule?: MatchingRule) {
    return this.formBuilder.group({
      id: rule?.id || null,
      channelGroupId: this.channelGroupId,
      isInclude: rule?.isInclude || true,
      networkRegex: [
        rule?.networkRegex || "",
        { validators: [regexValidator()] },
      ],
      stationRegex: [
        rule?.stationRegex || "",
        { validators: [regexValidator()] },
      ],
      locationRegex: [
        rule?.locationRegex || "",
        { validators: [regexValidator()] },
      ],
      channelRegex: [
        rule?.channelRegex || "",
        { validators: [regexValidator()] },
      ],
    });
  }

  // // Access triggers
  get rules(): FormArray {
    return this.matchingRulesForm.get("rules") as FormArray;
  }

  removeRule(index) {
    const rule = this.rules.at(index).value;
    if (rule.id) {
      this.removeRuleIds.push(+rule.id);
    }
    this.rules.removeAt(index);
    this.matchingRulesChange.emit(this.rules.value);
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
    this.rules.clear({ emitEvent: false });
    this.matchingRules?.forEach((rule) => {
      this.addRule(rule);
    });
  }

  previewChannels() {
    this.previewRules.emit(this.matchingRules);
    //request channels
  }
}
export function regexValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let isValid = true;
    if (control.value === "") {
      return null;
    }
    try {
      new RegExp(control.value);
    } catch (e) {
      isValid = false;
    }
    return isValid ? null : { inValidRegex: { value: control.value } };
  };
}
