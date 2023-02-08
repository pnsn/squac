import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { atLeastOneValidator, regexValidator } from "@core/utils/validators";
import { MatchingRule } from "squacapi";
import { Subscription } from "rxjs";

interface MatchingRuleForm {
  id: FormControl<number>;
  channelGroupId: FormControl<number>;
  isInclude: FormControl<boolean>;
  networkRegex: FormControl<string>;
  stationRegex: FormControl<string>;
  channelRegex: FormControl<string>;
  locationRegex: FormControl<string>;
}

interface MatchingRulesForm {
  rules: FormArray<FormGroup<MatchingRuleForm>>;
}

/**
 * Component for editing matching rules
 */
@Component({
  selector: "channel-group-matching-rule-edit",
  templateUrl: "./matching-rule-edit.component.html",
  styleUrls: ["./matching-rule-edit.component.scss"],
})
export class MatchingRuleEditComponent implements OnInit, OnChanges, OnDestroy {
  _matchingRules: MatchingRule[];
  @Input() matchingRules: MatchingRule[];
  @Input() channelGroupId: number;
  @Output() matchingRulesChange = new EventEmitter<MatchingRule[]>();
  @Output() previewRules = new EventEmitter<MatchingRule[]>();
  @Output() matchingRuleDeleteIds = new EventEmitter<number[]>();
  subscription = new Subscription();
  removeRuleIds = [];
  constructor(private formBuilder: FormBuilder) {}

  matchingRulesForm: FormGroup<MatchingRulesForm> = this.formBuilder.group({
    rules: this.formBuilder.array<FormGroup<MatchingRuleForm>>([]),
  });

  /**
   * Subscrive to value changes on form
   */
  ngOnInit(): void {
    const rulesSub = this.rules.valueChanges.subscribe((values) => {
      this._matchingRules = [];
      values.forEach((value) => {
        if (
          value.networkRegex ||
          value.stationRegex ||
          value.locationRegex ||
          value.channelRegex
        ) {
          this._matchingRules.push(value as MatchingRule);
        }
      });
    });
    this.subscription.add(rulesSub);
  }

  /**
   * Listen to input changes
   *
   * @param changes input changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    //only take initial values
    if (changes["matchingRules"] && this.matchingRules) {
      this.initForm();
    }
  }

  /**
   * unsubscribe
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * make form for matching rule
   *
   * @param rule new matching rule to add
   * @returns created form group
   */
  makeRuleForm(rule?: MatchingRule): FormGroup<MatchingRuleForm> {
    return this.formBuilder.group<MatchingRuleForm>(
      {
        id: new FormControl(rule?.id || null),
        channelGroupId: new FormControl(this.channelGroupId),
        isInclude: new FormControl(rule ? rule.isInclude : true),
        networkRegex: new FormControl(rule?.networkRegex || "", {
          validators: [regexValidator()],
        }),
        stationRegex: new FormControl(rule?.stationRegex || "", {
          validators: [regexValidator()],
        }),
        locationRegex: new FormControl(rule?.locationRegex || "", {
          validators: [regexValidator()],
        }),
        channelRegex: new FormControl(rule?.channelRegex || "", {
          validators: [regexValidator()],
        }),
      },
      {
        validators: [
          atLeastOneValidator([
            "networkRegex",
            "stationRegex",
            "locationRegex",
            "channelRegex",
          ]),
        ],
      }
    );
  }

  /**
   * @returns form array of matching rules
   */
  get rules(): FormArray<FormGroup<MatchingRuleForm>> {
    return this.matchingRulesForm.get("rules") as FormArray<
      FormGroup<MatchingRuleForm>
    >;
  }

  /**
   * Emit updated rules
   */
  updateRules(): void {
    this.matchingRulesChange.emit(this._matchingRules);
  }

  /**
   * Removes rule at given index and emit results
   *
   * @param index rule index
   */
  removeRule(index: number): void {
    const rule = this.rules.at(index).value;
    if (rule.id) {
      this.removeRuleIds.push(+rule.id);
    }
    this.rules.removeAt(index);
    this.matchingRulesChange.emit(this.rules.value as MatchingRule[]);
    this.matchingRuleDeleteIds.emit(this.removeRuleIds);
  }

  /**
   * Add new matching rule
   *
   * @param rule rule to add
   */
  addRule(rule?: MatchingRule): void {
    const ruleFormGroup = this.makeRuleForm(rule);
    this.rules.push(ruleFormGroup, { emitEvent: false });
  }

  /**
   * Set up rule form
   */
  initForm(): void {
    //only take initial matchingRules
    if (this.matchingRules.length > 0 && !this._matchingRules) {
      this._matchingRules = this.matchingRules.slice();
      this._matchingRules?.forEach((rule) => {
        this.addRule(rule);
      });
    }
  }

  /**
   * Ensure form is uppercased
   *
   * @param eventTarget form field
   * @param source form control
   * @param index form index
   */
  uppercase(eventTarget: any, source: string, index: number): void {
    this.rules.controls[index].patchValue({
      [source]: (eventTarget as HTMLInputElement).value.toUpperCase(),
    });
  }

  /**
   * Emit matching rules
   */
  previewChannels(): void {
    this.previewRules.emit(this._matchingRules);
  }
}
