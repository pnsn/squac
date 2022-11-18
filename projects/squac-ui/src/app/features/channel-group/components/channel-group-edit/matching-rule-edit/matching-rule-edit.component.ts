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
import { UntypedFormArray, UntypedFormBuilder } from "@angular/forms";
import { atLeastOneValidator, regexValidator } from "@core/utils/validators";
import { MatchingRule } from "squacapi";
import { Subscription } from "rxjs";

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
  constructor(private formBuilder: UntypedFormBuilder) {}

  matchingRulesForm = this.formBuilder.group({
    rules: this.formBuilder.array([]),
  });

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
          this._matchingRules.push(value);
        }
      });
    });
    this.subscription.add(rulesSub);
  }

  ngOnChanges(changes: SimpleChanges): void {
    //only take initial values
    if (changes.matchingRules && this.matchingRules) {
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
  get rules(): UntypedFormArray {
    return this.matchingRulesForm.get("rules") as UntypedFormArray;
  }

  updateRules() {
    this.matchingRulesChange.emit(this._matchingRules);
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
    // this.rules.clear({ emitEvent: false });

    //only take initial matchingRules
    if (this.matchingRules.length > 0 && !this._matchingRules) {
      this._matchingRules = this.matchingRules.slice();
      this._matchingRules?.forEach((rule) => {
        this.addRule(rule);
      });
    }
  }

  uppercase(eventTarget: any, source: string, index: number) {
    this.rules.controls[index].patchValue({
      [source]: (eventTarget as HTMLInputElement).value.toUpperCase(),
    });
  }

  previewChannels() {
    this.previewRules.emit(this._matchingRules);
    //request channels
  }
}
