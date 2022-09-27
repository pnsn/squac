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
import { FormArray, FormBuilder } from "@angular/forms";
import { atLeastOneValidator, regexValidator } from "@core/utils/validators";
import { MatchingRule } from "@features/channel-group/models/matching-rule";
import { Subscription } from "rxjs";

@Component({
  selector: "channel-group-matching-rule-edit",
  templateUrl: "./matching-rule-edit.component.html",
  styleUrls: ["./matching-rule-edit.component.scss"],
})
export class MatchingRuleEditComponent implements OnInit, OnChanges, OnDestroy {
  @Input() matchingRules: MatchingRule[];
  @Input() channelGroupId: number;
  @Output() matchingRulesChange = new EventEmitter<MatchingRule[]>();
  @Output() previewRules = new EventEmitter<MatchingRule[]>();
  @Output() matchingRuleDeleteIds = new EventEmitter<number[]>();
  subscription = new Subscription();
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
    this.subscription.add(rulesSub);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.matchingRules) {
      this.initForm();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  makeRuleForm(rule?: MatchingRule) {
    return this.formBuilder.group(
      {
        id: rule?.id || null,
        channelGroupId: this.channelGroupId,
        isInclude: rule ? rule.isInclude : true,
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

  // // Access triggers
  get rules(): FormArray {
    return this.matchingRulesForm.get("rules") as FormArray;
  }

  updateRules() {
    this.matchingRulesChange.emit(this.matchingRules);
  }

  removeRule(index) {
    const rule = this.rules.at(index).value;
    if (rule.id) {
      this.removeRuleIds.push(+rule.id);
    }
    this.rules.removeAt(index);
    this.matchingRulesChange.emit(this.rules.value);
    this.matchingRuleDeleteIds.emit(this.removeRuleIds);
  }

  addRule(rule?: MatchingRule) {
    const ruleFormGroup = this.makeRuleForm(rule);
    this.rules.push(ruleFormGroup, { emitEvent: false });
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
