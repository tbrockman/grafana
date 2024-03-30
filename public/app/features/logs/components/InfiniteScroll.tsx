import { css } from '@emotion/css';
<<<<<<< HEAD
import React, { ReactNode, useEffect, useState } from 'react';

import { AbsoluteTimeRange, LogRowModel, TimeRange } from '@grafana/data';
import { convertRawToRange, isRelativeTime, isRelativeTimeRange } from '@grafana/data/src/datetime/rangeutil';
import { LogsSortOrder, TimeZone } from '@grafana/schema';
import { Spinner } from '@grafana/ui';
=======
import React, { ReactNode, useEffect, useRef, useState } from 'react';

import { AbsoluteTimeRange, LogRowModel, TimeRange } from '@grafana/data';
import { convertRawToRange, isRelativeTime, isRelativeTimeRange } from '@grafana/data/src/datetime/rangeutil';
import { config, reportInteraction } from '@grafana/runtime';
import { LogsSortOrder, TimeZone } from '@grafana/schema';

import { LoadingIndicator } from './LoadingIndicator';
>>>>>>> graf/main

export type Props = {
  children: ReactNode;
  loading: boolean;
  loadMoreLogs?: (range: AbsoluteTimeRange) => void;
  range: TimeRange;
  rows: LogRowModel[];
  scrollElement?: HTMLDivElement;
  sortOrder: LogsSortOrder;
  timeZone: TimeZone;
<<<<<<< HEAD
=======
  topScrollEnabled?: boolean;
>>>>>>> graf/main
};

export const InfiniteScroll = ({
  children,
  loading,
  loadMoreLogs,
  range,
  rows,
  scrollElement,
  sortOrder,
  timeZone,
<<<<<<< HEAD
=======
  topScrollEnabled = false,
>>>>>>> graf/main
}: Props) => {
  const [upperOutOfRange, setUpperOutOfRange] = useState(false);
  const [lowerOutOfRange, setLowerOutOfRange] = useState(false);
  const [upperLoading, setUpperLoading] = useState(false);
  const [lowerLoading, setLowerLoading] = useState(false);
<<<<<<< HEAD
  const [lastScroll, setLastScroll] = useState(scrollElement?.scrollTop || 0);

=======
  const rowsRef = useRef<LogRowModel[]>(rows);
  const lastScroll = useRef<number>(scrollElement?.scrollTop || 0);

  // Reset messages when range/order/rows change
>>>>>>> graf/main
  useEffect(() => {
    setUpperOutOfRange(false);
    setLowerOutOfRange(false);
  }, [range, rows, sortOrder]);

<<<<<<< HEAD
=======
  // Reset loading messages when loading stops
>>>>>>> graf/main
  useEffect(() => {
    if (!loading) {
      setUpperLoading(false);
      setLowerLoading(false);
    }
  }, [loading]);

<<<<<<< HEAD
=======
  // Ensure bottom loader visibility
  useEffect(() => {
    if (lowerLoading && scrollElement) {
      scrollElement.scrollTo(0, scrollElement.scrollHeight - scrollElement.clientHeight);
    }
  }, [lowerLoading, scrollElement]);

  // Request came back with no new past rows
  useEffect(() => {
    if (rows !== rowsRef.current && rows.length === rowsRef.current.length && (upperLoading || lowerLoading)) {
      if (sortOrder === LogsSortOrder.Descending && lowerLoading) {
        setLowerOutOfRange(true);
      } else if (sortOrder === LogsSortOrder.Ascending && upperLoading) {
        setUpperOutOfRange(true);
      }
    }
    rowsRef.current = rows;
  }, [lowerLoading, rows, sortOrder, upperLoading]);

>>>>>>> graf/main
  useEffect(() => {
    if (!scrollElement || !loadMoreLogs) {
      return;
    }

    function handleScroll(event: Event | WheelEvent) {
<<<<<<< HEAD
      if (!scrollElement || !loadMoreLogs || !rows.length || loading) {
        return;
      }
      event.stopImmediatePropagation();
      setLastScroll(scrollElement.scrollTop);
      const scrollDirection = shouldLoadMore(event, scrollElement, lastScroll);
      if (scrollDirection === ScrollDirection.NoScroll) {
        return;
      } else if (scrollDirection === ScrollDirection.Top) {
        scrollTop();
      } else {
=======
      if (!scrollElement || !loadMoreLogs || !rows.length || loading || !config.featureToggles.logsInfiniteScrolling) {
        return;
      }
      event.stopImmediatePropagation();
      const scrollDirection = shouldLoadMore(event, scrollElement, lastScroll.current);
      lastScroll.current = scrollElement.scrollTop;
      if (scrollDirection === ScrollDirection.NoScroll) {
        return;
      } else if (scrollDirection === ScrollDirection.Top && topScrollEnabled) {
        scrollTop();
      } else if (scrollDirection === ScrollDirection.Bottom) {
>>>>>>> graf/main
        scrollBottom();
      }
    }

    function scrollTop() {
<<<<<<< HEAD
      if (!canScrollTop(getVisibleRange(rows), range, timeZone, sortOrder)) {
=======
      const newRange = canScrollTop(getVisibleRange(rows), range, timeZone, sortOrder);
      if (!newRange) {
>>>>>>> graf/main
        setUpperOutOfRange(true);
        return;
      }
      setUpperOutOfRange(false);
<<<<<<< HEAD
      const newRange =
        sortOrder === LogsSortOrder.Descending
          ? getNextRange(getVisibleRange(rows), range, timeZone)
          : getPrevRange(getVisibleRange(rows), range);
      loadMoreLogs?.(newRange);
      setUpperLoading(true);
    }

    function scrollBottom() {
      if (!canScrollBottom(getVisibleRange(rows), range, timeZone, sortOrder)) {
=======
      loadMoreLogs?.(newRange);
      setUpperLoading(true);
      reportInteraction('grafana_logs_infinite_scrolling', {
        direction: 'top',
        sort_order: sortOrder,
      });
    }

    function scrollBottom() {
      const newRange = canScrollBottom(getVisibleRange(rows), range, timeZone, sortOrder);
      if (!newRange) {
>>>>>>> graf/main
        setLowerOutOfRange(true);
        return;
      }
      setLowerOutOfRange(false);
<<<<<<< HEAD
      const newRange =
        sortOrder === LogsSortOrder.Descending
          ? getPrevRange(getVisibleRange(rows), range)
          : getNextRange(getVisibleRange(rows), range, timeZone);
      loadMoreLogs?.(newRange);
      setLowerLoading(true);
=======
      loadMoreLogs?.(newRange);
      setLowerLoading(true);
      reportInteraction('grafana_logs_infinite_scrolling', {
        direction: 'bottom',
        sort_order: sortOrder,
      });
>>>>>>> graf/main
    }

    scrollElement.addEventListener('scroll', handleScroll);
    scrollElement.addEventListener('wheel', handleScroll);

    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
      scrollElement.removeEventListener('wheel', handleScroll);
    };
<<<<<<< HEAD
  }, [lastScroll, loadMoreLogs, loading, range, rows, scrollElement, sortOrder, timeZone]);
=======
  }, [loadMoreLogs, loading, range, rows, scrollElement, sortOrder, timeZone, topScrollEnabled]);
>>>>>>> graf/main

  // We allow "now" to move when using relative time, so we hide the message so it doesn't flash.
  const hideTopMessage = sortOrder === LogsSortOrder.Descending && isRelativeTime(range.raw.to);
  const hideBottomMessage = sortOrder === LogsSortOrder.Ascending && isRelativeTime(range.raw.to);

  return (
    <>
<<<<<<< HEAD
      {upperLoading && loadingMessage}
      {!hideTopMessage && upperOutOfRange && outOfRangeMessage}
      {children}
      {!hideBottomMessage && lowerOutOfRange && outOfRangeMessage}
      {lowerLoading && loadingMessage}
=======
      {upperLoading && <LoadingIndicator adjective={sortOrder === LogsSortOrder.Descending ? 'newer' : 'older'} />}
      {!hideTopMessage && upperOutOfRange && outOfRangeMessage}
      {children}
      {!hideBottomMessage && lowerOutOfRange && outOfRangeMessage}
      {lowerLoading && <LoadingIndicator adjective={sortOrder === LogsSortOrder.Descending ? 'older' : 'newer'} />}
>>>>>>> graf/main
    </>
  );
};

const styles = {
<<<<<<< HEAD
  limitReached: css({
=======
  messageContainer: css({
>>>>>>> graf/main
    textAlign: 'center',
    padding: 0.25,
  }),
};

<<<<<<< HEAD
const outOfRangeMessage = <div className={styles.limitReached}>Limit reached for the current time range.</div>;
const loadingMessage = (
  <div className={styles.limitReached}>
    <Spinner />
=======
const outOfRangeMessage = (
  <div className={styles.messageContainer} data-testid="end-of-range">
    End of the selected time range.
>>>>>>> graf/main
  </div>
);

enum ScrollDirection {
  Top = -1,
  Bottom = 1,
  NoScroll = 0,
}
function shouldLoadMore(event: Event | WheelEvent, element: HTMLDivElement, lastScroll: number): ScrollDirection {
  // Disable behavior if there is no scroll
  if (element.scrollHeight <= element.clientHeight) {
    return ScrollDirection.NoScroll;
  }
  const delta = event instanceof WheelEvent ? event.deltaY : element.scrollTop - lastScroll;
  if (delta === 0) {
    return ScrollDirection.NoScroll;
  }
  const scrollDirection = delta < 0 ? ScrollDirection.Top : ScrollDirection.Bottom;
  const diff =
    scrollDirection === ScrollDirection.Top
      ? element.scrollTop
      : element.scrollHeight - element.scrollTop - element.clientHeight;
<<<<<<< HEAD
  const coef = 1;

  return diff <= coef ? scrollDirection : ScrollDirection.NoScroll;
=======

  return diff <= 1 ? scrollDirection : ScrollDirection.NoScroll;
>>>>>>> graf/main
}

function getVisibleRange(rows: LogRowModel[]) {
  const firstTimeStamp = rows[0].timeEpochMs;
  const lastTimeStamp = rows[rows.length - 1].timeEpochMs;

  const visibleRange =
    lastTimeStamp < firstTimeStamp
      ? { from: lastTimeStamp, to: firstTimeStamp }
      : { from: firstTimeStamp, to: lastTimeStamp };

  return visibleRange;
}

function getPrevRange(visibleRange: AbsoluteTimeRange, currentRange: TimeRange) {
  return { from: currentRange.from.valueOf(), to: visibleRange.from };
}

function getNextRange(visibleRange: AbsoluteTimeRange, currentRange: TimeRange, timeZone: TimeZone) {
  // When requesting new logs, update the current range if using relative time ranges.
  currentRange = updateCurrentRange(currentRange, timeZone);
  return { from: visibleRange.to, to: currentRange.to.valueOf() };
}

export const SCROLLING_THRESHOLD = 1e3;

// To get more logs, the difference between the visible range and the current range should be 1 second or more.
function canScrollTop(
  visibleRange: AbsoluteTimeRange,
  currentRange: TimeRange,
  timeZone: TimeZone,
  sortOrder: LogsSortOrder
<<<<<<< HEAD
) {
  if (sortOrder === LogsSortOrder.Descending) {
    // When requesting new logs, update the current range if using relative time ranges.
    currentRange = updateCurrentRange(currentRange, timeZone);
    return currentRange.to.valueOf() - visibleRange.to > SCROLLING_THRESHOLD;
  }
  return Math.abs(currentRange.from.valueOf() - visibleRange.from) > SCROLLING_THRESHOLD;
=======
): AbsoluteTimeRange | undefined {
  if (sortOrder === LogsSortOrder.Descending) {
    // When requesting new logs, update the current range if using relative time ranges.
    currentRange = updateCurrentRange(currentRange, timeZone);
    const canScroll = currentRange.to.valueOf() - visibleRange.to > SCROLLING_THRESHOLD;
    return canScroll ? getNextRange(visibleRange, currentRange, timeZone) : undefined;
  }

  const canScroll = Math.abs(currentRange.from.valueOf() - visibleRange.from) > SCROLLING_THRESHOLD;
  return canScroll ? getPrevRange(visibleRange, currentRange) : undefined;
>>>>>>> graf/main
}

function canScrollBottom(
  visibleRange: AbsoluteTimeRange,
  currentRange: TimeRange,
  timeZone: TimeZone,
  sortOrder: LogsSortOrder
<<<<<<< HEAD
) {
  if (sortOrder === LogsSortOrder.Descending) {
    return Math.abs(currentRange.from.valueOf() - visibleRange.from) > SCROLLING_THRESHOLD;
  }
  // When requesting new logs, update the current range if using relative time ranges.
  currentRange = updateCurrentRange(currentRange, timeZone);
  return currentRange.to.valueOf() - visibleRange.to > SCROLLING_THRESHOLD;
=======
): AbsoluteTimeRange | undefined {
  if (sortOrder === LogsSortOrder.Descending) {
    const canScroll = Math.abs(currentRange.from.valueOf() - visibleRange.from) > SCROLLING_THRESHOLD;
    return canScroll ? getPrevRange(visibleRange, currentRange) : undefined;
  }
  // When requesting new logs, update the current range if using relative time ranges.
  currentRange = updateCurrentRange(currentRange, timeZone);
  const canScroll = currentRange.to.valueOf() - visibleRange.to > SCROLLING_THRESHOLD;
  return canScroll ? getNextRange(visibleRange, currentRange, timeZone) : undefined;
>>>>>>> graf/main
}

// Given a TimeRange, returns a new instance if using relative time, or else the same.
function updateCurrentRange(timeRange: TimeRange, timeZone: TimeZone) {
  return isRelativeTimeRange(timeRange.raw) ? convertRawToRange(timeRange.raw, timeZone) : timeRange;
}
