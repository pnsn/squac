import { BehaviorSubject, Subject, of, Observable } from 'rxjs';
import { Metric } from '@core/models/metric';
import { Threshold } from '../models/threshold';
import { Widget } from '@features/widgets/models/widget';
import { ChannelGroup } from '@core/models/channel-group';

export class MockWidgetEditService {
  metrics = new BehaviorSubject<Metric[]>([]);
  isValid = new Subject<boolean>();

  testThresholds: { [metricId: number]: Threshold} = {
    1 : new Threshold(1, 1, 1, 1, 1, 1)
  };

  testChannelGroup: ChannelGroup = new ChannelGroup(
    1,
    1,
    'name',
    'name',
    1,
    true,
    true,
    []
  );

  testWidget: Widget = new Widget(
    1,
    1,
    'name',
    'description',
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    []
  );

  updateValidity(): void {
    this.isValid.next(true);
  }

  getThresholds(): { [metricId: number]: Threshold} {
    return this.testThresholds;
  }

  setWidget(widget: Widget): void {
    if (widget) {
      this.metrics.next(widget.metrics);
    }
    this.updateValidity();
  }

  getChannelGroup(): ChannelGroup {
    return this.testChannelGroup;
  }

  getWidget(): Widget {
    return this.testWidget;
  }

  getMetricIds(): void | number[] {
    return [1, 2, 3];
  }

  updateChannelGroup(channelGroup): void {
    this.updateValidity();
  }

  updateMetrics(metrics): void {
    this.updateValidity();
  }

  updateType(id): void {
    this.updateValidity();
  }

  updateThresholds(thresholds): void {
    this.updateValidity();
  }

  updateWidgetInfo(name: string, description: string, dashboardId: number, statType): void {
    this.updateValidity();
  }

  clearWidget(): void {
    this.metrics.next([]);
  }

  saveWidget(): Observable<Widget> {
    return of(this.testWidget);
  }

}
